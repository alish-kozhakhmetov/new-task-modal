import { useState } from 'react'

import type { TaskModalDependencies } from '@/modules/task-modal/model/types/props'
import { setMathInputRef } from '@/modules/tasks/lib/set-math-input-ref'
import {
  isActiveSolution,
  type TaskSolutionValue,
} from '@/modules/tasks/lib/solution-types'
import type { TaskComponentProps } from '@/modules/tasks/model/types'
import { SharedSolutionBody } from '@/modules/tasks/ui/common/task-solution/shared-solution-body'
import { TaskTitle } from '@/modules/tasks/ui/common/task-title/task-title'
import type { Translation } from '@/types/api/task'
import { MathInput } from '@/ui/math-input/math-input'
import { MathText } from '@/ui/math-text/math-text'

import { TablePart } from '../../complex/shared/figures/table-part'
import { TextAdornment } from '../../text/shared/text-adornment'
import styles from '../shared/calculate-by-image.module.scss'
import { ItemBoard, type ZoneEntry } from '../shared/item-board'

import {
  decodeZone,
  encodeZone,
  parseCalculateByImage,
  toText,
  type CalculateByImageModel,
  type PoolItem,
} from './parse-calculate-by-image'
import type {
  CalculateByImageDescription,
  CalculateByImageTask,
} from './types.task'
import { isFieldDue, withCellMode } from './with-cell-rules'

type Translate = (value: Translation | string) => string

/*
 * The host dictionary has no keys for these yet; Russian is the fallback, as
 * in the test template.
 */
const labelsFrom = (deps: TaskModalDependencies) => {
  const localize = deps.localize as unknown as
    | Record<string, string>
    | undefined
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
    {model.tableBefore ? (
      <TablePart part={model.tableBefore} deps={deps} />
    ) : null}
    {model.imageBefore ? (
      <div
        className={styles.imageBefore}
        dangerouslySetInnerHTML={{ __html: model.imageBefore }}
      />
    ) : null}
  </div>
)

const boardProps = (model: CalculateByImageModel) => ({
  layout: model.layout,
  separator: model.separator,
  perRow: model.perRow,
  zonePicture: model.zonePicture,
  placement: model.placement,
})

/** Rebuild the zone from stored indexes, so a reset store empties it. */
const zoneFromIndexes = (
  indexes: number[],
  model: CalculateByImageModel,
): PoolItem[] =>
  indexes
    .map((index) => model.catalog[index])
    .filter((item): item is PoolItem => item != null)

/*
 * `solution` often comes back as the same calculateByImage description with
 * the right set in `items` (Task_0_1_38_9, 0_10_5_2) — then show that set in
 * the zone; otherwise the shared explanation body.
 */
const CalculateByImageSolution = ({
  task,
  deps,
  translate,
}: {
  task: CalculateByImageTask
  deps: TaskModalDependencies
  translate: Translate
}) => {
  const solution = task.solution as unknown
  const model = parseCalculateByImage(task.description, translate)
  const isSameShape =
    solution != null &&
    typeof solution === 'object' &&
    (solution as { type?: unknown }).type === 'calculateByImage' &&
    Array.isArray((solution as { items?: unknown }).items)

  if (isSameShape) {
    const solved = parseCalculateByImage(
      solution as CalculateByImageDescription,
      translate,
    )
    return (
      <div className={styles.root} data-template-id="calculateByImage.solution">
        <Condition task={task} model={model} deps={deps} />
        <ItemBoard
          {...boardProps(model)}
          zone={solved.preplaced.map((item) => ({ item, removable: false }))}
          pool={[]}
          canAdd={false}
          labels={labelsFrom(deps)}
        />
      </div>
    )
  }

  return (
    <div className={styles.root} data-template-id="calculateByImage.solution">
      <Condition task={task} model={model} deps={deps} />
      <SharedSolutionBody
        solution={task.solution as TaskSolutionValue}
        deps={deps}
      />
    </div>
  )
}

/**
 * Pupil puts items into the zone; the zone content is the answer.
 * Items that were there from the start stay (the old screen's trash button
 * removes only the pupil's own); the row is a source, or — with
 * `isChangable` — every item in it can be taken once.
 */
