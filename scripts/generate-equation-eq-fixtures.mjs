/**
 * Fixtures for the equation layouts of grades 5–11 (`equation.plain`,
 * `.after`, `.beforeAfter`, `equation.multi.*`): `data/task.json`,
 * `data/groups.json`, `data/all-tasks.json` in each template folder.
 *
 * Two sources, and every task says which in `_fixtureSource`:
 * - `variants.json` / `equation.json` — real payloads of the generators run on
 *   the monolith (02.08, Qalan contracts, `qalan-docs/trainer/contracts/fixtures/`);
 * - `source` — a layout with no payload in that corpus, built by hand from the
 *   generator's Elixir source in `matheducator` (title, description,
 *   answer_input, answer — strings copied, helpers expanded as written:
 *   `Latex.exp` → `\(…\)`, `TaskAnswerInput.before` → a Translation with the
 *   same text in every language). Shape is the one the real payloads have.
 *
 * Usage (from new-task-modal):
 *   QALAN_FIXTURES=<qalan-assets>/qalan-docs/trainer/contracts/fixtures \
 *     node scripts/generate-equation-eq-fixtures.mjs
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const modalRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
)
const equationRoot = path.join(
  modalRoot,
  'src/modules/tasks/ui/templates/equation',
)
const FIX = process.env.QALAN_FIXTURES
if (!FIX || !fs.existsSync(path.join(FIX, 'variants.json'))) {
  console.error(
    'QALAN_FIXTURES must point at qalan-docs/trainer/contracts/fixtures',
  )
  process.exit(1)
}

const LANGS = [
  'with_audio_player',
  'aze',
  'kgz',
  'uzb',
  'eng',
  'rus',
  'kaz',
  'arjd',
  'arsa',
  'areg',
]
/** `Translation.new(...)`: a language the source leaves out is empty. */
const tr = (values) => {
  const out = {}
  for (const lang of LANGS)
    out[lang] = lang === 'with_audio_player' ? false : (values[lang] ?? '')
  out.module_name = 'Elixir.Helpers.Translation'
  return out
}
/** One text in every language — `Latex.exp`, `TaskAnswerInput.before(string)`. */
const same = (text) => tr(Object.fromEntries(LANGS.map((lang) => [lang, text])))
const isTr = (v) => v && typeof v === 'object' && 'module_name' in v

/** Real payload → what the API hands the package (no `_struct`, no `answer`). */
const strip = (value) => {
  if (Array.isArray(value)) return value.map(strip)
  if (value && typeof value === 'object') {
    const out = {}
    for (const [k, v] of Object.entries(value))
      if (k !== '_struct') out[k] = strip(v)
    return out
  }
  return value
}

const answerString = (solution) => {
  const a = solution?.answer
  if (typeof a === 'string') return a
  if (isTr(a)) return a.rus ?? ''
  return ''
}

const toTask = (raw, source) => {
  const type = raw.taskType
  const id = type.replace('Elixir.', '')
  const answer = answerString(raw.solution)
  if (!answer) throw new Error(`${id}: no solution.answer`)
  if (
    /\[\+\d+ chars\]/.test(
      JSON.stringify([raw.description, raw.answerInput, raw.title]),
    )
  ) {
    throw new Error(`${id}: truncated by the export`)
  }
  return {
    attemptsCount: null,
    isPrimary: true,
    hasVideoUrl: false,
    isPenalty: false,
    answerInput: strip(raw.answerInput),
    difficulty: raw.difficulty ?? null,
    result: 'none',
    title: strip(raw.title),
    fields: strip(raw.fields ?? {}),
    description: strip(raw.description),
    type,
    position: 0,
    id: `eq-fixture-${id.toLowerCase()}`,
    solution: { type: 'formula', answer: same(answer), content: same('') },
    hint1: null,
    hint2: null,
    videoId: null,
    videoUrl: null,
    _fixtureSource: source,
  }
}

const variants = JSON.parse(
  fs.readFileSync(path.join(FIX, 'variants.json'), 'utf8'),
)
const examples = JSON.parse(
  fs.readFileSync(path.join(FIX, 'equation.json'), 'utf8'),
).examples
const real = new Map(
  [...variants, ...examples].map((v) => [v.taskType.replace('Elixir.', ''), v]),
)
const fromCorpus = (id) => {
  const raw = real.get(id)
  if (!raw) throw new Error(`${id}: not in variants.json / equation.json`)
  return toTask(raw, 'variants.json (generator run 02.08)')
}

