import { TemplateTypes } from '../../../model/template-types.ts'

const map = {
  [TemplateTypes.AnswerCell.Multi.Stack.N2Plain]: ['3_9'],
  [TemplateTypes.AnswerCell.Plain]: ['3_4'],
  [TemplateTypes.Complex.Plain]: ['6_10'],
  [TemplateTypes.Table.Mixed]: ['7_1', '7_2', '7_10'],
  [TemplateTypes.Test.Plain]: ['2_5', '8_2', '8_4'],
  [TemplateTypes.Text.Multi.Stack.N2Before]: ['1_11', '1_16'],
  [TemplateTypes.Text.Plain]: ['1_1', '5_8', '5_12'],
}

export default map
