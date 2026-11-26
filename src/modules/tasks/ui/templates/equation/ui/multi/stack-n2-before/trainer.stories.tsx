import type { Meta } from '@storybook/react-vite'

import {
  getGroupControlOptions,
  makeInTrainerCorrectStory,
  makeInTrainerWrongAnswerStory,
  makeInTrainerShowAnswerStory,
  type TemplateGroupFixture,
  type EquationStoryMetaArgs,
  type AllTasksFile,
  exampleFromTask,
  trainerFolderDocsParameters,
} from '../../../shared/lib/storybook'
import type { EquationTask as Task } from '../../../shared/lib/types.task'

import allTasksJson from './data/all-tasks.json'
import groupsJson from './data/groups.json'
import fixture from './data/task.json'

import { EquationMultiStackN2Before as Template } from '.'

const task = fixture as unknown as Task
const groups = groupsJson as unknown as TemplateGroupFixture[]
const { groupIds, defaultGroup } = getGroupControlOptions(groups)
const ROOT_TITLE = 'Templates/Equation/multi/stack-n2-before'

const meta = {
  title: 'Templates/Equation/multi/stack-n2-before/Trainer',
  component: Template,
  parameters: {
    ...trainerFolderDocsParameters(exampleFromTask(task, ROOT_TITLE)),
  },
  args: {
    group: defaultGroup,
  },
  argTypes: {
    group: {
      control: 'select',
      options: groupIds,
      description: 'Пример из data/groups.json',
    },
  },
} satisfies Meta<EquationStoryMetaArgs>

export default meta

export const Correct = makeInTrainerCorrectStory({
  Template,
  groups,
  fallbackTask: task,
  allTasks: allTasksJson as unknown as AllTasksFile,
  rootTitle: ROOT_TITLE,
})

export const WrongAnswer = makeInTrainerWrongAnswerStory({
  Template,
  groups,
  fallbackTask: task,
  rootTitle: ROOT_TITLE,
})

export const ShowAnswer = makeInTrainerShowAnswerStory({
  Template,
  groups,
  fallbackTask: task,
  rootTitle: ROOT_TITLE,
})
