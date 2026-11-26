import { createMultiAnswerCellTemplate } from '../../../lib/create-multi-answer-cell-template'

/** См. `./README.md` и пример payload в `./data/task.json`. */
export const AnswerCellMultiInlineN3After = createMultiAnswerCellTemplate({
  id: 'answerCell.multi.inline.n3.after',
  layout: 'inline',
  inputCount: 3,
  withAfter: true,
})
