type PopStateHandler = typeof window.onpopstate

const OURS = Symbol('ntm-back')

/**
 * «Назад» браузера закрывает окно тем же путём, что × (2.5.2): хост ставит
 * window.onpopstate на свой closeModal, а тот берёт прогресс из своего
 * состояния — пакетный прогресс урока до него не доходил, и строка урока
 * оставалась «Начать» без процента. Пока окно открыто, «назад» ведёт в
 * close пакета (closeWithProgress); после закрытия — снова обработчик хоста.
 */
export const bindBrowserBack = (close: () => void) => {
  const current = window.onpopstate as
    | (PopStateHandler & { [OURS]?: PopStateHandler })
    | null
  // повторный монтаж (хост перерисовал контроллер) — хозяин тот же, что и был
  const host = current && OURS in current ? (current[OURS] ?? null) : current

  const ours = Object.assign(() => close(), { [OURS]: host })
  window.onpopstate = ours

  return () => {
    if (window.onpopstate === ours) window.onpopstate = host
  }
}
