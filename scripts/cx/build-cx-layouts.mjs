/**
 * Stream CX (wave 1): scaffold the missing complex / answerCell / text layouts
 * and their data from the generator corpus, and write the generator → layout
 * map for the grade streams.
 *
 *   npx tsx scripts/cx/build-cx-layouts.mjs [--data-only] [--no-scaffold]
 *
 * Each example goes to the layout the PACKAGE's own classifier gives its
 * payload (`description.type` → family classifier), not the inventory's
 * label: where the two differ the mapping says so (`layoutByPayload`).
 *
 * Sources (read only, paths overridable by env):
 * - CX_INVENTORY — qalan-docs/trainer/grades-inventory/inventory.json (26.11):
 *   which generator needs which layout (`forms[].tpl`, `ids`, grade, lessons);
 * - CX_VARIANTS — qalan-docs/trainer/contracts/fixtures/variants.json (02.08):
 *   real payloads as the API serialises them, one per structural form, plus
 *   the generator's `answer` — the value TaskChecker dispatches on.
 *
 * Strings over 200 chars are cut by that export («…[+N chars]»). A cut SVG
 * is replaced by a marked placeholder picture, a cut text keeps its head with
 * «…»; such fixtures carry `truncated: true`. Live tasks come whole.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { classifyAnswerCellTemplate } from '../../src/modules/tasks/ui/templates/answer-cell/lib/classify-answer-cell-template.ts'
import { classifyComplexTemplate } from '../../src/modules/tasks/ui/templates/complex/lib/classify-complex-template.ts'
import { classifyTextTemplate } from '../../src/modules/tasks/ui/templates/text/lib/classify-text-template.ts'
import { execSync } from 'node:child_process'

import { LAYOUTS, NOT_BUILT } from './layouts.mjs'

const CLASSIFY = {
  complex: classifyComplexTemplate,
  answerCell: classifyAnswerCellTemplate,
  text: classifyTextTemplate,
}
/** Templates of 2.5.8 (before this stream), by the release's own list. */
const BASE_TEMPLATES = new Set(
  Object.values(
    JSON.parse(
      execSync('git show 2.5.8:src/modules/tasks/model/implemented-templates.json', {
        cwd: path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..'),
      }).toString(),
    ),
  ).flat(),
)
// 2.5.8 routes these two through chapter maps without listing them
BASE_TEMPLATES.add('complex.plain.center')
BASE_TEMPLATES.add('answerCell.plain.center')

/** The package's template id for a payload, or null (family outside CX). */
const classifyPayload = (task) => {
  const fn = CLASSIFY[task.description?.type]
  return fn ? fn(task) : null
}

const HERE = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(HERE, '../..')
const TEMPLATES = path.join(ROOT, 'src/modules/tasks/ui/templates')
const ASSETS =
  process.env.CX_ASSETS ??
  '/Users/alisher/Documents/Projects/qalan/assets/.claude/worktrees/great-hawking-727933'
const INVENTORY =
  process.env.CX_INVENTORY ??
  path.join(ASSETS, 'qalan-docs/trainer/grades-inventory/inventory.json')
const VARIANTS =
  process.env.CX_VARIANTS ??
  path.join(ASSETS, 'qalan-docs/trainer/contracts/fixtures/variants.json')

const args = new Set(process.argv.slice(2))
const SCAFFOLD = !args.has('--data-only') && !args.has('--no-scaffold')

const LESSON_MAP =
  process.env.CX_LESSON_MAP ??
  path.join(ASSETS, 'qalan-docs/trainer/contracts/amirali-template-map.json')

const inventory = JSON.parse(fs.readFileSync(INVENTORY, 'utf8'))
/** Task keys of the 31.07 lessons (`3_7_2_10`, `GeoTask_8_4_9`). */
const lessonKeys = new Set(
  Object.keys(JSON.parse(fs.readFileSync(LESSON_MAP, 'utf8')).keyToTemplate),
)
const inLesson = (generator) =>
  lessonKeys.has(generator.replace(/^Task_/, '')) || lessonKeys.has(generator)
const variants = JSON.parse(fs.readFileSync(VARIANTS, 'utf8'))

// ---------------------------------------------------------------- payloads
const CUT = /…\[\+(\d+) chars\]$/

