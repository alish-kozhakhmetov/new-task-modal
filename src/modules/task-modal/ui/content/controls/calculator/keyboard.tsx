import clsx from 'clsx'
import { useRef, type MouseEvent, type PointerEvent } from 'react'

import styles from './keyboard.module.scss'
import { CALC_MODE, NUMBERS, OPERATORS } from './model/constants'
import type { CalculatorSymbol } from './model/symbols/types'

type KeyboardMode = (typeof CALC_MODE)[keyof typeof CALC_MODE]

interface Props {
  keys: CalculatorSymbol[]
  mode: KeyboardMode
  onKeyPress: (key: CalculatorSymbol | string) => void
}

/** A finger that moved further than this is swiping the pages, not tapping. */
const TAP_SLOP_PX = 10

/** The click a tap may still send is the same press — not typed twice. */
const CLICK_AFTER_TAP_MS = 800

/**
 * A key types on the finger's release, not on the click (2.5.3).
 *
 * iOS Safari may swallow the click of a quick repeated tap on one key — it
 * waits to see a double tap: «4», then «0» four times at ~0.2 s gave «400»
 * in the Simulator on 2.5.1. touch-action: manipulation (2.5.2) turns the
 * double-tap gesture off; typing on `pointerup` does not depend on the click
 * at all. Pointer events come for every touch: each tap types, the same key
 * again too, no debounce. A finger that slid (a swipe between the letter and
 * digit pages, rule 69) types nothing.
 *
 * The click a tap still sends is skipped for that key. A mouse and the
 * keyboard (Tab, Enter / Space on a key) type through the click as before.
 */
const useTapPress = (onKeyPress: Props['onKeyPress']) => {
  const pressed = useRef(
    new Map<number, { x: number; y: number; key: string }>(),
  )
  const tappedAt = useRef(new Map<string, number>())

  return (symbol: CalculatorSymbol) => ({
    onPointerDown: (e: PointerEvent<HTMLButtonElement>) => {
      if (e.pointerType === 'mouse') return
      pressed.current.set(e.pointerId, {
        x: e.clientX,
        y: e.clientY,
        key: symbol.title,
      })
    },
    onPointerUp: (e: PointerEvent<HTMLButtonElement>) => {
      const down = pressed.current.get(e.pointerId)
      pressed.current.delete(e.pointerId)
      if (!down || down.key !== symbol.title) return
      if (Math.hypot(e.clientX - down.x, e.clientY - down.y) > TAP_SLOP_PX)
        return
      tappedAt.current.set(symbol.title, performance.now())
      onKeyPress(symbol)
    },
    onPointerCancel: (e: PointerEvent<HTMLButtonElement>) => {
      pressed.current.delete(e.pointerId)
    },
    onClick: (e: MouseEvent<HTMLButtonElement>) => {
      const tapped = tappedAt.current.get(symbol.title)
      // detail 0 — Enter or Space on a focused key, never a tap's click
      if (
        e.detail !== 0 &&
        tapped !== undefined &&
        performance.now() - tapped < CLICK_AFTER_TAP_MS
      )
        return
      onKeyPress(symbol)
    },
  })
}

export const Keyboard = ({ keys, mode, onKeyPress }: Props) => {
  const isLetters = mode === CALC_MODE.LETTERS
  const isMain = mode === CALC_MODE.MAIN
  const pressHandlers = useTapPress(onKeyPress)

  return (
    <div className={clsx(styles.keyboard, styles[mode])}>
      {keys.map((symbol) => {
        const isOperator = OPERATORS.includes(symbol.label)
        const isNumberKey = NUMBERS.includes(Number(symbol.title))

        return (
          <button
            type="button"
            data-calc
            data-calc-key={symbol.label}
            aria-label={symbol.label}
            key={symbol.title}
            {...pressHandlers(symbol)}
            className={clsx(styles.button, {
              [styles.operator]: isOperator,
              [styles.number]: isNumberKey,
              [styles.letterKey]: isLetters,
              [styles.mainKey]: isMain,
            })}
          >
            {symbol.icon ? <symbol.icon /> : symbol.title}
          </button>
        )
      })}
    </div>
  )
}
