// Local static build of the CP prototype (not committed): the package's config,
// with StatsPanel stubbed — ../matheducator/reactjs_client has no
// src/common/StatsPanel.jsx on its current branch, and the build stops on it.
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import type { StorybookConfig } from '@storybook/react-vite'

import base from '../.storybook/main'

const here = path.dirname(fileURLToPath(import.meta.url))

const config: StorybookConfig = {
  ...base,
  addons: (base.addons ?? []).map((a) =>
    a === './addon-test-runner/preset.ts' ? '../.storybook/addon-test-runner/preset.ts' : a,
  ),
  async viteFinal(config, options) {
    const merged = await base.viteFinal!(config, options)
    const stub = path.resolve(here, 'stats-panel-stub.jsx')
    const alias = merged.resolve?.alias as unknown
    if (Array.isArray(alias)) {
      for (const a of alias as { find: unknown; replacement: string }[])
        if (a.find === '@matheducator/StatsPanel') a.replacement = stub
    } else if (alias && typeof alias === 'object') {
      ;(alias as Record<string, string>)['@matheducator/StatsPanel'] = stub
    }
    return merged
  },
}
export default config
