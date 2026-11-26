import { createMultiEquationTemplate } from '../../../shared/lib/create-multi-equation-template'

/** См. `./README.md` и пример payload в `./data/task.json`. */
export const EquationMultiStackN3Before = createMultiEquationTemplate({
  id: 'equation.multi.stack.n3.before',
  layout: 'stack',
  inputCount: 3,
  withBefore: true,
})
