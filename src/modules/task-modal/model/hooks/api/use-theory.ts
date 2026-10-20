import { useQuery } from '@tanstack/react-query'
import { useCallback, useEffect, useMemo, useRef } from 'react'

import type { Theory } from '@/types/api/api'

import { useSetAppState } from '../../store/task-modal-store'
import type { TaskModalProps } from '../../types/props'

interface Args {
  props: TaskModalProps
  onLoad: (theory: Theory | undefined) => void
  isTheoryShown: boolean
  /**
   * Wide layout (lead session, 20.10): the chat is always on screen, so it
   * opening is no longer the child turning to the theory. The theory still
   * loads with the task, but the coin waits for a press on the theory video —
   * call `awardTheoryCoin`. On the phone opening the chat is that action, and
   * the coin comes with the load, as before.
   */
  deferCoin?: boolean
}

const NAMESPACE = 'lesson'

export const useTheory = ({
  props,
  onLoad,
  isTheoryShown,
  deferCoin = false,
}: Args) => {
  const setAppState = useSetAppState()
  const { deps, hostProps } = props
  const { global, api, alert, enums } = deps
  const { LessonTheory } = enums
  const { lessonId, personalStudyItemId, applicationType } = hostProps

  const language = useMemo(() => {
    const abbrLanguage = global.getAbbreviatedLanguage()
    return global.isLocationQalanSchool() && abbrLanguage === 'rus'
      ? 'school'
      : abbrLanguage
  }, [global])

  const coinGiven = useRef(false)
  const giveCoin = () => {
    if (!personalStudyItemId || coinGiven.current) return
    coinGiven.current = true
    void api.addCoinForTheory(lessonId!, personalStudyItemId, applicationType)
  }

  const { data, isSuccess, isFetched, error, isError } = useQuery({
    queryKey: [NAMESPACE, lessonId, language],
    queryFn: () => api.getLessonById(lessonId!, language),
    enabled: !!lessonId && !isTheoryShown,
    staleTime: Infinity,
  })

  useEffect(() => {
    if (isError && error) {
      alert.showError(error)
    }
  }, [isError, error])

  useEffect(() => {
    if (isSuccess && data && !isTheoryShown) {
      const theory = data.theory.filter(
        (item) => item.type === LessonTheory.VideoUrl,
      )

      setAppState({
        lesson: { ...data, theory },
        selectedTheory: theory[0],
        locatedCountry: data.locatedCountry,
      })

      onLoad(theory[0])
      coinGiven.current = false

      if (!deferCoin) giveCoin()
    }
  }, [isSuccess, data, isTheoryShown])

  // One coin per theory load (that is, per task), however many presses.
  const awardTheoryCoin = useCallback(() => {
    if (deferCoin) giveCoin()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deferCoin, lessonId, personalStudyItemId, applicationType])

  return { isTheorySet: isFetched || isTheoryShown, awardTheoryCoin }
}
