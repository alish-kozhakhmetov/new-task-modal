/**
 * An instruction that introduces what follows ends with a colon, not a full
 * stop: «Решите уравнение.» → «Решите уравнение:» (Alisher, 05.10 — a period
 * before the equation read as if the task were over). The title always sits
 * above the expression, the table or the options, so it always introduces.
 *
 * Only a single sentence changes: a title of two sentences is prose, and its
 * period stays. «…», «?» and «!» stay as they are.
 */
export const leadColon = (text: string): string => {
  const trimmed = text.trimEnd()
  if (!trimmed.endsWith('.') || trimmed.endsWith('..')) return text
  const body = trimmed.slice(0, -1)
  if (/[.!?]\s/.test(body)) return text
  return body + ':' + text.slice(trimmed.length)
}
