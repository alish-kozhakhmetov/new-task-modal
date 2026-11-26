import { createMultiComplexTemplate } from '../../../lib/create-multi-complex-template'

/** См. `./README.md` и пример payload в `./data/task.json`. */
export const ComplexMultiStackN5Before = createMultiComplexTemplate({
  id: 'complex.multi.stack.n5.before',
  layout: 'stack',
  inputCount: 5,
  withBefore: true,
})
