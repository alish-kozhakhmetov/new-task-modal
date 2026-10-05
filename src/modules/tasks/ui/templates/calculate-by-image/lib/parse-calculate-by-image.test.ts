import { describe, expect, it } from 'vitest'

import { pickTranslationText } from '@/modules/tasks/lib/translation-utils'

import fixtures from '../ui/plain/data/tasks.json'

import {
  decodeZone,
  parseCalculateByImage,
  toCalculateByImageApiAnswer,
} from './parse-calculate-by-image'
import type { CalculateByImageTask } from './types.task'

const tasks = (fixtures as unknown as { tasks: CalculateByImageTask[] }).tasks
const byType = (id: string) => {
  const task = tasks.find((t) => t.type === `Elixir.Task_${id}`)
  if (!task) throw new Error(`no fixture ${id}`)
  return task
}
const translate = (value: unknown) => pickTranslationText(value)
const parse = (id: string) =>
  parseCalculateByImage(byType(id).description, translate)

describe('parseCalculateByImage', () => {
  it.each(tasks.map((task) => [task.type, task] as const))(
    '%s: непустой ряд и вместимость',
    (_, task) => {
      const model = parseCalculateByImage(task.description, translate)
      expect(model.pool.length).toBeGreaterThan(0)
      expect(model.capacity).toBeGreaterThan(0)
    },
  )

  it('заранее положенные предметы — в зоне (Task_0_1_38_9: три линейки)', () => {
    const model = parse('0_1_38_9')
    expect(model.preplaced.map((item) => item.id)).toEqual([
      'ruler',
      'ruler',
      'ruler',
    ])
    expect(model.pool).toHaveLength(1)
  })

  it('один id, разные картинки — разные кнопки (Task_1_13_8_4, члены семьи)', () => {
    const model = parse('1_13_8_4')
    expect(new Set(model.pool.map((item) => item.id)).size).toBe(1)
    expect(model.pool.length).toBeGreaterThan(1)
  })

  it('подложка из одних прямоугольников — рамка старой зоны, не картинка', () => {
    expect(parse('4_6_6_8').zonePicture).toBeNull()
    expect(parse('2_2_24_10').zonePicture).toBeNull()
    expect(parse('0_1_38_9').zonePicture).toBeNull()
  })

  it('id-перевод остаётся объектом (Task_3_15_1_4, единицы «мм»)', () => {
    expect(
      parse('3_15_1_4').pool.some((item) => typeof item.id === 'object'),
    ).toBe(true)
  })
})

describe('ответ', () => {
  it('в сторе — номера в каталоге; мусор не читается', () => {
    expect(decodeZone('')).toBeNull()
    expect(decodeZone('[1,1,0]')).toEqual([1, 1, 0])
    expect(decodeZone('["ruler"]')).toBeNull()
  })

  it('на бэк — { list: [{ image, id }] } с повторами и в порядке нажатий', () => {
    const { description } = byType('1_5_12_6')
    const model = parseCalculateByImage(description, translate)
    const [a, b] = model.pool
    expect(
      toCalculateByImageApiAnswer(
        `[${b.index},${a.index},${a.index}]`,
        description,
      ),
    ).toEqual({
      list: [
        { image: '', id: b.id },
        { image: '', id: a.id },
        { image: '', id: a.id },
      ],
    })
  })

  it('номер вне каталога не уходит на бэк', () => {
    expect(
      toCalculateByImageApiAnswer('[999]', byType('0_1_38_9').description),
    ).toBeNull()
  })
})
