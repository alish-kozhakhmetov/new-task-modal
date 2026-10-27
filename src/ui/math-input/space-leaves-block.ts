/**
 * A space in the field steps out of the block MathQuill's caret is in
 * (`spaceBehavesLikeTab`) — useful to leave a fraction or a power: «1/2 + 3».
 * In brackets it is not: «(a + b)» left them right after «a» and the answer
 * became «((a)+b)» (2.5.8, live test 27.10, lesson 2141). In the field itself
 * there is nothing to leave.
 *
 * Read from the field's DOM — the caret's block opens with a bracket
 * (`<span class="mq-paren">(</span><span block>…|</span>`) — the same in the
 * package's MathQuill and in the site's 0.10.1, without their internals.
 */
export const spaceLeavesBlock = (field: HTMLElement | null): boolean => {
  const caret = field?.querySelector('.mq-cursor')
  const block =
    caret?.parentElement ?? field?.querySelector('.mq-hasCursor') ?? null
  if (!block || block.classList.contains('mq-root-block')) return false
  return !block.previousElementSibling?.classList.contains('mq-paren')
}
