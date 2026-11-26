/**
 * Fixtures of the coordinate-plane prototype from REAL backend payloads.
 *
 *   tsx scripts/coordinate-plane/build-fixtures.ts tasks <gen.jsonl>
 *     → data/all-tasks.json (tasks the prototype answers) + candidates.jsonl
 *   tsx scripts/coordinate-plane/build-fixtures.ts verdicts <verdicts.jsonl>
 *     → data/backend-verdicts.json
 *
 * gen.jsonl and verdicts.jsonl come from the local backend (G3's be.sh: the
 * monolith's generators and TaskChecker, test.qalan.kz is not touched):
 * backend/gen.exs dumps the tasks, backend/check.exs judges candidates.jsonl
 * with TaskChecker.user_answer_correct? on the task rebuilt from its fields.
 * The procedure is in qalan-docs/trainer/specs/coordinate-plane.md
 * («Чем проверено»).
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { planeModeOf } from '../../src/modules/tasks/ui/templates/coordinate-plane/lib/drawing-figure'
import {
  toAnswerString,
  toWireAnswer,
  type Pt,
} from '../../src/modules/tasks/ui/templates/coordinate-plane/lib/plane-answer'
import { solvePlaneAnswer } from '../../src/modules/tasks/ui/templates/coordinate-plane/lib/solve-plane-answer'

/** One line of the generator dump (gen.exs) or of the verdicts. */
export interface GenRow {
  id: string
  error?: string
  type: string
  seed: number
  title?: unknown
  description?: { type: string; figure: Parameters<typeof planeModeOf>[0] }
  answerInput?: unknown
  solution?: unknown
  answer?: unknown
  answerType?: string
  fields?: string
  label?: string
  wire?: unknown
  verdict?: unknown
}

const DATA = join(
  dirname(fileURLToPath(import.meta.url)),
  '../../src/modules/tasks/ui/templates/coordinate-plane/ui/draw/data',
)
const KEEP_LANG = new Set(['rus', 'kaz', 'eng', '_struct', 'module_name'])

/** Translations shrunk to rus/kaz/eng: the stories run in Russian. */
const shrink = (v: unknown): unknown => {
  if (Array.isArray(v)) return v.map(shrink)
  if (v && typeof v === 'object') {
    const o = v as Record<string, unknown>
    const isTr =
      o._struct === 'Helpers.Translation' ||
      o.module_name === 'Elixir.Helpers.Translation'
    return Object.fromEntries(
      Object.entries(o)
        .filter(([k]) => !isTr || KEEP_LANG.has(k))
        .map(([k, x]) => [k, shrink(x)]),
    )
  }
  return v
}

const [cmd, file] = process.argv.slice(2)
const lines = readFileSync(file, 'utf8')
  .split('\n')
  .filter(Boolean)
  .map((l) => JSON.parse(l) as GenRow)

if (cmd === 'tasks') {
  const tasks: unknown[] = []
  const candidates: string[] = []
  for (const r of lines) {
    if (r.error || r.description?.type !== 'coordinatePlane') continue
    const mode = planeModeOf(r.description.figure)
    if (mode.kind === 'unsupported') continue
    const solved = solvePlaneAnswer(r.answer)
    tasks.push(
      shrink({
        id: `cp-${r.id}`,
        type: r.type,
        title: r.title,
        description: r.description,
        answerInput: r.answerInput,
        solution: r.solution,
        fields: {},
        _backend: {
          id: r.id,
          seed: r.seed,
          answer: r.answer,
          answerType: r.answerType,
        },
      }),
    )
    if (!solved) continue
    const shift = (pts: Pt[], i: number, dx: number, dy: number) =>
      pts.map((p, j) => (j === i ? { x: p.x + dx, y: p.y + dy } : p))
    const tries: [string, Pt[]][] = [['solved', solved]]
    if (solved.length > 1) tries.push(['reversed', [...solved].reverse()])
    tries.push(
      ['last y+1', shift(solved, solved.length - 1, 0, 1)],
      ['first x+1', shift(solved, 0, 1, 0)],
    )
    for (const [label, pts] of tries) {
      const store = toAnswerString(mode, { points: pts })
      const wire = toWireAnswer(store)
      const row = { id: r.id, seed: r.seed, fields: r.fields, label, wire }
      candidates.push(JSON.stringify(row))
      // what the store holds today, sent as is: a JSON string, not an object
      if (label === 'solved' && typeof wire !== 'string')
        candidates.push(
          JSON.stringify({ ...row, label: 'solved as string', wire: store }),
        )
    }
  }
  writeFileSync(
    join(DATA, 'all-tasks.json'),
    JSON.stringify(tasks, null, 1) + '\n',
  )
  writeFileSync(
    join(dirname(file), 'candidates.jsonl'),
    candidates.join('\n') + '\n',
  )
  console.log(`tasks ${tasks.length}, candidates ${candidates.length}`)
} else if (cmd === 'verdicts') {
  const rows = lines.map(({ id, label, wire, verdict }) => ({
    id,
    label,
    wire,
    verdict,
  }))
  writeFileSync(
    join(DATA, 'backend-verdicts.json'),
    JSON.stringify(rows, null, 1) + '\n',
  )
  console.log(
    `verdicts ${rows.length}, true ${rows.filter((r) => r.verdict === true).length}`,
  )
}
