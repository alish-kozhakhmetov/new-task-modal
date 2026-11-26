import { createMultiComplexTemplate } from '../../../lib/create-multi-complex-template'

/** См. `./README.md` и пример payload в `./data/task.json`. */
export const ComplexMultiInlineN2After = createMultiComplexTemplate({
  id: 'complex.multi.inline.n2.after',
  layout: 'inline',
  inputCount: 2,
  withAfter: true,
})
