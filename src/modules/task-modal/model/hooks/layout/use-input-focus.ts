import { useEffect, useRef } from 'react'

import type { Task } from '@/types/api/task'

import { getParentWithAttr } from '../../helpers'
import { getRevealScrollTop } from '../../lib/reveal-in-container'
import { useStore } from '../../store/task-modal-store'

import type { CalcState } from './use-calc-setup'
import type { TaskModalRefs } from './use-refs'

const FOCUSED = 'focused'
const DATA_INPUT = 'data-input'
const DATA_CALC = 'data-calc'

interface Args {
  refs: TaskModalRefs
  activeTask: Task
  calcState: CalcState
}

export const useInputFocus = ({ refs, activeTask, calcState }: Args) => {
  const lastFocusedInput = useRef<HTMLElement | null>(null)
  const isTaskLoaded = useStore((s) => s.isTaskLoaded)

  useEffect(() => {
    const root = refs.root.current
    const taskContainer = refs.taskContainer.current

    if (!root || !taskContainer || !calcState.isSetupFinished) {
      return
    }

    const setFocusedInput = (input: HTMLElement) => {
      lastFocusedInput.current?.classList.remove(FOCUSED)
      lastFocusedInput.current = input

      input.classList.add(FOCUSED)

      if (!calcState.isOpen) {
        input.scrollIntoView({
          block: 'center',
          // CSS can't override an explicit 'smooth' — honour rule 99 here.
          behavior: window.matchMedia('(prefers-reduced-motion: reduce)')
            .matches
            ? 'auto'
            : 'smooth',
        })
      }
    }

    const setInitialFocus = () => {
      if (lastFocusedInput.current) return

      const input = refs.taskContainer.current?.querySelector(`[${DATA_INPUT}]`)

      if (input instanceof HTMLElement) {
        setFocusedInput(input)

        // Programmatic .focus() bubbles a focusin to the overflow handler's
        // `data-control` listener, which reopens the calculator — undoing a
        // deliberate close (overflow layout, or solution shown). Don't fight it.
        if (calcState.isEnabled && !calcState.isOpen) return

        const map = refs.mathInput.current
        if (!map) return

        const mathInputRef = map.get(input.id)
        mathInputRef?.focus()
      }
    }

    const handler = (event: MouseEvent) => {
      const target = event.target

      const isElement = target instanceof HTMLElement
      if (!isElement) return

      const isInput = target.hasAttribute(DATA_INPUT)
      if (isInput) {
        setFocusedInput(target)
        return
      }

      const parentInput = getParentWithAttr(target, DATA_INPUT)
      if (parentInput) {
        setFocusedInput(parentInput)
        return
      }

      const isCalc = target.hasAttribute(DATA_CALC)
      const parentCalc = getParentWithAttr(target, DATA_CALC)
      const lastFcsdInp = lastFocusedInput.current

      if (isCalc || parentCalc) {
        lastFcsdInp?.classList.add(FOCUSED)
      } else {
        lastFcsdInp?.classList.remove(FOCUSED)
      }
    }

    // Rule 96: Tab moves focus without a click — remember that field too, or
    // the calculator keeps typing into the one clicked before.
    const onFocusIn = (event: FocusEvent) => {
      const target = event.target
      if (!(target instanceof HTMLElement)) return

      const input = target.hasAttribute(DATA_INPUT)
        ? target
        : getParentWithAttr(target, DATA_INPUT)
      if (input && input !== lastFocusedInput.current) setFocusedInput(input)
    }

    setInitialFocus()

    // Lazy templates / MathJax can mount [data-input] after isSetupFinished.
    const observer = new MutationObserver(() => {
      if (!lastFocusedInput.current) setInitialFocus()
    })
    observer.observe(taskContainer, { childList: true, subtree: true })

    let raf2 = 0
    const raf1 = requestAnimationFrame(() => {
      setInitialFocus()
      raf2 = requestAnimationFrame(() => setInitialFocus())
    })

    root.addEventListener('click', handler)
    root.addEventListener('focusin', onFocusIn)

    return () => {
      observer.disconnect()
      root.removeEventListener('focusin', onFocusIn)
      cancelAnimationFrame(raf1)
      cancelAnimationFrame(raf2)
      root.removeEventListener('click', handler)
      lastFocusedInput.current?.classList.remove(FOCUSED)
      lastFocusedInput.current = null
    }
  }, [activeTask.id, calcState.isSetupFinished, isTaskLoaded])

  // Rule 98: a tap scrolls the field to the centre while the calculator is
  // still closed; then the calculator opens, the task area shrinks and the
  // field ends up below its edge. Bring the field back once the area has
  // shrunk, unless it is still fully visible.
  useEffect(() => {
    const taskContainer = refs.taskContainer.current
    if (!taskContainer || typeof ResizeObserver === 'undefined') return

    let lastHeight = taskContainer.clientHeight
    const observer = new ResizeObserver(() => {
      const height = taskContainer.clientHeight
      const shrank = height < lastHeight
      lastHeight = height

      const input = lastFocusedInput.current
      if (!shrank || !input || !taskContainer.contains(input)) return

      const top = getRevealScrollTop(
        taskContainer.getBoundingClientRect(),
        input.getBoundingClientRect(),
        taskContainer.scrollTop,
      )
      if (top === null) return

      taskContainer.scrollTo({
        top,
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
          ? 'auto'
          : 'smooth',
      })
    })
    observer.observe(taskContainer)

    return () => observer.disconnect()
  }, [
    activeTask.id,
    calcState.isSetupFinished,
    isTaskLoaded,
    refs.taskContainer,
  ])

  return lastFocusedInput
}