const placeholderSvg = (chars) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="240" height="72" viewBox="0 0 240 72" data-cx-placeholder="truncated"><rect x="1" y="1" width="238" height="70" rx="8" fill="#f3f4f6" stroke="#9ca3af" stroke-dasharray="6 4"/><text x="120" y="32" text-anchor="middle" font-size="13" fill="#6b7280">рисунок урезан выгрузкой</text><text x="120" y="52" text-anchor="middle" font-size="11" fill="#9ca3af">fixture: +${chars} chars</text></svg>`

/** Drop `_struct` (export-only), restore cut strings as marked stand-ins. */
const toApi = (node, flags) => {
  if (Array.isArray(node)) return node.map((x) => toApi(x, flags))
  if (node && typeof node === 'object') {
    const out = {}
    for (const [k, v] of Object.entries(node)) {
      if (k === '_struct') continue
      out[k] = toApi(v, flags)
    }
    return out
  }
  if (typeof node === 'string') {
    const m = CUT.exec(node)
    if (!m) return node
    flags.truncated = true
    if (/<svg|<img|<div|<\?xml/i.test(node)) return placeholderSvg(m[1])
    return `${node.replace(CUT, '')}…`
  }
  return node
}

const translation = (rus) => ({
  with_audio_player: false,
  aze: '',
  kgz: '',
  uzb: '',
  eng: '',
  rus,
  kaz: '',
  arjd: '',
  arsa: '',
  areg: '',
  module_name: 'Elixir.Helpers.Translation',
})

// ------------------------------------------------- the generator's answer
/** Elixir Fraction → the pupil's `\frac{a}{b}` (mixed: `1\frac{a}{b}`). */
const fractionText = (f) => {
  const sign = f.sign < 0 ? '-' : ''
  if (!f.a) return `${sign}${f.integer ?? 0}`
  const whole = f.integer ? String(f.integer) : ''
  return `${sign}${whole}\\frac{${f.a}}{${f.b}}`
}

/** Elixir MyDecimal → `12,5` (the keyboard's decimal comma). */
const decimalText = (d) => {
  const sign = d.sign < 0 ? '-' : ''
  const coef = String(d.coef)
  const exp = Number(d.exp)
  if (exp >= 0) return `${sign}${coef}${'0'.repeat(exp)}`
  const digits = coef.padStart(-exp + 1, '0')
  return `${sign}${digits.slice(0, exp)},${digits.slice(exp)}`
}

/**
 * Every answer string the backend accepts, best first — null when the
 * value's type is judged by a rule this stream does not own (interval,
 * union, point…: stream ANS).
 */
export const acceptedStrings = (a) => {
  if (a == null) return null
  if (typeof a === 'number') return [String(a).replace('.', ',')]
  if (typeof a === 'string') return [a]
  if (Array.isArray(a)) {
    const all = a.map(acceptedStrings)
    return all.some((x) => x == null) ? null : all.flat()
  }
  const s = a._struct
  if (s === 'MultipleTaskAnswer') {
    const parts = a.answers.map(acceptedStrings)
    if (parts.some((x) => x == null)) return null
    return [parts.map((p) => p[0]).join(';;')]
  }
  if (s === 'TaskAnswers.AnyOfThemTaskAnswer') return acceptedStrings(a.answers)
  if (s === 'Fraction') return [fractionText(a)]
  if (s === 'MyDecimal') return [decimalText(a)]
  if (s === 'ExpressionTaskAnswer') return [String(a.answer)]
  if (s === 'PermutationsTaskAnswer')
    return a.default_answer ? [a.default_answer] : null
  return null
}

/** Answer value types inside, for the report («int», «Fraction»…). */
const answerKinds = (a, acc = new Set()) => {
  if (a == null) acc.add('none')
  else if (typeof a === 'number') acc.add(Number.isInteger(a) ? 'int' : 'float')
  else if (typeof a === 'string') acc.add('str')
  else if (Array.isArray(a)) a.forEach((x) => answerKinds(x, acc))
  else if (a._struct === 'MultipleTaskAnswer' || a._struct === 'TaskAnswers.AnyOfThemTaskAnswer')
    a.answers.forEach((x) => answerKinds(x, acc))
  else acc.add(a._struct ?? 'object')
  return acc
}

const OWN_KINDS = new Set(['int', 'str', 'float'])

// ------------------------------------------------------------- the corpus
const byType = new Map()
for (const v of variants) {
  const key = v.taskType.replace(/^Elixir\./, '')
  if (!byType.has(key)) byType.set(key, [])
  byType.get(key).push(v)
}

const LAYOUT_SET = new Set(LAYOUTS.map((l) => l.id))
const INVENTORY_SET = new Set([...LAYOUT_SET, ...NOT_BUILT])
const gens = new Map() // generator → { grade, layout, code, st, lessons }
for (const f of inventory.forms) {
  if (!INVENTORY_SET.has(f.tpl)) continue
  for (const id of f.ids) {
    gens.set(id, {
      grade: f.g,
      layout: f.tpl,
      code: f.code,
      st: f.st,
      ans: f.ans,
      formLessons: f.les,
    })
  }
}

const taskKey = (id) => id.replace(/^(Geo)?Task_/, '')

const makeEntry = (generator, v, index) => {
  const flags = { truncated: false }
  const task = {
    attemptsCount: null,
    isPrimary: true,
    hasVideoUrl: false,
    isPenalty: false,
    answerInput: toApi(v.answerInput, flags),
    difficulty: v.difficulty ?? null,
    result: 'none',
    title: toApi(v.title, flags),
    fields: toApi(v.fields, flags),
    description: toApi(v.description, flags),
    type: v.taskType,
    position: 0,
    id: `cx-${taskKey(generator)}-${index}`,
    hint1: null,
    hint2: null,
    videoId: null,
    videoUrl: null,
  }
  const accepted = acceptedStrings(v.answer)
  if (accepted?.length) {
    task.solution = {
      type: 'formula',
      answer: translation(accepted[0]),
      content: translation(''),
    }
  }
  const kinds = [...answerKinds(v.answer)].sort()
  return {
    id: taskKey(generator),
    task,
    backendAnswer: v.answer,
    answerElixirType: v.answerElixirType,
    answerKinds: kinds,
    answerRuleOwned: kinds.every((k) => OWN_KINDS.has(k)),
    accepted,
    truncated: flags.truncated,
  }
}

/** Input extras no multi template draws: a picture, a label above / below. */
const inputExtras = (task) => {
  const ai = task.answerInput
  if (!ai || typeof ai !== 'object') return []
  const inputs = Object.entries(ai)
    .filter(([k]) => k.startsWith('input'))
    .map(([, v]) => v)
  const out = new Set()
  const filled = (v) =>
    typeof v === 'string'
      ? v.trim().length > 0
      : v && typeof v === 'object'
        ? Object.entries(v).some(([k, x]) => k !== 'module_name' && typeof x === 'string' && x.trim())
        : false
  for (const i of inputs.length ? inputs : [ai]) {
    if (!i || typeof i !== 'object') continue
    for (const k of ['svg', 'up', 'down']) if (filled(i[k])) out.add(k)
  }
  return [...out]
}

/** Labels written only in Kazakh (rus empty) — 2.5.8 multi templates read `rus`. */
const kazOnlyLabels = (task) => {
  const ai = task.answerInput
  if (!ai || typeof ai !== 'object') return false
  return Object.entries(ai)
    .filter(([k]) => k.startsWith('input'))
    .some(([, i]) =>
      ['before', 'after'].some((k) => {
        const v = i?.[k]
        return v && typeof v === 'object' && !String(v.rus ?? '').trim() && String(v.kaz ?? '').trim()
      }),
    )
}

const perLayout = new Map(LAYOUTS.map((l) => [l.id, []]))
/** generator → what its 02.08 payload says, where it differs from the inventory. */
const payloadLayout = new Map()
for (const [generator, g] of gens) {
  const vs = byType.get(generator) ?? []
  vs.forEach((v, i) => {
    const entry = { grade: g.grade, ...makeEntry(generator, v, i) }
    entry.layoutByPayload = classifyPayload(entry.task)
    entry.inputExtras = inputExtras(entry.task)
    entry.kazOnlyLabels = kazOnlyLabels(entry.task)
    if (entry.layoutByPayload !== g.layout) payloadLayout.set(generator, entry.layoutByPayload)
    if (perLayout.has(entry.layoutByPayload)) perLayout.get(entry.layoutByPayload).push(entry)
  })
}

// A layout no 02.08 example reaches gets the local backend's tasks routed to
// it (CX_LOCAL=.cx-local/corpus-*.json from scripts/cx/local-corpus.mjs):
// whole payloads, the sandbox's answerString as the reference.
for (const file of (process.env.CX_LOCAL ?? '').split(',').filter(Boolean)) {
  for (const e of JSON.parse(fs.readFileSync(path.resolve(ROOT, file), 'utf8'))) {
    if (!e.task || !perLayout.has(e.layout) || perLayout.get(e.layout).some((x) => !x.local)) continue
    const ref = e.answerString == null ? null : String(e.answerString).split(' || ')[0]
    perLayout.get(e.layout).push({
      grade: e.grade,
      id: e.id,
      task: e.task,
      backendAnswer: null,
      answerElixirType: 'local backend',
      accepted: ref == null ? null : [ref],
      truncated: false,
      layoutByPayload: e.layout,
      local: true,
    })
  }
}

// ------------------------------------------------------------ scaffolding
const SIBLING = {
  complex: {
    multi: {
      folder: 'ui/multi/stack-n2-before-after',
      component: 'ComplexMultiStackN2BeforeAfter',
      fileBase: 'complex-multi-stack-n2-before-after',
      title: 'Templates/Complex/multi/stack-n2-beforeAfter',
    },
    simple: {
      folder: 'ui/before-after',
      component: 'ComplexBeforeAfter',
      fileBase: 'complex-before-after',
      title: 'Templates/Complex/beforeAfter',
    },
  },
  answerCell: {
    multi: {
      folder: 'ui/multi/inline-n2-plain',
      component: 'AnswerCellMultiInlineN2Plain',
      fileBase: 'answer-cell-multi-inline-n2-plain',
      title: 'Templates/AnswerCell/multi/inline-n2-plain',
    },
  },
  text: {
    multi: {
      folder: 'ui/multi/stack-n2-before-after',
      component: 'TextMultiStackN2BeforeAfter',
      fileBase: 'text-multi-stack-n2-before-after',
      title: 'Templates/Text/multi/stack-n2-before-after',
    },
  },
}

const STORY_FILES = [
  'all-groups.stories.tsx',
  'all-tasks.stories.tsx',
  'data.stories.tsx',
  'trainer.stories.tsx',
  'index.ts',
]

const FACTORY = {
  complex: (l) =>
    l.multi
      ? ['createMultiComplexTemplate', '../../../lib/create-multi-complex-template']
      : ['createSimpleComplexTemplate', '../../lib/create-simple-complex-template'],
  answerCell: () => [
    'createMultiAnswerCellTemplate',
    '../../../lib/create-multi-answer-cell-template',
  ],
  text: () => ['createMultiTextTemplate', '../../../lib/create-multi-text-template'],
}

const CLASSIFIER = {
  complex: ['classifyComplexTemplate', 'classify-complex-template'],
  answerCell: ['classifyAnswerCellTemplate', 'classify-answer-cell-template'],
  text: ['classifyTextTemplate', 'classify-text-template'],
}

const TYPE = { complex: 'ComplexTask', answerCell: 'AnswerCellTask', text: 'TextTask' }

const ADORN_RU = {
  plain: 'без подписей',
  before: 'подпись слева',
  after: 'подпись справа',
  beforeAfter: 'подписи слева и справа',
}
const LAYOUT_RU = { stack: 'столбиком', inline: 'в строку' }

const componentSource = (l) => {
  const [factory, from] = FACTORY[l.family](l)
  const cfg = [`  id: '${l.id}',`]
  if (l.multi) cfg.push(`  layout: '${l.layout}',`, `  inputCount: ${l.n},`)
  if (l.adorn === 'before' || l.adorn === 'beforeAfter') cfg.push('  withBefore: true,')
  if (l.adorn === 'after' || l.adorn === 'beforeAfter') cfg.push('  withAfter: true,')
  return `import { ${factory} } from '${from}'

