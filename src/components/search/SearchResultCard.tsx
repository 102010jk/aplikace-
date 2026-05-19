import { motion } from 'framer-motion'
import { Plus, Check, Star, Tv, Film } from 'lucide-react'
import { posterUrl } from '../../api/tmdb'
import type { TMDBMovie, TMDBShow } from '../../types'
import { formatYear, formatRating } from '../../utils/format'

interface Props {
  item: (TMDBMovie | TMDBShow) & { media_type: 'movie' | 'tv' }
  inLibrary: boolean
  onAdd: () => void
}

export function SearchResultCard({ item, inLibrary, onAdd }: Props) {
  const isMovie = item.media_type === 'movie'
  const title = isMovie ? (item as TMDBMovie).title : (item as TMDBShow).name
  const year = isMovie
    ? formatYear((item as TMDBMovie).release_date)
    : formatYear((item as TMDBShow).first_air_date)
  const poster = posterUrl(item.poster_path, 'w92')

  return (
    <motion.div
      className="flex items-center gap-3 px-4 py-3 hover:bg-card-hover rounded-xl transition-colors"
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
    >
      <div className="w-10 h-14 rounded-lg overflow-hidden shrink-0 bg-border">
        {poster ? (
          <img src={poster} alt={title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-card to-surface">
            {isMovie ? <Film size={14} className="text-muted" /> : <Tv size={14} className="text-muted" />}
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-white text-sm font-medium truncate">{title}</p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-xs text-muted">{year}</span>
          <span className="w-0.5 h-0.5 rounded-full bg-muted" />
          <span className={`text-xs px-1.5 py-0.5 rounded-md font-medium ${
            isMovie ? 'bg-blue-500/20 text-blue-400' : 'bg-purple-500/20 text-purple-400'
          }`}>
            {isMovie ? 'Film' : 'Seriál'}
          </span>
          {item.vote_average > 0 && (
            <>
              <span className="w-0.5 h-0.5 rounded-full bg-muted" />
              <span className="text-xs text-muted flex items-center gap-1">
                <Star size={10} className="text-yellow-400" />
                {formatRating(item.vote_average)}
              </span>
            </>
          )}
        </div>
      </div>

      <button
        onClick={onAdd}
        disabled={inLibrary}
        className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
          inLibrary
            ? 'bg-green-500/20 text-green-400 cursor-default'
            : 'bg-accent/20 text-accent hover:bg-accent hover:text-white'
        }`}
      >
        {inLibrary ? <Check size={14} /> : <Plus size={14} />}
      </button>
    </motion.div>
  )
}
