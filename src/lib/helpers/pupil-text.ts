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
