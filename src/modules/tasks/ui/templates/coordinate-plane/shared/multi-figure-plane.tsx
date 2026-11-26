import { useState } from 'react'

import type { TaskModalDependencies } from '@/modules/task-modal/model/types/props'
import { Button, ButtonColor } from '@/ui/button/button'

import type { PlaneMode } from '../lib/drawing-figure'
import {
  FIGURE_NAMES,
  PANEL_WORDS,
  fromMultiAnswer,
  isFinished,
  toMultiAnswer,
  type MultiDraft,
} from '../lib/multi-figure'
import type { CoordinatePlaneFigure } from '../lib/types.task'

import styles from './coordinate-plane.module.scss'
import { InteractivePlane } from './interactive-plane'

type MultiMode = Extract<PlaneMode, { kind: 'multi' }>

interface Props {
  figure: CoordinatePlaneFigure
  mode: MultiMode
  answer: string
  onChange: (answer: string) => void
  deps: TaskModalDependencies
  readOnly: boolean
  label?: string
  clearLabel: string
}

/**
 * Several figures on one plane: the plane takes the clicks for the active
 * figure, the panel under it switches figures, adds one, deletes the active
 * one and clears all (DrawingFigureList.jsx of the old window, on the
 * package's buttons). A figure is added only when every figure is finished:
 * an empty figure is never an answer. On a plane to shade (canFill),
 * «Закрасить» turns the clicks into the filling point — half a cell apart,
 * as a region between lines can be narrower than a cell (Task_7_3_50_1) —
 * and the region it is in is hatched.
 */
export const MultiFigurePlane = ({
  figure,
  mode,
  answer,
  onChange,
  deps,
  readOnly,
  label,
  clearLabel,
}: Props) => {
  const [draft, setDraft] = useState<MultiDraft>(() =>
    fromMultiAnswer(answer, mode),
  )
  // The store's answer changed from outside (a reset): start again from it.
  const [seen, setSeen] = useState(answer)
  if (answer !== seen) {
    setSeen(answer)
    setDraft(fromMultiAnswer(answer, mode))
  }
  // the fill tool (scenario F): the clicks mark the region, not a figure
  const [filling, setFilling] = useState(false)
  const t = (v: { rus: string; kaz: string; eng: string }) =>
    String(deps.global.translateTasks(v))

  const update = (next: MultiDraft) => {
    const value = toMultiAnswer(next)
    setDraft(next)
    setSeen(value)
    if (value !== answer) onChange(value)
  }

  const fills = draft.fills ?? []
  const active = filling ? undefined : draft.figures[draft.active]
  const allFinished = draft.figures.every(isFinished)
  const canFill = mode.fill && draft.figures.length > 0 && allFinished
  const add = (type: number) => {
    setFilling(false)
    update({
      ...draft,
      figures: [...draft.figures, { type, points: [] }],
      active: draft.figures.length,
    })
  }
  const remove = () => {
    const figures = draft.figures.filter((_, i) => i !== draft.active)
    update({ ...draft, figures, active: figures.length - 1 })
  }
  const select = (i: number) => {
    setFilling(false)
    update({ ...draft, active: i })
  }
  const name = (type: number) =>
    FIGURE_NAMES[type] ? t(FIGURE_NAMES[type]) : ''

  return (
    <>
      <div className={styles.planeWrap}>
        <InteractivePlane
          figure={figure}
          mode={
            filling
              ? { kind: 'point' }
              : active
                ? { kind: 'figure', figureType: active.type }
                : { kind: 'unsupported', reason: 'choose' }
          }
          draft={{ points: filling ? fills : (active?.points ?? []) }}
          others={draft.figures.filter((f) => f !== active)}
          shade={
            mode.fill && fills.length
              ? {
                  figures: draft.figures,
                  at: fills[0],
                  byAxes: Boolean(figure.isFillingLimitedByAxis),
                }
              : undefined
          }
          halfStep={filling}
          deps={deps}
          readOnly={readOnly || (!active && !filling)}
          label={label}
          onDraftChange={(next) =>
            filling
              ? update({ ...draft, fills: next.points })
              : update({
                  ...draft,
                  figures: draft.figures.map((f, i) =>
                    i === draft.active ? { ...f, points: next.points } : f,
                  ),
                })
          }
        />
      </div>
      {readOnly ? null : (
        <div className={styles.panel} data-testid="coordinate-plane-figures">
          {draft.figures.length ? (
            <div className={styles.tools}>
              {draft.figures.map((f, i) => (
                <Button
                  // eslint-disable-next-line react-x/no-array-index-key -- a figure is its place in the list: the pupil's order is the answer's
                  key={i}
                  color={f === active ? ButtonColor.Blue : ButtonColor.Gray}
                  aria-pressed={f === active}
                  onClick={() => select(i)}
                  data-testid="coordinate-plane-figure"
                >
                  {`${name(f.type)} ${i + 1}`}
                </Button>
              ))}
            </div>
          ) : (
            <p className={styles.notice}>{t(PANEL_WORDS.choose)}</p>
          )}
          <div className={styles.tools}>
            {mode.fill ? (
              <Button
                color={filling ? ButtonColor.Blue : ButtonColor.Gray}
                aria-pressed={filling}
                disabled={!canFill}
                onClick={() => setFilling(!filling)}
                data-testid="coordinate-plane-fill"
              >
                {t(PANEL_WORDS.fill)}
              </Button>
            ) : null}
            {(mode.many || !draft.figures.length ? mode.choices : []).map(
              (type) => (
                <Button
                  key={type}
                  color={ButtonColor.Gray}
                  disabled={!allFinished}
                  onClick={() => add(type)}
                  data-testid={`coordinate-plane-add-${type}`}
                >
                  {mode.fixed == null
                    ? `+ ${name(type)}`
                    : `+ ${t(PANEL_WORDS.add)}`}
                </Button>
              ),
            )}
            <Button
              color={ButtonColor.Gray}
              disabled={!active}
              onClick={remove}
              data-testid="coordinate-plane-remove"
            >
              {t(PANEL_WORDS.remove)}
            </Button>
            <Button
              color={ButtonColor.Gray}
              disabled={!draft.figures.some((f) => f.points.length)}
              onClick={() => {
                setFilling(false)
                update(fromMultiAnswer('', mode))
              }}
              data-testid="coordinate-plane-clear"
            >
              {clearLabel}
            </Button>
          </div>
        </div>
      )}
    </>
  )
}
