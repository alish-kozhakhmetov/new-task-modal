import { TemplateTypes } from '../../../model/template-types.ts'

const map = {
  [TemplateTypes.Complex.After]: [
    '1_2',
    '2_4',
    '2_5',
    '2_6',
    '4_1',
    '4_2',
    '4_3',
  ],
  [TemplateTypes.Complex.BeforeAfter]: ['2_2', '2_3', '18_1'],
  [TemplateTypes.Complex.Plain]: [
    11,
    12,
    '14_1',
    '14_2',
    '14_3',
    '14_4',
    '15_1',
    '15_2',
  ],
  [TemplateTypes.Test.Plain]: ['1_1'],
  [TemplateTypes.Text.After]: ['3_3', '3_4'],
  [TemplateTypes.Text.Multi.Stack.N3BeforeAfter]: ['3_5'],
  [TemplateTypes.Text.Plain]: ['3_1', '3_2'],
}

export default map
