import stackN2Tasks from '@/modules/tasks/ui/templates/answer-cell/ui/multi/stack-n2-plain/data/all-tasks.json'
import gridTasks from '@/modules/tasks/ui/templates/table/ui/grid/data/all-tasks.json'
import testTasks from '@/modules/tasks/ui/templates/test/ui/plain/data/all-tasks.json'
import inlineN5Tasks from '@/modules/tasks/ui/templates/text/ui/multi/inline-n5-after/data/all-tasks.json'
import stackN5Tasks from '@/modules/tasks/ui/templates/text/ui/multi/stack-n5-after/data/all-tasks.json'
import plainTasks from '@/modules/tasks/ui/templates/text/ui/plain/data/all-tasks.json'
import type { Task } from '@/types/api/task'

/**
 * A lesson for the task list stories: real conditions of lesson 2121
 * (grade 4, «Разряды и классы»), from the package fixtures, in the lesson's
 * own order. Fifteen tasks — the lesson as the backend gives it.
 */
const LESSON_2121 = [
  '4_1_3',
  '4_1_4',
  '4_1_5',
  '4_1_6',
  '4_1_7',
  '4_1_8',
  '4_1_9',
  '4_1_10',
  '4_1_56_1',
  '4_1_56',
  '4_1_57',
  '4_1_59',
  '4_1_60',
  '4_1_61',
  '4_1_62',
] as const

type LessonTaskId = (typeof LESSON_2121)[number]

interface FixtureFile {
  byGrade?: Record<string, { id: string; task: unknown }[]>
}

const FILES = [
  plainTasks,
  stackN5Tasks,
  inlineN5Tasks,
  gridTasks,
  testTasks,
  stackN2Tasks,
] as unknown[]

const fixture = (id: string): Task => {
  for (const file of FILES) {
    const hit = (file as FixtureFile).byGrade?.['4']?.find((t) => t.id === id)
    if (hit) return structuredClone(hit.task) as Task
  }
  throw new Error(`No fixture for ${id}`)
}

/** As the backend gives it before the first attempt: no solution. */
const unsolved = (id: string): Task => ({ ...fixture(id), solution: null })

/**
 * Solved in an earlier visit: the backend returns such a task empty —
 * `description: ""`, no `answerInput`, no `fields`, `solution: "-"`
 * (contracts/backend-notes.md). Nothing to show but the status.
 */
const solvedEarlier = (id: string, result: string): Task => {
  const { id: taskId, type, position } = fixture(id)
  return {
    id: taskId,
    type,
    position,
    title: '',
    result,
    isPenalty: false,
    description: '' as unknown as Task['description'],
    solution: '-',
  }
}

/** Solved in this visit — the store keeps what the check left on the task. */
const solvedNow = (
  id: string,
  result: 'correct' | 'error' | 'solution_shown',
  answer: string,
): Task => {
  const task = fixture(id)
  return {
    ...task,
    result,
    answer,
    // The backend sends the solution only after the last attempt or «show».
    solution: result === 'correct' ? null : task.solution,
    attemptsCount: result === 'correct' ? 1 : 3,
  }
}

export interface LessonFixture {
  tasks: Task[]
  activeTask: Task
  initialTasksCount: number
  /**
   * What the check sends back after the last wrong attempt — the solution
   * with the answer panel. Without it the mock has none to show.
   */
  solution?: Task['solution']
}

/**
 * Mid-lesson, mixed: three tasks solved on an earlier visit (empty from the
 * backend), four in this one — right, answer shown, right, with a mistake —
 * an extra task after the mistake (solved), the current task №9 and seven
 * ahead. 16 tasks of the initial 15: the counter reads «№9/15 16».
 */