/** См. \`./README.md\` и пример payload в \`./data/task.json\`. */
export const ${l.component} = ${factory}({
${cfg.join('\n')}
})
`
}

const testSource = (l) => {
  const up = l.multi ? '../../..' : '../..'
  const mocks = l.family === 'text' ? `${up}/lib/testing/mocks` : `${up}/../text/lib/testing/mocks`
  const [classify, classifyFile] = CLASSIFIER[l.family]
  const T = TYPE[l.family]
  const wantPrefix = l.family !== 'answerCell' && (l.adorn === 'before' || l.adorn === 'beforeAfter')
  const wantSuffix = l.family !== 'answerCell' && (l.adorn === 'after' || l.adorn === 'beforeAfter')
  const sample = l.n > 1 ? Array.from({ length: l.n }, (_, i) => i + 1).join(';;') : '7'
  return `import { screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { ${classify} } from '${up}/lib/${classifyFile}'
import { makeSolution, renderTemplate } from '${up}/lib/testing/test-utils'
import type { ${T} } from '${up}/lib/types.task'

import allTasksJson from './data/all-tasks.json'
import fixture from './data/task.json'

import { ${l.component} as Template } from '.'

vi.mock('@/ui/math-input/math-input', () => import('${mocks}/math-input'))
vi.mock('@/ui/math-text/math-text', () => import('${mocks}/math-text'))
vi.mock('@/ui/math-text/math-formula', () => import('${mocks}/math-formula'))

const task = { ...(fixture as unknown as ${T}), solution: null }

type Entry = { id: string; task: ${T}; truncated?: boolean }
const corpus = Object.values(
  (allTasksJson as unknown as { byGrade: Record<string, Entry[]> }).byGrade,
).flat()

const visibleFields = (t: ${T}) =>
  t.description && 'isAnswerCellHidden' in t.description
    ? !t.description.isAnswerCellHidden
    : true

const asInput = (e: Entry) => ({ ...e, task: { ...e.task, solution: null } })
const countable = corpus
  .map(asInput)
  .filter((e) => visibleFields(e.task) && !e.truncated)
const uncounted = corpus
  .map(asInput)
  .filter((e) => !visibleFields(e.task) || e.truncated)

describe('${l.id}', () => {
  it('фикстура классифицируется в ${l.id}', () => {
    expect(${classify}(task)).toBe('${l.id}')
  })

  it('${l.n} ${l.n === 1 ? 'поле' : 'поля'} ${l.layout ? LAYOUT_RU[l.layout] : ''}, ${ADORN_RU[l.adorn]}', () => {
    renderTemplate(Template, task)

    expect(screen.getAllByTestId('math-input')).toHaveLength(${l.n})
${wantPrefix ? "    expect(screen.getAllByTestId('text-prefix').length).toBeGreaterThan(0)\n" : ''}${wantSuffix ? "    expect(screen.getAllByTestId('text-suffix').length).toBeGreaterThan(0)\n" : ''}  })

  it('solution-ветка вместо режима ввода', () => {
    renderTemplate(Template, { ...task, solution: makeSolution('${sample}') })

    expect(screen.queryByTestId('math-input')).not.toBeInTheDocument()
    expect(screen.getByText(/Правильный ответ/)).toBeInTheDocument()
  })

  it.each(countable.map((e) => [e.id, e.task] as const))(
    'корпус: %s классифицируется сюда и рисует ${l.n} ${l.n === 1 ? 'поле' : 'поля'}',
    (_id, t) => {
      expect(${classify}(t)).toBe('${l.id}')
      renderTemplate(Template, t)
      expect(screen.getAllByTestId('math-input')).toHaveLength(${l.n})
    },
  )

  // a cut export string may cut the cells out of the condition, a hidden
  // answer row keeps its fields in the table: these only classify and render
  it.each(uncounted.map((e) => [e.id, e.task] as const))(
    'корпус: %s (урезан выгрузкой или поля в таблице) классифицируется сюда и рисуется',
    (_id, t) => {
      expect(${classify}(t)).toBe('${l.id}')
      expect(() => renderTemplate(Template, t)).not.toThrow()
    },
  )
})
`
}

const readmeSource = (l, entries) => {
  const grades = [...new Set(entries.map((e) => e.grade))].sort((a, b) => a - b)
  const first = entries.find((e) => !e.truncated) ?? entries[0]
  const what = l.multi
    ? `${l.n} \`MathInput\` ${LAYOUT_RU[l.layout]}, ${ADORN_RU[l.adorn]}.`
    : `Одно поле \`MathInput\`, ${ADORN_RU[l.adorn]}.`
  const when = l.multi
    ? `\`answerInput\` с \`input1\`…\`input${l.n}\`; \`inline\` ${l.layout === 'inline' ? 'true' : 'falsy'}; подписи у полей: ${ADORN_RU[l.adorn]}.`
    : `\`answerInput\` одно поле, непустой \`before\`, пустой \`after\`.`
  return `# \`${l.id}\`

${what} Собрана потоком CX волны 1 (26.11.2026) из фабрики семейства — та же
вёрстка, что у соседних раскладок 4 класса.

## Когда выбирать

${when}

## Контракт данных

См. [data/task.json](data/task.json)${first ? ` (\`${first.task.type}\`)` : ''}. Примеры — из выгрузки
генераторов 02.08 (\`variants.json\`), классы: ${grades.join(', ') || '—'}. Строки длиннее
200 символов выгрузка урезает: урезанный рисунок заменён помеченной заглушкой
(\`truncated: true\` в [data/all-tasks.json](data/all-tasks.json)). Боевые данные приходят целиком.

## Тесты

[${l.fileBase}.test.tsx](${l.fileBase}.test.tsx): classify → id; ${l.n} ${l.n === 1 ? 'поле' : 'поля'}; ветка решения;
корпус — каждая задача из \`all-tasks.json\` классифицируется сюда и рисует ${l.n} ${l.n === 1 ? 'поле' : 'поля'}.
`
}

const write = (file, text) => {
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, text)
}

