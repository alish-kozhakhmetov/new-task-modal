import { TemplateTypes } from '../../../model/template-types.ts'

const map = {
  [TemplateTypes.Complex.After]: [
    '6_3', '6_4', '7_20', '8_8',
  ],
  [TemplateTypes.Complex.Multi.Stack.N2BeforeAfter]: [
    '4_1', '4_2', '4_3', '4_4', '6_5',
  ],
  [TemplateTypes.Complex.Plain]: [
    '6_2', '7_1', '7_2', '7_8', '7_19', '7_22', '7_23',
  ],
  [TemplateTypes.Table.Mixed]: [
    '7_5', '7_6', '7_7', '7_9',
  ],
  [TemplateTypes.Table.MultiRow]: [
    '7_3', '7_4',
  ],
  [TemplateTypes.Test.Plain]: [
    '8_3',
  ],
  [TemplateTypes.Text.After]: [
    '1_3', '4_5_1', '6_1', '7_21', '8_1', '8_2', '8_9',
  ],
  [TemplateTypes.Text.Multi.Stack.N2BeforeAfter]: [
    '8_4',
  ],
  [TemplateTypes.Text.Plain]: [
    '7_24',
  ],
}

export default map
