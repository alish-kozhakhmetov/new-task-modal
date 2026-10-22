import { useStore } from '../store/task-modal-store'
import type { TaskModalProps } from '../types/props'

/**
 * Close the window, handing the lesson progress to the host first (2.5.2).
 *
 * The host's lesson row reads the progress from its own state on close
 * (site: TaskModalController.closeModal → onClose(this.state.userProgress)),
 * and the package kept it only in its store: closed with × mid-lesson, the
 * row stayed at «Начать» instead of «Продолжить» and the percent.
 *
 * Only on close, not after every check: the host re-renders the controller on
 * its setState, and the controller remounts the window from the host's state.
 *
 * The host's setState runs synchronously here (React 16, called from outside
 * its event handlers); its callback closes with the fresh state. A host that
 * ignores the callback is closed right after.
 */
export const closeWithProgress = (
  props: Pick<TaskModalProps, 'setState' | 'closeModal'>,
  onClosed?: () => void,
) => {
  let isClosed = false
  const close = () => {
    if (isClosed) return
    isClosed = true
    props.closeModal()
    onClosed?.()
  }

  const progress = useStore.getState().state?.userProgress
  if (typeof progress === 'number') {
    props.setState({ userProgress: progress }, close)
  }
  close()
}
