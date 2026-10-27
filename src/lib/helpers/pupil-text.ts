import type { Global } from '@/types/global'

/**
 * A string the pupil sees, in the languages of the package's own
 * dictionaries (chat-text.tsx, task-list-strings.ts, top-bar.tsx): the host's
 * `global.translate` picks the field by the interface language, as for every
 * other string of the site; other languages fall back as the site's do.
 */
export type PupilText = {
  rus: string
  kaz: string
  eng: string
}

/** The string in the pupil's language; Russian without a host translate. */
export const pupilText = (
  global: Partial<Pick<Global, 'translate'>> | undefined,
  text: PupilText,
): string =>
  (typeof global?.translate === 'function' && global.translate(text)) ||
  text.rus

/**
 * Strings of the task window outside the chat and the task list (2.5.7: the
 * answer panel read «Ваш ответ» in a Kazakh lesson). Kazakh — as the chat's
 * (chat-text.tsx) or the site's own words (Localization.js), named per entry.
 */
export const TASK_TEXT = {
  /** chat-text.tsx `yourAnswer` */
  yourAnswer: {
    rus: 'Ваш ответ:',
    kaz: 'Сіздің жауабыңыз:',
    eng: 'Your answer:',
  },
  /** Kazakh — chat-text.tsx `correctAnswer`; the Russian stays the panel's. */
  correctAnswer: {
    rus: 'Правильный ответ:',
    kaz: 'Дұрыс жауап:',
    eng: 'Correct answer:',
  },
  /** chat-text.tsx `explanation` */
  explanation: { rus: 'Объяснение', kaz: 'Түсіндірме', eng: 'Explanation' },
  /** Site: «Чатты ашу» (mlReview.openChat). */
  openChat: { rus: 'Открыть чат', kaz: 'Чатты ашу', eng: 'Open the chat' },
  /** Site: «Тақта» (whiteboard), as «Чатты ашу». */
  openDraft: {
    rus: 'Открыть доску',
    kaz: 'Тақтаны ашу',
    eng: 'Open the board',
  },
  /** Site: «Оқушыға сызуға рұқсат беру» (whiteboardTools.allowPupil). */
  draw: { rus: 'Рисовать', kaz: 'Сызу', eng: 'Draw' },
  /** Site: whiteboardTools.eraser */
  eraser: { rus: 'Ластик', kaz: 'Өшіргіш', eng: 'Eraser' },
  /** Site: «Артқа» (duelPage.back) */
  back: { rus: 'Назад', kaz: 'Артқа', eng: 'Back' },
  forward: { rus: 'Вперед', kaz: 'Алға', eng: 'Forward' },
  /** Site: «Барлығын өшіру», «Тақтаны тазалау» */
  clearAll: { rus: 'Очистить всё', kaz: 'Барлығын тазалау', eng: 'Clear all' },
  /** Title of the draft column (wide layout); Kazakh — the lead's, 23.10. */
  draft: { rus: 'Черновик', kaz: 'Қаралама', eng: 'Draft' },
  /**
   * Above a test with several correct answers while the host dictionary has
   * no `pickEveryFittingOption`; Kazakh — the lead's, 23.10.
   */
  pickEveryFittingOption: {
    rus: 'Выберите все подходящие варианты',
    kaz: 'Барлық сәйкес нұсқаларды таңдаңыз',
    eng: 'Select all that apply',
  },
  /**
   * A task the package has no template for (2.5.8: lesson 2205, Task_4_6_6_*
   * — the window stayed empty). Kazakh — mine, to check with the lead.
   */
  taskUnavailable: {
    rus: 'Эта задача пока открывается только в прежнем окне',
    kaz: 'Бұл тапсырма әзірге тек бұрынғы терезеде ашылады',
    eng: 'This task opens only in the previous window for now',
  },
  openInOldWindow: {
    rus: 'Открыть в прежнем окне',
    kaz: 'Бұрынғы терезеде ашу',
    eng: 'Open in the previous window',
  },
  /** Site: «Жабу» */
  close: { rus: 'Закрыть', kaz: 'Жабу', eng: 'Close' },
  /** Site: «Тақтаны тазалау», «Жабу» */
  closeDraft: {
    rus: 'Закрыть доску',
    kaz: 'Тақтаны жабу',
    eng: 'Close the board',
  },
} as const satisfies Record<string, PupilText>

export type TaskTextKey = keyof typeof TASK_TEXT

/** `t('yourAnswer')` in the pupil's language. */
export const taskT =
  (global: Partial<Pick<Global, 'translate'>> | undefined) =>
  (key: TaskTextKey): string =>
    pupilText(global, TASK_TEXT[key])
