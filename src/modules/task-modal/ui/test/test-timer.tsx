import clsx from 'clsx'
import { useEffect, useEffectEvent, useState } from 'react'

import { useTestStore } from '../../model/test/test-store'

import s from './test.module.scss'

const pad = (n: number) => String(n).padStart(2, '0')

/** mm:ss (h:mm:ss from an hour) left until the deadline. */
export const formatLeft = (ms: number) => {
  const total = Math.max(0, Math.ceil(ms / 1000))
  const h = Math.floor(total / 3600)
  const m = Math.floor((total % 3600) / 60)
  const sec = total % 60
  return h ? `${h}:${pad(m)}:${pad(sec)}` : `${pad(m)}:${pad(sec)}`
}

/** Countdown from the server's `timeLeft`; at zero the attempt finishes (as the old modal). */
export const TestTimer = ({ onElapsed }: { onElapsed: () => void }) => {
  const deadline = useTestStore((st) => st.deadline)
  const phase = useTestStore((st) => st.phase)
  const [now, setNow] = useState(() => Date.now())

  const tick = useEffectEvent(() => {
    const t = Date.now()
    setNow(t)
    if (
      deadline != null &&
      t >= deadline &&
      (phase === 'running' || phase === 'confirm')
    )
      onElapsed()
  })

  useEffect(() => {
    if (deadline == null) return
    const id = window.setInterval(tick, 1000)
    return () => window.clearInterval(id)
  }, [deadline])

  if (deadline == null) return null
  const left = deadline - now
  return (
    <span
      className={clsx(s.timer, left < 60_000 && s.low)}
      data-testid="test-timer"
    >
      {formatLeft(left)}
    </span>
  )
}
