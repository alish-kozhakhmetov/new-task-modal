import { createMultiComplexTemplate } from '../../../lib/create-multi-complex-template'

/** См. `./README.md` и пример payload в `./data/task.json`. */
export const ComplexMultiStackN4BeforeAfter = createMultiComplexTemplate({
  id: 'complex.multi.stack.n4.beforeAfter',
  layout: 'stack',
  inputCount: 4,
  withBefore: true,
  withAfter: true,
})
