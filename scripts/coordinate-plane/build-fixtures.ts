/**
 * Fixtures of the coordinate-plane prototype from REAL backend payloads.
 *
 *   tsx scripts/coordinate-plane/build-fixtures.ts tasks <gen.jsonl>
 *     → data/all-tasks.json (seed 1 of every task the prototype answers, with
 *       its solution: the stories), data/seed-tasks.json (every seed, no
 *       solution: the test) + candidates.jsonl
 *   tsx scripts/coordinate-plane/build-fixtures.ts verdicts <verdicts.jsonl>
 *     → data/backend-verdicts.json
 *
 * gen.jsonl and verdicts.jsonl come from the local backend (the monolith's
 * generators and TaskChecker, test.qalan.kz is not touched). Since 27.11
 * grades 5–11 run on origin/master, as production does — be.sh of
 * feat/grade-5-pilot with QALAN_BE_MODULES=<master common>:<master hs>, no
 * `-pa` over G3's modules (it would mix versions); grades 1–4 on G3's build:
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
  toMultiAnswer,
  type DrawnFigure,
} from '../../src/modules/tasks/ui/templates/coordinate-plane/lib/multi-figure'
import {
  toAnswerString,
  toWireAnswer,
  type Pt,
} from '../../src/modules/tasks/ui/templates/coordinate-plane/lib/plane-answer'
import {
  fillPredicate,
  solveFigures,
  solveFill,
  solvePlaneAnswer,
} from '../../src/modules/tasks/ui/templates/coordinate-plane/lib/solve-plane-answer'

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

// a third argument: write the fixtures there instead of the package's data
// (a second backend — origin/master — judged without touching the corpus)
const [cmd, file, outDir] = process.argv.slice(2)
const OUT = outDir ?? DATA
const lines = readFileSync(file, 'utf8')
  .split('\n')
  .filter(Boolean)
  .map((l) => JSON.parse(l) as GenRow)

if (cmd === 'tasks') {
  const tasks: unknown[] = []
  const seedTasks: unknown[] = []
  const candidates: string[] = []
  for (const r of lines) {
    if (r.error || r.description?.type !== 'coordinatePlane') continue
    const mode = planeModeOf(r.description.figure)
    if (mode.kind === 'unsupported') continue
    const solved = solvePlaneAnswer(r.answer, r.description.figure)
    const task = {
      id: `cp-${r.id}-s${r.seed}`,
      type: r.type,
      title: r.title,
      description: r.description,
      answerInput: r.answerInput,
      fields: {},
      _backend: {
        id: r.id,
        seed: r.seed,
        answer: r.answer,
        answerType: r.answerType,
      },
    }
    seedTasks.push(shrink(task))
    // the stories' file keeps its key order: id … answerInput, solution, fields
    const { fields, _backend, ...head } = task
    if (r.seed === 1)
      tasks.push(
        shrink({
          ...head,
          id: `cp-${r.id}`,
          solution: r.solution,
          fields,
          _backend,
        }),
      )
    const shift = (pts: Pt[], i: number, dx: number, dy: number) =>
      pts.map((p, j) => (j === i ? { x: p.x + dx, y: p.y + dy } : p))
    const push = (label: string, store: string) => {
      if (!store) return
      const wire = toWireAnswer(store)
      const row = { id: r.id, seed: r.seed, fields: r.fields, label, wire }
      candidates.push(JSON.stringify(row))
      if (label === 'solved' && typeof wire !== 'string')
        candidates.push(
          JSON.stringify({ ...row, label: 'solved as string', wire: store }),
        )
    }
    if (mode.kind === 'multi') {
      // several figures (scenario E): the solved set, its order reversed,
      // one figure missing, one point of the last figure off; a plane to
      // shade (F) — with the filling point, without it, and outside
      const f = r.description.figure as {
        minPosition?: number
        maxPosition?: number
        tickStep?: number
      }
      const step = f.tickStep || 1
      const field = {
        lo: (f.minPosition ?? -5) - step,
        hi: (f.maxPosition ?? 5) + step,
      }
      const figs = solveFigures(r.answer, field)
      if (!figs) continue
      const inner = { lo: field.lo + step, hi: field.hi - step, step }
      const fill = mode.fill ? solveFill(r.answer, inner) : null
      const holds = mode.fill ? fillPredicate(r.answer, field) : null
      const corners: Pt[] = [
        { x: inner.lo, y: inner.lo },
        { x: inner.hi, y: inner.hi },
        { x: inner.lo, y: inner.hi },
        { x: inner.hi, y: inner.lo },
      ]
      const outside = holds ? corners.find((p) => !holds(p)) : undefined
      const fills = fill ? [fill] : []
      const last = figs.length - 1
      const tries: [string, DrawnFigure[], Pt[]][] = [['solved', figs, fills]]
      if (figs.length > 1) {
        tries.push(['figures reversed', [...figs].reverse(), fills])
        tries.push(['one figure missing', figs.slice(0, last), fills])
      }
      // off the figure: across a vertical line, else up (y+1 along x = 0
      // is still the line — the backend rightly accepts it)
      const off = (g: DrawnFigure) =>
        g.points[0].x === g.points[1].x
          ? shift(g.points, 1, 1, 0)
          : shift(g.points, 1, 0, 1)
      tries.push([
        'last point off',
        figs.map((g, i) => (i === last ? { ...g, points: off(g) } : g)),
        fills,
      ])
      if (fill) tries.push(['no filling point', figs, []])
      if (outside) tries.push(['filling point outside', figs, [outside]])
      for (const [label, figures, points] of tries)
        push(label, toMultiAnswer({ figures, active: 0, fills: points }))
      continue
    }
    if (!solved) continue
    const tries: [string, Pt[]][] = [['solved', solved]]
    if (solved.length > 1) tries.push(['reversed', [...solved].reverse()])
    tries.push(
      ['last y+1', shift(solved, solved.length - 1, 0, 1)],
      ['first x+1', shift(solved, 0, 1, 0)],
    )
    // no answer (two points on one x of a curve): «Проверить» stays off;
    // «solved as string» — what the store holds, sent as is: not an object
    for (const [label, pts] of tries)
      push(label, toAnswerString(mode, { points: pts }))
  }
  writeFileSync(
    join(OUT, 'all-tasks.json'),
    JSON.stringify(tasks, null, 1) + '\n',
  )
  // compact: three seeds of every task, read by the test only
  writeFileSync(join(OUT, 'seed-tasks.json'), JSON.stringify(seedTasks) + '\n')
  writeFileSync(
    join(dirname(file), 'candidates.jsonl'),
    candidates.join('\n') + '\n',
  )
  console.log(
    `tasks ${tasks.length}, seed tasks ${seedTasks.length}, candidates ${candidates.length}`,
  )
} else if (cmd === 'verdicts') {
  const rows = lines.map(({ id, seed, label, wire, verdict }) => ({
    id,
    seed,
    label,
    wire,
    verdict,
  }))
  // one row per line: diffs stay readable, the file stays small
  writeFileSync(
    join(OUT, 'backend-verdicts.json'),
    '[\n' + rows.map((r) => JSON.stringify(r)).join(',\n') + '\n]\n',
  )
  console.log(
    `verdicts ${rows.length}, true ${rows.filter((r) => r.verdict === true).length}`,
  )
}
