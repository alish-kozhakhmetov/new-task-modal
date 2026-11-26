import { createMultiComplexTemplate } from '../../../lib/create-multi-complex-template'

/** См. `./README.md` и пример payload в `./data/task.json`. */
export const ComplexMultiStackN4Before = createMultiComplexTemplate({
  id: 'complex.multi.stack.n4.before',
  layout: 'stack',
  inputCount: 4,
  withBefore: true,
})
