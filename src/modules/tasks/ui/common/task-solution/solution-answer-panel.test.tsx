import { render, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import { describe, expect, it, vi } from 'vitest'

import type { TaskModalDependencies } from '@/modules/task-modal/model/types/props'
import { makeTaskModalDeps } from '@/modules/tasks/ui/templates/shared/testing/make-task-modal-deps'

import { SolutionAnswerPanel } from './solution-answer-panel'
import { SolutionExplanation } from './solution-explanation'

// jsdom has no MathJax: the formula is its source text.
vi.mock('better-react-mathjax', () => ({
  MathJax: ({
    children,
    className,
  }: {
    children: ReactNode
    className?: string
  }) => <span className={className}>{children}</span>,
}))

/** The host's translate in a Kazakh lesson: the `kaz` field of the object. */
const kazakhDeps = (): TaskModalDependencies => {
  const deps = makeTaskModalDeps()
  return {
    ...deps,
    global: {
      ...deps.global,
      translate: (value: unknown) =>
        typeof value === 'object' && value !== null
          ? ((value as Record<string, string>).kaz ?? '')
          : String(value),
    },
  } as TaskModalDependencies
}

describe('SolutionAnswerPanel labels in the pupil language (2.5.7)', () => {
  it('reads Kazakh in a Kazakh lesson', () => {
    render(
      <SolutionAnswerPanel
        userAnswer="50068"
        correctAnswer="80011"
        deps={kazakhDeps()}
      />,
    )

    expect(screen.getByText('Сіздің жауабыңыз:')).toBeInTheDocument()
    expect(screen.getByText('Дұрыс жауап:')).toBeInTheDocument()
    expect(screen.queryByText('Ваш ответ:')).not.toBeInTheDocument()
    expect(screen.queryByText('Правильный ответ:')).not.toBeInTheDocument()
  })

  it('keeps Russian without a host translate', () => {
    render(
      <SolutionAnswerPanel
        userAnswer="50068"
        correctAnswer="80011"
        deps={makeTaskModalDeps()}
      />,
    )

    expect(screen.getByText('Ваш ответ:')).toBeInTheDocument()
    expect(screen.getByText('Правильный ответ:')).toBeInTheDocument()
  })
})

describe('SolutionExplanation title in the pupil language (2.5.7)', () => {
  it('reads «Түсіндірме» in a Kazakh lesson', () => {
    render(<SolutionExplanation solution="\(2+2=4\)" deps={kazakhDeps()} />)
    expect(screen.getByText('Түсіндірме')).toBeInTheDocument()
  })
})
