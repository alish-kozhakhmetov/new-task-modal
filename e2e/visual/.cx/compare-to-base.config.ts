/**
 * Stream CX, not for commit: the package's visual config, compared against the
 * snapshots a clean 2.5.8 worktree (ntm-cx-base) just took of the same stories.
 */
import { defineConfig } from '@playwright/test'

import base from '../playwright.config'

export default defineConfig({
  ...base,
  testDir: '..',
  snapshotPathTemplate:
    '/Users/alisher/Documents/Projects/qalan/ntm-cx-base/e2e/visual/__screenshots__/{testFileName}/{arg}{ext}',
  outputDir: '/Users/alisher/Documents/Projects/qalan/ntm-cx/.cx-local/visual-out',
})
