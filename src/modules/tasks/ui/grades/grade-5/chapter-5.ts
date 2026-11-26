import { TemplateTypes } from '../../../model/template-types.ts'

const map = {
  [TemplateTypes.Comparison.Plain]: [
    31,
  ],
  [TemplateTypes.Complex.After]: [
    21,
  ],
  [TemplateTypes.Complex.BeforeAfter]: [
    '3_1', '3_2', '3_3', '3_4', '3_5', '3_6', '3_7', '3_8',
    '4_3', '4_4', '4_5', '55_2', '55_3', '55_4', '56_2', '56_3',
    '56_4',
  ],
  [TemplateTypes.Complex.Multi.Stack.N2BeforeAfter]: [
    '1_6', '1_7', '4_2',
  ],
  [TemplateTypes.Complex.Plain]: [
    '2_3', 18,
  ],
  [TemplateTypes.Formula.Plain]: [
    30,
  ],
  [TemplateTypes.Test.Plain]: [
    1, 2, '2_2', 46, 48, 49, 51,
  ],
  [TemplateTypes.Text.After]: [
    '2_5', 23, 24, 25, 26, 33, 34, 35,
    36, 37, 38, 39, 41, 42, 43,
  ],
  [TemplateTypes.Text.Before]: [
    '1_2', 4,
  ],
  [TemplateTypes.Text.BeforeAfter]: [
    '1_1', '1_3', '1_4', '1_5', '2_1', 3, '4_7', 5,
    6, 7, 8, 10, 52, 53, 54, '57_1',
    '57_2', '57_3', '57_4', '58_1', '58_2', '58_3',
  ],
  [TemplateTypes.Text.Multi.Stack.N2After]: [
    '2_4',
  ],
  [TemplateTypes.Text.Multi.Stack.N2Before]: [
    '4_1',
  ],
  [TemplateTypes.Text.Multi.Stack.N2BeforeAfter]: [
    '1_8',
  ],
  [TemplateTypes.Text.Multi.Stack.N3BeforeAfter]: [
    58,
  ],
  [TemplateTypes.Text.Plain]: [
    '4_6', 9, 11, 12, 13, 14, 15, 16,
    17, 27, 28, 29, 32, 40, 44,
  ],
}

export default map
