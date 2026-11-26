import { createMultiEquationTemplate } from '../../../shared/lib/create-multi-equation-template'

/** См. `./README.md` и пример payload в `./data/task.json`. */
export const EquationMultiStackN2Before = createMultiEquationTemplate({
  id: 'equation.multi.stack.n2.before',
  layout: 'stack',
  inputCount: 2,
  withBefore: true,
})
