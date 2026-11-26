import { createMultiComplexTemplate } from '../../../lib/create-multi-complex-template'

/** См. `./README.md` и пример payload в `./data/task.json`. */
export const ComplexMultiInlineN4After = createMultiComplexTemplate({
  id: 'complex.multi.inline.n4.after',
  layout: 'inline',
  inputCount: 4,
  withAfter: true,
})
