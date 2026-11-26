/**
 * Stream CX, the regression of a live grade by pixels: the same examples shot
 * by scripts/cx/verify.mjs --route=chapters --probe-only --shots=all on a clean
 * 2.5.8 worktree and on this branch, compared file by file.
 *
 *   node scripts/cx/compare-shots.mjs <base dir> <branch dir> [<diff dir>]
 *
 * Prints the counts (same / differ / only in one) and the differing files; a
 * diff PNG per differing pair goes to <diff dir> (red: changed pixels).
 */
import fs from 'node:fs'
import path from 'node:path'

import { pathToFileURL } from 'node:url'

// pixelmatch and pngjs come with the package's dev tools (transitively), not
// hoisted to node_modules: take them from pnpm's store of this tree
const PNPM = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../../node_modules/.pnpm')
const fromStore = async (name, entry) => {
  const dir = fs.readdirSync(PNPM).find((d) => d.startsWith(`${name}@`))
  if (!dir) throw new Error(`${name} is not in ${PNPM}`)
  return import(pathToFileURL(path.join(PNPM, dir, 'node_modules', name, entry)).href)
}
const pixelmatch = (await fromStore('pixelmatch', 'index.js')).default
const { PNG } = await fromStore('pngjs', 'lib/png.js')

const [baseDir, branchDir, diffDir] = process.argv.slice(2)
if (!baseDir || !branchDir) {
  console.error('usage: compare-shots.mjs <base dir> <branch dir> [<diff dir>]')
  process.exit(2)
}
const list = (d) => new Set(fs.readdirSync(d).filter((f) => f.endsWith('.png')))
const a = list(baseDir)
const b = list(branchDir)
if (a.size === 0 || b.size === 0) {
  console.error(`no shots: base ${a.size}, branch ${b.size}`)
  process.exit(2)
}
if (diffDir) fs.mkdirSync(diffDir, { recursive: true })

const same = []
const differ = []
for (const f of a) {
  if (!b.has(f)) continue
  const x = PNG.sync.read(fs.readFileSync(path.join(baseDir, f)))
  const y = PNG.sync.read(fs.readFileSync(path.join(branchDir, f)))
  if (x.width !== y.width || x.height !== y.height) {
    differ.push({ f, pixels: null, size: `${x.width}x${x.height} → ${y.width}x${y.height}` })
    continue
  }
  const out = new PNG({ width: x.width, height: x.height })
  const n = pixelmatch(x.data, y.data, out.data, x.width, x.height, { threshold: 0.1 })
  if (n === 0) same.push(f)
  else {
    differ.push({ f, pixels: n })
    if (diffDir) fs.writeFileSync(path.join(diffDir, f), PNG.sync.write(out))
  }
}
const onlyBase = [...a].filter((f) => !b.has(f))
const onlyBranch = [...b].filter((f) => !a.has(f))
console.log(
  JSON.stringify(
    { same: same.length, differ: differ.length, onlyBase: onlyBase.length, onlyBranch: onlyBranch.length },
    null,
    1,
  ),
)
for (const d of differ) console.log('differ', d.f, d.pixels ?? d.size)
for (const f of onlyBase) console.log('only base', f)
for (const f of onlyBranch) console.log('only branch', f)
