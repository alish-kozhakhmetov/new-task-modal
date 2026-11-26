import { createMultiEquationTemplate } from '../../../shared/lib/create-multi-equation-template'

/** См. `./README.md` и пример payload в `./data/task.json`. */
export const EquationMultiInlineN2BeforeAfter = createMultiEquationTemplate({
  id: 'equation.multi.inline.n2.beforeAfter',
  layout: 'inline',
  inputCount: 2,
  withBefore: true,
  withAfter: true,
})
