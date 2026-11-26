/**
 * Grade pilot, step 2: every generator of the grade's live lessons → a
 * package template, or «new type» with the reason. Writes the chapter maps
 * `grades/grade-N/chapter-M.ts` for the generators of the chosen curriculum
 * chapters (the lessons' `chapterId`), keeping what the maps already have.
 *
 *   npx tsx scripts/pilot/map-grade.ts --grade=5 [--chapters=170,171] [--write]
 *
 * Rules, the same the package's own classifiers give, no new types:
 * - `description.type` outside the package's nine families → new type;
 * - a complex part the package does not draw (only text 10, number line 20,
 *   angle list 50, coordinate plane 110, table 120, image 160) → new type;
 * - the classifier's id is shipped → that template;
 * - not shipped → a shipped one of the same family that draws everything the
 *   task has: same single/multi, its before/after flags cover the task's
 *   (a template draws an adornment only when its flag is on AND the data has
 *   it; multi templates draw as many inputs as the data has);
 * - nothing covers → «variant missing» (listed, not mapped).
 * A generator whose samples disagree takes the template that covers all of
 * them, else it is listed.
 */
import fs from 'node:fs'
import path from 'node:path'

import { TemplateTypes } from '../../src/modules/tasks/model/template-types.ts'
import { classify, parseType, type AnyTask } from './lib/classify.ts'

const root = path.resolve(import.meta.dirname, '../..')
const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const [k, v] = a.replace(/^--/, '').split('=')
    return [k, v ?? 'true']
  }),
)
const GRADE = Number(args.grade ?? 5)
const CACHE = path.join(root, '.pilot-cache', `grade-${GRADE}`)
/** generators the solver showed broken: { "5_1_55_2": "why" } — kept out of the maps */
const EXCLUDE_FILE = path.join(import.meta.dirname, `grade-${GRADE}-exclude.json`)
const EXCLUDE: Record<string, string> = fs.existsSync(EXCLUDE_FILE) ? JSON.parse(fs.readFileSync(EXCLUDE_FILE, 'utf8')) : {}
const chaptersFilter = args.chapters ? new Set(String(args.chapters).split(',').map(Number)) : null

/**
 * The grades inventory (qalan-docs/trainer/grades-inventory/inventory.json, built
 * on 2.5.8): the work list and the streams' borders. Only a generator the
 * inventory calls «rules» or «open» goes into the maps here; «almost» (a
 * layout, a part of the figure, a key or an answer rule that 2.5.8 lacks) is
 * another stream's work and is listed with its code, even when a shipped
 * template of the family would draw it (wave1-common.md, 26.11).
 */
const INVENTORY =
  (args.inventory as string | undefined) ??
  path.join(process.env.HOME ?? '', 'Documents/Projects/qalan/assets/qalan-docs/trainer/grades-inventory/inventory.json')
type Form = { g: number; st: string; code: string; tpl?: string; ids: string[] }
const inventory = new Map<string, Form>()
if (fs.existsSync(INVENTORY)) {
  for (const f of JSON.parse(fs.readFileSync(INVENTORY, 'utf8')).forms as Form[])
    if (f.g === GRADE) for (const id of f.ids) inventory.set(`Elixir.${id}`, f)
} else console.warn(`no inventory at ${INVENTORY}: every exact generator is mapped`)

/** runtime value → `TemplateTypes.X.Y` expression for codegen */
const exprOf = new Map<string, string>()
const walk = (o: unknown, prefix: string) => {
  if (typeof o === 'string') exprOf.set(o, prefix)
  else if (o && typeof o === 'object') for (const [k, v] of Object.entries(o)) walk(v, `${prefix}.${k}`)
}
walk(TemplateTypes, 'TemplateTypes')
const SHIPPED = new Set(exprOf.keys())

const DRAWN_PARTS = new Set([10, 20, 50, 110, 120, 160])
const ADORN = ['plain', 'before', 'after', 'beforeAfter'] as const
type Adorn = (typeof ADORN)[number]
const needs = (a: Adorn) => ({ before: a === 'before' || a === 'beforeAfter', after: a === 'after' || a === 'beforeAfter' })

