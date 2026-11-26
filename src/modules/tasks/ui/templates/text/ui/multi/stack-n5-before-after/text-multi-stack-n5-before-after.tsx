import { createMultiTextTemplate } from '../../../lib/create-multi-text-template'

/** См. `./README.md` и пример payload в `./data/task.json`. */
export const TextMultiStackN5BeforeAfter = createMultiTextTemplate({
  id: 'text.multi.stack.n5.beforeAfter',
  layout: 'stack',
  inputCount: 5,
  withBefore: true,
  withAfter: true,
})
