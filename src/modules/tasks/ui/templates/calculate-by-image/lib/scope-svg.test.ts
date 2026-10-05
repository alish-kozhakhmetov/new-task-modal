import { describe, expect, it } from 'vitest'

import { scopeSvg } from './scope-svg'

const svg = `<svg><style>.st0{fill:red}.st1{fill:url(#g)}</style>
<defs><linearGradient id="g"/></defs>
<path class="st0 big"/><use href="#g"/><rect class="st1"/></svg>`

describe('scopeSvg', () => {
  const out = scopeSvg(svg, 'p1-')

  it('классы из <style> получают префикс и в CSS, и в class', () => {
    expect(out).toContain('.p1-st0{fill:red}')
    expect(out).toContain('class="p1-st0 big"')
    expect(out).toContain('class="p1-st1"')
  })

  it('id и ссылки на него — тоже', () => {
    expect(out).toContain('id="p1-g"')
    expect(out).toContain('url(#p1-g)')
    expect(out).toContain('href="#p1-g"')
  })

  it('две картинки с одинаковыми классами больше не делят правила', () => {
    expect(scopeSvg(svg, 'a-')).not.toContain('.st0{')
    expect(scopeSvg(svg, 'a-')).not.toBe(scopeSvg(svg, 'b-'))
  })

  it('текст без разметки не трогается', () => {
    expect(scopeSvg('бабушка', 'x-')).toBe('бабушка')
  })
})
