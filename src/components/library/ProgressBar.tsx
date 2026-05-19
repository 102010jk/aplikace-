import { useEffect, useRef } from 'react'
import { animate } from 'animejs'

interface Props {
  watched: number
  total: number
}

export function ProgressBar({ watched, total }: Props) {
  const fillRef = useRef<HTMLDivElement>(null)
  const prevPct = useRef(0)

  if (total === 0) return null
  const pct = Math.round((watched / total) * 100)

  useEffect(() => {
    if (!fillRef.current) return
    animate(fillRef.current, {
      width: [`${prevPct.current}%`, `${pct}%`],
      duration: 600,
      ease: 'easeOutExpo',
    })
    prevPct.current = pct
  }, [pct])

  const color =
    pct === 100 ? '#22c55e' : pct === 0 ? '#374151' : '#fbbf24'

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs text-muted">{watched}/{total} epizod</span>
        <span className="text-xs text-muted">{pct}%</span>
      </div>
      <div className="h-1 bg-border rounded-full overflow-hidden">
        <div
          ref={fillRef}
          className="h-full rounded-full"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
    </div>
  )
}
