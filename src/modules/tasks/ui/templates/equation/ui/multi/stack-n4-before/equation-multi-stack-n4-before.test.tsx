import { vi } from 'vitest'

import { describeEquationLayout } from '../../../shared/lib/testing/describe-equation-layout'

import groups from './data/groups.json'

import { EquationMultiStackN4Before as Template } from '.'

vi.mock(
  '@/ui/math-input/math-input',
  () => import('../../../shared/lib/testing/typing-math-input'),
)
vi.mock(
  '@/ui/math-text/math-text',
  () => import('../../../../text/lib/testing/mocks/math-text'),
)
vi.mock(
  '@/ui/math-text/math-formula',
  () => import('../../../../text/lib/testing/mocks/math-formula'),
)

describeEquationLayout(
  'equation.multi.stack.n4.before',
  Template,
  groups as unknown as Parameters<typeof describeEquationLayout>[2],
)