type Parsed = { family: string; multi: boolean; layout?: string; n?: number; adorn: Adorn; extra?: string }
const parseId = (id: string): Parsed | null => {
  const p = id.split('.')
  const family = p[0]
  if (p[1] === 'multi') {
    const adorn = p[4] as Adorn
    if (!ADORN.includes(adorn)) return { family, multi: true, layout: p[2], n: Number(p[3]?.slice(1)), adorn: 'plain', extra: p[4] }
    return { family, multi: true, layout: p[2], n: Number(p[3]?.slice(1)), adorn }
  }
  const adorn = p[1] as Adorn
  if (!ADORN.includes(adorn)) return { family, multi: false, adorn: 'plain', extra: p.slice(1).join('.') }
  if (p.length > 2) return { family, multi: false, adorn, extra: p.slice(2).join('.') }
  return { family, multi: false, adorn }
}

/** A shipped template that draws everything the classified id needs. */
const cover = (id: string): string | null => {
  if (SHIPPED.has(id)) return id
  const want = parseId(id)
  if (!want) return null
  const w = needs(want.adorn)
  const cands = [...SHIPPED]
    .map((s) => ({ s, p: parseId(s)! }))
    .filter(({ p }) => p && p.family === want.family && p.multi === want.multi && !p.extra)
    .filter(({ p }) => {
      const h = needs(p.adorn)
      return (!w.before || h.before) && (!w.after || h.after)
    })
    // closest first: same layout, same n, fewest extra flags
    .map(({ s, p }) => {
      const h = needs(p.adorn)
      let score = 0
      if (want.multi) {
        if (p.layout !== want.layout) score += 10
        if (p.n !== want.n) score += 1
      }
      score += (h.before && !w.before ? 2 : 0) + (h.after && !w.after ? 2 : 0)
      return { s, score }
    })
    .sort((a, b) => a.score - b.score || a.s.localeCompare(b.s))
  return cands[0]?.s ?? null
}

type Verdict = { template: string | null; reason: string; classified: string | null }
const judge = (t: AnyTask): Verdict => {
  const dt = t.description?.type
  const c = classify(t)
  if (!c) return { template: null, reason: `new type: ${dt ?? 'no description'}`, classified: null }
  if (dt === 'complex') {
    const parts = (t.description?.parts as Array<{ type?: number }> | undefined) ?? []
    const odd = [...new Set(parts.map((p) => Number(p.type)).filter((x) => !DRAWN_PARTS.has(x)))]
    if (odd.length) return { template: null, reason: `new type: complex part ${odd.join(',')}`, classified: c }
  }
  const tpl = cover(c)
  if (!tpl) return { template: null, reason: `variant missing: ${c}`, classified: c }
  return { template: tpl, reason: tpl === c ? 'exact' : `cover ${c}`, classified: c }
}

// ---- the grade's live lessons
type Lesson = { chapterId: number; lessonId: number; lessonTitle: string; status: number; tasks: AnyTask[] }
const lessons: Lesson[] = fs
  .readdirSync(path.join(CACHE, 'lessons'))
  .map((f) => JSON.parse(fs.readFileSync(path.join(CACHE, 'lessons', f), 'utf8')))

type Gen = {
  type: string
  key: string
  grade: number
  chapter: number
  id: string
  tasks: number
  lessons: Set<number>
  curriculumChapters: Set<number>
  verdicts: Map<string, number>
  samples: Verdict[]
}
const gens = new Map<string, Gen>()
let badType = 0
for (const l of lessons) {
  for (const t of l.tasks) {
    const p = parseType(t.type)
    if (!p) {
      badType++
      continue
    }
    const g =
      gens.get(t.type!) ??
      ({
        type: t.type!,
        key: `${p.grade}_${p.chapter}_${p.id}`,
        ...p,
        tasks: 0,
        lessons: new Set(),
        curriculumChapters: new Set(),
        verdicts: new Map(),
        samples: [],
      } as Gen)
    gens.set(t.type!, g)
    g.tasks++
    g.lessons.add(l.lessonId)
    g.curriculumChapters.add(Number(l.chapterId))
    if (!t.description || typeof t.description !== 'object' || !t.description.type) continue
    const v = judge(t)
    g.samples.push(v)
    const k = `${v.template ?? '∅'}|${v.reason}`
    g.verdicts.set(k, (g.verdicts.get(k) ?? 0) + 1)
  }
}