export const createCalculateByImageTemplate = ({ id }: { id: string }) => {
  const Template = ({
    task,
    deps,
    answer,
    onChange,
  }: TaskComponentProps<CalculateByImageTask>) => {
    const translate: Translate = (value) => deps.global.translateTasks(value)

    if (isActiveSolution(task.solution as TaskSolutionValue)) {
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
    const lockedCount = model.preplaced.length
    const commit = (next: PoolItem[]) =>
      onChange(next.length > lockedCount ? encodeZone(next) : '')
    const taken = model.oneTime
      ? new Set(zone.slice(lockedCount).map((item) => item.index))
      : undefined

    return (
      <div className={styles.root} data-template-id={id}>
        <Condition task={task} model={model} deps={deps} />
        <ItemBoard
          {...boardProps(model)}
          zone={zone.map((item, index) => ({
            item,
            removable: index >= lockedCount,
          }))}
          pool={model.pool}
          taken={taken}
          canAdd={zone.length < model.capacity}
          labels={labelsFrom(deps)}
          onAdd={(item) => commit([...zone, item])}
          onRemove={(index) => commit(zone.filter((_, i) => i !== index))}
        />
        {model.tableAfter ? (
          <TablePart part={model.tableAfter} deps={deps} />
        ) : null}
        {model.textAfter ? (
          <MathText className={styles.text}>{model.textAfter}</MathText>
        ) : null}
      </div>
    )
  }

  Template.displayName = id

  return Template
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
    const translate: Translate = (value) => deps.global.translateTasks(value)
    const { description } = task
    const model = parseCalculateByImage(description, translate)
    const mode = withCellMode(description, model)
    const [zone, setZone] = useState<PoolItem[]>(model.preplaced)
    const [taps, setTaps] = useState(0)
    const [fieldShown, setFieldShown] = useState(() =>
      isFieldDue(description, 0, model.preplaced.length),
    )

    if (isActiveSolution(task.solution as TaskSolutionValue)) {
      return (
        <CalculateByImageSolution
          task={task}
          deps={deps}
          translate={translate}
        />
      )
    }

    const update = (next: PoolItem[], nextTaps: number) => {
      setZone(next)
      setTaps(nextTaps)
      if (!fieldShown && isFieldDue(description, nextTaps, next.length)) {
        setFieldShown(true)
      }
    }

    const constKey = description.constItem
      ? JSON.stringify(description.constItem.id)
      : null
    const isBefore = (item: PoolItem) => JSON.stringify(item.id) === constKey
    const firstBefore = zone.findIndex(isBefore)
    const before = model.preplaced.find(isBefore)
    const lockedCount = mode === 'add' ? model.preplaced.length : 0
    const tapLimit = Number(description.itemsMaxQuantity) || 0

    const add = (item: PoolItem) => {
      if (mode === 'transform') {
        if (firstBefore < 0) return
        update(
          zone.map((it, i) => (i === firstBefore ? item : it)),
          taps + 1,
        )
        return
      }
      update([...zone, item], taps + 1)
    }

    const remove = (index: number) => {
      if (mode === 'transform') {
        if (!before || isBefore(zone[index])) return
        update(
          zone.map((it, i) => (i === index ? before : it)),
          Math.max(0, taps - 1),
        )
        return
      }
      if (mode === 'add') {
        update(
          zone.filter((_, i) => i !== index),
          Math.max(0, taps - 1),
        )
        return
      }
      update(
        zone.filter((_, i) => i !== index),
        taps + 1,
      )
    }

    const canAdd =
      mode === 'transform'
        ? firstBefore >= 0
        : tapLimit === 0 || taps < tapLimit
    const entries: ZoneEntry[] = zone.map((item, index) => ({
      item,
      removable:
        mode === 'transform'
          ? !isBefore(item)
          : mode === 'add'
            ? index >= lockedCount
            : mode === 'remove',
    }))
    const interactive = mode !== 'count'
    const prefix = toText(task.answerInput?.before, translate)
    const suffix = toText(task.answerInput?.after, translate)

    return (
      <div className={styles.root} data-template-id={id}>
        <Condition task={task} model={model} deps={deps} />
        <div className={styles.answer}>
          <ItemBoard
            {...boardProps(model)}
            zone={entries}
            pool={mode === 'add' || mode === 'transform' ? model.pool : []}
            canAdd={canAdd}
            labels={labelsFrom(deps)}
            onAdd={interactive ? add : undefined}
            onRemove={interactive ? remove : undefined}
          />
          {model.tableAfter ? (
            <TablePart part={model.tableAfter} deps={deps} />
          ) : null}
          {fieldShown ? (
            <>
              {model.textAfter ? (
                <MathText className={styles.text}>{model.textAfter}</MathText>
              ) : null}
              <div className={styles.field} data-testid="cbi-field">
                {prefix ? <TextAdornment value={prefix} /> : null}
                <MathInput
                  ref={(ref) => setMathInputRef(ref, mathInput)}
                  formula={answer}
                  onMathFieldChanged={onChange}
                  className={styles.input}
                />
                {suffix ? <TextAdornment value={suffix} /> : null}
              </div>
            </>
          ) : null}
        </div>
      </div>
    )
  }

  Template.displayName = id

  return Template
}