export const midLesson = (): LessonFixture => {
  const errored = solvedNow('4_1_9', 'error', '96741')
  // An extra task is of the same type as the one with the mistake and takes
  // its position (use-check-answer.ts). The fixture has one 4_1_9 — the
  // story reuses its condition under a new id.
  const extra: Task = {
    ...solvedNow('4_1_9', 'correct', '96714'),
    id: 'penalty-4_1_9',
    isPenalty: true,
  }
  const current = unsolved('4_1_10')
  const tasks: Task[] = [
    solvedEarlier('4_1_3', 'correct'),
    solvedEarlier('4_1_4', 'error'),
    solvedEarlier('4_1_5', 'correct'),
    solvedNow('4_1_6', 'correct', '2'),
    solvedNow('4_1_7', 'solution_shown', ''),
    solvedNow('4_1_8', 'correct', '6;;3;;6;;3;;2'),
    errored,
    extra,
    current,
    ...LESSON_2121.slice(8).map((id: LessonTaskId) => unsolved(id)),
  ]
  return { tasks, activeTask: current, initialTasksCount: LESSON_2121.length }
}

/** The start of a lesson: №1 solved right in this visit, №2 is current. */
export const secondTask = (): LessonFixture => {
  const current = unsolved('4_1_4')
  const tasks: Task[] = [
    solvedNow('4_1_3', 'correct', '1'),
    current,
    ...LESSON_2121.slice(2).map((id: LessonTaskId) => unsolved(id)),
  ]
  return { tasks, activeTask: current, initialTasksCount: LESSON_2121.length }
}

/**
 * Lesson 2120 («Чтение и запись чисел до 100 000»), its tasks in the fixtures
 * in order: №1 right, №2 current, the rest ahead. №2 and №3 have five-digit
 * numbers in the text («50000», «61861») and their generators group digits
 * (rule 100) — the list's rows group them as the task does. Lesson 2121's
 * place-value tasks (4_1_3…4_1_7, 4_1_56) are in GROUPING_OFF_TASKS: their
 * numbers stay solid on the task and in the list.
 */
export const lesson2120 = (): LessonFixture => {
  const current = unsolved('4_1_2')
  const tasks: Task[] = [
    solvedNow('4_1_1', 'correct', '80000'),
    current,
    ...['4_1_69', '4_1_70', '4_1_71', '4_1_72', '4_1_73'].map(unsolved),
  ]
  return { tasks, activeTask: current, initialTasksCount: tasks.length }
}

/** A lesson of one task, before the first attempt — a field to type into. */
const oneTask = (task: Task): LessonFixture => ({
  tasks: [task],
  activeTask: task,
  initialTasksCount: 1,
})

/**
 * 4_1_1 «Запишите цифрами число …» with the number Alisher typed (23.10):
 * the generator's instance for 50000. The fixture holds the 80000 one; the
 * condition is its text with the number's words swapped.
 */
export const writeFiftyThousand = (): LessonFixture => {
  const task = unsolved('4_1_1')
  const description = task.description as unknown as {
    content: Record<string, string>
  }
  description.content = {
    ...description.content,
    rus: 'Запишите цифрами число пятьдесят тысяч.',
    kaz: 'Елу мың санын цифрмен жазыңыз.',
    eng: 'Write the number fifty thousand in numerals.',
  }
  task.fields = { ...task.fields, number: 50000 }
  return oneTask(task)
}

/** 4_8_3_1 «… следует за числом 3000004 …» — a seven-digit answer. */
export const nextAfterMillions = (): LessonFixture =>
  oneTask(unsolved('4_8_3_1'))

/**
 * Two single-field tasks, the first with the backend's solution: three wrong
 * answers bring «Далее», «Далее» brings the second (2.5.7: the computer's
 * keyboard types into the field on entry and after «Далее», no click).
 */
export const twoFieldTasks = (): LessonFixture => {
  // own ids: the check's mock counts wrong attempts by id
  const first = { ...unsolved('4_1_1'), id: 'keyboard-4_1_1' }
  return {
    tasks: [first, { ...unsolved('4_8_3_1'), id: 'keyboard-4_8_3_1' }],
    activeTask: first,
    initialTasksCount: 2,
    solution: fixture('4_1_1').solution,
  }
}
