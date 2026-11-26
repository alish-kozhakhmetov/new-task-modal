import { TemplateTypes } from '../../../model/template-types.ts'

const map = {
  [TemplateTypes.Comparison.Plain]: [
    14, '16_1', '16_2', '16_3', '16_4',
  ],
  [TemplateTypes.Complex.After]: [
    '55_1', '61_14', '62_8', '62_9', '62_10',
  ],
  [TemplateTypes.Complex.BeforeAfter]: [
    '41_12',
  ],
  [TemplateTypes.Complex.Multi.Stack.N2BeforeAfter]: [
    '45_3', '45_6', '45_7', '45_9', '45_11',
  ],
  [TemplateTypes.Complex.Plain]: [
    '46_1', '46_2', '46_3', '46_4', '46_5', '46_6', '58_3', '58_4',
    '58_5', '58_7', '58_8', '58_9', '61_11', '61_12', '61_13',
  ],
  [TemplateTypes.Equation.Before]: [
    '58_6',
  ],
  [TemplateTypes.Formula.Plain]: [
    54, '61_1', '61_2', '61_3', '61_5', '61_6', '61_7', '61_8',
    '61_9', '61_10', '61_15',
  ],
  [TemplateTypes.Table.Plain]: [
    '18_1', '18_2', '18_3', '18_4', '18_5', 45,
  ],
  [TemplateTypes.Test.Plain]: [
    8, 13, '13_1', '62_1', '62_2',
  ],
  [TemplateTypes.Text.BeforeAfter]: [
    '45_10', '62_4', '62_5', '62_6', '62_7', '62_11',
  ],
  [TemplateTypes.Text.Multi.Stack.N2BeforeAfter]: [
    '41_3',
  ],
  [TemplateTypes.Text.Plain]: [
    9, 10, 15, '17_1', '17_2', '17_3', '55_10', '62_12',
  ],
}

export default map
