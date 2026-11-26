import { createMultiTextTemplate } from '../../../lib/create-multi-text-template'

/** См. `./README.md` и пример payload в `./data/task.json`. */
export const TextMultiInlineN2BeforeAfter = createMultiTextTemplate({
  id: 'text.multi.inline.n2.beforeAfter',
  layout: 'inline',
  inputCount: 2,
  withBefore: true,
  withAfter: true,
})
