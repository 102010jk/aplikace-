// TMDB raw shapes
export interface TMDBMovie {
  id: number
  title: string
  overview: string
  poster_path: string | null
  release_date: string
  vote_average: number
  genre_ids: number[]
  media_type: 'movie'
}

export interface TMDBShow {
  id: number
  name: string
  overview: string
  poster_path: string | null
  first_air_date: string
  vote_average: number
  genre_ids: number[]
  number_of_seasons: number
  media_type: 'tv'
}

export interface TMDBEpisode {
  id: number
  episode_number: number
  name: string
  overview: string
  air_date: string
  runtime: number | null
  still_path: string | null
}

export interface TMDBSeason {
  id: number
  season_number: number
  name: string
  episode_count: number
  episodes: TMDBEpisode[]
}

// Tracked data shapes
export type MediaStatus = 'not_watched' | 'in_progress' | 'watched'
export type MediaType = 'movie' | 'tv'

export interface TrackedEpisode {
  episodeId: number
  seasonNumber: number
  episodeNumber: number
  watched: boolean
  watchedAt: string | null
}

export interface TrackedSeason {
  seasonNumber: number
  episodes: TrackedEpisode[]
}

export interface TrackedMovie {
  id: number
  type: 'movie'
  title: string
  overview: string
  posterPath: string | null
  releaseYear: string
  voteAverage: number
  status: MediaStatus
  addedAt: string
  watchedAt: string | null
}

export interface TrackedShow {
  id: number
  type: 'tv'
  title: string
  overview: string
  posterPath: string | null
  firstAirYear: string
  voteAverage: number
  numberOfSeasons: number
  status: MediaStatus
  addedAt: string
  seasons: TrackedSeason[]
}

export type TrackedMedia = TrackedMovie | TrackedShow

export type FilterType = 'all' | 'movies' | 'tv'
export type FilterStatus = 'all' | 'not_watched' | 'in_progress' | 'watched'
