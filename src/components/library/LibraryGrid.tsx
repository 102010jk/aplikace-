import { useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { animate, stagger } from 'animejs'
import { useTrackerStore } from '../../store/useTrackerStore'
import { MediaCard } from './MediaCard'
import { FilterBar } from '../filters/FilterBar'
import { EmptyState } from '../ui/EmptyState'
import type { TrackedMedia } from '../../types'

export function LibraryGrid() {
  const library = useTrackerStore(s => s.library)
  const filterType = useTrackerStore(s => s.filterType)
  const filterStatus = useTrackerStore(s => s.filterStatus)

  const gridRef = useRef<HTMLDivElement>(null)
  const prevCountRef = useRef(0)

  const entries = Object.entries(library) as [string, TrackedMedia][]

  const filtered = entries.filter(([, item]) => {
    if (filterType === 'movies' && item.type !== 'movie') return false
    if (filterType === 'tv' && item.type !== 'tv') return false
    if (filterStatus !== 'all' && item.status !== filterStatus) return false
    return true
  })

  const order = { in_progress: 0, not_watched: 1, watched: 2 }
  filtered.sort(([, a], [, b]) => {
    const diff = order[a.status] - order[b.status]
    if (diff !== 0) return diff
    return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime()
  })

  // Stagger animate newly added cards
  useEffect(() => {
    if (!gridRef.current) return
    const cards = gridRef.current.querySelectorAll('[data-card]')
    const newCount = filtered.length
    const prev = prevCountRef.current

    if (newCount > prev) {
      // Only animate the new cards
      const newCards = Array.from(cards).slice(0, newCount - prev)
      animate(newCards, {
        opacity: [0, 1],
        translateY: [32, 0],
        scale: [0.92, 1],
        duration: 450,
        delay: stagger(55),
        ease: 'easeOutExpo',
      })
    } else if (prev === 0 && newCount > 0) {
      animate(Array.from(cards), {
        opacity: [0, 1],
        translateY: [24, 0],
        scale: [0.95, 1],
        duration: 420,
        delay: stagger(55, { start: 100 }),
        ease: 'easeOutExpo',
      })
    }
    prevCountRef.current = newCount
  }, [filtered.length])

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
        <div
          ref={gridRef}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
        >
          <AnimatePresence>
            {filtered.map(([key, item]) => (
              <motion.div
                key={key}
                data-card
                exit={{ opacity: 0, scale: 0.88, transition: { duration: 0.18 } }}
              >
                <MediaCard item={item} itemKey={key} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
