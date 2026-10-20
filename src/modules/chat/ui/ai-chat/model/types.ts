import type { MessageInterface } from '@/types/api/api'

export interface MyVideoMessageType {
  type: 'my-video'
  url: string
  id: number
  /** The lesson theory video: pressing it is turning to the theory. */
  isTheory?: boolean
}

type CurrentDateMessage = {
  id: number
  type: 'current-date'
}

export type AiChatMessageType =
  | MessageInterface
  | MyVideoMessageType
  | CurrentDateMessage
