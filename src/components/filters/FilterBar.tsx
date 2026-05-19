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
  const filterType = useTrackerStore(s => s.filterType)
  const filterStatus = useTrackerStore(s => s.filterStatus)
  const setFilter = useTrackerStore(s => s.setFilter)

  return (
    <div className="flex flex-wrap gap-4 mb-6">
      <div className="flex items-center gap-1 bg-card border border-border rounded-xl p-1">
        {typeFilters.map(f => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value, undefined)}
            className={`relative px-3 py-1.5 text-sm rounded-lg transition-all font-medium ${
              filterType === f.value
                ? 'bg-accent text-white'
                : 'text-muted hover:text-white'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-1 bg-card border border-border rounded-xl p-1">
        {statusFilters.map(f => (
          <button
            key={f.value}
            onClick={() => setFilter(undefined, f.value)}
            className={`relative px-3 py-1.5 text-sm rounded-lg transition-all font-medium ${
              filterStatus === f.value
                ? 'bg-accent/80 text-white'
                : 'text-muted hover:text-white'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>
    </div>
  )
}
