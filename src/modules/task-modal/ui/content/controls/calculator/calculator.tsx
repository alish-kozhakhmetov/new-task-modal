import 'keen-slider/keen-slider.min.css'
import { useMemo, useState, type RefObject } from 'react'

import type { Global } from '@/types/global'
import { Slider } from '@/ui/slider/slider'

import { Keyboard } from './keyboard'
import { CALC_MODE } from './model/constants'
import { ARROW_UP_ACTION, LETTERS } from './model/symbols/letters'
import { keyboardForTask } from './model/symbols/signs'
import type { CalculatorSymbol, MainPanelSymbol } from './model/symbols/types'

/** Names of the keyboard pages, for their pagination dots. */
const PAGE_LABELS = [
  { rus: 'Буквы', kaz: 'Әріптер', eng: 'Letters' },
  { rus: 'Цифры', kaz: 'Цифрлар', eng: 'Digits' },
]
/** The task's own signs (DS «Additional»), after the digits. */
const SIGNS_LABEL = { rus: 'Знаки', kaz: 'Таңбалар', eng: 'Signs' }

interface Props {
  global: Global
  onInput: (input: string) => void
  /** The active task's type: it picks the signs (model/symbols/signs.ts). */
  taskType?: string
  ref?: RefObject<HTMLDivElement | null>
  className?: string
}

export const Calculator = ({
  global,
  onInput,
  taskType,
  ref,
  className,
}: Props) => {
  const [isUppercase, setIsUppercase] = useState(false)

  const translate = global.translate

  const layout = useMemo(() => keyboardForTask(taskType), [taskType])

  const translated = useMemo(
    () => (keys: MainPanelSymbol[]) =>
      keys.map((symbol) =>
        symbol.withTranslation
          ? { ...symbol, title: translate(symbol.title) }
          : symbol,
      ),
    [translate],
  )

  const mainKeys = useMemo(
    () => translated(layout.main),
    [translated, layout.main],
  )
  const extraKeys = useMemo(
    () => (layout.extra ? translated(layout.extra) : null),
    [translated, layout.extra],
  )

  const letterKeys = useMemo(() => {
    return LETTERS.map((symbol) => {
      if (isUppercase) {
        return { ...symbol, ...symbol.upperCased }
      }

      return symbol
    })
  }, [isUppercase])

  const handleKeyPress = (key: CalculatorSymbol | string) => {
    const isSymbol = typeof key === 'object'

    if (!isSymbol) {
      onInput(key)
      return
    }

    if (key.action === ARROW_UP_ACTION) {
      setIsUppercase((prev) => !prev)
      return
    }

    if (key.latex) {
      onInput(key.latex)
    } else {
      onInput(key.title)
    }
  }

  return (
    <Slider
      className={className}
      ref={ref}
      slideLabels={[
        ...PAGE_LABELS,
        ...(extraKeys ? [SIGNS_LABEL] : []),
      ].map((label) => translate(label))}
      slides={[
        <Keyboard
          key={CALC_MODE.LETTERS}
          mode={CALC_MODE.LETTERS}
          keys={letterKeys}
          onKeyPress={handleKeyPress}
        />,
        <Keyboard
          key={CALC_MODE.MAIN}
          mode={CALC_MODE.MAIN}
          keys={mainKeys}
          onKeyPress={handleKeyPress}
        />,
        ...(extraKeys
          ? [
              <Keyboard
                key="signs"
                mode={CALC_MODE.MAIN}
                keys={extraKeys}
                onKeyPress={handleKeyPress}
              />,
            ]
          : []),
      ]}
    />
  )
}
