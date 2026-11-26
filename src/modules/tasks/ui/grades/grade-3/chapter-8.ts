import { TemplateTypes } from '../../../model/template-types.ts'

const map = {
  [TemplateTypes.ColumnOperation.Plain]: [22, 23],
  [TemplateTypes.Comparison.Plain]: [12],
  [TemplateTypes.Formula.Plain]: [13, 14, 15, 16, 17, 18, 19, 20, 21],
  [TemplateTypes.Test.Plain]: [2],
  [TemplateTypes.Text.After]: [24, 25, 26, 27, 30, 34, 36, 37, 45, 46],
  [TemplateTypes.Text.Multi.Stack.N4After]: [7],
  [TemplateTypes.Text.Plain]: [
    1, 3, 4, 5, 6, 8, 10, 11, 28, 29, 31, 32, 33, 35, 38, 39, 40, 41, 42, 43,
    44, 47,
  ],
}

export default map
