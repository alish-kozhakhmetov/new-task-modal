import { describe, expect, it } from 'vitest'

import type { Task } from '@/types/api/task'

import { isWithoutCalc } from './is-without-calc'

const task = (type: string, key = '0_3_11_6') =>
  ({ type: `Elixir.Task_${key}`, description: { type } }) as unknown as Task

describe('isWithoutCalc', () => {
  it('withCell новым шаблоном — клавиатура есть', () => {
    expect(
      isWithoutCalc(task('calculateByImageWithCell'), { '0_3_11_6': true }),
    ).toBe(false)
  })

  it('withCell старым экраном — как раньше, без клавиатуры', () => {
    expect(isWithoutCalc(task('calculateByImageWithCell'), {})).toBe(true)
    expect(isWithoutCalc(task('calculateByImageWithCell'), null)).toBe(true)
  })

  it('прочие типы из списка не меняются даже в белом списке', () => {
    const all = { '0_3_11_6': true }
    expect(isWithoutCalc(task('calculateByImage'), all)).toBe(true)
    expect(isWithoutCalc(task('test'), all)).toBe(true)
    expect(isWithoutCalc(task('text'), all)).toBe(false)
  })
})
