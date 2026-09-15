import type { Translation } from '@/types/api/task'
import { normalizeOperatorSigns } from '@/ui/math-text/normalize-operator-signs'
import type { RadioOption } from '@/ui/radio-button/radio-button-group'

/** Letter for variant index: 0 → A, 1 → B, … */
export const getTestRadioValue = (index: number) =>
  String.fromCharCode(65 + index)

/** Map description.variants → RadioButtonGroup options. */
export const getTestVariants = (
  variants: Translation[] | undefined,
  translate: (value: Translation | string) => string,
): RadioOption[] =>
  (variants ?? []).map((option, index) => {
    const label = translate(option)
    return {
      value: getTestRadioValue(index),
      /*
       * Option text bypasses MathText, so signs are normalized here:
       * «820 - 432 > 386», «49 · 8 = 3136 : 8» (Task_4_3_4_14, 4_3_4_6).
       * Markup (SVG variants) is left alone — a `*` in its CSS is not a sign.
       */
      label: label.includes('<') ? label : normalizeOperatorSigns(label),
    }
  })

/**
 * Resolve a stored letter (A/B/C…) to its display value for answer panels —
 * just the letter itself, so the solution panel shows which option was
 * chosen without repeating the option text.
 */
export const getTestOptionDisplayValue = (
  options: RadioOption[],
  value: string | null | undefined,
): string => {
  const option = options.find((item) => item.value === value)
  if (!option) return value ?? ''
  return option.value
}
