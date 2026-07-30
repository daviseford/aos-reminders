// @vitest-environment node

import path from 'path'
import { loadConfigFromFile } from 'vite'
import { describe, expect, it } from 'vitest'

describe('Vite development server', () => {
  it('ignores nested worktree output', async () => {
    const loaded = await loadConfigFromFile(
      { command: 'serve', mode: 'development' },
      path.resolve(process.cwd(), 'vite.config.mts')
    )

    expect(loaded?.config.server?.watch?.ignored).toEqual(
      expect.arrayContaining(['**/.worktrees/**', '**/.claude/worktrees/**'])
    )
  })
})
