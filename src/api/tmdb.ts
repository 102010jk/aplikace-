import type { TMDBMovie, TMDBShow, TMDBSeason } from '../types'

const BASE = 'https://api.themoviedb.org/3'
const KEY = import.meta.env.VITE_TMDB_API_KEY

async function get<T>(path: string, params: Record<string, string> = {}): Promise<T> {
  const url = new URL(`${BASE}${path}`)
  url.searchParams.set('api_key', KEY)
  url.searchParams.set('language', 'cs-CZ')
  for (const [k, v] of Object.entries(params)) {
    url.searchParams.set(k, v)
  }
  const res = await fetch(url.toString())
  if (!res.ok) throw new Error(`TMDB ${res.status}: ${res.statusText}`)
  return res.json()
}

export function posterUrl(path: string | null, size = 'w500'): string | null {
  return path ? `https://image.tmdb.org/t/p/${size}${path}` : null
}

export async function searchMovies(query: string): Promise<TMDBMovie[]> {
  if (!query.trim()) return []
  const data = await get<{ results: TMDBMovie[] }>('/search/movie', { query })
  return data.results.map(m => ({ ...m, media_type: 'movie' as const }))
}

export async function searchShows(query: string): Promise<TMDBShow[]> {
  if (!query.trim()) return []
  const data = await get<{ results: TMDBShow[] }>('/search/tv', { query })
  return data.results.map(s => ({ ...s, media_type: 'tv' as const }))
}

export async function fetchShowDetails(id: number): Promise<TMDBShow> {
  const data = await get<TMDBShow & { number_of_seasons: number }>(`/tv/${id}`)
  return { ...data, media_type: 'tv' as const }
}

export async function fetchSeason(showId: number, seasonNumber: number): Promise<TMDBSeason> {
  return get<TMDBSeason>(`/tv/${showId}/season/${seasonNumber}`)
}
