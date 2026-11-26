import { TemplateTypes } from '../../../model/template-types.ts'

const map = {
  [TemplateTypes.AnswerCell.Multi.Stack.N2Plain]: ['2_3'],
  [TemplateTypes.AnswerCell.Plain]: ['2_9'],
  [TemplateTypes.Complex.Plain]: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  [TemplateTypes.Test.Plain]: ['2_5', '2_6', '2_7'],
}

export default map
