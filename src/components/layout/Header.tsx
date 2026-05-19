import { Search, Film } from 'lucide-react'
import { motion } from 'framer-motion'
import { useTrackerStore } from '../../store/useTrackerStore'

export function Header() {
  const openSearch = useTrackerStore(s => s.openSearch)
  const library = useTrackerStore(s => s.library)
  const count = Object.keys(library).length

  return (
    <header className="sticky top-0 z-40 bg-surface/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
            <Film size={16} className="text-white" />
          </div>
          <span className="text-white font-semibold text-lg tracking-tight">CineTrack</span>
          {count > 0 && (
            <span className="text-xs text-muted bg-card border border-border px-2 py-0.5 rounded-full">
              {count} {count === 1 ? 'titul' : count < 5 ? 'tituly' : 'titulů'}
            </span>
          )}
        </div>

        <motion.button
          onClick={openSearch}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-card border border-border text-muted hover:text-white hover:border-accent/50 transition-colors text-sm"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Search size={15} />
          <span className="hidden sm:inline">Hledat filmy a seriály…</span>
          <kbd className="hidden sm:inline text-xs bg-surface px-1.5 py-0.5 rounded border border-border ml-1">⌘K</kbd>
        </motion.button>
      </div>
    </header>
  )
}
