import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type {
  TrackedMedia,
  TrackedMovie,
  TrackedShow,
  TrackedSeason,
  TMDBMovie,
  TMDBShow,
  TMDBSeason,
  FilterType,
  FilterStatus,
} from '../types'
import { deriveShowStatus } from '../utils/status'

interface TrackerState {
  library: Record<string, TrackedMedia>
  filterType: FilterType
  filterStatus: FilterStatus
  searchOpen: boolean
  activeDetailId: string | null

  addMedia: (item: TMDBMovie | TMDBShow) => void
  removeMedia: (key: string) => void
  setMovieWatched: (key: string, watched: boolean) => void
  toggleEpisode: (key: string, seasonNumber: number, episodeId: number) => void
  markSeasonWatched: (key: string, seasonNumber: number, watched: boolean) => void
  loadSeasonEpisodes: (key: string, season: TMDBSeason) => void
  setFilter: (type?: FilterType, status?: FilterStatus) => void
  openSearch: () => void
  closeSearch: () => void
  openDetail: (key: string) => void
  closeDetail: () => void
}

function mediaKey(type: 'movie' | 'tv', id: number): string {
  return `${type}-${id}`
}

export const useTrackerStore = create<TrackerState>()(
  persist(
    (set, get) => ({
      library: {},
      filterType: 'all',
      filterStatus: 'all',
      searchOpen: false,
      activeDetailId: null,

      addMedia: (item) => {
        const now = new Date().toISOString()
        if (item.media_type === 'movie') {
          const movie = item as TMDBMovie
          const key = mediaKey('movie', movie.id)
          if (get().library[key]) return
          const tracked: TrackedMovie = {
            id: movie.id,
            type: 'movie',
            title: movie.title,
            overview: movie.overview,
            posterPath: movie.poster_path,
            releaseYear: movie.release_date?.slice(0, 4) ?? '',
            voteAverage: movie.vote_average,
            status: 'not_watched',
            addedAt: now,
            watchedAt: null,
          }
          set(s => ({ library: { ...s.library, [key]: tracked } }))
        } else {
          const show = item as TMDBShow
          const key = mediaKey('tv', show.id)
          if (get().library[key]) return
          const tracked: TrackedShow = {
            id: show.id,
            type: 'tv',
            title: show.name,
            overview: show.overview,
            posterPath: show.poster_path,
            firstAirYear: show.first_air_date?.slice(0, 4) ?? '',
            voteAverage: show.vote_average,
            numberOfSeasons: show.number_of_seasons ?? 1,
            status: 'not_watched',
            addedAt: now,
            seasons: [],
          }
          set(s => ({ library: { ...s.library, [key]: tracked } }))
        }
      },

      removeMedia: (key) => {
        set(s => {
          const next = { ...s.library }
          delete next[key]
          return { library: next }
        })
      },

      setMovieWatched: (key, watched) => {
        set(s => {
          const item = s.library[key]
          if (!item || item.type !== 'movie') return s
          return {
            library: {
              ...s.library,
              [key]: {
                ...item,
                status: watched ? 'watched' : 'not_watched',
                watchedAt: watched ? new Date().toISOString() : null,
              } as TrackedMovie,
            },
          }
        })
      },

      toggleEpisode: (key, seasonNumber, episodeId) => {
        set(s => {
          const item = s.library[key]
          if (!item || item.type !== 'tv') return s
          const show = item as TrackedShow
          const seasons = show.seasons.map(season => {
            if (season.seasonNumber !== seasonNumber) return season
            return {
              ...season,
              episodes: season.episodes.map(ep => {
                if (ep.episodeId !== episodeId) return ep
                const nowWatched = !ep.watched
                return { ...ep, watched: nowWatched, watchedAt: nowWatched ? new Date().toISOString() : null }
              }),
            }
          })
          return {
            library: {
              ...s.library,
              [key]: { ...show, seasons, status: deriveShowStatus(seasons) } as TrackedShow,
            },
          }
        })
      },

      markSeasonWatched: (key, seasonNumber, watched) => {
        set(s => {
          const item = s.library[key]
          if (!item || item.type !== 'tv') return s
          const show = item as TrackedShow
          const now = new Date().toISOString()
          const seasons = show.seasons.map(season => {
            if (season.seasonNumber !== seasonNumber) return season
            return {
              ...season,
              episodes: season.episodes.map(ep => ({
                ...ep,
                watched,
                watchedAt: watched ? now : null,
              })),
            }
          })
          return {
            library: {
              ...s.library,
              [key]: { ...show, seasons, status: deriveShowStatus(seasons) } as TrackedShow,
            },
          }
        })
      },

      loadSeasonEpisodes: (key, season) => {
        set(s => {
          const item = s.library[key]
          if (!item || item.type !== 'tv') return s
          const show = item as TrackedShow
          const exists = show.seasons.find(s => s.seasonNumber === season.season_number)
          if (exists) return s

          const trackedSeason: TrackedSeason = {
            seasonNumber: season.season_number,
            episodes: season.episodes.map(ep => ({
              episodeId: ep.id,
              seasonNumber: season.season_number,
              episodeNumber: ep.episode_number,
              watched: false,
              watchedAt: null,
            })),
          }
          const seasons = [...show.seasons, trackedSeason].sort(
            (a, b) => a.seasonNumber - b.seasonNumber
          )
          return {
            library: {
              ...s.library,
              [key]: { ...show, seasons } as TrackedShow,
            },
          }
        })
      },

      setFilter: (type, status) => {
        set(s => ({
          filterType: type ?? s.filterType,
          filterStatus: status ?? s.filterStatus,
        }))
      },

      openSearch: () => set({ searchOpen: true }),
      closeSearch: () => set({ searchOpen: false }),
      openDetail: (key) => set({ activeDetailId: key }),
      closeDetail: () => set({ activeDetailId: null }),
    }),
    {
      name: 'cinetrack-storage',
      partialize: (s) => ({
        library: s.library,
        filterType: s.filterType,
        filterStatus: s.filterStatus,
      }),
    }
  )
)

export { mediaKey }
