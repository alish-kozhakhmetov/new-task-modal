import clsx from 'clsx'
import React, { useId } from 'react'

import { MathText } from '../math-text/math-text'
import { isHtmlRadioLabel } from '../radio-button/radio-button'

import styles from './checkbox.module.scss'

// Labels carry math islands («\\(97 \\times 11 = 1067\\)»). They go through
// MathText: nothing else typesets them. In Storybook MathJax's start-up pass
// over the whole page happened to catch them; in the trainer the task arrives
// later and the child saw «\\(59 ⋅ 64 = 3777\\)» (4_3_4_3 on 2.2.2, 05.10).

interface Props {
  name: string
  value: string
  label: string
  checked: boolean
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  disabled?: boolean
  /** Non-interactive, but keeps default/checked look (no gray, no hover). */
  readOnly?: boolean
}

/** Radio's twin for tasks with more than one correct answer. */
export const Checkbox = ({
  name,
  value,
  label,
  checked,
  onChange,
  disabled = false,
  readOnly = false,
}: Props) => {
  const id = useId()
  const htmlLabel = isHtmlRadioLabel(label)

  return (
    <label
      className={clsx(
        styles.checkbox,
        checked && styles.checked,
        disabled && !readOnly && styles.disabled,
        readOnly && styles.readOnly,
        htmlLabel && styles.htmlLabel,
      )}
      htmlFor={id}
    >
      <input
        id={id}
        type="checkbox"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        disabled={disabled || readOnly}
        className={styles.checkboxInput}
        aria-label={htmlLabel ? value : undefined}
      />
      <span className={styles.checkboxControl} aria-hidden />
      {htmlLabel ? (
        <span
          className={styles.checkboxLabel}
          dangerouslySetInnerHTML={{ __html: label }}
        />
      ) : (
        <MathText inline className={styles.checkboxLabel}>
          {label}
        </MathText>
      )}
    </label>
  )
}