/** One template per generator: the one all samples agree on, or one that covers every sample. */
const decide = (g: Gen): Verdict => {
  if (!g.samples.length) return { template: null, reason: 'no description in the lesson (solved / empty)', classified: null }
  const nulls = g.samples.filter((s) => !s.template)
  if (nulls.length) return nulls[0]
  const tpls = [...new Set(g.samples.map((s) => s.template!))]
  if (tpls.length === 1) return g.samples[0]
  // try each candidate: does it cover every sample's classified id?
  const ids = [...new Set(g.samples.map((s) => s.classified!))]
  for (const cand of tpls) {
    const cp = parseId(cand)!
    const h = needs(cp.adorn)
    const ok = ids.every((id) => {
      const w = parseId(id)!
      const n = needs(w.adorn)
      return w.family === cp.family && w.multi === cp.multi && (!n.before || h.before) && (!n.after || h.after)
    })
    if (ok) return { template: cand, reason: `cover ${ids.join(' + ')}`, classified: ids.join('+') }
  }
  return { template: null, reason: `samples disagree: ${ids.join(', ')}`, classified: ids.join('+') }
}

/** The pilot's own verdict, then the inventory's border: rules/open only, exact only. */
const gate = (g: Gen, v: Verdict): Verdict => {
  const f = inventory.get(g.type)
  if (!v.template) return v
  if (v.reason !== 'exact')
    return { template: null, reason: `almost: layout:${v.classified} (2.5.8 has only ${v.template})`, classified: v.classified }
  if (!f) return { ...v, reason: 'exact, not in inventory' }
  if (f.st === 'rules' || f.st === 'open') return v
  return { template: null, reason: `${f.st}: ${f.code} (pilot classifier: ${v.template})`, classified: v.classified }
}

const out: Array<Record<string, unknown>> = []
for (const g of gens.values()) {
  const v = EXCLUDE[g.key]
    ? { template: null, reason: `excluded: ${EXCLUDE[g.key]}`, classified: decide(g).classified }
    : gate(g, decide(g))
  const f = inventory.get(g.type)
  out.push({
    type: g.type,
    key: g.key,
    grade: g.grade,
    chapter: g.chapter,
    id: g.id,
    tasks: g.tasks,
    lessons: [...g.lessons],
    curriculumChapters: [...g.curriculumChapters],
    template: v.template,
    reason: v.reason,
    classified: v.classified,
    inventory: f ? { st: f.st, code: f.code, tpl: f.tpl } : null,
    sampleVerdicts: Object.fromEntries(g.verdicts),
  })
}
out.sort((a, b) => String(a.key).localeCompare(String(b.key), undefined, { numeric: true }))
fs.writeFileSync(path.join(CACHE, 'mapping.json'), JSON.stringify(out, null, 1))

// ---- summary
const sum = (xs: Array<Record<string, unknown>>) => xs.reduce((s, x) => s + Number(x.tasks), 0)
const mapped = out.filter((x) => x.template)
console.log(`lessons ${lessons.length}, generators ${out.length}, tasks ${sum(out)}; not Task_N_M_…: ${badType}`)
console.log(`mapped ${mapped.length} generators / ${sum(mapped)} tasks; not: ${out.length - mapped.length} / ${sum(out) - sum(mapped)}`)
const byReason = new Map<string, { g: number; t: number }>()
for (const x of out) {
  const r = String(x.reason)
    .replace(/^cover .*/, 'cover')
    .replace(/^(variant missing: \w+).*/, '$1')
    .replace(/ \((2\.5\.8 has only|pilot classifier:) .*\)$/, '')
  const e = byReason.get(r) ?? { g: 0, t: 0 }
  e.g++
  e.t += Number(x.tasks)
  byReason.set(r, e)
}
for (const [r, e] of [...byReason.entries()].sort((a, b) => b[1].t - a[1].t)) console.log(`  ${r.padEnd(48)} ${String(e.g).padStart(4)} gen ${String(e.t).padStart(5)} tasks`)
// the inventory's layout (Amirali's live map, 31.07) against the pilot's classifier on today's samples
const tplDiff = out.filter((x) => {
  const inv = x.inventory as { tpl?: string } | null
  const c = String(x.classified ?? '')
  return inv?.tpl && !inv.tpl.endsWith('.?') && c && !c.includes('+') && inv.tpl !== c
})
const tplSame = out.filter((x) => {
  const inv = x.inventory as { tpl?: string } | null
  return inv?.tpl && !inv.tpl.endsWith('.?') && x.classified && inv.tpl === x.classified
})
console.log(`inventory layout = pilot classifier: ${tplSame.length}, differs: ${tplDiff.length}`)
for (const x of tplDiff) console.log(`  ${x.key}: inventory ${(x.inventory as { tpl: string }).tpl}, today ${x.classified}`)
const otherGrades = out.filter((x) => x.grade !== GRADE)
if (otherGrades.length) console.log(`generators of other grades in these lessons: ${otherGrades.map((x) => x.key).join(' ')}`)

