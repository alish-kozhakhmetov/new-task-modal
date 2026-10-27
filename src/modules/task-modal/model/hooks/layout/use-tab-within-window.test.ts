import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { answerFields, nextTabTarget, tabbables } from './use-tab-within-window'

// jsdom lays nothing out: every element reports a box, as on screen.
beforeEach(() => {
  vi.spyOn(Element.prototype, 'getClientRects').mockReturnValue([
    {},
  ] as unknown as DOMRectList)
})
afterEach(() => {
  vi.restoreAllMocks()
  document.body.innerHTML = ''
})

/** A window as the package draws it: header, two fields, the check, a chat. */
const windowHtml = () => {
  document.body.innerHTML = `
    <div data-ntm-root>
      <div class="task-modal">
        <button id="list">№1/2</button>
        <button id="close">×</button>
        <span data-input id="f1"><span class="mq-textarea"><textarea id="t1"></textarea></span></span>
        <span>+</span>
        <span data-input id="f2"><span class="mq-textarea"><textarea id="t2"></textarea></span></span>
        <button id="check" disabled>Проверить</button>
        <div inert><button id="hidden-key">a</button></div>
        <button id="key">7</button>
      </div>
      <button id="chat">AI-чат</button>
    </div>`
  return document.querySelector<HTMLElement>('[data-ntm-root]')!
}

const byId = (id: string) => document.getElementById(id)!

describe('answerFields', () => {
  it('the task fields in the order of the page', () => {
    const root = windowHtml()
    expect(answerFields(root).map((f) => f.id)).toEqual(['f1', 'f2'])
  })
})

describe('tabbables', () => {
  it('counts MathQuill textareas, skips disabled and inert', () => {
    const root = windowHtml()
    expect(tabbables(root).map((el) => el.id)).toEqual([
      'list',
      'close',
      't1',
      't2',
      'key',
      'chat',
    ])
  })
})

describe('nextTabTarget', () => {
  it('Tab from a field goes to the next field, round', () => {
    const root = windowHtml()
    expect(nextTabTarget(root, byId('t1'), false)).toBe(byId('t2'))
    expect(nextTabTarget(root, byId('t2'), false)).toBe(byId('t1'))
  })

  it('Shift+Tab from a field goes to the previous field, round', () => {
    const root = windowHtml()
    expect(nextTabTarget(root, byId('t1'), true)).toBe(byId('t2'))
    expect(nextTabTarget(root, byId('t2'), true)).toBe(byId('t1'))
  })

  it('a single field keeps the keys', () => {
    const root = windowHtml()
    byId('f2').remove()
    expect(nextTabTarget(root, byId('t1'), false)).toBe(byId('t1'))
  })

  it('from a button — the next one in the window, round, never out', () => {
    const root = windowHtml()
    expect(nextTabTarget(root, byId('close'), false)).toBe(byId('t1'))
    expect(nextTabTarget(root, byId('chat'), false)).toBe(byId('list'))
    expect(nextTabTarget(root, byId('list'), true)).toBe(byId('chat'))
  })

  it('from an element Tab skips — the nearest one after it', () => {
    const root = windowHtml()
    const layer = document.createElement('section')
    layer.tabIndex = -1
    byId('key').before(layer)
    expect(nextTabTarget(root, layer, false)).toBe(byId('key'))
    expect(nextTabTarget(root, layer, true)).toBe(byId('t2'))
  })
})
