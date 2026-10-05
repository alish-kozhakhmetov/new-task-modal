import { useEffect, type RefObject } from 'react'

import {
  pickWordForm,
  WORD_FORM_MARK,
  wordFormsOf,
} from '../../lib/resolve-word-forms'

const MARKED_WORD = new RegExp(`([А-Яа-яЁё]+)${WORD_FORM_MARK}`, 'g')

/** First text node with a marked word, outside MathJax. */
const markedText = (el: Element): Text | null => {
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT)
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    const text = n as Text
    if (text.parentElement?.closest('mjx-container')) continue
    if (text.data.includes(WORD_FORM_MARK)) return text
  }
  return null
}

/**
 * The label right after a field: its next sibling, or — when the field sits
 * last in its own wrapper — the wrapper's next sibling. Another field there
 * means the field has no label after it.
 */
const labelAfter = (field: Element, root: Element): Text | null => {
  let node: Element | null = field
  for (let depth = 0; node && node !== root && depth < 3; depth++) {
    const next = node.nextElementSibling
    if (next) {
      if (next.matches('[data-input]') || next.querySelector('[data-input]'))
        return null
      return markedText(next)
    }
    node = node.parentElement
  }
  return null
}

/** What the field shows, read from MathQuill's DOM: digits, «,» or a fraction. */
const fieldValue = (field: Element): string => {
  if (field.querySelector('.mq-fraction')) return '\\frac'
  const block = field.querySelector('.mq-root-block') ?? field
  return (block.textContent ?? '').replace(
    /[\s\u00a0\u200b-\u200d\u2060\ufeff]/g,
    '',
  )
}

/**
 * «5 [лет]» → «1 [год]» → «3 [года]» while the child types: the word after a
 * field agrees with the number in it. Only words the text marked as word
 * forms change (see resolve-word-forms). Works on the DOM because the labels
 * are rendered by fourteen templates; React leaves the edited text node be,
 * since its own text for it does not change.
 */
export const useWordFormAgreement = (
  ref: RefObject<HTMLElement | null>,
  taskId: unknown,
) => {
  useEffect(() => {
    const root = ref.current
    if (!root) return

    // The text as rendered, before agreement, per label node.
    const original = new WeakMap<Text, string>()
    let frame = 0

    const update = () => {
      frame = 0
      for (const field of root.querySelectorAll('[data-input]')) {
        const label = labelAfter(field, root)
        if (!label) continue
        if (!original.has(label)) original.set(label, label.data)
        const value = fieldValue(field)
        const next = original
          .get(label)!
          .replace(MARKED_WORD, (whole, word: string) => {
            const forms = wordFormsOf(word)
            return forms ? pickWordForm(forms, value) + WORD_FORM_MARK : whole
          })
        if (label.data !== next) label.data = next
      }
    }

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }

    // MathQuill edits its own DOM on every keystroke and keypad press.
    const observer = new MutationObserver(schedule)
    observer.observe(root, {
      subtree: true,
      childList: true,
      characterData: true,
    })
    schedule()

    return () => {
      observer.disconnect()
      if (frame) cancelAnimationFrame(frame)
    }
  }, [ref, taskId])
}
