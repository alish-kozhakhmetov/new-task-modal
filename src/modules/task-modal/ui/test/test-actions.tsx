import clsx from 'clsx'
import { useEffect } from 'react'

import Pen from '@/assets/icons/actions/pen.svg'
import type { TaskModalModals } from '@/modules/task-modal/task-modal'
import { Button, ButtonColor, ButtonLayout } from '@/ui/button/button'
import { ButtonWithLoader } from '@/ui/button/button-with-loader'

import { isAnswerEmpty } from '../../model/helpers'
import type { TaskModalRefs } from '../../model/hooks/layout/use-refs'
import { useStore } from '../../model/store/task-modal-store'
import type { useLessonTest } from '../../model/test/use-lesson-test'
import type { TaskModalProps } from '../../model/types/props'

import s from './test.module.scss'
import { TEST_TEXTS } from './texts'

interface Props {
  props: TaskModalProps
  refs: TaskModalRefs
  modals: TaskModalModals
  flow: ReturnType<typeof useLessonTest>
}

/**
 * Test actions: draft · «Завершить» · «Далее». No «Проверить», no chat: the
 * test does not check answers and has no help (site's CheckTaskModal). An
 * empty answer — «Пропустить».
 */
export const TestActions = ({ props, refs, modals, flow }: Props) => {
  const answer = useStore((st) => st.answer)
  const isEmpty = isAnswerEmpty(answer, props.deps)
  const busy = flow.test.phase === 'finishing'

  useEffect(() => {
    const root = refs.root.current
    if (!root) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Enter' || flow.test.phase !== 'running') return
      e.preventDefault()
      void flow.next()
    }
    root.addEventListener('keydown', onKey)
    return () => root.removeEventListener('keydown', onKey)
  }, [flow.test.phase])

  const { actions } = refs

  return (
    <div className={s.actions} ref={actions}>
      <Button
        color={ButtonColor.White}
        layout={ButtonLayout.Icon}
        onClick={modals.canvas.open}
        aria-label="Открыть доску"
        className={clsx(s.button, s.icon, s.pen)}
      >
        <Pen />
      </Button>
      <Button
        color={ButtonColor.White}
        onClick={() => flow.setPhase('confirm')}
        disabled={busy}
        className={clsx(s.button, s.finish)}
      >
        {TEST_TEXTS.finish}
      </Button>
      <ButtonWithLoader
        onClick={() => void flow.next()}
        isLoading={false}
        disabled={busy}
        className={clsx(s.button, s.next)}
      >
        {isEmpty ? TEST_TEXTS.skip : TEST_TEXTS.next}
      </ButtonWithLoader>
    </div>
  )
}
