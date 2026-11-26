import { createMultiEquationTemplate } from '../../../shared/lib/create-multi-equation-template'

/** См. `./README.md` и пример payload в `./data/task.json`. */
export const EquationMultiStackN2BeforeAfter = createMultiEquationTemplate({
  id: 'equation.multi.stack.n2.beforeAfter',
  layout: 'stack',
  inputCount: 2,
  withBefore: true,
  withAfter: true,
})
