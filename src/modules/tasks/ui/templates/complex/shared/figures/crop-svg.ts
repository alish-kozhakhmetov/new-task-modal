/** Air left around a cropped drawing, in screen px (same as the plane). */
export const CROP_MARGIN = 12

/** Blank edge, in screen px, below which a drawing is left as it came. */
const CROP_THRESHOLD = 16

/**
 * Crops an inline backend SVG to what it draws, keeping its scale: the blank
 * paper inside the backend's own canvas goes, the strokes stay the same size.
 * A picture is cropped only when some edge carries more than CROP_THRESHOLD of
 * blank; 0–16px of air is how most grade-4 pictures come and they stay as-is.
 * Returns false when nothing is measurable (no layout, as in jsdom).
 */
export const cropSvgToContent = (svg: SVGSVGElement): boolean => {
  if (typeof svg.getBBox !== 'function') return false
  const rect = svg.getBoundingClientRect()
  const vb = svg.viewBox?.baseVal
  if (!rect.width || !rect.height || !vb || !vb.width || !vb.height)
    return false
  let b: DOMRect
  try {
    b = svg.getBBox()
  } catch {
    return false
  }
  if (!b.width || !b.height) return false

  // The default preserveAspectRatio (xMidYMid meet) fits the viewBox inside
  // the box and centres it: a 388×261 picture in a 190×190 box (4_7_14_2)
  // gets 33px bands above and below. Those bands are blank paper too.
  const scale = Math.min(rect.width / vb.width, rect.height / vb.height)
  const offX = (rect.width - vb.width * scale) / 2
  const offY = (rect.height - vb.height * scale) / 2
  const blank = [
    offX + (b.x - vb.x) * scale,
    offY + (b.y - vb.y) * scale,
    offX + (vb.x + vb.width - b.x - b.width) * scale,
    offY + (vb.y + vb.height - b.y - b.height) * scale,
  ]
  if (Math.max(...blank) <= CROP_THRESHOLD) return false

  const m = CROP_MARGIN / scale
  const x = Math.max(vb.x, b.x - m)
  const y = Math.max(vb.y, b.y - m)
  const w = Math.min(vb.x + vb.width, b.x + b.width + m) - x
  const h = Math.min(vb.y + vb.height, b.y + b.height + m) - y
  svg.setAttribute('viewBox', `${x} ${y} ${w} ${h}`)
  svg.setAttribute('width', String(Math.round(w * scale)))
  svg.setAttribute('height', String(Math.round(h * scale)))
  svg.style.width = `${Math.round(w * scale)}px`
  svg.style.height = `${Math.round(h * scale)}px`
  return true
}
