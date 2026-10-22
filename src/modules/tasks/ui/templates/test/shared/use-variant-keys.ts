import { useEffect } from 'react'

import { useStore } from '@/modules/task-modal/model/store/task-modal-store'
import {
  parseMultiValue,
  serializeMultiValue,
} from '@/ui/checkbox/checkbox-group'
import type { RadioOption } from '@/ui/radio-button/radio-button-group'

/** Typing in a text field is not a choice: the chat line, an input. */
const isTextEntry = (target: EventTarget | null) => {
  if (!(target instanceof HTMLElement)) return false
  if (target.isContentEditable || target.tagName === 'TEXTAREA') return true
  if (target.tagName !== 'INPUT') return false
  const type = (target as HTMLInputElement).type
  return type !== 'radio' && type !== 'checkbox' && type !== 'button'
}

/**
 * The index a physical key picks: the letter of the option (A, B, C…) or its
 * number (1, 2, 3…). `code`, not `key`: on a Russian layout «B» comes as «и»,
 * the physical key is still B — the letter the option has.
 */
const optionIndex = (code: string) => {
  const letter = /^Key([A-Z])$/.exec(code)
  if (letter) return letter[1].charCodeAt(0) - 65
  const digit = /^(?:Digit|Numpad)([1-9])$/.exec(code)
  return digit ? Number(digit[1]) - 1 : -1
}

interface Options {
  /** The inputs' `name`: the picked one takes the focus. */
  name: string
  options: RadioOption[]
  value: string
  onChange: (value: string) => void
  multiple: boolean
  enabled: boolean
}

/**
 * A test is answered from a computer's keyboard too (registry row 68, rule 96;
 * the stand did it since August): A–F or 1–6 pick the option, a second press
 * of a picked checkbox drops it. The picked option takes the focus, as on a
 * click — so Enter then checks the answer (the window hears Enter inside it).
 * Not while a text field has the focus, not with a modifier (⌘C, Ctrl+R), not
 * under the task list.
 */
export const useVariantKeys = ({
  name,
  options,
  value,
  onChange,
  multiple,
  enabled,
}: Options) => {
  const isListOpen = useStore((s) => s.taskList !== null)

  useEffect(() => {
    if (!enabled || isListOpen) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.isComposing) return
      if (event.metaKey || event.ctrlKey || event.altKey) return
      if (isTextEntry(event.target)) return
      const index = optionIndex(event.code)
      const option = options[index]
      if (!option) return
      event.preventDefault()
      document
        .querySelector<HTMLInputElement>(
          `input[name="${CSS.escape(name)}"][value="${CSS.escape(option.value)}"]`,
        )
        ?.focus({ preventScroll: true })
      if (!multiple) {
        onChange(option.value)
        return
      }
      const picked = parseMultiValue(value)
      const next = picked.includes(option.value)
        ? picked.filter((item) => item !== option.value)
        : [...picked, option.value]
      onChange(serializeMultiValue(options, next))
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [enabled, isListOpen, name, options, value, onChange, multiple])
}
