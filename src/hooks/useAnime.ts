import { useEffect, useRef } from 'react'
import { animate, stagger } from 'animejs'

export function useAnimeStagger(
  selector: string,
  deps: unknown[] = []
) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return
    const targets = ref.current.querySelectorAll(selector)
    if (!targets.length) return
    animate(targets, {
      opacity: [0, 1],
      translateY: [24, 0],
      scale: [0.95, 1],
      duration: 420,
      delay: stagger(60, { start: 80 }),
      ease: 'easeOutExpo',
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return ref
}

export function useAnimeCounter(value: number, duration = 600) {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!ref.current) return
    const obj = { val: 0 }
    animate(obj, {
      val: value,
      duration,
      ease: 'easeOutExpo',
      onUpdate() {
        if (ref.current) ref.current.textContent = String(Math.round(obj.val))
      },
    })
  }, [value, duration])

  return ref
}
