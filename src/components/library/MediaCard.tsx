import { motion } from 'framer-motion'
import { Trash2, Star } from 'lucide-react'
import { useState } from 'react'
import { posterUrl } from '../../api/tmdb'
import type { TrackedMedia, TrackedShow } from '../../types'
import { StatusBadge } from './StatusBadge'
import { ProgressBar } from './ProgressBar'
import { getEpisodeCounts } from '../../utils/status'
import { useTrackerStore } from '../../store/useTrackerStore'
import { formatRating } from '../../utils/format'

interface Props {
  item: TrackedMedia
  itemKey: string
}

export function MediaCard({ item, itemKey }: Props) {
  const { openDetail, removeMedia } = useTrackerStore(s => ({
    openDetail: s.openDetail,
    removeMedia: s.removeMedia,
  }))
  const [showRemove, setShowRemove] = useState(false)

  const poster = posterUrl(item.posterPath)
  const year = item.type === 'movie' ? item.releaseYear : item.firstAirYear
  const { watched, total } = item.type === 'tv'
    ? getEpisodeCounts((item as TrackedShow).seasons)
    : { watched: 0, total: 0 }

  return (
    <motion.div
      className="group relative cursor-pointer"
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.15 }}
      onMouseEnter={() => setShowRemove(true)}
      onMouseLeave={() => setShowRemove(false)}
      onClick={() => openDetail(itemKey)}
    >
      <div className="bg-card border border-border rounded-xl overflow-hidden hover:border-accent/40 transition-colors">
        {/* Poster */}
        <div className="aspect-[2/3] relative bg-gradient-to-br from-card to-surface">
          {poster ? (
            <img
              src={poster}
              alt={item.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center p-4">
              <p className="text-muted text-sm text-center font-medium">{item.title}</p>
            </div>
          )}

          {/* Status badge overlay */}
          <div className="absolute top-2 left-2">
            <StatusBadge status={item.status} />
          </div>

          {/* Rating */}
          {item.voteAverage > 0 && (
            <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded-full">
              <Star size={10} className="text-yellow-400 fill-yellow-400" />
              <span className="text-xs text-white">{formatRating(item.voteAverage)}</span>
            </div>
          )}

          {/* Remove button */}
          <motion.button
            className="absolute bottom-2 right-2 w-7 h-7 bg-red-500/80 hover:bg-red-500 rounded-lg flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: showRemove ? 1 : 0, scale: showRemove ? 1 : 0.8 }}
            transition={{ duration: 0.15 }}
            onClick={e => {
              e.stopPropagation()
              removeMedia(itemKey)
            }}
          >
            <Trash2 size={12} className="text-white" />
          </motion.button>
        </div>

        {/* Info */}
        <div className="p-3">
          <p className="text-white text-sm font-medium truncate">{item.title}</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-muted">{year}</span>
            <span className="w-0.5 h-0.5 rounded-full bg-border" />
            <span className={`text-xs ${item.type === 'movie' ? 'text-blue-400' : 'text-purple-400'}`}>
              {item.type === 'movie' ? 'Film' : 'Seriál'}
            </span>
          </div>

          {item.type === 'tv' && total > 0 && (
            <div className="mt-2">
              <ProgressBar watched={watched} total={total} />
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
