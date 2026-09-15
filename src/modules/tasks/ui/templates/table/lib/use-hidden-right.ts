import { useEffect, useRef, useState } from 'react'

/**
 * Whether a horizontally scrollable box still hides content past its right
 * edge.
 *
 * A wide table on a phone scrolls sideways, but a phone shows no scrollbar
 * until touched: a child sees «Первое слагаемое | Второе слагаемое | З…» and
 * has no reason to swipe for the sum the task is about. The flag drives a
 * visible fade on that edge, and clears once the child has scrolled to the end.
 */
export const useHiddenRight = <T extends HTMLElement>() => {
  const ref = useRef<T>(null)
  const [hiddenRight, setHiddenRight] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const update = () =>
      setHiddenRight(
        element.scrollLeft + element.clientWidth < element.scrollWidth - 1,
      )

    update()
    element.addEventListener('scroll', update, { passive: true })

    // jsdom has no ResizeObserver; the initial measurement still runs.
    const observer =
      typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(update)
    observer?.observe(element)
    if (element.firstElementChild) observer?.observe(element.firstElementChild)

    return () => {
      element.removeEventListener('scroll', update)
      observer?.disconnect()
    }
  }, [])

  return { ref, hiddenRight }
}
