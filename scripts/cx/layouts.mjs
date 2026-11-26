/**
 * Stream CX (wave 1): the layouts of the complex / answerCell / text families
 * the package lacked at 2.5.8. One entry per template id; folder, component
 * name and story title follow the siblings already in the package.
 */

const ADORN_KEBAB = {
  plain: 'plain',
  before: 'before',
  after: 'after',
  beforeAfter: 'before-after',
}

const FAMILY = {
  complex: {
    dir: 'complex',
    pascal: 'Complex',
    storyRoot: 'Templates/Complex',
    // complex titles keep the camel adornment: `multi/stack-n2-beforeAfter`
    titleAdorn: (a) => a,
  },
  answerCell: {
    dir: 'answer-cell',
    pascal: 'AnswerCell',
    storyRoot: 'Templates/AnswerCell',
    titleAdorn: (a) => ADORN_KEBAB[a],
  },
  text: {
    dir: 'text',
    pascal: 'Text',
    storyRoot: 'Templates/Text',
    titleAdorn: (a) => ADORN_KEBAB[a],
  },
}

/** Ids in the order of the work matrix (generators), then the 4 out of lessons. */
export const LAYOUT_IDS = [
  'complex.before',
  'complex.multi.stack.n2.before',
  'complex.multi.stack.n3.beforeAfter',
  'complex.multi.stack.n3.before',
  'complex.multi.stack.n4.beforeAfter',
  'answerCell.multi.stack.n3.plain',
  'answerCell.multi.inline.n2.after',
  'text.multi.inline.n2.beforeAfter',
  'text.multi.stack.n5.beforeAfter',
  'text.multi.stack.n2.plain',
  'complex.multi.stack.n4.before',
  'complex.multi.stack.n2.plain',
  'complex.multi.inline.n3.after',
  'answerCell.multi.inline.n3.plain',
  'complex.multi.inline.n2.after',
  'answerCell.multi.inline.n5.plain',
  'text.multi.stack.n4.before',
  'text.multi.stack.n3.after',
  'complex.multi.inline.n2.beforeAfter',
  'complex.multi.stack.n3.plain',
  'text.multi.stack.n4.plain',
  'answerCell.multi.inline.n3.after',
  // the local backend's Task_2_6_12_6 is answerCell (variants 02.08: text)
  'answerCell.multi.inline.n4.after',
  'answerCell.multi.stack.n4.plain',
  'answerCell.multi.stack.n2.after',
  'text.multi.inline.n3.after',
  'complex.multi.stack.n5.before',
  'text.multi.stack.n3.plain',
  'text.multi.inline.n2.before',
  'complex.multi.inline.n3.beforeAfter',
  'complex.multi.inline.n2.plain',
  'answerCell.multi.inline.n4.plain',
  'complex.multi.inline.n4.after',
  'complex.multi.stack.n5.beforeAfter',
  'complex.multi.inline.n2.before',
  'answerCell.multi.stack.n3.beforeAfter',
  'complex.multi.stack.n3.after',
  'text.multi.inline.n4.after',
  'text.multi.inline.n4.beforeAfter',
  'text.multi.stack.n4.beforeAfter',
  'text.multi.stack.n5.before',
  // in the inventory's forms, not in the 31.07 lessons
  'answerCell.multi.stack.n3.after',
  'complex.multi.stack.n4.plain',
  'complex.multi.inline.n3.before',
  // no inventory item: Task_5_2_4_3's 02.08 payload is complex, not answerCell
  'complex.multi.inline.n5.plain',
]

const cap = (s) => s[0].toUpperCase() + s.slice(1)

/** `complex.multi.inline.n3.beforeAfter` → everything the scaffold needs. */
export const describeLayout = (id) => {
  const parts = id.split('.')
  const family = parts[0]
  const f = FAMILY[family]
  if (!f) throw new Error(`unknown family ${id}`)
  if (parts[1] !== 'multi') {
    const adorn = parts[1]
    return {
      id,
      family,
      familyDir: f.dir,
      multi: false,
      adorn,
      layout: null,
      n: 1,
      folder: `ui/${ADORN_KEBAB[adorn]}`,
      depth: 2,
      component: `${f.pascal}${cap(adorn)}`,
      fileBase: `${f.dir}-${ADORN_KEBAB[adorn]}`,
      storyTitle: `${f.storyRoot}/${f.titleAdorn(adorn)}`,
    }
  }
  const layout = parts[2]
  const n = Number(parts[3].slice(1))
  const adorn = parts[4]
  const slug = `${layout}-n${n}-${ADORN_KEBAB[adorn]}`
  return {
    id,
    family,
    familyDir: f.dir,
    multi: true,
    adorn,
    layout,
    n,
    folder: `ui/multi/${slug}`,
    depth: 3,
    component: `${f.pascal}Multi${cap(layout)}N${n}${cap(adorn)}`,
    fileBase: `${f.dir}-multi-${slug}`,
    storyTitle: `${f.storyRoot}/multi/${layout}-n${n}-${f.titleAdorn(adorn)}`,
    typeKey: `N${n}${cap(adorn)}`,
  }
}

export const LAYOUTS = LAYOUT_IDS.map(describeLayout)

/**
 * Inventory items of the stream NOT built: no payload in the corpus
 * (`complex.multi.inline.n4.beforeAfter` — GeoTask_9_2_27_*, fields with an
 * `up` label: a ratio written as a fraction) or the payload already fits a
 * 2.5.8 layout (`answerCell.multi.stack.n2.before` — empty labels → n2.plain).
 */
export const NOT_BUILT = [
  'complex.multi.inline.n4.beforeAfter',
  'answerCell.multi.stack.n2.before',
]