const input = (before = '', after = '') => ({
  up: '',
  type: 10,
  text: ' ',
  svg: '',
  down: '',
  before,
  after,
})
const single = (before = '', after = '') => input(before, after)
const multi = (inputs, inline = false) => {
  const out = { type: inputs.length * 10, inline }
  inputs.forEach((value, i) => {
    out[`input${i + 1}`] = value
  })
  return out
}

/* Built from the generator source (matheducator, high_school_tasks). */
const fromSource = (
  id,
  file,
  { title, content, fields, answerInput, answer },
) =>
  toTask(
    {
      taskType: `Elixir.${id}`,
      title,
      fields,
      description: { type: 'equation', content: same(content) },
      answerInput,
      solution: { answer },
    },
    `source: ${file}`,
  )

const SOURCE = {
  // Strings.execute_step(); description "#{number}#{letter ^ power}+#{letter ^ power}", answer "#{number + 1}#{letter ^ power}"
  Task_7_2_3_1: () =>
    fromSource('Task_7_2_3_1', 'task_types/7-grade/chapter2/task_7_2_3_1.ex', {
      title: tr({
        kaz: 'Амалды орындаңыз:',
        rus: 'Выполните действие:',
        eng: 'Perform the operation:',
        uzb: 'Amalni bajaring:',
        kgz: 'Амалдарды аткарыңыз:',
        areg: 'أوجد ناتج ما يلي',
        arsa: '',
        aze: 'Əməli yerinə yetirin:',
        arjd: 'جد ناتج ما يلي',
      }),
      content: '3x^4+x^4',
      fields: { letter: 'x', number: 3, power: 4 },
      answerInput: single(),
      answer: '\\(4x^4\\)',
    }),
  // title Translation.new(...); description Latex.dfrac(number, 100); answer_input TaskAnswerInput.percent() = after_("\\%")
  Task_6_1_1_2_1: () =>
    fromSource(
      'Task_6_1_1_2_1',
      'task_types/6-grade/chapter1/lesson1/lesson1_2/task_6_1_1_2_1.ex',
      {
        title: tr({
          kaz: 'Қатынасты процентпен өрнектеңіз:',
          rus: 'Выразите соотношение в процентах:',
          eng: '',
          uzb: 'Nisbatni foiz bilan ifodalang:',
          kgz: '',
          areg: '',
          arsa: '',
          aze: 'Nisbəti faizlə ifadə edin:',
        }),
        content: '\\dfrac{7}{100}',
        fields: { number: 7 },
        answerInput: single('', '\\(\\%\\)'),
        answer: '7',
      },
    ),
  // Strings.Grade_7.determine_the_number_and_degree_of_members_of_the_polynomial(); before_text(polynomial_members_quantity / polynomial_power); MultipleTaskAnswer [3, 2]
  Task_7_2_9_2: () =>
    fromSource('Task_7_2_9_2', 'task_types/7-grade/chapter2/task_7_2_9_2.ex', {
      title: tr({
        kaz: 'Көпмүшенің мүшелер санын және дәрежесін анықтаңыз.',
        rus: 'Определите количество членов и степень многочлена.',
        eng: 'Determine the number of terms and degree of the polynomial.',
        uzb: "Ko'phadning hadlar sonini va darajasini aniqlang.",
        kgz: 'Көп мүчөнүн мүчөлөрүнүн санын жана даражасын аныктаңыз.',
        areg: 'اكتب عدد حدود المقدار الجبري ودرجته',
        arsa: 'اكتب عدد حدود المقدار الجبري ودرجته',
        aze: 'Çoxhədlinin hədlərinin sayını və dərəcəsini tapın.',
      }),
      content: 'x^2 + 5x + 8',
      fields: { letter: 'x', number1: 5, number2: 8 },
      answerInput: multi([
        input(
          tr({
            kaz: 'Көпмүшенің мүшелер саны:',
            rus: 'Количество членов многочлена:',
            eng: 'The number of terms of the polynomial:',
            uzb: "Ko'phadning hadlari soni:",
            kgz: 'Көп мүчөнүн мүчөлөрүнүн саны:',
            areg: 'عدد حدود كثير الحدود:',
            arsa: '',
            aze: 'Çoxhədlinin hədlərinin sayı:',
          }),
        ),
        input(
          tr({
            kaz: 'Көпмүшенің дәрежесі:',
            rus: 'Степень многочлена:',
            eng: 'Degree of the polynomial:',
            uzb: 'Ko`phadning darajasi',
            kgz: 'Көп мүчөнүн даражасы:',
            areg: 'درجة كثير الحدود:',
            arsa: '',
            aze: 'Çoxhədlinin dərəcəsi:',
          }),
        ),
      ]),
      answer: '\\(3;;2\\)',
    }),
  // title Translation.new(...); description "a_n = #{dfrac("n^2 - #{number}", "n")}"; answer_input 1..4 before("a_#{n} = "); answer Fraction(n*n - number, n) normalized
  Task_10_7_13_1: () =>
    fromSource(
      'Task_10_7_13_1',
      'task_types/10-grade/chapter7/lesson3/task_10_7_13_1.ex',
      {
        title: tr({
          kaz: 'Тізбектің алғашқы төрт мүшесін жазыңыз:',
          rus: 'Напишите первые четыре члена последовательности:',
          eng: 'Write the first four terms of the sequence:',
          uzb: 'Ketma-ketlikning dastlabki to‘rtta hadini yozing:',
          kgz: 'Удаалыштыктын алгачкы төрт мүчөсүн жазыңыз:',
          areg: '',
          arsa: '',
          aze: 'Ardıcıllığın ilk dörd həddini yazın:',
        }),
        content: 'a_n = \\dfrac{n^2 - 3}{n}',
        fields: { number: 3 },
        answerInput: multi(
          [1, 2, 3, 4].map((n) => input(same(`\\(a_${n} = \\)`))),
        ),
        answer: '\\(-2;;\\frac{1}{2};;2;;\\frac{13}{4}\\)',
      },
    ),
}

