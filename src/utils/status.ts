import type { MediaStatus, TrackedSeason } from '../types'

export function deriveShowStatus(seasons: TrackedSeason[]): MediaStatus {
  if (seasons.length === 0) return 'not_watched'

  let total = 0
  let watched = 0

  for (const season of seasons) {
    for (const ep of season.episodes) {
      total++
      if (ep.watched) watched++
    }
  }

  if (total === 0 || watched === 0) return 'not_watched'
  if (watched === total) return 'watched'
  return 'in_progress'
}

export function getEpisodeCounts(seasons: TrackedSeason[]): { watched: number; total: number } {
  let total = 0
  let watched = 0
  for (const season of seasons) {
    for (const ep of season.episodes) {
      total++
      if (ep.watched) watched++
    }
  }
  return { watched, total }
}
