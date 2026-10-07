/** A row name: letters and punctuation, no digits, signs or math. */
export const isWordLabel = (label: string) =>
  /\p{L}{2,}/u.test(label) && !/[\d=+×·*<>\\]/.test(label)

/**
 * Labelled fields one under another share one label column (rule 20), so the
 * fields start on one vertical line instead of each after its own label.
 * Only for named rows («Альбом:», «Значение частного:»): when a label is an
 * expression («(46 + 76) × x =» over «x =») the column takes the widest one
 * and pushes the short row's field and unit off the screen.
 */
export const hasLabelColumn = (
  layout: 'stack' | 'inline',
  withBefore: boolean,
  befores: (string | undefined)[],
) => {
  const labels = befores.filter(Boolean)
  return (
    layout !== 'inline' &&
    withBefore &&
    labels.length > 0 &&
    labels.every((label) => isWordLabel(String(label)))
  )
}
