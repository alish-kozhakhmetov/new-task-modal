/**
 * An instruction that introduces what follows ends with a colon, not a full
 * stop: «Решите уравнение.» → «Решите уравнение:» (Alisher, 05.10 — a period
 * before the equation read as if the task were over). The title always sits
 * above the expression, the table or the options, so it always introduces.
 *
 * The same instruction typed without a final mark gets the colon too:
 * «Вычислите эффективным способом» → «Вычислите эффективным способом:»
 * (4_2_2_1; on the whitelist also «Преобразуйте в секунды» and four Kazakh
 * titles). Only a title that ends in a letter or a digit — a closing bracket,
 * a formula or a mark of its own stays as it is.
 *
 * Only a single sentence changes: a title of two sentences is prose, and its
 * period stays. «…», «?» and «!» stay as they are.
 */
export const leadColon = (text: string): string => {
  const trimmed = text.trimEnd()
  const tail = text.slice(trimmed.length)

  if (/[\p{L}\p{N}]$/u.test(trimmed)) {
    if (/[.!?]\s/.test(trimmed)) return text
    return trimmed + ':' + tail
  }

  if (!trimmed.endsWith('.') || trimmed.endsWith('..')) return text
  const body = trimmed.slice(0, -1)
  if (/[.!?]\s/.test(body)) return text
  return body + ':' + tail
}
