import { createContext, use, type ReactNode } from 'react'

import type { Global } from '@/types/global'

/**
 * Chat strings in the pupil's language (2.5.2: a Kazakh lesson showed the chat
 * in Russian). The host's `global.translate` picks the field by the interface
 * language, as for every other string of the site (kaz is its fallback).
 * Kazakh and English wording — to be checked by a native speaker.
 */
export const CHAT_TEXT = {
  aiChat: { rus: 'AI-чат', kaz: 'AI-чат', eng: 'AI chat' },
  mentor: { rus: 'Ментор', kaz: 'Ментор', eng: 'Mentor' },
  viewExample: {
    rus: 'Смотреть пример',
    kaz: 'Мысалды көру',
    eng: 'See example',
  },
  showAnswer: {
    rus: 'Показать ответ',
    kaz: 'Жауапты көрсету',
    eng: 'Show answer',
  },
  hello: { rus: 'Привет!', kaz: 'Сәлем!', eng: 'Hi!' },
  greeting: {
    rus: 'Трудности с задачей? Посмотри видео, если не поможет — пиши, разберемся',
    kaz: 'Есеп қиын ба? Бейнені көр, көмектеспесе — жаз, бірге шешеміз',
    eng: 'Stuck? Watch the video, and if it doesn’t help, write — we’ll sort it out',
  },
  exampleBefore: {
    rus: 'Держи пример, после просмотра добавится ',
    kaz: 'Міне, мысал. Көргеннен кейін ',
    eng: 'Here is an example. After watching it, ',
  },
  exampleBold: {
    rus: 'одна дополнительная задача',
    kaz: 'бір қосымша есеп',
    eng: 'one extra task',
  },
  exampleAfter: { rus: '', kaz: ' қосылады', eng: ' will be added' },
  answerBefore: {
    rus: 'Держи ответ, после просмотра добавятся ',
    kaz: 'Міне, жауап. Көргеннен кейін ',
    eng: 'Here is the answer. After viewing it, ',
  },
  answerBold: {
    rus: 'две дополнительные задачи',
    kaz: 'екі қосымша есеп',
    eng: 'two extra tasks',
  },
  answerAfter: { rus: '', kaz: ' қосылады', eng: ' will be added' },
  message: { rus: 'Сообщение…', kaz: 'Хабарлама…', eng: 'Message…' },
  today: { rus: 'Сегодня', kaz: 'Бүгін', eng: 'Today' },
  yesterday: { rus: 'Вчера', kaz: 'Кеше', eng: 'Yesterday' },
  dateLocale: { rus: 'ru-RU', kaz: 'kk-KZ', eng: 'en-GB' },
  explanation: { rus: 'Объяснение', kaz: 'Түсіндірме', eng: 'Explanation' },
  condition: { rus: 'Условие', kaz: 'Шарты', eng: 'Problem' },
  yourAnswer: {
    rus: 'Ваш ответ:',
    kaz: 'Сіздің жауабыңыз:',
    eng: 'Your answer:',
  },
  correctAnswer: {
    rus: 'Верный ответ:',
    kaz: 'Дұрыс жауап:',
    eng: 'Correct answer:',
  },
} as const

export type ChatTextKey = keyof typeof CHAT_TEXT
export type ChatT = (key: ChatTextKey) => string

/** Russian — stories and anything rendered outside the chat. */
export const ruChatT: ChatT = (key) => CHAT_TEXT[key].rus

export const chatT =
  (global: Partial<Pick<Global, 'translate'>>): ChatT =>
  (key) =>
    (typeof global.translate === 'function' &&
      global.translate(CHAT_TEXT[key])) ||
    CHAT_TEXT[key].rus

const ChatTextContext = createContext<ChatT>(ruChatT)

export const ChatTextProvider = ({
  t,
  children,
}: {
  t: ChatT
  children: ReactNode
}) => <ChatTextContext value={t}>{children}</ChatTextContext>

export const useChatT = () => use(ChatTextContext)

/** «Держи пример, после просмотра добавится <b>одна дополнительная задача</b>» */
export const ExampleIntro = ({ t }: { t: ChatT }) => (
  <>
    {t('exampleBefore')}
    <b>{t('exampleBold')}</b>
    {t('exampleAfter')}
  </>
)

export const AnswerIntro = ({ t }: { t: ChatT }) => (
  <>
    {t('answerBefore')}
    <b>{t('answerBold')}</b>
    {t('answerAfter')}
  </>
)

export const Greeting = ({ t }: { t: ChatT }) => (
  <>
    {t('hello')}
    <br />
    <br />
    {t('greeting')}
  </>
)
