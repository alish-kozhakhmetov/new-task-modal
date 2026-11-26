import { createMultiTextTemplate } from '../../../lib/create-multi-text-template'

/** См. `./README.md` и пример payload в `./data/task.json`. */
export const TextMultiInlineN3After = createMultiTextTemplate({
  id: 'text.multi.inline.n3.after',
  layout: 'inline',
  inputCount: 3,
  withAfter: true,
})
