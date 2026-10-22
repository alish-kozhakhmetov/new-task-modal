import { afterEach, describe, expect, it, vi } from 'vitest'

import { bindBrowserBack } from './bind-browser-back'

// Браузер на «назад» вызывает window.onpopstate; jsdom при dispatchEvent его не зовёт
const back = () => {
  window.onpopstate?.call(window, new PopStateEvent('popstate'))
}

describe('bindBrowserBack', () => {
  afterEach(() => {
    window.onpopstate = null
  })

  it('«назад» закрывает окно путём пакета, а не обработчиком хоста', () => {
    const host = vi.fn()
    window.onpopstate = host
    const close = vi.fn()

    const unbind = bindBrowserBack(close)
    back()

    expect(close).toHaveBeenCalledTimes(1)
    expect(host).not.toHaveBeenCalled()

    unbind()
    expect(window.onpopstate).toBe(host)
  })

  it('повторный монтаж не теряет обработчик хоста', () => {
    const host = vi.fn()
    window.onpopstate = host

    const unbindFirst = bindBrowserBack(vi.fn())
    void unbindFirst // первый корень снят перемонтажом, не закрытием
    const close = vi.fn()
    const unbind = bindBrowserBack(close)

    back()
    expect(close).toHaveBeenCalledTimes(1)

    unbind()
    expect(window.onpopstate).toBe(host)
  })
})
