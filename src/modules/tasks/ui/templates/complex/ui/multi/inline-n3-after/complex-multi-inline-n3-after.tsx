import { createMultiComplexTemplate } from '../../../lib/create-multi-complex-template'

/** См. `./README.md` и пример payload в `./data/task.json`. */
export const ComplexMultiInlineN3After = createMultiComplexTemplate({
  id: 'complex.multi.inline.n3.after',
  layout: 'inline',
  inputCount: 3,
  withAfter: true,
})
