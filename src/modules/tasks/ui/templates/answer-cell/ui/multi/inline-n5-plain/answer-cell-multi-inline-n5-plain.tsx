import { createMultiAnswerCellTemplate } from '../../../lib/create-multi-answer-cell-template'

/** См. `./README.md` и пример payload в `./data/task.json`. */
export const AnswerCellMultiInlineN5Plain = createMultiAnswerCellTemplate({
  id: 'answerCell.multi.inline.n5.plain',
  layout: 'inline',
  inputCount: 5,
})