const report = []
for (const l of LAYOUTS) {
  const dir = path.join(TEMPLATES, l.familyDir, l.folder)
  const entries = perLayout.get(l.id)
  // task.json: a whole (uncut) example with a judged answer, else the first
  const sample =
    entries.find((e) => !e.truncated && e.accepted) ??
    entries.find((e) => !e.truncated) ??
    entries[0]

  if (!sample) {
    report.push({ id: l.id, examples: 0 })
    continue
  }

  const grades = [...new Set(entries.map((e) => e.grade))].sort((a, b) => a - b)
  const byGrade = Object.fromEntries(
    grades.map((g) => [
      String(g),
      entries
        .filter((e) => e.grade === g)
        .map((e) => ({ ...e, group: `grade-${g}`, grade: undefined })),
    ]),
  )
  const groups = grades.map((g) => {
    const list = entries.filter((e) => e.grade === g)
    const head = list.find((e) => !e.truncated && e.accepted) ?? list[0]
    return { group: `grade-${g}`, count: list.length, task: head.task }
  })
  const defaultGrade = grades.includes(sample.grade) ? sample.grade : grades[0]

  write(path.join(dir, 'data/task.json'), `${JSON.stringify(sample.task, null, 2)}\n`)
  write(path.join(dir, 'data/groups.json'), `${JSON.stringify(groups, null, 2)}\n`)
  write(
    path.join(dir, 'data/all-tasks.json'),
    `${JSON.stringify({ defaultGrade, grades, byGrade }, null, 2)}\n`,
  )

  if (SCAFFOLD) {
    const sib = SIBLING[l.family][l.multi ? 'multi' : 'simple']
    const sibDir = path.join(TEMPLATES, l.familyDir, sib.folder)
    const swap = (src) =>
      src
        .split(sib.component)
        .join(l.component)
        .split(`'${sib.title}`)
        .join(`'${l.storyTitle}`)
        .split(sib.fileBase)
        .join(l.fileBase)
    for (const f of STORY_FILES) {
      write(path.join(dir, f), swap(fs.readFileSync(path.join(sibDir, f), 'utf8')))
    }
    write(
      path.join(dir, `${l.fileBase}.stories.tsx`),
      swap(fs.readFileSync(path.join(sibDir, `${sib.fileBase}.stories.tsx`), 'utf8')),
    )
    write(path.join(dir, `${l.fileBase}.tsx`), componentSource(l))
    write(path.join(dir, `${l.fileBase}.test.tsx`), testSource(l))
    write(path.join(dir, 'README.md'), readmeSource(l, entries))
  }

  report.push({
    id: l.id,
    examples: entries.length,
    whole: entries.filter((e) => !e.truncated).length,
    judged: entries.filter((e) => e.accepted && e.answerRuleOwned).length,
    grades: grades.join(','),
  })
}

