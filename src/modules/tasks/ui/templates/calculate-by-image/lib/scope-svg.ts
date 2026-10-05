/**
 * Backend item pictures carry their own `<style>` with generic class names
 * (`.st0`, `.cls-1`) and ids (`#a` for gradients). Injected side by side they
 * restyle each other: Task_0_3_11_6 put «rabbit with carrot» next to «rabbit
 * without carrot», and the second picture's `.st3` painted the carrot over —
 * the item was in the zone, the carrot was invisible.
 *
 * Every class and id defined inside the markup gets a per-picture prefix;
 * references (`.st0`, `class="st0"`, `url(#a)`, `href="#a"`) follow.
 */
const STYLE_BLOCK = /<style[^>]*>([\s\S]*?)<\/style>/gi
const CLASS_IN_CSS = /\.(-?[_a-zA-Z][\w-]*)/g
const ID_ATTR = /\sid\s*=\s*["']([^"']+)["']/gi

const escapeRe = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

export const scopeSvg = (html: string, prefix: string): string => {
  if (!html.includes('<')) return html

  const classes = new Set<string>()
  for (const block of html.matchAll(STYLE_BLOCK)) {
    for (const match of block[1].matchAll(CLASS_IN_CSS)) classes.add(match[1])
  }
  const ids = new Set<string>()
  for (const match of html.matchAll(ID_ATTR)) ids.add(match[1])
  if (classes.size === 0 && ids.size === 0) return html

  let out = html.replace(STYLE_BLOCK, (block) =>
    block.replace(CLASS_IN_CSS, (whole, name: string) =>
      classes.has(name) ? `.${prefix}${name}` : whole,
    ),
  )

  out = out.replace(/\sclass\s*=\s*(["'])([^"']*)\1/gi, (_, quote, list) => {
    const scoped = (list as string)
      .split(/\s+/)
      .map((name) => (classes.has(name) ? `${prefix}${name}` : name))
      .join(' ')
    return ` class=${quote}${scoped}${quote}`
  })

  for (const id of ids) {
    const safe = escapeRe(id)
    out = out
      .replace(
        new RegExp(`(\\sid\\s*=\\s*["'])${safe}(["'])`, 'g'),
        `$1${prefix}${id}$2`,
      )
      .replace(
        new RegExp(`url\\(\\s*#${safe}\\s*\\)`, 'g'),
        `url(#${prefix}${id})`,
      )
      .replace(
        new RegExp(`((?:xlink:)?href\\s*=\\s*["'])#${safe}(["'])`, 'g'),
        `$1#${prefix}${id}$2`,
      )
  }

  return out
}
