import { createMultiAnswerCellTemplate } from '../../../lib/create-multi-answer-cell-template'

/** См. `./README.md` и пример payload в `./data/task.json`. */
export const AnswerCellMultiInlineN2After = createMultiAnswerCellTemplate({
  id: 'answerCell.multi.inline.n2.after',
  layout: 'inline',
  inputCount: 2,
  withAfter: true,
})
