import {
  AnswerIntro,
  ExampleIntro,
  Greeting,
  ruChatT,
  type ChatT,
} from '../../../model/chat-text'

import type { AiChatMessageType } from './types'

// Texts in the pupil's language: built with the chat's `t` (chat-text.tsx).
// The constants below are the Russian ones, for stories.
export const getInitialMessages = (t: ChatT): AiChatMessageType[] => [
  {
    id: Date.now() * 92423,
    type: 'current-date',
  },
  {
    id: Date.now() * 924,
    text: <Greeting t={t} />,
    senderUserId: 0,
    senderFullname: t('aiChat'),
    sentAt: new Date().toISOString(),
    isFromPupil: false,
    type: 'text',
  },
]

export const GREETING_TEXT = <Greeting t={ruChatT} />
export const VIDEO_EXPLANATION_TEXT = <ExampleIntro t={ruChatT} />
export const ANSWER_SOLUTION_INTRO_TEXT = <AnswerIntro t={ruChatT} />
export const INITIAL_MESSAGES = getInitialMessages(ruChatT)

export const MOCK_THEORY: AiChatMessageType = {
  id: Date.now(),
  type: 'my-video',
  url: 'https://youtube.com/embed/is-Pi0GxN78',
}
