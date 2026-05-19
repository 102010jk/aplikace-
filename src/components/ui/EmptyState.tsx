import { useEffect, useRef } from 'react'
import { Film } from 'lucide-react'
import { animate, createTimeline } from 'animejs'

interface EmptyStateProps {
  title: string
  description?: string
}

export function EmptyState({ title, description }: EmptyStateProps) {
  const iconRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!iconRef.current || !textRef.current) return
    createTimeline({ defaults: { ease: 'easeOutExpo' } })
      .add(iconRef.current, {
        scale: [0, 1],
        opacity: [0, 1],
        duration: 700,
        ease: 'easeOutElastic(1, .6)',
      })
      .add(textRef.current, {
        translateY: [12, 0],
        opacity: [0, 1],
        duration: 400,
        ease: 'easeOutExpo',
      }, '-=300')

    // Gentle float loop
    animate(iconRef.current, {
      translateY: [-4, 4],
      duration: 2400,
      loop: true,
      alternate: true,
      ease: 'easeInOutSine',
      delay: 700,
    })
  }, [])

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
      <div
        ref={iconRef}
        className="w-16 h-16 rounded-2xl bg-card border border-border flex items-center justify-center"
        style={{ opacity: 0 }}
      >
        <Film size={28} className="text-accent" />
      </div>
      <div ref={textRef} style={{ opacity: 0 }}>
        <p className="text-white font-medium">{title}</p>
        {description && <p className="text-muted text-sm mt-1">{description}</p>}
      </div>
    </div>
  )
}
