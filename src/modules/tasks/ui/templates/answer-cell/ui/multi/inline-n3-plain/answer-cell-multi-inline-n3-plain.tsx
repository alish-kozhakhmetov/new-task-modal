import { createMultiAnswerCellTemplate } from '../../../lib/create-multi-answer-cell-template'

/** См. `./README.md` и пример payload в `./data/task.json`. */
export const AnswerCellMultiInlineN3Plain = createMultiAnswerCellTemplate({
  id: 'answerCell.multi.inline.n3.plain',
  layout: 'inline',
  inputCount: 3,
})