const LAYOUTS = [
  {
    id: 'equation.plain',
    folder: 'ui/plain',
    tasks: [() => fromCorpus('Task_10_2_3_1'), SOURCE.Task_7_2_3_1],
  },
  { id: 'equation.after', folder: 'ui/after', tasks: [SOURCE.Task_6_1_1_2_1] },
  {
    id: 'equation.beforeAfter',
    folder: 'ui/before-after',
    tasks: [
      () => fromCorpus('Task_10_2_10_1'),
      () => fromCorpus('Task_10_2_10_2'),
    ],
  },
  {
    id: 'equation.multi.stack.n2.before',
    folder: 'ui/multi/stack-n2-before',
    tasks: [SOURCE.Task_7_2_9_2],
  },
  {
    id: 'equation.multi.stack.n2.beforeAfter',
    folder: 'ui/multi/stack-n2-before-after',
    tasks: [() => fromCorpus('Task_10_4_1_10')],
  },
  {
    id: 'equation.multi.stack.n3.before',
    folder: 'ui/multi/stack-n3-before',
    tasks: [() => fromCorpus('Task_7_2_1_1')],
  },
  {
    id: 'equation.multi.stack.n4.before',
    folder: 'ui/multi/stack-n4-before',
    tasks: [SOURCE.Task_10_7_13_1],
  },
  {
    id: 'equation.multi.stack.n4.beforeAfter',
    folder: 'ui/multi/stack-n4-before-after',
    tasks: [() => fromCorpus('Task_10_4_6_1')],
  },
  {
    id: 'equation.multi.inline.n2.beforeAfter',
    folder: 'ui/multi/inline-n2-before-after',
    tasks: [
      () => fromCorpus('Task_10_4_13_6'),
      () => fromCorpus('Task_11_7_6_1'),
    ],
  },
]

const gradeOf = (task) => Number(/Task_(\d+)_/.exec(task.type)?.[1])
const keyOf = (task) => task.type.replace('Elixir.Task_', '')
const write = (file, data) => {
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`)
}

for (const layout of LAYOUTS) {
  const tasks = layout.tasks.map((make) => make())
  const dir = path.join(equationRoot, layout.folder, 'data')
  const group = layout.id.replace(/\./g, '_')
  const groups = tasks.map((task, i) => ({
    group: `${group}_${i + 1}`,
    count: 1,
    tasks: [{ id: keyOf(task) }],
    task,
  }))
  const byGrade = {}
  tasks.forEach((task, i) => {
    const g = String(gradeOf(task))
    ;(byGrade[g] ??= []).push({ id: keyOf(task), group: groups[i].group, task })
  })
  const grades = Object.keys(byGrade)
    .map(Number)
    .sort((a, b) => a - b)
  write(path.join(dir, 'task.json'), tasks[0])
  write(path.join(dir, 'groups.json'), groups)
  write(path.join(dir, 'all-tasks.json'), {
    defaultGrade: gradeOf(tasks[0]),
    grades,
    byGrade,
  })
  console.log(`${layout.id}: ${tasks.map(keyOf).join(', ')}`)
}
