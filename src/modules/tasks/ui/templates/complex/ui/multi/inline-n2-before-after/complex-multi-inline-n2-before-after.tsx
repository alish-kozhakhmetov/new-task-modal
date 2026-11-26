import { createMultiComplexTemplate } from '../../../lib/create-multi-complex-template'

/** См. `./README.md` и пример payload в `./data/task.json`. */
export const ComplexMultiInlineN2BeforeAfter = createMultiComplexTemplate({
  id: 'complex.multi.inline.n2.beforeAfter',
  layout: 'inline',
  inputCount: 2,
  withBefore: true,
  withAfter: true,
})
