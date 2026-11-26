import { createMultiTextTemplate } from '../../../lib/create-multi-text-template'

/** См. `./README.md` и пример payload в `./data/task.json`. */
export const TextMultiInlineN4After = createMultiTextTemplate({
  id: 'text.multi.inline.n4.after',
  layout: 'inline',
  inputCount: 4,
  withAfter: true,
})
