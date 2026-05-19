import { motion } from 'framer-motion'
import { useTrackerStore } from '../../store/useTrackerStore'
import type { FilterType, FilterStatus } from '../../types'

const typeFilters: { value: FilterType; label: string }[] = [
  { value: 'all', label: 'Vše' },
  { value: 'movies', label: 'Filmy' },
  { value: 'tv', label: 'Seriály' },
]

const statusFilters: { value: FilterStatus; label: string }[] = [
  { value: 'all', label: 'Vše' },
  { value: 'not_watched', label: 'Nezhlédnuto' },
  { value: 'in_progress', label: 'Sleduji' },
  { value: 'watched', label: 'Zhlédnuto' },
]

export function FilterBar() {
  const { filterType, filterStatus, setFilter } = useTrackerStore(s => ({
    filterType: s.filterType,
    filterStatus: s.filterStatus,
    setFilter: s.setFilter,
  }))

  return (
    <div className="flex flex-wrap gap-4 mb-6">
      <div className="flex items-center gap-1 bg-card border border-border rounded-xl p-1">
        {typeFilters.map(f => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value, undefined)}
            className="relative px-3 py-1.5 text-sm rounded-lg transition-colors"
          >
            {filterType === f.value && (
              <motion.div
                layoutId="type-pill"
                className="absolute inset-0 bg-accent rounded-lg"
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />
            )}
            <span className={`relative z-10 font-medium ${filterType === f.value ? 'text-white' : 'text-muted hover:text-white'}`}>
              {f.label}
            </span>
          </button>
        ))}
      </div>

      <div className="flex items-center gap-1 bg-card border border-border rounded-xl p-1">
        {statusFilters.map(f => (
          <button
            key={f.value}
            onClick={() => setFilter(undefined, f.value)}
            className="relative px-3 py-1.5 text-sm rounded-lg transition-colors"
          >
            {filterStatus === f.value && (
              <motion.div
                layoutId="status-pill"
                className="absolute inset-0 bg-accent/80 rounded-lg"
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />
            )}
            <span className={`relative z-10 font-medium ${filterStatus === f.value ? 'text-white' : 'text-muted hover:text-white'}`}>
              {f.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
