'use client'

import clsx from 'clsx'
import type React from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'

import DeleteIcon from '@/assets/icons/calc/delete.svg'
import BackIcon from '@/assets/icons/canvas/back.svg'
import EditIcon from '@/assets/icons/canvas/edit.svg'
import EraserIcon from '@/assets/icons/canvas/eraser.svg'
import ForwardIcon from '@/assets/icons/canvas/forward.svg'
import CloseIcon from '@/assets/icons/close.svg'
import { taskT } from '@/lib/helpers/pupil-text'
import type { Global } from '@/types/global'

import styles from './canvas.module.scss'

type DrawingMode = 'draw' | 'erase'

interface Point {
  x: number
  y: number
}

interface CanvasProps {
  onClose: () => void
  /** Draft belongs to one task (Alisher, 05.10): pass the task id. */
  taskId?: string | number | null
  /**
   * Permanent column of the wide layout: never closed, so the drawing is
   * saved after every stroke instead of on «Закрыть», and there is no close.
   */
  isPinned?: boolean
  /** The host's translate: the buttons' names in the pupil's language. */
  global?: Partial<Pick<Global, 'translate'>>
}

const STORAGE_PREFIX = 'drawing-board-data'

export const canvasStorageKey = (taskId?: string | number | null) =>
  taskId == null || taskId === ''
    ? STORAGE_PREFIX
    : `${STORAGE_PREFIX}:${taskId}`

export function Canvas({
  onClose,
  taskId,
  isPinned = false,
  global,
}: CanvasProps) {
  const t = taskT(global)
  const STORAGE_KEY = canvasStorageKey(taskId)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const isDrawingRef = useRef(false)
  const [mode, setMode] = useState<DrawingMode>('draw')
  const [history, setHistory] = useState<ImageData[]>([])
  const [historyStep, setHistoryStep] = useState(-1)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // On the phone the board is a fixed sheet the size of the window. In the
    // wide layout it is a column (its frame is not fixed): the bitmap takes the
    // column's size, or a window-sized canvas would overflow it.
    const frame = canvas.parentElement
    const column =
      frame && getComputedStyle(frame).position !== 'fixed'
        ? frame.getBoundingClientRect()
        : null
    canvas.width = column ? Math.round(column.width) : window.innerWidth
    canvas.height = column ? Math.round(column.height) : window.innerHeight

    const savedData = localStorage.getItem(STORAGE_KEY)
    if (savedData) {
      const img = new Image()
      img.onload = () => {
        ctx.drawImage(img, 0, 0)
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        setHistory([imageData])
        setHistoryStep(0)
      }
      img.src = savedData
    } else {
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      setHistory([imageData])
      setHistoryStep(0)
    }
  }, [STORAGE_KEY])

  const saveToLocalStorage = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const dataUrl = canvas.toDataURL('image/png')
    localStorage.setItem(STORAGE_KEY, dataUrl)
  }, [STORAGE_KEY])

  const handleClose = useCallback(() => {
    saveToLocalStorage()
    onClose()
  }, [saveToLocalStorage, onClose])

  const saveState = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const newHistory = history.slice(0, historyStep + 1)
    newHistory.push(imageData)
    setHistory(newHistory)
    setHistoryStep(newHistory.length - 1)
  }, [history, historyStep])

  const getCoordinates = (e: React.TouchEvent | React.MouseEvent): Point => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }

    const rect = canvas.getBoundingClientRect()

    if ('touches' in e) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      }
    }

    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    }
  }

  const startDrawing = (e: React.TouchEvent | React.MouseEvent) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const { x, y } = getCoordinates(e)

    isDrawingRef.current = true
    ctx.beginPath()
    ctx.moveTo(x, y)

    if (mode === 'draw') {
      ctx.globalCompositeOperation = 'source-over'
      // --canvas-ink: white over the dimmed task, dark in the light column
      ctx.strokeStyle =
        getComputedStyle(canvas).getPropertyValue('--canvas-ink').trim() ||
        'black'
      ctx.lineWidth = 3
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
    } else {
      ctx.globalCompositeOperation = 'destination-out'
      ctx.lineWidth = 50
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
    }
  }

  const draw = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDrawingRef.current) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const { x, y } = getCoordinates(e)
    ctx.lineTo(x, y)
    ctx.stroke()
  }

  const stopDrawing = () => {
    if (isDrawingRef.current) {
      isDrawingRef.current = false
      saveState()
      if (isPinned) saveToLocalStorage()
    }
  }

  const undo = () => {
    if (historyStep <= 0) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const newStep = historyStep - 1
    ctx.putImageData(history[newStep], 0, 0)
    setHistoryStep(newStep)
  }

  const redo = () => {
    if (historyStep >= history.length - 1) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const newStep = historyStep + 1
    ctx.putImageData(history[newStep], 0, 0)
    setHistoryStep(newStep)
  }

  const clearBoard = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    saveState()
  }

  return (
    <>
      <div className={styles.container}>
        {/* Seen only as a column of the wide layout: an empty white strip
            without a name reads as a broken page. */}
        <p className={styles.title}>Черновик</p>
        <canvas
          ref={canvasRef}
          className={styles.canvas}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />

        <div className={styles.controlPanel}>
          <div className={clsx(styles.controls, isPinned && styles.pinned)}>
            <div className={clsx(styles.group, styles.edit)}>
              <button
                className={clsx(
                  styles.button,
                  mode === 'draw' && styles.active,
                )}
                onClick={() => setMode('draw')}
                title={t('draw')}
              >
                <EditIcon />
              </button>
              <button
                className={clsx(
                  styles.button,
                  mode === 'erase' && styles.active,
                )}
                onClick={() => setMode('erase')}
                title={t('eraser')}
              >
                <EraserIcon />
              </button>
            </div>

            <div className={clsx(styles.group, styles.history)}>
              <button
                className={styles.button}
                onClick={undo}
                disabled={historyStep <= 0}
                title={t('back')}
              >
                <BackIcon />
              </button>
              <button
                className={styles.button}
                onClick={redo}
                disabled={historyStep >= history.length - 1}
                title={t('forward')}
              >
                <ForwardIcon />
              </button>

              <button
                className={styles.button}
                onClick={clearBoard}
                title={t('clearAll')}
              >
                <DeleteIcon />
              </button>
            </div>

            {!isPinned && (
              <div className={clsx(styles.group, styles.close)}>
                <button
                  className={styles.button}
                  onClick={handleClose}
                  title={t('closeDraft')}
                >
                  <CloseIcon />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
