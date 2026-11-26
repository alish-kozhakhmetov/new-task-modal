import { createMultiComplexTemplate } from '../../../lib/create-multi-complex-template'

/** См. `./README.md` и пример payload в `./data/task.json`. */
export const ComplexMultiStackN2Before = createMultiComplexTemplate({
  id: 'complex.multi.stack.n2.before',
  layout: 'stack',
  inputCount: 2,
  withBefore: true,
})
