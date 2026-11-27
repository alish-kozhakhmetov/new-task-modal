/**
 * Types every sampled backend reference into a real MathQuill field — once
 * with our keys (insertSymbolToMathField, the keyboard's own path), once as
 * a computer's keyboard would — and writes what the field holds, for the
 * backend's TaskChecker to judge (tools/pilot/keys/README.md).
 *
 *   KEYS_SAMPLES=<samples.jsonl> KEYS_CANDIDATES=<out.jsonl> \
 *     npx vitest run --project=unit tools/pilot/keys/candidates.test.ts
 *
 * Without KEYS_SAMPLES the test is skipped: the samples come from the
 * backend, outside this repository.
 */
import fs from 'node:fs'

import { describe, expect, it } from 'vitest'

import '../../../.storybook/jquery-global'
import '@edtr-io/mathquill/build/mathquill.js'

import { LETTERS } from '../../../src/modules/task-modal/ui/content/controls/calculator/model/symbols/letters'
import { keyboardForTask } from '../../../src/modules/task-modal/ui/content/controls/calculator/model/symbols/signs'
import {
  insertSymbolToMathField,
  MATHQUILL_CONFIG,
} from '../../../src/ui/math-input/model'
import type { MathField } from '../../../src/ui/math-input/types'

import {
  referenceToKeys,
  referenceToTyping,
  type TgMode,
} from './reference-to-keys'

const SAMPLES = process.env.KEYS_SAMPLES
const OUT = process.env.KEYS_CANDIDATES

type Field = MathField & { typedText: (t: string) => void }

/** A line of backend/sample.exs: the task's fields as the API rebuilds them. */
interface Sample {
  id: string
  i: number
  refs: (string | null)[]
  fields?: string
  /** Older samples: the task as an Erlang term. */
  task?: string
}

const field = (): Field => {
  const el = document.createElement('span')
  document.body.appendChild(el)
  return window.MathQuill.getInterface(2).MathField(el, {
    ...MATHQUILL_CONFIG,
  }) as unknown as Field
}

const typeKeys = (keys: string[]) => {
  const f = field()
  for (const k of keys) insertSymbolToMathField(f, k)
  return f.latex()
}

describe.skipIf(!SAMPLES)('keys: references typed into MathQuill', () => {
  it('every reference', { timeout: 600_000 }, () => {
    const rows = fs
      .readFileSync(SAMPLES!, 'utf8')
      .split('\n')
      .filter(Boolean)
      .map((l) => JSON.parse(l) as Sample)
    const out: string[] = []
    let typed = 0
    for (const r of rows) {
      const ref: string | null = r.refs[0]
      if (!ref) continue
      // the keys this task's keyboard really has: letters, digits page, signs page
      const kb = keyboardForTask(r.id)
      const onBoard = new Set(
        [
          ...LETTERS.flatMap((l) => [l, { ...l, ...l.upperCased }]),
          ...kb.main,
          ...(kb.extra ?? []),
        ].map((s) => s.latex || s.title),
      )
      // a keyboard with signs has the fraction that nests: \frac{}{}
      const frac = onBoard.has('\\frac{}{}') ? '\\frac{}{}' : '\\frac'
      const board = (k: string) => (k === '\\frac' ? frac : k)
      const has = (k: string) => onBoard.has(board(k))
      const single = has('(')
      const base = { singleBrackets: single, has, pair: single ? '(' : '( )' }
      const cands: Record<string, string> = {}
      const keys = referenceToKeys(ref, { ...base, tg: 'key' })
      if (keys) cands.keys = typeKeys(keys.map(board))
      else cands.no_key = 'no key on this keyboard'
      // the representations tg/ctg could have been given, for the record
      if (/tg|tan|cot/.test(ref))
        for (const tg of ['operatorname', 'tan'] as TgMode[]) {
          const alt = referenceToKeys(ref, { ...base, tg, has: () => true })
          if (alt) cands[`keys_${tg}`] = typeKeys(alt)
        }
      const typing = referenceToTyping(ref)
      if (typing) {
        const f = field()
        for (const t of typing)
          if ('type' in t) f.typedText(t.type)
          else insertSymbolToMathField(f, t.key)
        cands.typed = f.latex()
        typed++
      }
      out.push(
        JSON.stringify({
          id: r.id,
          i: r.i,
          ref,
          task: r.task,
          fields: r.fields,
          cands,
        }),
      )
      document.body.innerHTML = ''
    }
    fs.writeFileSync(OUT!, out.join('\n'))
    expect(out.length).toBeGreaterThan(0)
    expect(typed).toBeGreaterThan(0)
  })
})
