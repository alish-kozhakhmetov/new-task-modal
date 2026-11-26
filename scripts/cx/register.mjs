/**
 * Stream CX: register the built layouts in TEMPLATE_MAP and
 * implemented-templates.json (idempotent; TemplateTypes is edited by hand).
 *   node scripts/cx/register.mjs
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { LAYOUTS } from './layouts.mjs'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const FAM = {
  complex: ['Complex', 'wrapComplex', 'complex'],
  answerCell: ['AnswerCell', 'wrapAnswerCell', 'answer-cell'],
  text: ['Text', 'wrapText', 'text'],
}
const MARK = '  // Stream CX (wave 1): complex / answerCell / text layouts missing at 2.5.8.\n'
const mapFile = path.join(ROOT, 'src/modules/tasks/model/template-map.ts')
let src = fs.readFileSync(mapFile, 'utf8')
// one loader per layout, under the mark; a layout already there is kept
let out = src.includes(MARK) ? '' : MARK
for (const l of LAYOUTS) {
  const [P, wrap, dir] = FAM[l.family]
  const where = `'@/modules/tasks/ui/templates/${dir}/${l.folder}'`
  if (src.includes(where)) continue
  const key = l.multi
    ? `TemplateTypes.${P}.Multi.${l.layout[0].toUpperCase()}${l.layout.slice(1)}.${l.typeKey}`
    : `TemplateTypes.${P}.Before`
  out += `  [${key}]: () =>\n    ${wrap}(() =>\n      import(\n        ${where}\n      ).then((module) => ({ default: module.${l.component} })),\n    ),\n`
}
if (out) {
  const anchor = '} satisfies Record<string, unknown>'
  if (src.split(anchor).length !== 2) throw new Error('anchor')
  src = src.replace(anchor, out + anchor)
  fs.writeFileSync(mapFile, src)
}
const listFile = path.join(ROOT, 'src/modules/tasks/model/implemented-templates.json')
const list = JSON.parse(fs.readFileSync(listFile, 'utf8'))
for (const l of LAYOUTS) if (!list[l.family].includes(l.id)) list[l.family].push(l.id)
fs.writeFileSync(
  listFile,
  `${JSON.stringify(list, null, 2).replace(/\[\n\s+("[^"]+")\n\s+\]/g, '[$1]')}\n`,
)
console.log(`registered ${LAYOUTS.length}`)
