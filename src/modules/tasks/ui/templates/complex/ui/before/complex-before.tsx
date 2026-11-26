import { createSimpleComplexTemplate } from '../../lib/create-simple-complex-template'

/** См. `./README.md` и пример payload в `./data/task.json`. */
export const ComplexBefore = createSimpleComplexTemplate({
  id: 'complex.before',
  withBefore: true,
})
