import { useState } from 'react'

import type { TaskModalDependencies } from '@/modules/task-modal/model/types/props'
import { setMathInputRef } from '@/modules/tasks/lib/set-math-input-ref'
import { isActiveSolution } from '@/modules/tasks/lib/solution-types'
import { isTranslation } from '@/modules/tasks/lib/translation-utils'
import type { TaskComponentProps } from '@/modules/tasks/model/types'
import { SharedSolutionBody } from '@/modules/tasks/ui/common/task-solution/shared-solution-body'
import { TaskTitle } from '@/modules/tasks/ui/common/task-title/task-title'
import type { Translation } from '@/types/api/task'
import { MathInput } from '@/ui/math-input/math-input'
import { MathText } from '@/ui/math-text/math-text'

import { TextAdornment } from '../../text/shared/text-adornment'
import styles from '../shared/calculate-by-image.module.scss'
import { ItemBoard } from '../shared/item-board'

import {
  decodeZone,
  encodeZone,
  parseCalculateByImage,
  type CalculateByImageModel,
  type PoolItem,
} from './parse-calculate-by-image'
import type { CalculateByImageTask } from './types.task'

/*
 * The host dictionary has no keys for these yet; Russian is the fallback, as
 * in the test template.
 */
const labelsFrom = (deps: TaskModalDependencies) => {
  const localize = deps.localize as Record<string, string> | undefined
  return {
    add: localize?.putItemIntoZone ?? 'Положить',
    remove: localize?.takeItemFromZone ?? 'Убрать',
    zone: localize?.itemZone ?? 'Сюда',
  }
}

const Condition = ({
  task,
  model,
  deps,
}: {
  task: CalculateByImageTask
  model: CalculateByImageModel
  deps: TaskModalDependencies
}) => (
  <div className={styles.condition}>
    <TaskTitle title={task.title} deps={deps} />
    {model.textBefore ? (
      <MathText className={styles.text}>{model.textBefore}</MathText>
    ) : null}
    {model.imageBefore ? (
      <div
        className={styles.imageBefore}
        dangerouslySetInnerHTML={{ __html: model.imageBefore }}
      />
    ) : null}
  </div>
)

/** Rebuild the zone from stored indexes, so a reset store empties it. */
const zoneFromIndexes = (
  indexes: number[],
  model: CalculateByImageModel,
): PoolItem[] =>
  indexes
    .map((index) => model.catalog[index])
    .filter((item): item is PoolItem => item != null)

/*
 * `solution` sometimes comes back as the same calculateByImage description
 * with the right set in `items` (Task_0_1_38_9) — then show that set in the
 * zone; otherwise the shared explanation body.
 */
const CalculateByImageSolution = ({
  task,
  deps,
  translate,
}: {
  task: CalculateByImageTask
  deps: TaskModalDependencies
  translate: (value: Translation | string) => string
}) => {
  const { solution } = task
  const isSameShape =
    solution != null &&
    typeof solution === 'object' &&
    solution.type === 'calculateByImage'
  const model = parseCalculateByImage(task.description, translate)

  if (isSameShape) {
    const solved = parseCalculateByImage(
      solution as unknown as CalculateByImageTask['description'],
      translate,
    )
    return (
      <div className={styles.root} data-template-id="calculateByImage.solution">
        <Condition task={task} model={model} deps={deps} />
        <ItemBoard
          zone={solved.preplaced}
          pool={[]}
          capacity={solved.capacity}
          zonePicture={model.zonePicture}
          labels={labelsFrom(deps)}
        />
      </div>
    )
  }

  return (
    <div className={styles.root} data-template-id="calculateByImage.solution">
      <Condition task={task} model={model} deps={deps} />
      <SharedSolutionBody solution={task.solution} deps={deps} />
    </div>
  )
}

