import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X } from 'lucide-react'
import { useTrackerStore } from '../../store/useTrackerStore'
import { useSearch } from '../../hooks/useSearch'
import { SearchResultCard } from './SearchResultCard'
import { Spinner } from '../ui/Spinner'
import { fetchShowDetails } from '../../api/tmdb'
import { useToast } from '../ui/Toast'
import type { TMDBMovie, TMDBShow } from '../../types'

export function SearchModal() {
  const searchOpen = useTrackerStore(s => s.searchOpen)
  const closeSearch = useTrackerStore(s => s.closeSearch)
  const addMedia = useTrackerStore(s => s.addMedia)
  const library = useTrackerStore(s => s.library)
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const { results, loading, error } = useSearch(query)
  const { showToast } = useToast()

  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => inputRef.current?.focus(), 100)
    } else {
      setQuery('')
    }
  }, [searchOpen])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        useTrackerStore.getState().openSearch()
      }
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [])

  async function handleAdd(item: (TMDBMovie | TMDBShow) & { media_type: 'movie' | 'tv' }) {
    if (item.media_type === 'tv') {
      try {
        const details = await fetchShowDetails(item.id)
        addMedia({ ...item, ...details, media_type: 'tv' as const })
      } catch {
        addMedia(item)
      }
    } else {
      addMedia(item)
    }
    const title = item.media_type === 'movie' ? (item as TMDBMovie).title : (item as TMDBShow).name
    showToast(`${title} přidán do knihovny`)
  }

  return (
    <AnimatePresence>
      {searchOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          <motion.div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={closeSearch}
          />
          <motion.div
            className="relative z-10 w-full max-w-xl bg-card border border-border rounded-2xl shadow-2xl overflow-hidden"
            initial={{ y: -20, scale: 0.97, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: -20, scale: 0.97, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            <div className="flex items-center gap-3 px-4 border-b border-border">
              <Search size={18} className="text-muted shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Hledat filmy a seriály..."
                className="flex-1 py-4 bg-transparent text-white placeholder-muted outline-none text-sm"
              />
              {loading && <Spinner size={16} />}
              <button onClick={closeSearch} className="text-muted hover:text-white transition-colors p-1">
                <X size={18} />
              </button>
            </div>

            <div className="max-h-96 overflow-y-auto py-2">
              {error && (
                <p className="text-sm text-red-400 px-4 py-3">{error}</p>
              )}

              {!loading && !error && results.length === 0 && query.trim() && (
                <p className="text-sm text-muted px-4 py-6 text-center">
                  Žádné výsledky pro „{query}"
                </p>
              )}

              {!query.trim() && (
                <p className="text-sm text-muted px-4 py-6 text-center">
                  Zadej název filmu nebo seriálu
                </p>
              )}

              <motion.div layout>
                {results.map((item, i) => {
                  const key = `${item.media_type}-${item.id}`
                  return (
                    <motion.div
                      key={key}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04 }}
                    >
                      <SearchResultCard
                        item={item}
                        inLibrary={!!library[key]}
                        onAdd={() => handleAdd(item)}
                      />
                    </motion.div>
                  )
                })}
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
