import { describe, expect, it } from 'vitest'

import { splitLeadingSeparators } from './split-leading-separators'

describe('splitLeadingSeparators', () => {
  it('moves a «;» after a field to that field (4_12_19_8)', () => {
    const parts = '31; 36; answercell; answercell; 51; 56; 61; 66; 71'.split(
      'answercell',
    )
    expect(splitLeadingSeparators(parts)).toEqual({
      parts: ['31; 36; ', '', '51; 56; 61; 66; 71'],
      trailing: [';', ';'],
    })
  })

  it('moves a comma too', () => {
    expect(splitLeadingSeparators(['a ', ', b'])).toEqual({
      parts: ['a ', 'b'],
      trailing: [','],
    })
  })

  it('keeps division and other signs on the right (4_1_73)', () => {
    const parts = ['', ' : ', ' = 5']
    expect(splitLeadingSeparators(parts)).toEqual({
      parts,
      trailing: ['', ''],
    })
  })

  it('leaves a single part alone', () => {
    expect(splitLeadingSeparators(['только текст'])).toEqual({
      parts: ['только текст'],
      trailing: [],
    })
  })
})
