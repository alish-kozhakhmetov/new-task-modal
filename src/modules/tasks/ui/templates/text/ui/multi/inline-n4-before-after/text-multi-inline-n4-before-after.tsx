import { createMultiTextTemplate } from '../../../lib/create-multi-text-template'

/** См. `./README.md` и пример payload в `./data/task.json`. */
export const TextMultiInlineN4BeforeAfter = createMultiTextTemplate({
  id: 'text.multi.inline.n4.beforeAfter',
  layout: 'inline',
  inputCount: 4,
  withBefore: true,
  withAfter: true,
})
