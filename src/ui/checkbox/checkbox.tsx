import clsx from 'clsx'
import React, { useId } from 'react'

import mathTextStyles from '../math-text/math-text.module.scss'
import { isHtmlRadioLabel } from '../radio-button/radio-button'

import styles from './checkbox.module.scss'

// Labels carry math islands («\\(97 \\times 11 = 1067\\)») that MathJax typesets in
// place; without the MathText scope its TeX serif font stayed next to Halvar.

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
          className={clsx(styles.checkboxLabel, mathTextStyles.mathText)}
          dangerouslySetInnerHTML={{ __html: label }}
        />
      ) : (
        <span className={clsx(styles.checkboxLabel, mathTextStyles.mathText)}>
          {label}
        </span>
      )}
    </label>
  )
}
