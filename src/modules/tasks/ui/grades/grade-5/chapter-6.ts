import { TemplateTypes } from '../../../model/template-types.ts'

const map = {
  [TemplateTypes.AnswerCell.After]: [
    '1_14', '1_15',
  ],
  [TemplateTypes.Comparison.Plain]: [
    '8_1', '8_2', '8_3', '8_4', '8_5', '8_6', '8_7', '8_8',
    '8_9', '8_10', '8_11', '8_12', '8_13',
  ],
  [TemplateTypes.Complex.After]: [
    '1_20', '2_1', '2_2', '2_3', '2_4', '4_1', '4_2', '4_3',
    '4_4', '6_1', '6_2', '7_1', '7_2', '7_3', 8, 9,
  ],
  [TemplateTypes.Complex.Multi.Stack.N2After]: [
    '3_1',
  ],
  [TemplateTypes.Complex.Plain]: [
    1, '2_5', '2_6',
  ],
  [TemplateTypes.Table.Grid]: [
    '2_9',
  ],
  [TemplateTypes.Table.Mixed]: [
    '3_8',
  ],
  [TemplateTypes.Table.MultiRow]: [
    '1_11',
  ],
  [TemplateTypes.Test.Plain]: [
    '1_1', '1_3', '1_5',
  ],
  [TemplateTypes.Text.After]: [
    '1_2', '1_4', '1_6', '1_9', '1_12', '1_17', '2_10', '2_11',
    '2_12', '2_13', '2_17', '2_19', '2_21', '3_10', '3_11', '3_12',
  ],
  [TemplateTypes.Text.Before]: [
    '3_3',
  ],
  [TemplateTypes.Text.Multi.Stack.N2BeforeAfter]: [
    '1_10', '1_13', '1_19',
  ],
  [TemplateTypes.Text.Plain]: [
    '1_18', '2_7', '2_8', '2_18', '3_2', '3_6', '3_7', '3_13',
    '3_17', '3_18',
  ],
}

export default map
