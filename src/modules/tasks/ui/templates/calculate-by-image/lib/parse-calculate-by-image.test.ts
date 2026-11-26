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

  it('размер картинки — смысл: мячи 53, 68 и 90px остаются разными (Task_0_6_3_9)', () => {
    const scales = Object.fromEntries(
      parse('0_6_3_9').pool.map((item) => [item.id as string, item.scale]),
    )
    expect(scales.big).toBe(1)
    expect(scales.small).toBeCloseTo(68 / 90)
    expect(scales.smallest).toBeCloseTo(53 / 90)
  })

  it('один размер у всех — масштаб 1 (Task_0_10_5_2: булочки)', () => {
    expect(parse('0_10_5_2').catalog.every((item) => item.scale === 1)).toBe(
      true,
    )
  })

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
    expect(parse('2_2_24_10').zonePicture).toBeNull()
    expect(parse('0_1_38_9').zonePicture).toBeNull()
  })

  it('id-перевод остаётся объектом (Task_3_15_1_4, единицы «мм»)', () => {
    expect(
      parse('3_15_1_4').pool.some((item) => typeof item.id === 'object'),
    ).toBe(true)
  })
})

describe('пирамида (vertical)', () => {
  it('кольца в своих пропорциях, тонкое — не меньше 44 px (Task_1_1_2_9)', () => {
    const model = parse('1_1_2_9')
    expect(model.layout).toBe('column')
    // drawn as the old screen draws it: width × height, letterboxed by the viewBox
    const own = model.pool.map((item) => {
      const tag = /<svg\b[^>]*>/i.exec(item.html)?.[0] ?? ''
      const num = (re: RegExp) => Number(re.exec(tag)?.[1])
      const [w, h] = [num(/\swidth="([\d.]+)/), num(/\sheight="([\d.]+)/)]
      const box =
        /viewBox="[-\d.]+[\s,]+[-\d.]+[\s,]+([\d.]+)[\s,]+([\d.]+)/.exec(tag)
      const k = Math.min(w / Number(box?.[1]), h / Number(box?.[2]))
      return { w: Number(box?.[1]) * k, h: Number(box?.[2]) * k }
    })
    // one factor for every ring: the rings keep their own proportions
    const factors = model.pool.map(
      (item, i) => (item.columnWidth ?? 0) / own[i].w,
    )
    const drawn = model.pool.map(
      (item, i) => (item.columnWidth ?? 0) * (own[i].h / own[i].w),
    )
    expect(Math.max(...factors) / Math.min(...factors)).toBeLessThan(1.02)
    expect(Math.min(...drawn)).toBeGreaterThanOrEqual(43)
  })

  it('без vertical ширины нет — предмет в своей клетке', () => {
    expect(
      parse('0_10_5_2').pool.every((item) => item.columnWidth == null),
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