// ------------------------------------------------ generator → layout map
const examplesByGen = new Map()
for (const [layout, entries] of perLayout) {
  for (const e of entries) {
    const key = `Task_${e.id}`
    const gen = [...gens.keys()].find((g) => taskKey(g) === e.id) ?? key
    if (!examplesByGen.has(gen)) examplesByGen.set(gen, [])
    examplesByGen.get(gen).push({
      layout,
      truncated: e.truncated,
      owned: e.answerRuleOwned,
      extras: e.inputExtras,
      kazOnly: e.kazOnlyLabels,
    })
  }
}
const mapping = {
  _what:
    'Поток CX волны 1: генератор → раскладка нового окна. Только раскладки complex.*, answerCell.*, text.*, которых не было в 2.5.8. Подключение к классам (карты глав, available-tasks) — потоки классов.',
  _built: new Date().toISOString(),
  _sources: {
    inventory: `${path.relative(ASSETS, INVENTORY)} (${inventory.meta.builtAt})`,
    variants: `${path.relative(ASSETS, VARIANTS)} (выгрузка 02.08, монолит ${inventory.meta.sources.coverage.monolithCommit.slice(0, 10)})`,
    package: 'feat/cx-layouts от 2.5.8 (453fef53)',
  },
  _fields: {
    grade: 'класс генератора',
    layout: 'templateId в TEMPLATE_MAP / TemplateTypes',
    chapterKey: 'ключ карты главы: grade-N/chapter-M.ts, суффикс задачи',
    status: 'статус в инвентаризации до потока (almost = не хватало только раскладки)',
    inLessons: 'ключ задачи есть в уроках снимка 31.07 (amirali-template-map.json, keyToTemplate)',
    example: 'есть пример в variants.json (проверен рендером и ответом)',
    layoutInInventory: 'раскладка по инвентаризации (карта уроков 31.07 / порт классификатора)',
    layoutByPayload: 'раскладка, которую классификатор ПАКЕТА даёт примеру из выгрузки 02.08, если она другая; layoutByPayloadExists: in 2.5.8 — уже была, CX — сделана здесь, no — нет нигде',
    inputExtras: 'у поля есть картинка (svg) или подпись над/под (up/down) — 2.5.8 их не рисует ни в одной multi-раскладке',
    kazOnlyLabels: 'подписи полей только на казахском (rus пуст) — 2.5.8 multi-раскладки читают у подписи только rus',
    answerRule: 'own — тип ответа проверяется этим потоком (целое, строка, несколько полей); ans — нужен поток ANS (дробь, десятичная, промежуток…); none — эталона нет',
  },
  generators: [...gens.entries()]
    .map(([generator, g]) => {
      const m = /^(?:Geo)?Task_(\d+)_(\d+)_(.+)$/.exec(generator)
      const ex = examplesByGen.get(generator) ?? []
      const owned = ex.length ? ex.every((x) => x.owned) : null
      const byPayload = payloadLayout.get(generator)
      const extras = [...new Set(ex.flatMap((x) => x.extras))]
      return {
        generator,
        grade: g.grade,
        layout: byPayload && !BASE_TEMPLATES.has(byPayload) && !LAYOUT_SET.has(byPayload) ? g.layout : (byPayload ?? g.layout),
        layoutInInventory: g.layout,
        ...(byPayload ? { layoutByPayload: byPayload, layoutByPayloadExists: BASE_TEMPLATES.has(byPayload) ? 'in 2.5.8' : LAYOUT_SET.has(byPayload) ? 'CX' : 'no' } : {}),
        ...(extras.length ? { inputExtras: extras } : {}),
        ...(ex.some((x) => x.kazOnly) ? { kazOnlyLabels: true } : {}),
        chapterKey: m ? { file: `grade-${m[1]}/chapter-${m[2]}.ts`, id: m[3] } : null,
        status: g.st,
        inLessons: inLesson(generator),
        example: ex.length > 0,
        answerRule: owned == null ? 'none' : owned ? 'own' : 'ans',
      }
    })
    .sort((a, b) => a.grade - b.grade || a.generator.localeCompare(b.generator, 'en', { numeric: true })),
}
fs.writeFileSync(path.join(ROOT, 'cx-mapping.json'), `${JSON.stringify(mapping, null, 2)}\n`)

console.table(report)
console.log(`generators: ${mapping.generators.length}`)
