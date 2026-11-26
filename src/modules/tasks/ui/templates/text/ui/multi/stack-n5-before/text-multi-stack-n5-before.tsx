import { createMultiTextTemplate } from '../../../lib/create-multi-text-template'

/** См. `./README.md` и пример payload в `./data/task.json`. */
export const TextMultiStackN5Before = createMultiTextTemplate({
  id: 'text.multi.stack.n5.before',
  layout: 'stack',
  inputCount: 5,
  withBefore: true,
})
