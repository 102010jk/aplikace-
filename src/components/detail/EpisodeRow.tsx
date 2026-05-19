import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import type { TrackedEpisode, TMDBEpisode } from '../../types'
import { formatRuntime } from '../../utils/format'

interface Props {
  tracked: TrackedEpisode
  meta?: TMDBEpisode
  onToggle: () => void
}

export function EpisodeRow({ tracked, meta, onToggle }: Props) {
  const title = meta?.name ?? `Epizoda ${tracked.episodeNumber}`
  const runtime = meta ? formatRuntime(meta.runtime) : ''
  const isFuture = meta?.air_date ? new Date(meta.air_date) > new Date() : false

  return (
    <motion.div
      layout
      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
        tracked.watched ? 'bg-green-500/5' : 'hover:bg-card-hover'
      } ${isFuture ? 'opacity-50' : ''}`}
    >
      <button
        onClick={onToggle}
        disabled={isFuture}
        className={`shrink-0 w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
          tracked.watched
            ? 'border-green-500 bg-green-500'
            : 'border-border hover:border-accent'
        }`}
      >
        <motion.div
          initial={false}
          animate={{ scale: tracked.watched ? 1 : 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
          <Check size={11} className="text-white" strokeWidth={3} />
        </motion.div>
      </button>

      <span className="text-xs text-muted w-6 shrink-0">
        E{String(tracked.episodeNumber).padStart(2, '0')}
      </span>

      <p className={`flex-1 text-sm truncate ${tracked.watched ? 'text-muted line-through' : 'text-white'}`}>
        {title}
      </p>

      <div className="flex items-center gap-2 shrink-0">
        {runtime && <span className="text-xs text-muted">{runtime}</span>}
        {isFuture && meta?.air_date && (
          <span className="text-xs text-muted">
            {new Date(meta.air_date).toLocaleDateString('cs-CZ', { day: 'numeric', month: 'short' })}
          </span>
        )}
      </div>
    </motion.div>
  )
}
