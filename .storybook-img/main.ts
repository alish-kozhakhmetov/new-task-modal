// Temporary build-only config: matheducator master has no StatsPanel.jsx,
// so the statistics docs page gets a stub. Everything else is the package config.
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import type { StorybookConfig } from '@storybook/react-vite'

import base from '../.storybook/main'

const dirname = path.dirname(fileURLToPath(import.meta.url))

const config: StorybookConfig = {
  ...base,
  addons: (base.addons as string[]).map((a) =>
    a.startsWith('./') ? path.resolve(dirname, '../.storybook', a) : a,
  ),
  async viteFinal(cfg, opts) {
    const merged = await base.viteFinal!(cfg, opts)
    const alias = merged.resolve?.alias as Record<string, string>
    alias['@matheducator/StatsPanel'] = path.resolve(dirname, 'stats-panel-stub.jsx')
    return merged
  },
}
export default config
