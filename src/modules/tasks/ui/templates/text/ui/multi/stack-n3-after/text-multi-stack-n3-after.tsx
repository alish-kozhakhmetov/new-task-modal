import { createMultiTextTemplate } from '../../../lib/create-multi-text-template'

/** См. `./README.md` и пример payload в `./data/task.json`. */
export const TextMultiStackN3After = createMultiTextTemplate({
  id: 'text.multi.stack.n3.after',
  layout: 'stack',
  inputCount: 3,
  withAfter: true,
})
