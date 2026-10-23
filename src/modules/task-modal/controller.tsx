import { createRoot, type Root } from 'react-dom/client'

import { ErrorBoundary } from '@/lib/error-boundary/error-boundary'

import { bindBrowserBack } from './model/lib/bind-browser-back'
import { closeWithProgress } from './model/lib/close-with-progress'
import { injectFonts } from './model/lib/fonts/inject-fonts'
import type { TaskModalProps } from './model/types/props'
import { TaskModal } from './task-modal'

declare global {
  interface HTMLElement {
    instance?: Root
  }
}

const WRAPPER_ID = 'task-modal-wrapper'
const ROOT_ID = 'task-modal-root'

const removeRootElement = () => {
  const rootElement = document.getElementById(ROOT_ID)
  if (!rootElement) return

  if (rootElement.instance) rootElement.instance.unmount()

  rootElement.remove()
}

const createRootElement = () => {
  const rootElement = document.createElement('div')
  rootElement.id = ROOT_ID
  rootElement.style.cssText = 'height:100%'
  rootElement.style.position = 'relative'

  const wrapper = document.getElementById(WRAPPER_ID)
  wrapper?.appendChild(rootElement)

  return rootElement
}

const getRoot = () => {
  removeRootElement()

  const rootElement = createRootElement()
  const root = createRoot(rootElement)

  rootElement.instance = root

  return { root, rootElement }
}

/**
 * The window is open in this wrapper: its root is on the page and mounted.
 *
 * The host re-renders this controller on every setState of its own and on
 * every change of the address — the site wraps it in withRouter. A remount
 * rebuilt the window from the host's state, which the window does not keep
 * current: the pupil went back to the task the window had opened on, the
 * chat and the draft closed. From 2.5.5 «Далее» hands the host the new task
 * and the site writes it into the address, so such a re-render comes with
 * every task. While the window is open, it stays as it is; a closed window
 * (its root unmounted) or a new wrapper mounts afresh, as before.
 */
const isOpenIn = (wrapper: HTMLElement) => {
  const rootElement = document.getElementById(ROOT_ID)
  return Boolean(rootElement?.instance && wrapper.contains(rootElement))
}

/**
 * Монтирует модальное окно задания `@qalan/new-task-modal` в DOM хост-приложения.
 *
 * Функция ищет контейнер `#task-modal-wrapper` в DOM хоста, автоматически инжектирует
 * стили/шрифты библиотеки и рендерит автономный React 19 Root.
 *
 * @param props Параметры монтирования, включая активное задание, инжектируемые сервисы (`deps`) и коллбэки.
 * @returns Всегда возвращает `null` (монтирование производится асинхронно в изолированный DOM-root).
 *
 * @example
 * ```tsx
 * TaskModalController({
 *   activeTask,
 *   deps,
 *   state,
 *   setState,
 *   hostProps,
 *   actions,
 *   closeModal: () => console.log('Closed'),
 * })
 * ```
 */
export const TaskModalController = (props: TaskModalProps) => {
  setTimeout(() => {
    // The host re-renders this controller on its own setState — also the one
    // closeWithProgress makes on close, after which the host drops the
    // wrapper. No wrapper — nothing to mount into (see Mount docs).
    const wrapper = document.getElementById(WRAPPER_ID)
    if (!wrapper) return

    // A re-render of the host while the window is open (see isOpenIn)
    if (isOpenIn(wrapper)) return

    injectFonts()

    const { root, rootElement } = getRoot()

    // × , «Далее» on the last task, browser «back»: the host gets the lesson
    // progress first
    let unbindBack = () => {}
    const closeModal = () =>
      closeWithProgress(props, () => {
        unbindBack()
        root.unmount()
        rootElement.instance = undefined
      })
    unbindBack = bindBrowserBack(closeModal)

    root.render(
      <ErrorBoundary>
        <TaskModal {...props} closeModal={closeModal} />
      </ErrorBoundary>,
    )
  }, 0)

  return null
}
