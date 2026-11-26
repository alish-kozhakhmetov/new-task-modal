import { describe, expect, it } from 'vitest'

import { pickTranslationText } from '@/modules/tasks/lib/translation-utils'
import type { Task } from '@/types/api/task'

import { getInlineInputEntries } from './get-inline-input-entries'

/** answerInput of Task_3_14_16_19 (variants.json, 02.08): labels in Kazakh only. */
const kazakhOnly = {
  type: 20,
  input2: {
    up: '',
    type: 10,
    text: ' ',
    svg: '',
    down: '',
    before: {
      with_audio_player: false,
      uzb: '',
      rus: '',
      module_name: 'Elixir.Helpers.Translation',
      kgz: '',
      kaz: 'Ең үлкен сан: ',
      eng: '',
      aze: '',
      arsa: '',
      arjd: '',
      areg: '',
    },
    after: '',
  },
  input1: {
    up: '',
    type: 10,
    text: ' ',
    svg: '',
    down: '',
    before: {
      with_audio_player: false,
      uzb: '',
      rus: '',
      module_name: 'Elixir.Helpers.Translation',
      kgz: '',
      kaz: 'Ең кіші сан: ',
      eng: '',
      aze: '',
      arsa: '',
      arjd: '',
      areg: '',
    },
    after: '',
  },
  inline: false,
}

/** A host that answers in Kazakh: the language's field, else any filled. */
const kazakh = (value: unknown) =>
  value && typeof value === 'object' && 'kaz' in value
    ? String((value as { kaz: string }).kaz) || pickTranslationText(value)
    : pickTranslationText(value)

const withInput = (answerInput: unknown) => ({ answerInput }) as unknown as Task

describe('getInlineInputEntries — подписи полей', () => {
  it('подпись только на казахском не теряется', () => {
    const entries = getInlineInputEntries(withInput(kazakhOnly), kazakh)
    expect(entries.map((e) => e.before)).toEqual([
      'Ең кіші сан: ',
      'Ең үлкен сан: ',
    ])
  })

  it('подпись — на языке хоста, а не всегда rus', () => {
    const both = {
      input1: {
        before: { ...kazakhOnly.input1.before, rus: 'Наименьшее число: ' },
      },
    }
    expect(getInlineInputEntries(withInput(both), kazakh)[0].before).toBe(
      'Ең кіші сан: ',
    )
    expect(
      getInlineInputEntries(withInput(both), pickTranslationText)[0].before,
    ).toBe('Наименьшее число: ')
  })

  it('строковая подпись и пустая — как раньше', () => {
    const entries = getInlineInputEntries(
      withInput({ input1: { before: 'D = ', after: '' }, input2: {} }),
      pickTranslationText,
    )
    expect(entries).toEqual([
      { key: 'input1', before: 'D = ', after: '' },
      { key: 'input2', before: '', after: '' },
    ])
  })
})