if (args.write !== 'true') process.exit(0)

// ---- write chapter maps for the chosen curriculum chapters
const chosen = out.filter(
  (x) => x.template && (!chaptersFilter || (x.curriculumChapters as number[]).some((c) => chaptersFilter.has(c))),
)
const files = new Map<string, Map<string, Array<string | number>>>()
const fileOf = (g: number, ch: number) => path.join(root, 'src/modules/tasks/ui/grades', `grade-${g}`, `chapter-${ch}.ts`)
const load = async (g: number, ch: number) => {
  const f = fileOf(g, ch)
  if (files.has(f)) return files.get(f)!
  const m = new Map<string, Array<string | number>>()
  if (fs.existsSync(f)) {
    const mod = await import(f)
    for (const [tpl, ids] of Object.entries(mod.default as Record<string, Array<string | number>>)) m.set(tpl, [...ids])
  }
  files.set(f, m)
  return m
}
let added = 0
let kept = 0
let removed = 0
for (const x of out) {
  if (!String(x.reason).startsWith('excluded') || x.grade === 4) continue
  if (chaptersFilter && !(x.curriculumChapters as number[]).some((c) => chaptersFilter.has(c))) continue
  const m = await load(Number(x.grade), Number(x.chapter))
  for (const [tpl, ids] of m) {
    const left = ids.filter((i) => String(i) !== String(x.id))
    if (left.length !== ids.length) removed++
    if (left.length) m.set(tpl, left)
    else m.delete(tpl)
  }
}
for (const x of chosen) {
  if (x.grade === 4) continue // grade 4 is not touched by the pilot
  const m = await load(Number(x.grade), Number(x.chapter))
  const idValue = /^\d+$/.test(String(x.id)) ? Number(x.id) : String(x.id)
  const already = [...m.entries()].find(([, ids]) => ids.some((i) => String(i) === String(x.id)))
  if (already) {
    kept++
    if (already[0] !== x.template) console.log(`  keep ${x.key}: map has ${already[0]}, pilot would say ${x.template}`)
    continue
  }
  const ids = m.get(String(x.template)) ?? []
  ids.push(idValue)
  m.set(String(x.template), ids)
  added++
}
const fmt = (ids: Array<string | number>) => {
  const sorted = [...ids].sort((a, b) => String(a).localeCompare(String(b), undefined, { numeric: true }))
  const lines: string[] = []
  for (let i = 0; i < sorted.length; i += 8)
    lines.push(`    ${sorted.slice(i, i + 8).map((id) => (typeof id === 'number' ? String(id) : `'${id}'`)).join(', ')},`)
  return lines.join('\n')
}
for (const [f, m] of files) {
  const entries = [...m.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([tpl, ids]) => `  [${exprOf.get(tpl)}]: [\n${fmt(ids)}\n  ],`)
  fs.mkdirSync(path.dirname(f), { recursive: true })
  fs.writeFileSync(
    f,
    `import { TemplateTypes } from '../../../model/template-types.ts'\n\nconst map = {\n${entries.join('\n')}\n}\n\nexport default map\n`,
  )
}
console.log(`written ${files.size} chapter files: +${added} generators, ${kept} already mapped, ${removed} excluded`)
