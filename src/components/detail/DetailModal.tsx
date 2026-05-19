import { X, Star, Check } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTrackerStore } from '../../store/useTrackerStore'
import { posterUrl } from '../../api/tmdb'
import { SeasonAccordion } from './SeasonAccordion'
import { StatusBadge } from '../library/StatusBadge'
import { ProgressBar } from '../library/ProgressBar'
import { getEpisodeCounts } from '../../utils/status'
import { formatRating } from '../../utils/format'
import type { TrackedShow } from '../../types'

export function DetailModal() {
  const activeDetailId = useTrackerStore(s => s.activeDetailId)
  const library = useTrackerStore(s => s.library)
  const closeDetail = useTrackerStore(s => s.closeDetail)
  const setMovieWatched = useTrackerStore(s => s.setMovieWatched)

  const item = activeDetailId ? library[activeDetailId] : null

  return (
    <AnimatePresence>
      {item && activeDetailId && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={closeDetail}
          />

          <motion.div
            className="relative z-10 w-full max-w-2xl max-h-[90vh] bg-card border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col mx-4"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            {/* Header with backdrop */}
            <div className="relative shrink-0">
              {item.posterPath && (
                <div className="absolute inset-0 overflow-hidden">
                  <img
                    src={posterUrl(item.posterPath, 'w500')!}
                    alt=""
                    className="w-full h-full object-cover blur-2xl scale-110 opacity-20"
                  />
                </div>
              )}
              <div className="relative p-5 flex gap-4">
                {/* Small poster */}
                <div className="w-20 shrink-0 rounded-lg overflow-hidden bg-border aspect-[2/3]">
                  {item.posterPath ? (
                    <img
                      src={posterUrl(item.posterPath, 'w185')!}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-card to-surface" />
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0 pt-1">
                  <h2 className="text-white font-semibold text-lg leading-tight">{item.title}</h2>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <span className="text-sm text-muted">
                      {item.type === 'movie' ? item.releaseYear : item.firstAirYear}
                    </span>
                    {item.voteAverage > 0 && (
                      <span className="flex items-center gap-1 text-sm text-muted">
                        <Star size={12} className="text-yellow-400 fill-yellow-400" />
                        {formatRating(item.voteAverage)}
                      </span>
                    )}
                    <StatusBadge status={item.status} />
                  </div>

                  {item.overview && (
                    <p className="text-muted text-xs mt-2 line-clamp-2 leading-relaxed">{item.overview}</p>
                  )}
                </div>

                <button
                  onClick={closeDetail}
                  className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-surface/80 flex items-center justify-center text-muted hover:text-white transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="overflow-y-auto flex-1 p-5 pt-0">
              {item.type === 'movie' && (
                <div className="flex gap-3 mt-2">
                  <motion.button
                    onClick={() => setMovieWatched(activeDetailId, item.status !== 'watched')}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-colors ${
                      item.status === 'watched'
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/30'
                        : 'bg-accent text-white hover:bg-accent-hover'
                    }`}
                    whileTap={{ scale: 0.98 }}
                  >
                    {item.status === 'watched' ? (
                      <>
                        <Check size={16} />
                        Zhlédnuto – klikni pro zrušení
                      </>
                    ) : (
                      <>
                        <Check size={16} />
                        Označit jako zhlédnuto
                      </>
                    )}
                  </motion.button>
                </div>
              )}

              {item.type === 'tv' && (
                <div className="space-y-3 mt-2">
                  {/* Overall progress */}
                  {(() => {
                    const { watched, total } = getEpisodeCounts((item as TrackedShow).seasons)
                    if (total === 0) return null
                    return (
                      <div className="bg-surface rounded-xl p-4">
                        <p className="text-xs text-muted mb-2">Celkový postup</p>
                        <ProgressBar watched={watched} total={total} />
                      </div>
                    )
                  })()}

                  {/* Season accordions */}
                  {Array.from(
                    { length: (item as TrackedShow).numberOfSeasons },
                    (_, i) => i + 1
                  ).map(seasonNum => {
                    const tracked = (item as TrackedShow).seasons.find(
                      s => s.seasonNumber === seasonNum
                    )
                    return (
                      <SeasonAccordion
                        key={seasonNum}
                        itemKey={activeDetailId}
                        showId={item.id}
                        seasonNumber={seasonNum}
                        trackedSeason={tracked}
                        defaultOpen={seasonNum === 1}
                      />
                    )
                  })}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
