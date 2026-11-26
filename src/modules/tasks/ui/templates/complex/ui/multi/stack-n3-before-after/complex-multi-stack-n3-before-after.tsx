import { createMultiComplexTemplate } from '../../../lib/create-multi-complex-template'

/** См. `./README.md` и пример payload в `./data/task.json`. */
export const ComplexMultiStackN3BeforeAfter = createMultiComplexTemplate({
  id: 'complex.multi.stack.n3.beforeAfter',
  layout: 'stack',
  inputCount: 3,
  withBefore: true,
  withAfter: true,
})
