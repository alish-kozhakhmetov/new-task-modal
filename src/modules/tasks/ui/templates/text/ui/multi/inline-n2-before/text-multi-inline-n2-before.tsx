import { createMultiTextTemplate } from '../../../lib/create-multi-text-template'

/** См. `./README.md` и пример payload в `./data/task.json`. */
export const TextMultiInlineN2Before = createMultiTextTemplate({
  id: 'text.multi.inline.n2.before',
  layout: 'inline',
  inputCount: 2,
  withBefore: true,
})
