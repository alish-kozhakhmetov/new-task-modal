import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState, type CSSProperties, type ReactNode } from 'react'
import { expect, waitFor, within } from 'storybook/test'

import '../../../.storybook/mathquill-bootstrap'

import { withOnDemandPlay } from '@/testing/with-on-demand-play'

import {
  getMathQuillTex,
  ALL_MATH_SYMBOLS_MATHQUILL_TEX,
  isAllMathSymbolsSection,
  SYMBOL_SECTIONS,
  type SymbolSection,
} from '../math-symbol-catalog'
import { DigitGroupingContext } from '../math-text/group-digits'

import { DIGIT_GAP_ATTR } from './group-field-digits'
import { MathInput } from './math-input'

const meta = {
  title: 'Math UI/MathInput',
  component: MathInput,
  parameters: {
    docs: {
      description: {
        component:
          'Поле MathQuill для ввода и редактирования LaTeX-формул. Контролируется через `formula` / `onMathFieldChanged`.',
      },
    },
  },
} satisfies Meta<typeof MathInput>

export default meta
type Story = StoryObj<typeof meta>

const ControlledMathInput = ({
  formula: initial,
  className,
  style,
}: {
  formula: string
  className?: string
  style?: CSSProperties
}) => {
  const [formula, setFormula] = useState(initial)
  return (
    <MathInput
      formula={formula}
      onMathFieldChanged={setFormula}
      className={className}
      style={style}
    />
  )
}

export const Default: Story = {
  args: {
    formula: 'x^2',
  },
  render: (args) => <ControlledMathInput formula={args.formula ?? ''} />,
}

export const Empty: Story = {
  args: {
    formula: '',
  },
  render: (args) => <ControlledMathInput formula={args.formula ?? ''} />,
}

export const Fraction: Story = {
  args: {
    formula: '\\frac{a}{b}',
  },
  render: (args) => <ControlledMathInput formula={args.formula ?? ''} />,
}

export const Complex: Story = {
  args: {
    formula: '\\sqrt{x^2+y^2}=z',
  },
  render: (args) => <ControlledMathInput formula={args.formula ?? ''} />,
}

// ---------------------------------------------------------------------------
// Symbol catalog (MathQuill-compatible subset)
// ---------------------------------------------------------------------------

const sectionTitleStyle: CSSProperties = {
  margin: '28px 0 12px',
  fontSize: 16,
  fontWeight: 700,
}

const gridStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
  gap: 12,
}

const comboGridStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr',
  gap: 12,
}

const cardStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
  padding: 12,
  background: 'var(--bg-surface, #fff)',
  border: '1px solid var(--border-subtle, #e0e0e0)',
  borderRadius: 8,
  minHeight: 88,
  maxWidth: '100%',
}

const allSymbolsWrapStyle: CSSProperties = {
  boxSizing: 'border-box',
  width: '100%',
  maxWidth: '100%',
  minWidth: 0,
  padding: 12,
  overflowX: 'auto',
  background: 'var(--bg-surface, #fff)',
  border: '1px solid var(--border-subtle, #e0e0e0)',
  borderRadius: 8,
}

const allSymbolsFieldStyle: CSSProperties = {
  boxSizing: 'border-box',
  width: 'max-content',
  maxWidth: 'none',
  minWidth: 0,
}

const labelStyle: CSSProperties = {
  fontSize: 12,
  color: 'var(--text-secondary, #666)',
}

const texStyle: CSSProperties = {
  fontSize: 11,
  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
  color: 'var(--text-tertiary, #888)',
  wordBreak: 'break-all',
}

const SymbolCard = ({ label, tex }: { label: string; tex: string }) => (
  <div style={cardStyle}>
    <span style={labelStyle}>{label}</span>
    <ControlledMathInput formula={tex} />
    <code style={texStyle}>{tex}</code>
  </div>
)

const mathQuillSections = (): SymbolSection[] =>
  SYMBOL_SECTIONS.map((section) => ({
    ...section,
    items: section.items.flatMap((item) => {
      const tex = getMathQuillTex(item)
      if (tex === null) return []
      return [{ ...item, tex }]
    }),
  })).filter((section) => section.items.length > 0)

const SymbolCatalog = ({
  sections,
}: {
  sections: SymbolSection[]
}): ReactNode => (
  <div style={{ maxWidth: '100%', minWidth: 0 }}>
    <p style={{ margin: '0 0 8px', color: 'var(--text-secondary, #666)' }}>
      Каталог символов и комбинаций для MathInput / MathQuill. Команды, которые
      MathQuill не поддерживает (например <code>\\angle</code>,{' '}
      <code>\\triangle</code>, индексный корень), скрыты; <code>\\dfrac</code>{' '}
      заменён на <code>\\frac</code>.
    </p>
    {sections.map((section) => {
      if (isAllMathSymbolsSection(section.title)) {
        return (
          <section
            key={section.title}
            style={{ maxWidth: '100%', minWidth: 0 }}
          >
            <h3 style={sectionTitleStyle}>{section.title}</h3>
            <div style={allSymbolsWrapStyle}>
              <ControlledMathInput
                formula={ALL_MATH_SYMBOLS_MATHQUILL_TEX}
                style={allSymbolsFieldStyle}
              />
            </div>
          </section>
        )
      }
      const isCombo = section.title.startsWith('Комбинации')
      return (
        <section key={section.title}>
          <h3 style={sectionTitleStyle}>{section.title}</h3>
          <div style={isCombo ? comboGridStyle : gridStyle}>
            {section.items.map((item) => (
              <SymbolCard
                key={`${section.title}:${item.label}`}
                label={item.label}
                tex={item.tex}
              />
            ))}
          </div>
        </section>
      )
    })}
  </div>
)

