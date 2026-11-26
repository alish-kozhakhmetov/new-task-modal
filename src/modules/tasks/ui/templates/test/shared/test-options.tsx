import clsx from 'clsx'

import type { TaskModalDependencies } from '@/modules/task-modal/model/types/props'
import { renderConditionPart } from '@/modules/tasks/ui/templates/complex/shared/complex-description'
import { CheckboxGroup } from '@/ui/checkbox/checkbox-group'
import {
  RadioButtonGroup,
  type RadioOption,
} from '@/ui/radio-button/radio-button-group'

import { isFigureVariant } from '../lib/get-test-variants'
import type { TestTaskDescription } from '../lib/types.task'

import styles from './test.module.scss'
import { useVariantKeys } from './use-variant-keys'

interface Props {
  name: string
  options: RadioOption[]
  value: string
  onChange: (value: string) => void
  description: TestTaskDescription
  /** Needed to draw figure variants; without it they stay empty labels. */
  deps?: TaskModalDependencies
  disabled?: boolean
  readOnly?: boolean
  /** Task admits more than one correct answer — pick with checkboxes. */
  multiple?: boolean
  /** Localized "pick every fitting option" line. */
  multipleHint?: string
}

export const TestOptions = ({
  name,
  options: plainOptions,
  value,
  onChange,
  description,
  deps,
  disabled = false,
  readOnly = false,
  multiple = false,
  multipleHint,
}: Props) => {
  const variants: unknown[] = Array.isArray(description.variants)
    ? description.variants
    : []
  const options = deps
    ? plainOptions.map((option, index) => {
        const raw = variants[index]
        return isFigureVariant(raw)
          ? { ...option, figure: renderConditionPart(raw, deps, index) }
          : option
      })
    : plainOptions

  useVariantKeys({
    name,
    options,
    value,
    onChange,
    multiple,
    enabled: !disabled && !readOnly,
  })

  const horizontal = Boolean(description.isHorizontal)
  const wrap = Boolean(description.isWrapVariants)

  return (
    <div
      data-testid="test-options"
      data-layout={horizontal ? 'horizontal' : 'vertical'}
    >
      {multiple ? (
        <CheckboxGroup
          className={clsx(
            styles.radioGroup,
            horizontal && styles.radioGroupHorizontal,
            wrap && styles.radioGroupWrap,
          )}
          name={name}
          options={options}
          value={value}
          onChange={onChange}
          disabled={disabled}
          readOnly={readOnly}
          ariaLabel="test-options"
          hint={multipleHint}
        />
      ) : (
        <RadioButtonGroup
          className={clsx(
            styles.radioGroup,
            horizontal && styles.radioGroupHorizontal,
            wrap && styles.radioGroupWrap,
          )}
          name={name}
          options={options}
          value={value}
          onChange={onChange}
          disabled={disabled}
          readOnly={readOnly}
          ariaLabel="test-options"
        />
      )}
    </div>
  )
}
