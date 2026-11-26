import { createMultiTextTemplate } from '../../../lib/create-multi-text-template'

/** См. `./README.md` и пример payload в `./data/task.json`. */
export const TextMultiStackN4BeforeAfter = createMultiTextTemplate({
  id: 'text.multi.stack.n4.beforeAfter',
  layout: 'stack',
  inputCount: 4,
  withBefore: true,
  withAfter: true,
})
