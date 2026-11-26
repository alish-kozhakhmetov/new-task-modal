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
 * an empty figure is never an answer.
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
  const t = (v: { rus: string; kaz: string; eng: string }) =>
    String(deps.global.translateTasks(v))

  const update = (next: MultiDraft) => {
    const value = toMultiAnswer(next)
    setDraft(next)
    setSeen(value)
    if (value !== answer) onChange(value)
  }

  const active = draft.figures[draft.active]
  const allFinished = draft.figures.every(isFinished)
  const add = (type: number) =>
    update({
      figures: [...draft.figures, { type, points: [] }],
      active: draft.figures.length,
    })
  const remove = () => {
    const figures = draft.figures.filter((_, i) => i !== draft.active)
    update({ figures, active: figures.length - 1 })
  }
  const name = (type: number) =>
    FIGURE_NAMES[type] ? t(FIGURE_NAMES[type]) : ''

  return (
    <>
      <div className={styles.planeWrap}>
        <InteractivePlane
          figure={figure}
          mode={
            active
              ? { kind: 'figure', figureType: active.type }
              : { kind: 'unsupported', reason: 'choose' }
          }
          draft={{ points: active?.points ?? [] }}
          others={draft.figures.filter((_, i) => i !== draft.active)}
          deps={deps}
          readOnly={readOnly || !active}
          label={label}
          onDraftChange={(next) =>
            update({
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
                  color={
                    i === draft.active ? ButtonColor.Blue : ButtonColor.Gray
                  }
                  aria-pressed={i === draft.active}
                  onClick={() => update({ ...draft, active: i })}
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
            {mode.choices.map((type) => (
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
            ))}
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
              onClick={() => update(fromMultiAnswer('', mode))}
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
