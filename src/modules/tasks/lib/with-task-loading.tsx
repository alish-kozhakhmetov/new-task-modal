import { createContext, use, useEffect, type ComponentType } from 'react'

import { useStore } from '@/modules/task-modal/model/store/task-modal-store'

/**
 * `false` for a template drawn as a picture of a solved task (the task list's
 * review): it is not the task on screen, so its mount and unmount must not
 * mark that task loaded or unloaded — the calculator and the field focus of
 * the current task key on it.
 */
export const TaskLoadingReport = createContext(true)

export const withTaskLoading = <T extends object>(
  Template: ComponentType<T>,
) => {
  const Component = (props: T) => {
    const reports = use(TaskLoadingReport)
    const setIsTaskLoaded = useStore((s) => s.setIsTaskLoaded)

    useEffect(() => {
      if (!reports) return
      setIsTaskLoaded(true)
      return () => {
        setIsTaskLoaded(false)
      }
    }, [reports, setIsTaskLoaded])

    return <Template {...props} />
  }

  return Component
}
