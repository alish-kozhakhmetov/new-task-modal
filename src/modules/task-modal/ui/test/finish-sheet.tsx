import { Button, ButtonColor } from '@/ui/button/button'
import { ButtonWithLoader } from '@/ui/button/button-with-loader'

import { getAppState } from '../../model/store/task-modal-store'
import type { useLessonTest } from '../../model/test/use-lesson-test'

import s from './test.module.scss'
import { TEST_TEXTS } from './texts'

/** «Завершить тест?» — how many tasks are left without an answer, finish or go back to them. */
export const FinishSheet = ({
  flow,
}: {
  flow: ReturnType<typeof useLessonTest>
}) => {
  const left = flow.unanswered()
  const total = getAppState().tasks?.length ?? 0
  const back = () => {
    const first = left[0]
    if (first) flow.goTo(first)
    else flow.setPhase('running')
  }
  return (
    <div
      className={s.scrim}
      role="dialog"
      aria-modal="true"
      aria-labelledby="test-finish-title"
    >
      <div className={s.sheet}>
        <h2 id="test-finish-title">{TEST_TEXTS.confirmTitle}</h2>
        <p>
          {left.length
            ? TEST_TEXTS.confirmUnanswered(left.length, total)
            : TEST_TEXTS.confirmAllAnswered}
        </p>
        <div className={s.sheetButtons}>
          <ButtonWithLoader
            isLoading={flow.test.phase === 'finishing'}
            onClick={() => void flow.finish()}
          >
            {TEST_TEXTS.confirmYes}
          </ButtonWithLoader>
          <Button
            color={ButtonColor.White}
            onClick={back}
            disabled={flow.test.phase === 'finishing'}
          >
            {TEST_TEXTS.confirmBack}
          </Button>
        </div>
      </div>
    </div>
  )
}
