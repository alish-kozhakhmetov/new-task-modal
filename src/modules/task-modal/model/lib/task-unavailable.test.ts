import { describe, expect, it, vi } from 'vitest'

import { isTemplateMapReady } from '@/modules/tasks/model/component/get-task-component'
import type { Task } from '@/types/api/task'

import type { TaskModalProps } from '../types/props'

import {
  canOpenInOldWindow,
  isTaskUnavailable,
  openInOldWindow,
} from './task-unavailable'

const task = (type: string) => ({ id: type, type }) as unknown as Task

const mapLoaded = () =>
  vi.waitFor(() => expect(isTemplateMapReady()).toBe(true))

describe('isTaskUnavailable', () => {
  it('a generator without a template, no old screen from the host', async () => {
    await mapLoaded()
    // lesson 2205 «Тенге», calculateByImage — no template in the package
    expect(isTaskUnavailable(task('Elixir.Task_4_6_6_8'), {})).toBe(true)
  })

  it('a task with a template is drawn', async () => {
    await mapLoaded()
    expect(isTaskUnavailable(task('Elixir.Task_4_1_70'), {})).toBe(false)
  })

  it('the host mounts its old screen inside: not this state', async () => {
    await mapLoaded()
    const renderLegacyTask = vi.fn()
    expect(
      isTaskUnavailable(task('Elixir.Task_4_6_6_8'), { renderLegacyTask }),
    ).toBe(false)
  })
})

const hostProps = (search: string) => {
  const replace = vi.fn()
  const props = {
    hostProps: { location: { search }, history: { replace } },
  } as unknown as Pick<TaskModalProps, 'hostProps'>
  return { props, replace }
}

describe('openInOldWindow', () => {
  it('asks the host for the old window, keeping the address', () => {
    const { props, replace } = hostProps('?lessonId=2205&taskIndex=4')
    expect(canOpenInOldWindow(props)).toBe(true)

    openInOldWindow(props)

    expect(replace).toHaveBeenCalledWith({
      search: 'lessonId=2205&taskIndex=4&old=true',
    })
  })

  it('no router from the host — no such button', () => {
    const props = { hostProps: {} } as unknown as Pick<
      TaskModalProps,
      'hostProps'
    >
    expect(canOpenInOldWindow(props)).toBe(false)
  })
})
