import { useLayoutEffect, useRef, useState } from 'react'

/**
 * Keeps a fixed-aspect block inside a flexible parent: the scene uses the
 * largest 1000×720 rectangle that fits, so HTML callouts always line up with
 * the SVG illustration.
 */
export function useFitAspect(ratio: number) {
  const ref = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState<number | null>(null)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return

    const update = () => {
      const rect = el.getBoundingClientRect()
      if (rect.width <= 0 || rect.height <= 0) return
      const next = Math.floor(Math.min(rect.width, rect.height * ratio))
      if (next > 0) {
        setWidth((current) => (current === null || Math.abs(current - next) > 1 ? next : current))
      }
    }

    update()
    const observer = new ResizeObserver(update)
    observer.observe(el)
    window.addEventListener('resize', update)

    return () => {
      observer.disconnect()
      window.removeEventListener('resize', update)
    }
  }, [ratio])

  return { ref, width }
}
