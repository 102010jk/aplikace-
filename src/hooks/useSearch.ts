import { useState, useEffect, useRef } from 'react'
import { searchMovies, searchShows } from '../api/tmdb'
import type { TMDBMovie, TMDBShow } from '../types'

export type SearchResult = (TMDBMovie | TMDBShow) & { media_type: 'movie' | 'tv' }

export function useSearch(query: string) {
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current)

    if (!query.trim()) {
      setResults([])
      setLoading(false)
      return
    }

    setLoading(true)
    timerRef.current = setTimeout(async () => {
      try {
        const [movies, shows] = await Promise.all([
          searchMovies(query),
          searchShows(query),
        ])
        const combined: SearchResult[] = [
          ...movies.slice(0, 5).map(m => ({ ...m, media_type: 'movie' as const })),
          ...shows.slice(0, 5).map(s => ({ ...s, media_type: 'tv' as const })),
        ]
        setResults(combined)
        setError(null)
      } catch (e) {
        setError('Nepodařilo se vyhledat. Zkontroluj API klíč.')
        setResults([])
      } finally {
        setLoading(false)
      }
    }, 350)

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [query])

  return { results, loading, error }
}
