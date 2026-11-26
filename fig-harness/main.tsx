// Local render harness for FIG (not committed): one fixture task per page.
import '../.storybook/mathquill-bootstrap'
import '@/styles/_index.scss'

import { MathJaxContext } from 'better-react-mathjax'
import { useEffect, useState, type ComponentType } from 'react'
import { createRoot } from 'react-dom/client'

import { injectFonts } from '@/modules/task-modal/model/lib/fonts/inject-fonts'
import { MATH_JAX_CONFIG } from '@/modules/task-modal/providers'
import { TEMPLATE_MAP } from '@/modules/tasks/model/template-map'
import fixtures from '@/modules/tasks/ui/templates/complex/shared/figures/data/figure-parts.fixtures.json'
import testFixtures from '@/modules/tasks/ui/templates/test/shared/data/test-figures.fixtures.json'
import { makeTaskModalDeps } from '@/modules/tasks/ui/templates/shared/testing/make-task-modal-deps'

injectFonts()
const params = new URLSearchParams(location.search)
const id = params.get('id') ?? 'Task_6_5_27_2'
const width = Number(params.get('w') ?? 640)
const set = params.get('set') === 'test' ? (testFixtures as any).tasks.map((t: any) => ({ ...t, template: 'test.plain' })) : (fixtures as any).tasks
const fx = set.find((t: any) => t.id === id)

const App = () => {
  const [T, setT] = useState<ComponentType<any> | null>(null)
  const [answer, setAnswer] = useState('')
  useEffect(() => {
    void (TEMPLATE_MAP as any)[fx.template]().then((m: any) => setT(() => m.default))
  }, [])
  if (!fx) return <p>no fixture {id}</p>
  return (
    <MathJaxContext config={MATH_JAX_CONFIG}>
      <div id="shot" style={{ width, padding: 16, boxSizing: 'border-box', background: 'var(--bg-surface)' }}>
        {T ? (
          <T task={fx.task} deps={makeTaskModalDeps()} answer={answer} onChange={setAnswer} mathInput={{ current: new Map() }} />
        ) : null}
      </div>
    </MathJaxContext>
  )
}
createRoot(document.getElementById('root')!).render(<App />)
