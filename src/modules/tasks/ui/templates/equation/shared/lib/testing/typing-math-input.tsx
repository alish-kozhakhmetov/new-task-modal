/**
 * Vitest mock for `@/ui/math-input/math-input` that can be typed into.
 *
 * The text family's mock is a read-only `<input>` without a ref, so a test
 * cannot see what a template sends. This one exposes `getLatex` through the
 * ref (as MathQuill's MathInput does) and calls `onMathFieldChanged`, so the
 * multi-field handlers run for real and the joined answer can be asserted.
 */
import { useImperativeHandle, useRef, type Ref } from 'react'

import type { MathInputRef } from '@/ui/math-input/types'

interface MockProps {
  formula?: string
  className?: string
  id?: string
  onMathFieldChanged?: (value: string) => void
  ref?: Ref<MathInputRef>
}

export const MathInput = ({
  formula = '',
  className,
  id,
  onMathFieldChanged,
  ref,
}: MockProps) => {
  const value = useRef(formula)
  useImperativeHandle(ref, () => ({
    id: id ?? 'default',
    insertSymbol: () => {},
    setLatex: (latex: string) => {
      value.current = latex
    },
    getLatex: () => value.current,
    writeOnCursorPosition: () => {},
    focus: () => {},
  }))

  return (
    <input
      data-testid="math-input"
      data-input-id={id}
      className={className}
      defaultValue={formula}
      onChange={(event) => {
        value.current = event.target.value
        onMathFieldChanged?.(event.target.value)
      }}
    />
  )
}
