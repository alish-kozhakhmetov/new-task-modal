/**
 * Colour and line weight for drawings, by the system and not by the payload.
 *
 * Generators send colours of their own — `#fff200`, `#ff7f27`, `#8484ff`,
 * `green`, `dodgerblue` — and stroke widths of 1, 2 or 2.5. Alisher, 05.10:
 * a fill keeps its hue (two shapes of different colour stay different) but
 * takes the nearest colour of the design-system palette, step 500; lines are
 * the system weights 1 / 1.5 / 2. Values mirror `tokens.css` of the design
 * system (qalan-assets, 1.17.0): the package palette still has an older
 * `green-500` (#21ef69), so the drawing palette is spelled out here.
 */

/** Line weights: data and contours, fine marking, grid. */
export const STROKE = { data: 2, hair: 1.5, grid: 1 } as const

/** Ink of the drawing — follows the theme. */
export const INK = 'var(--text-primary)'
export const GRID_INK = 'var(--border-default)'
export const MUTED_INK = 'var(--border-strong)'

const PALETTE = {
  red: '#ff4a4a',
  orange: '#ff752c',
  brown: '#9c3f15',
  yellow: '#fed702',
  green: '#00b53f',
  blue: '#0066fe',
  purple: '#8b2cff',
} as const

const NAMED: Record<string, string> = {
  black: INK,
  white: 'var(--bg-surface)',
  grey: MUTED_INK,
  gray: MUTED_INK,
  lightgrey: GRID_INK,
  lightgray: GRID_INK,
}

const toRgb = (color: string): [number, number, number] | null => {
  const hex = color.trim().replace('#', '')
  if (/^[0-9a-f]{3}$/i.test(hex)) {
    return [0, 1, 2].map((i) => parseInt(hex[i] + hex[i], 16)) as [
      number,
      number,
      number,
    ]
  }
  if (/^[0-9a-f]{6}([0-9a-f]{2})?$/i.test(hex)) {
    return [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16)) as [
      number,
      number,
      number,
    ]
  }
  return null
}

/** CSS colour names the generators use, resolved to RGB. */
const NAME_RGB: Record<string, [number, number, number]> = {
  red: [255, 0, 0],
  orange: [255, 165, 0],
  yellow: [255, 255, 0],
  green: [0, 128, 0],
  lime: [0, 255, 0],
  blue: [0, 0, 255],
  dodgerblue: [30, 144, 255],
  deepskyblue: [0, 191, 255],
  purple: [128, 0, 128],
  violet: [238, 130, 238],
  pink: [255, 192, 203],
  deeppink: [255, 20, 147],
  brown: [165, 42, 42],
  lightgreen: [144, 238, 144],
}

const nearest = ([r, g, b]: [number, number, number]): string => {
  const max = Math.max(r, g, b) / 255
  const min = Math.min(r, g, b) / 255
  const light = (max + min) / 2
  const sat = max === min ? 0 : (max - min) / (1 - Math.abs(2 * light - 1))
  if (sat < 0.15) return light > 0.85 ? NAMED.white : light < 0.25 ? INK : MUTED_INK

  const d = max - min
  const rn = r / 255
  const gn = g / 255
  const bn = b / 255
  let hue =
    max === rn
      ? ((gn - bn) / d) % 6
      : max === gn
        ? (bn - rn) / d + 2
        : (rn - gn) / d + 4
  hue = (hue * 60 + 360) % 360

  if (hue < 15 || hue >= 330) return PALETTE.red
  if (hue < 45) return light < 0.35 ? PALETTE.brown : PALETTE.orange
  if (hue < 70) return PALETTE.yellow
  if (hue < 170) return PALETTE.green
  // Light blue-violet (#8484ff, lavender) reads as violet next to the blue
  // lines of the same drawing — it was purple on the showcase Alisher chose.
  if (hue >= 230 && hue < 255 && light > 0.65) return PALETTE.purple
  if (hue < 255) return PALETTE.blue
  return PALETTE.purple
}

/**
 * The payload colour on the system palette. `none`/`transparent` stay as they
 * are; anything unreadable falls back to `fallback`.
 */
export const paint = (color: unknown, fallback: string): string => {
  if (typeof color !== 'string' || color.trim() === '') return fallback
  const c = color.trim().toLowerCase()
  if (c === 'none' || c === 'transparent') return c
  if (c.startsWith('var(')) return color
  if (c in NAMED) return NAMED[c]
  const rgb = toRgb(c) ?? NAME_RGB[c] ?? null
  return rgb ? nearest(rgb) : fallback
}
