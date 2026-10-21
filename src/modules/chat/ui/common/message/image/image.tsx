import clsx from 'clsx'

import { formatMessageTime } from '@/lib/helpers/format-message-time'

import s from './image.module.scss'

interface Props {
  imageUrl: string
  sentAt: string
  isFromPupil?: boolean
}

const ImageMessage = ({ imageUrl, sentAt, isFromPupil }: Props) => {
  const time = formatMessageTime(sentAt)
  return (
    <div className={clsx(s.container, isFromPupil ? s.fromPupil : s.fromOther)}>
      <img src={imageUrl} alt="" className={s.image} />
      <div className={s.timeOverlay}>
        <span className={s.time}>{time}</span>
      </div>
    </div>
  )
}

export default ImageMessage
