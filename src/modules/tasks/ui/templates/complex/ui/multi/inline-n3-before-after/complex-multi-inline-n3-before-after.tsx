import { createMultiComplexTemplate } from '../../../lib/create-multi-complex-template'

/** См. `./README.md` и пример payload в `./data/task.json`. */
export const ComplexMultiInlineN3BeforeAfter = createMultiComplexTemplate({
  id: 'complex.multi.inline.n3.beforeAfter',
  layout: 'inline',
  inputCount: 3,
  withBefore: true,
  withAfter: true,
})
