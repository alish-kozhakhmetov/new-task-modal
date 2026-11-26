import { createMultiAnswerCellTemplate } from '../../../lib/create-multi-answer-cell-template'

/** См. `./README.md` и пример payload в `./data/task.json`. */
export const AnswerCellMultiInlineN4After = createMultiAnswerCellTemplate({
  id: 'answerCell.multi.inline.n4.after',
  layout: 'inline',
  inputCount: 4,
  withAfter: true,
})
