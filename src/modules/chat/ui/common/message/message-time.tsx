import { formatMessageTime } from '@/lib/helpers/format-message-time'

import s from './message.module.scss'

interface Props {
  sentAt: string
}

export const MessageTime = ({ sentAt }: Props) => {
  return <div className={s.messageTime}>{formatMessageTime(sentAt)}</div>
}
