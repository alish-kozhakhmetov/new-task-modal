import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { Canvas } from './canvas'

/** The host's translate in a Kazakh lesson: the `kaz` field of the object. */
const kazakh = {
  translate: (value: unknown) =>
    typeof value === 'object' && value !== null
      ? ((value as Record<string, string>).kaz ?? '')
      : String(value),
}

describe('Canvas button names in the pupil language (2.5.7)', () => {
  it('reads Kazakh in a Kazakh lesson', () => {
    render(<Canvas onClose={() => {}} global={kazakh} />)

    for (const name of [
      'Сызу',
      'Өшіргіш',
      'Артқа',
      'Алға',
      'Барлығын тазалау',
      'Тақтаны жабу',
    ])
      expect(screen.getByTitle(name)).toBeInTheDocument()
  })

  it('keeps Russian without a host translate', () => {
    render(<Canvas onClose={() => {}} />)
    expect(screen.getByTitle('Ластик')).toBeInTheDocument()
    expect(screen.getByTitle('Закрыть доску')).toBeInTheDocument()
  })
})
