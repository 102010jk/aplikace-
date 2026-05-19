import { motion, AnimatePresence } from 'framer-motion'
import { useTrackerStore } from '../../store/useTrackerStore'
import { MediaCard } from './MediaCard'
import { FilterBar } from '../filters/FilterBar'
import { EmptyState } from '../ui/EmptyState'
import type { TrackedMedia } from '../../types'

export function LibraryGrid() {
  const { library, filterType, filterStatus } = useTrackerStore(s => ({
    library: s.library,
    filterType: s.filterType,
    filterStatus: s.filterStatus,
  }))

  const entries = Object.entries(library) as [string, TrackedMedia][]

  const filtered = entries.filter(([, item]) => {
    if (filterType === 'movies' && item.type !== 'movie') return false
    if (filterType === 'tv' && item.type !== 'tv') return false
    if (filterStatus !== 'all' && item.status !== filterStatus) return false
    return true
  })

  // Sort: in_progress first, then not_watched, then watched
  const order = { in_progress: 0, not_watched: 1, watched: 2 }
  filtered.sort(([, a], [, b]) => {
    const diff = order[a.status] - order[b.status]
    if (diff !== 0) return diff
    return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime()
  })

  if (entries.length === 0) {
    return (
      <div>
        <FilterBar />
        <EmptyState
          title="Tvoje knihovna je prázdná"
          description="Hledej filmy a seriály pomocí tlačítka nahoře a přidej je do své sbírky."
        />
      </div>
    )
  }

  return (
    <div>
      <FilterBar />

      {filtered.length === 0 ? (
        <EmptyState title="Žádné výsledky" description="Zkus změnit filtry." />
      ) : (
        <motion.div
          layout
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
        >
          <AnimatePresence>
            {filtered.map(([key, item]) => (
              <motion.div
                key={key}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                <MediaCard item={item} itemKey={key} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  )
}