export const AllSymbols: Story = {
  name: 'All symbols & combinations',
  parameters: {
    docs: {
      description: {
        story:
          'Каталог операторов, дробей, корней, греческих букв и школьных комбинаций в редактируемых полях MathQuill.',
      },
    },
  },
  render: () => <SymbolCatalog sections={mathQuillSections()} />,
}

// ---------------------------------------------------------------------------
// Digit grouping in the field (rule 100, Alisher 23.10)
// ---------------------------------------------------------------------------

const GROUPING_SAMPLES: { label: string; tex: string; off?: boolean }[] = [
  { label: 'Четыре знака — слитно', tex: '5825' },
  { label: 'Пять знаков', tex: '50000' },
  { label: 'Семь знаков', tex: '8201794' },
  { label: 'Дробная часть — слитно', tex: '12345,0159' },
  { label: 'С минусом', tex: '-12345' },
  { label: 'Дробь — оба этажа', tex: '\\frac{12345}{100000}' },
  { label: 'Задача из GROUPING_OFF_TASKS', tex: '12345', off: true },
]

const GroupingTypedField = () => {
  const [latex, setLatex] = useState('')
  return (
    <div style={cardStyle}>
      <span style={labelStyle}>Набор — значение поля под ним</span>
      <MathInput
        formula=""
        onMathFieldChanged={setLatex}
        data-testid="grouping-field"
      />
      <code style={texStyle} data-testid="grouping-latex">
        {latex}
      </code>
    </div>
  )
}

type MqField = {
  focus: () => void
  typedText: (text: string) => void
  keystroke: (key: string) => void
  select: () => void
}

const mqOf = (el: HTMLElement) =>
  (
    window.MathQuill.getInterface(2) as unknown as (
      el: HTMLElement,
    ) => MqField | undefined
  )(el)

/** The field as it reads: digits, a space where a class gap is. */
const shownDigits = (field: HTMLElement) =>
  [...field.querySelectorAll('.mq-root-block [mathquill-command-id]')]
    .map((n) => `${n.textContent}${n.hasAttribute(DIGIT_GAP_ATTR) ? ' ' : ''}`)
    .join('')

const digitBoxes = (field: HTMLElement) =>
  [...field.querySelectorAll('.mq-root-block [mathquill-command-id]')].map(
    (n) => n.getBoundingClientRect(),
  )

/**
 * «50000» reads «50 000»: the condition's 0.14em gap after the digit that
 * ends a class — a margin, not a character. The value under the field (what
 * the store and the check get) stays solid. Not grouped: four digits, the
 * fraction part, a task of GROUPING_OFF_TASKS. Play: typing, the caret
 * between classes (in the middle of the gap), ⌫ from the middle, selection
 * and replacement.
 */
export const FieldGrouping: Story = {
  name: 'Поле: разрядка',
  args: { formula: '' },
  render: () => (
    <div style={{ display: 'grid', gap: 12, maxWidth: 420 }}>
      <GroupingTypedField />
      {GROUPING_SAMPLES.map(({ label, tex, off }) => (
        <DigitGroupingContext key={label} value={{ from: off ? null : 5 }}>
          <SymbolCard label={label} tex={tex} />
        </DigitGroupingContext>
      ))}
    </div>
  ),
  play: withOnDemandPlay(async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const field = await canvas.findByTestId('grouping-field')
    const value = canvas.getByTestId('grouping-latex')
    const mq = await waitFor(() => {
      const ready = mqOf(field)
      if (!ready) throw new Error('MathQuill is not on the field yet')
      return ready
    })
    mq.focus()

    // Typing: four digits solid, the fifth splits the classes.
    for (const ch of '5000') mq.typedText(ch)
    await waitFor(() => expect(value).toHaveTextContent(/^5000$/))
    await expect(shownDigits(field)).toBe('5000')
    mq.typedText('0')
    await waitFor(() => expect(value).toHaveTextContent(/^50000$/))
    await expect(shownDigits(field)).toBe('50 000')

    // The gap: 0.14em of the field's size between classes, none inside one.
    const em = parseFloat(getComputedStyle(field).fontSize)
    const boxes = digitBoxes(field)
    const inside = boxes[1].left - boxes[0].right
    const between = boxes[2].left - boxes[1].right
    await expect(between - inside).toBeCloseTo(0.14 * em, 0)

    // Seven digits; the caret three steps left stands between the classes,
    // in the middle of the gap — not at a class's edge, not a stop of its own.
    mq.typedText('0')
    mq.typedText('0')
    await waitFor(() => expect(shownDigits(field)).toBe('5 000 000'))
    for (let i = 0; i < 3; i += 1) mq.keystroke('Left')
    const cursor = field.querySelector<HTMLElement>('.mq-cursor')
    const before = cursor?.previousElementSibling?.getBoundingClientRect()
    const after = cursor?.nextElementSibling?.getBoundingClientRect()
    const caret = cursor?.getBoundingClientRect()
    if (!before || !after || !caret) throw new Error('no caret between digits')
    await expect(caret.right - before.right).toBeCloseTo(0.07 * em, 0)
    await expect(caret.right).toBeLessThan(after.left)

    // ⌫ from the middle takes the digit left of the caret and regroups.
    mq.keystroke('Backspace')
    await waitFor(() => expect(value).toHaveTextContent(/^500000$/))
    await expect(shownDigits(field)).toBe('500 000')

    // Selection (double tap, ⌘A): the gaps stay, a key replaces it all.
    mq.select()
    await expect(field.querySelector('.mq-selection')).not.toBeNull()
    await expect(shownDigits(field)).toBe('500 000')
    mq.typedText('7')
    await waitFor(() => expect(value).toHaveTextContent(/^7$/))
    await expect(shownDigits(field)).toBe('7')
  }),
}
