import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, CheckSquare, Square } from 'lucide-react'
import { fetchSeason } from '../../api/tmdb'
import { useTrackerStore } from '../../store/useTrackerStore'
import { EpisodeRow } from './EpisodeRow'
import { Spinner } from '../ui/Spinner'
import type { TrackedSeason, TMDBEpisode } from '../../types'

interface Props {
  itemKey: string
  showId: number
  seasonNumber: number
  trackedSeason: TrackedSeason | undefined
  defaultOpen?: boolean
}

export function SeasonAccordion({ itemKey, showId, seasonNumber, trackedSeason, defaultOpen = false }: Props) {
  const [open, setOpen] = useState(defaultOpen)
  const [loading, setLoading] = useState(false)
  const [metaEpisodes, setMetaEpisodes] = useState<TMDBEpisode[]>([])
  const [fetched, setFetched] = useState(false)
  const { loadSeasonEpisodes, toggleEpisode, markSeasonWatched } = useTrackerStore(s => ({
    loadSeasonEpisodes: s.loadSeasonEpisodes,
    toggleEpisode: s.toggleEpisode,
    markSeasonWatched: s.markSeasonWatched,
  }))

  useEffect(() => {
    if (!open || fetched) return
    setLoading(true)
    fetchSeason(showId, seasonNumber)
      .then(season => {
        setMetaEpisodes(season.episodes)
        loadSeasonEpisodes(itemKey, season)
        setFetched(true)
      })
      .catch(() => setFetched(true))
      .finally(() => setLoading(false))
  }, [open, fetched, showId, seasonNumber, itemKey, loadSeasonEpisodes])

  const episodes = trackedSeason?.episodes ?? []
  const watchedCount = episodes.filter(e => e.watched).length
  const totalCount = episodes.length
  const allWatched = totalCount > 0 && watchedCount === totalCount

  const metaMap = new Map(metaEpisodes.map(e => [e.id, e]))

  return (
    <div className="border border-border rounded-xl overflow-hidden">
      <button
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-card-hover transition-colors"
        onClick={() => setOpen(o => !o)}
      >
        <div className="flex items-center gap-3">
          <span className="text-white font-medium text-sm">Série {seasonNumber}</span>
          {totalCount > 0 && (
            <span className="text-xs text-muted">
              {watchedCount}/{totalCount} zhlédnuto
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {loading && <Spinner size={14} />}
          <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronDown size={16} className="text-muted" />
          </motion.div>
        </div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="overflow-hidden"
          >
            {episodes.length > 0 && (
              <div className="px-4 py-2 border-t border-border flex items-center justify-between">
                <span className="text-xs text-muted">
                  {watchedCount > 0
                    ? `${Math.round((watchedCount / totalCount) * 100)}% dokončeno`
                    : 'Žádné epizody nezhlédnuty'}
                </span>
                <button
                  onClick={() => markSeasonWatched(itemKey, seasonNumber, !allWatched)}
                  className="flex items-center gap-1.5 text-xs text-accent hover:text-accent-hover transition-colors"
                >
                  {allWatched ? <Square size={12} /> : <CheckSquare size={12} />}
                  {allWatched ? 'Odznačit vše' : 'Označit vše'}
                </button>
              </div>
            )}

            {loading && episodes.length === 0 && (
              <div className="flex justify-center py-6">
                <Spinner />
              </div>
            )}

            <div className="divide-y divide-border/30 px-2 pb-2">
              {episodes.map(ep => (
                <EpisodeRow
                  key={ep.episodeId}
                  tracked={ep}
                  meta={metaMap.get(ep.episodeId)}
                  onToggle={() => toggleEpisode(itemKey, seasonNumber, ep.episodeId)}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
