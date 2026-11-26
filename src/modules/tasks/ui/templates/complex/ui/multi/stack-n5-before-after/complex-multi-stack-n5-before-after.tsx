import { createMultiComplexTemplate } from '../../../lib/create-multi-complex-template'

/** См. `./README.md` и пример payload в `./data/task.json`. */
export const ComplexMultiStackN5BeforeAfter = createMultiComplexTemplate({
  id: 'complex.multi.stack.n5.beforeAfter',
  layout: 'stack',
  inputCount: 5,
  withBefore: true,
  withAfter: true,
})
