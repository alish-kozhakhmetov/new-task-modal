import { createMultiEquationTemplate } from '../../../shared/lib/create-multi-equation-template'

/** См. `./README.md` и пример payload в `./data/task.json`. */
export const EquationMultiStackN4Before = createMultiEquationTemplate({
  id: 'equation.multi.stack.n4.before',
  layout: 'stack',
  inputCount: 4,
  withBefore: true,
})
