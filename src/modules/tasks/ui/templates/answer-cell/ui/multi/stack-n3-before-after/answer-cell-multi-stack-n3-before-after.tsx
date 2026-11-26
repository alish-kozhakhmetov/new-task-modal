import { createMultiAnswerCellTemplate } from '../../../lib/create-multi-answer-cell-template'

/** См. `./README.md` и пример payload в `./data/task.json`. */
export const AnswerCellMultiStackN3BeforeAfter = createMultiAnswerCellTemplate({
  id: 'answerCell.multi.stack.n3.beforeAfter',
  layout: 'stack',
  inputCount: 3,
  withBefore: true,
  withAfter: true,
})