/** Pupil puts items into the zone; the zone content is the answer. */
export const createCalculateByImageTemplate = ({ id }: { id: string }) => {
  const Template = ({
    task,
    deps,
    answer,
    onChange,
  }: TaskComponentProps<CalculateByImageTask>) => {
    const translate = (value: Translation | string) =>
      deps.global.translateTasks(value)

    if (isActiveSolution(task.solution)) {
      return (
        <CalculateByImageSolution
          task={task}
          deps={deps}
          translate={translate}
        />
      )
    }

    const model = parseCalculateByImage(task.description, translate)
    const stored = decodeZone(answer)
    const zone = stored ? zoneFromIndexes(stored, model) : model.preplaced
    const commit = (next: PoolItem[]) =>
      onChange(next.length > 0 ? encodeZone(next) : '')

    return (
      <div className={styles.root} data-template-id={id}>
        <Condition task={task} model={model} deps={deps} />
        <ItemBoard
          zone={zone}
          pool={model.pool}
          capacity={model.capacity}
          zonePicture={model.zonePicture}
          labels={labelsFrom(deps)}
          onAdd={(item) => commit([...zone, item])}
          onRemove={(index) => commit(zone.filter((_, i) => i !== index))}
        />
        {model.textAfter ? (
          <MathText className={styles.text}>{model.textAfter}</MathText>
        ) : null}
      </div>
    )
  }

  Template.displayName = id

  return Template
}

const adornment = (
  value: string | Translation | undefined,
  translate: (value: Translation | string) => string,
): string => {
  if (value == null) return ''
  if (isTranslation(value)) return translate(value)
  return typeof value === 'string' ? value : ''
}

/**
 * Items are a counting aid; the answer is the number in the field
 * (`answer` is an integer). The zone lives in local state and is not sent.
 */
export const createCalculateByImageWithCellTemplate = ({
  id,
}: {
  id: string
}) => {
  const Template = ({
    task,
    deps,
    answer,
    onChange,
    mathInput,
  }: TaskComponentProps<CalculateByImageTask>) => {
    const translate = (value: Translation | string) =>
      deps.global.translateTasks(value)
    const model = parseCalculateByImage(task.description, translate)
    const [zone, setZone] = useState<PoolItem[]>(model.preplaced)

    if (isActiveSolution(task.solution)) {
      return (
        <CalculateByImageSolution
          task={task}
          deps={deps}
          translate={translate}
        />
      )
    }

    const canChange = !task.description.withoutRemoveItem
    const prefix = adornment(task.answerInput?.before, translate)
    const suffix = adornment(task.answerInput?.after, translate)

    /*
     * «Раздайте кроликам по одной морковке» (Task_0_3_11_6, 0_3_11_7): the
     * zone holds `constItem`s (rabbit without carrot), the row holds the
     * same thing «after» (rabbit with carrot). A tap in the row turns the
     * next «before» into «after», a tap in the zone turns it back. Read from
     * the field names; not yet compared with the old screen.
     */
    const constItem = task.description.constItem as
      | { id?: unknown }
      | null
      | undefined
    const constKey = constItem ? JSON.stringify(constItem.id) : null
    const isBefore = (item: PoolItem) => JSON.stringify(item.id) === constKey
    const firstBefore = zone.findIndex(isBefore)
    const transforms = constKey != null && model.preplaced.some(isBefore)

    const add = (item: PoolItem) => {
      if (!transforms) return setZone([...zone, item])
      if (firstBefore < 0) return
      setZone(zone.map((it, i) => (i === firstBefore ? item : it)))
    }
    const remove = (index: number) => {
      if (!transforms) return setZone(zone.filter((_, i) => i !== index))
      const before = model.preplaced.find(isBefore)
      if (!before || isBefore(zone[index])) return
      setZone(zone.map((it, i) => (i === index ? before : it)))
    }

    return (
      <div className={styles.root} data-template-id={id}>
        <Condition task={task} model={model} deps={deps} />
        <div className={styles.answer}>
          <ItemBoard
            zone={zone}
            pool={canChange ? model.pool : []}
            capacity={transforms ? Infinity : model.capacity}
            canAdd={transforms ? firstBefore >= 0 : undefined}
            zonePicture={model.zonePicture}
            labels={labelsFrom(deps)}
            onAdd={canChange ? add : undefined}
            onRemove={canChange ? remove : undefined}
          />
          {model.textAfter ? (
            <MathText className={styles.text}>{model.textAfter}</MathText>
          ) : null}
          <div className={styles.field}>
            {prefix ? <TextAdornment value={prefix} /> : null}
            <MathInput
              ref={(ref) => setMathInputRef(ref, mathInput)}
              formula={answer}
              onMathFieldChanged={onChange}
              className={styles.input}
            />
            {suffix ? <TextAdornment value={suffix} /> : null}
          </div>
        </div>
      </div>
    )
  }

  Template.displayName = id

  return Template
}
