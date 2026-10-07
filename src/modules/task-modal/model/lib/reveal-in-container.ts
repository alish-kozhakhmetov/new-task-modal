type Box = Pick<DOMRect, 'top' | 'bottom' | 'height'>

/**
 * Scroll position that brings `field` into the visible part of `container`,
 * centred; `null` when the field is already fully visible. A field taller
 * than the container is aligned to its top edge.
 */
export const getRevealScrollTop = (
  container: Box,
  field: Box,
  scrollTop: number,
): number | null => {
  if (field.top >= container.top && field.bottom <= container.bottom) {
    return null
  }

  const offset = field.top - container.top
  if (field.height >= container.height) return scrollTop + offset

  return scrollTop + offset - (container.height - field.height) / 2
}
