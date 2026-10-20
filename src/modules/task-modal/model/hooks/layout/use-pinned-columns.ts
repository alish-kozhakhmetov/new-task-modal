import { useSyncExternalStore } from 'react'

// Same conditions as the `wide` SCSS mixin (styles/lib/mixins.scss): a screen
// with a mouse, chat column from 1100, draft column from 1280.
const CHAT_QUERY = '(hover: hover) and (pointer: fine) and (min-width: 1100px)'
const DRAFT_QUERY = '(hover: hover) and (pointer: fine) and (min-width: 1280px)'

const useMedia = (query: string) =>
  useSyncExternalStore(
    (onChange) => {
      const list = window.matchMedia(query)
      list.addEventListener('change', onChange)
      return () => list.removeEventListener('change', onChange)
    },
    () => window.matchMedia(query).matches,
    () => false,
  )

/**
 * Wide layout (Alisher, 20.10, 17:52): the chat is a permanent column from
 * 1100 and the draft from 1280 — nothing to open, nothing to close. Below
 * that, and without `layout="wide"`, both stay sheets opened by buttons.
 */
export const usePinnedColumns = (isWide: boolean) => {
  const chat = useMedia(CHAT_QUERY)
  const draft = useMedia(DRAFT_QUERY)
  return { isChatPinned: isWide && chat, isDraftPinned: isWide && draft }
}
