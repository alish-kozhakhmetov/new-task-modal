/**
 * One check for every equation layout, run over every example in the
 * layout's `data/groups.json` (real payloads where the corpus has them).
 *
 * The answer is checked the way the backend reads it: `MultipleTaskAnswer`
 * splits the pupil string on `;;` and compares part by part in order
 * (`backend-answer-rules.json`, knownTraps `multiple-separator-arity`). So the
 * reference parts typed into the fields must reach the wire as exactly
 * `part1;;part2;;…`, and a mutation — swapped fields, one field left empty —
 * must not. The reference is the backend's own `solution.answer`, not
 * something derived from the template.
 */
import { fireEvent, screen } from '@testing-library/react'
import type { ComponentType } from 'react'
import { describe, expect, it, vi } from 'vitest'

import { toWireMultiAnswer } from '@/modules/tasks/lib/multi-answer'
import type { TaskComponentProps } from '@/modules/tasks/model/types'

import { stripMathDelimiters } from '../../../../text/lib/strip-math-delimiters'
import { classifyEquationTemplate } from '../classify-equation-template'
import { getEquationInputEntries } from '../equation-input-entries'
import type { EquationTask } from '../types.task'

import { makeSolution, renderTemplate } from './test-utils'

type Fixture = { group: string; task: EquationTask }

const rus = (value: unknown): string =>
  typeof value === 'string'
    ? value
    : ((value as { rus?: string } | null)?.rus ?? '')

const referenceParts = (task: EquationTask): string[] =>
  stripMathDelimiters(rus((task.solution as { answer?: unknown })?.answer))
    .split(';;')
    .map((part) => part.trim())

const lastAnswer = (onChange: ReturnType<typeof vi.fn>) =>
  toWireMultiAnswer(String(onChange.mock.calls.at(-1)?.[0] ?? ''), ';;')

export const describeEquationLayout = (
  id: string,
  Template: ComponentType<TaskComponentProps<EquationTask>>,
  groups: Fixture[],
) => {
  describe(`шаблон ${id}`, () => {
    const cases = groups.map((g) => [g.task.type, g.task] as const)

    it.each(cases)('%s → классификатор', (_, raw) => {
      expect(classifyEquationTemplate(raw)).toBe(id)
    })

    it.each(cases)('%s: уравнение, подписи, число полей', (_, raw) => {
      const task = { ...raw, solution: null }
      renderTemplate(Template, task)

      expect(screen.getByTestId('equation-content')).not.toHaveTextContent('')
      const entries = getEquationInputEntries(task.answerInput, rus)
      const fields = entries.length || 1
      expect(screen.getAllByTestId('math-input')).toHaveLength(fields)

      const before = entries.length
        ? entries.filter((e) => e.before).length
        : Number(
            Boolean(
              rus((task.answerInput as { before?: unknown })?.before).trim(),
            ),
          )
      const after = entries.length
        ? entries.filter((e) => e.after).length
        : Number(
            Boolean(
              rus((task.answerInput as { after?: unknown })?.after).trim(),
            ),
          )
      expect(screen.queryAllByTestId('equation-before')).toHaveLength(before)
      expect(screen.queryAllByTestId('equation-after')).toHaveLength(after)
    })

    const typeInto = (inputs: HTMLElement[], values: string[]) => {
      values.forEach((value, i) => {
        fireEvent.change(inputs[i], { target: { value } })
      })
    }

    const renderForAnswer = (raw: EquationTask) => {
      const onChange = vi.fn()
      renderTemplate(Template, { ...raw, solution: null }, { onChange })
      return { onChange, inputs: screen.getAllByTestId('math-input') }
    }

    it.each(cases)('%s: верный ответ уходит как в эталоне', (_, raw) => {
      const parts = referenceParts(raw)
      const { onChange, inputs } = renderForAnswer(raw)

      // the backend compares part by part: one field per reference part
      expect(inputs).toHaveLength(parts.length)
      typeInto(inputs, parts)
      expect(lastAnswer(onChange)).toBe(parts.join(';;'))
    })

    it.each(cases)('%s: неверный ответ не совпадает с эталоном', (_, raw) => {
      const parts = referenceParts(raw)
      const { onChange, inputs } = renderForAnswer(raw)

      // the last field off by a digit
      typeInto(inputs, [...parts.slice(0, -1), `${parts.at(-1)}1`])
      expect(lastAnswer(onChange)).not.toBe(parts.join(';;'))

      // one field emptied: the slot stays, so the arity still matches
      typeInto(inputs, ['', ...parts.slice(1)])
      const holed = lastAnswer(onChange)
      expect(holed.split(';;')).toHaveLength(parts.length)
      expect(holed).not.toBe(parts.join(';;'))
    })

    const ordered = cases.filter(
      ([, raw]) => new Set(referenceParts(raw)).size > 1,
    )
    if (ordered.length) {
      it.each(ordered)('%s: поля уходят в порядке input1..N', (_, raw) => {
        const parts = referenceParts(raw)
        const { onChange, inputs } = renderForAnswer(raw)

        typeInto(inputs, [...parts].reverse())
        expect(lastAnswer(onChange)).toBe([...parts].reverse().join(';;'))
        expect(lastAnswer(onChange)).not.toBe(parts.join(';;'))
      })
    }

    it.each(cases)('%s: ветка решения вместо ввода', (_, raw) => {
      const parts = referenceParts(raw)
      renderTemplate(Template, {
        ...raw,
        solution: makeSolution(`\\(${parts.join(';;')}\\)`),
      })
      expect(screen.queryByTestId('math-input')).not.toBeInTheDocument()
      expect(screen.getByText(/Правильный ответ/)).toBeInTheDocument()
    })
  })
}
