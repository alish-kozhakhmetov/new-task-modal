import { createEquationTemplate } from '../../shared/lib/create-equation-template'

/** См. `./README.md` и пример payload в `./data/task.json`. */
export const EquationBeforeAfter = createEquationTemplate({
  id: 'equation.beforeAfter',
  withBefore: true,
  withAfter: true,
})
