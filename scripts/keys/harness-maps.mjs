/**
 * The harness's temporary chapter maps: the package has no template for
 * grades 5–13 yet, so each task of .cache/tasks.json is mapped to the
 * template it carries (`template`), in src/modules/tasks/ui/grades/__keys-harness__/.
 * The maps match GRADE_CHAPTER_REGEX like real ones — they must never reach
 * git or a build: write them before vite, clean them right after the drive.
 *
 *   node scripts/keys/harness-maps.mjs write
 *   node scripts/keys/harness-maps.mjs clean
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const DIR = path.resolve(HERE, '../../src/modules/tasks/ui/grades/__keys-harness__')
const mode = process.argv[2]

fs.rmSync(DIR, { recursive: true, force: true })
if (mode === 'write') {
  const tasks = JSON.parse(fs.readFileSync(path.join(HERE, '.cache/tasks.json'), 'utf8'))
  const maps = new Map()
  for (const t of tasks) {
    const [grade, chapter, ...rest] = t.taskType.replace(/^Elixir\.Task_/, '').split('_')
    const file = path.join(DIR, `grade-${grade}`, `chapter-${chapter}.ts`)
    const m = maps.get(file) ?? {}
    ;(m[t.template] ??= []).push(rest.join('_'))
    maps.set(file, m)
  }
  for (const [file, m] of maps) {
    fs.mkdirSync(path.dirname(file), { recursive: true })
    fs.writeFileSync(file, `// TEMPORARY keys harness map — never commit (scripts/keys/harness-maps.mjs)\nexport default ${JSON.stringify(m, null, 2)}\n`)
  }
  console.log(`maps: ${maps.size} files`)
} else if (mode !== 'clean') {
  console.error('write | clean')
  process.exit(1)
}
