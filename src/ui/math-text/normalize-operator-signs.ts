/**
 * Operator signs typed on a keyboard, shown as typeset signs.
 *
 * Generators write `(54009 - 36865) · 4`, `81224 − 8858 · 2`,
 * `28773 ⋅ 4 - 115425 : 3`: a hyphen for minus and `·`, `⋅` or `*` for times.
 * Outside MathJax that text reaches the child as is, and in Halvar `-` is a
 * short hyphen and `·` is `periodcentered`, a punctuation mark sitting below
 * the math axis — the multiplication sign all but disappears (Task_4_1_72).
 * `⋅` (U+22C5) is not in Halvar at all and falls back to another font.
 * Measured on the 1281 whitelisted grade-4 tasks: 60 show a hyphen for minus
 * and 57 a dot for times.
 *
 * Only text outside math islands changes: MathJax already typesets `-` in math
 * mode as a minus, and `\cdot` there is a separate decision.
 *
 * The rules are narrow on purpose, because prose uses the same characters:
 * - an ASCII `-` with spaces around it is a minus between numbers and brackets,
 *   and after a unit of measure that follows a number: «12 дм - 1065 мм»,
 *   «436 дней - 125 недель». Units come from an explicit list, not «any word»;
 * - the same `-` after an ordinary word is a prose dash the generator typed as
 *   a hyphen — «а в Санкт-Петербург - 7887 студентов», «во второй день -
 *   460110 кг» — and becomes an em dash, as in our trainer. Measured on the
 *   whitelist: 21 such hyphens are subtraction of quantities, 8 are prose;
 * - an en dash `–` becomes a minus only between numbers and brackets, so
 *   «Нижневартовска – 254500 человек» keeps its dash;
 * - `·`, `⋅`, `*` between numbers and brackets, alone in a label, or at the
 *   end of a label right before a field («изд./ч *») become `×`;
 * - a lone `/` between fields (a label of its own) becomes `÷`; a slash inside
 *   text («1/2», «км/ч») is a fraction or a unit and stays;
 * - `тг` next to a number or alone becomes `₸` (Halvar draws its own glyph);
 *   the word «тенге»/«теңге» in prose stays a word;
 * - anything without spaces around it («4-й», «2022-жылы») is left alone.
 */

const MATH_ISLAND_RE = /(\\\([\s\S]*?\\\)|\\\[[\s\S]*?\\\]|\$\$[\s\S]*?\$\$)/

const MINUS = '−'
const TIMES = '×'
const DIVIDE = '÷'
const DASH = '—'

/** Left operand: a digit, a closing bracket or a single Latin variable. */
const LEFT = String.raw`[\d)]|(?<!\p{L})[a-zA-Z](?!\p{L})`
/** Right operand, looked ahead: a digit, an opening bracket or a variable. */
const RIGHT = String.raw`[\d(]|[a-zA-Z](?!\p{L})`

/** Units of measure a quantity is written with in grade-4 tasks. */
const UNITS = [
  // ru — measured on the whitelist fixtures, plus the full forms of the same units
  'мм',
  'см',
  'дм',
  'м',
  'км',
  'мг',
  'г',
  'кг',
  'ц',
  'т',
  'мл',
  'л',
  'а',
  'га',
  'с',
  'сек',
  'секунда',
  'секунды',
  'секунд',
  'мин',
  'минута',
  'минуты',
  'минут',
  'ч',
  'час',
  'часа',
  'часов',
  'сут',
  'сутки',
  'суток',
  'нед',
  'неделя',
  'недели',
  'недель',
  'день',
  'дня',
  'дней',
  'месяц',
  'месяца',
  'месяцев',
  'год',
  'года',
  'лет',
  'век',
  'века',
  'веков',
  'тенге',
  'тг',
  'руб',
  // kk, ky — the same tasks are shown in Kazakh and Kyrgyz
  'күн',
  'сағат',
  'жыл',
  'саат',
  'мүнөт',
  'секунд',
  // uz, az, en
  'sm',
  'ga',
  'kg',
  'kq',
  'mg',
  'mq',
  'ml',
  'mL',
  'L',
  'l',
  'km',
  'dm',
  'cm',
  'mm',
  'm',
  'g',
  't',
  'ha',
  'hectare',
  's',
  'min',
  'h',
  'kun',
  'soat',
  'yil',
  'sekund',
  'daqiqa',
  'gün',
  'saat',
  'il',
  'saniyə',
  'dəqiqə',
  'days',
  'hours',
  'years',
  'seconds',
  'minutes',
].join('|')

const HYPHEN_AFTER_UNIT = new RegExp(
  String.raw`(\d\s*(?:${UNITS})\.?)(\s+)-(\s+)(?=[\d(])`,
  'gu',
)
// Only before a number, as in every measured case («Петербург - 7887»). Before
// a word the hyphen is left alone: «II - класс» turned into «II — класс» while
// its neighbour «I - класс» kept the hyphen — one letter is not «a word».
const HYPHEN_AS_PROSE_DASH = new RegExp(
  String.raw`(\p{L}{2,})\s+-\s+(?=\d)`,
  'gu',
)
const DASH_BETWEEN = new RegExp(
  String.raw`(${LEFT})(\s+)[-–](\s+)(?=${RIGHT})`,
  'gu',
)
const TIMES_BETWEEN = new RegExp(
  String.raw`(${LEFT})(\s*)[·⋅*](\s*)(?=${RIGHT})`,
  'gu',
)
const LEADING_MINUS = new RegExp(String.raw`^(\s*)[-–](\s+)(?=[\d(])`, 'u')
const TRAILING_MINUS = new RegExp(String.raw`([\d)])(\s+)[-–](\s*)$`, 'u')
const TENGE = /(^|[\s\d(])тг(?=$|[\s.,;:)])/gu
const EDGE_TIMES = new RegExp(String.raw`(^\s*|\s)[·⋅*](\s*$|\s+)`, 'gu')

const normalizeSegment = (text: string): string => {
  const trimmed = text.trim()
  if (trimmed === '-' || trimmed === '–') return text.replace(trimmed, MINUS)
  if (trimmed === '·' || trimmed === '⋅' || trimmed === '*') {
    return text.replace(trimmed, TIMES)
  }
  if (trimmed === '/') return text.replace(trimmed, DIVIDE)

  return text
    .replace(TENGE, '$1₸')
    .replace(DASH_BETWEEN, `$1$2${MINUS}$3`)
    .replace(HYPHEN_AFTER_UNIT, `$1$2${MINUS}$3`)
    .replace(HYPHEN_AS_PROSE_DASH, `$1 ${DASH} `)
    .replace(TIMES_BETWEEN, `$1$2${TIMES}$3`)
    .replace(LEADING_MINUS, `$1${MINUS}$2`)
    .replace(TRAILING_MINUS, `$1$2${MINUS}$3`)
    .replace(EDGE_TIMES, `$1${TIMES}$2`)
}

export const normalizeOperatorSigns = (text: string): string =>
  text
    .split(MATH_ISLAND_RE)
    .map((part, index) => (index % 2 === 1 ? part : normalizeSegment(part)))
    .join('')
