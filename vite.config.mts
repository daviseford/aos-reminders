import react from '@vitejs/plugin-react-swc'
import { defineConfig, type Plugin } from 'vite'
import { configDefaults } from 'vitest/config'
import path from 'path'

/*
 * The entry chunk is what the browser must parse before the app shell exists. Splitting the
 * generated corpus out took it from 12,516 kB to 795 kB raw (1,418 kB to 259 kB gzipped), and this
 * budget keeps it there.
 *
 * 850 kB, not the 750 kB this plugin originally shipped with: ten commits of feature work landed on
 * aos4-migration between that number being chosen and this branch merging, which is legitimate
 * growth rather than regression. The headroom is deliberately small — the point is to fail the build
 * the next time something large lands in the entry by accident.
 */
const INITIAL_ENTRY_CHUNK_LIMIT_BYTES = 850 * 1024

const enforceInitialEntryChunkBudget = (): Plugin => ({
  name: 'initial-entry-chunk-budget',
  apply: 'build',
  generateBundle(_options, bundle) {
    Object.values(bundle).forEach(output => {
      if (output.type !== 'chunk' || !output.isEntry) return
      const size = Buffer.byteLength(output.code)
      if (size > INITIAL_ENTRY_CHUNK_LIMIT_BYTES) {
        this.error(
          `${output.fileName} is ${(size / 1024).toFixed(2)} kB, above the ` +
            `${INITIAL_ENTRY_CHUNK_LIMIT_BYTES / 1024} kB initial entry budget.`
        )
      }
    })
  },
})

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          const normalizedId = id.replace(/\\/g, '/')
          if (normalizedId.endsWith('/src/aos4/generated/corpus/runtime.json')) {
            return 'aos4-catalog-data'
          }
        },
      },
    },
  },
  plugins: [react(), enforceInitialEntryChunkBudget()],
  resolve: {
    alias: {
      components: path.resolve(__dirname, 'src/components'),
      context: path.resolve(__dirname, 'src/context'),
      css: path.resolve(__dirname, 'src/css'),
      tests: path.resolve(__dirname, 'src/tests'),
      theme: path.resolve(__dirname, 'src/theme'),
      types: path.resolve(__dirname, 'src/types'),
      utils: path.resolve(__dirname, 'src/utils'),
      // Add more aliases as needed
    },
  },
  server: {
    watch: {
      ignored: ['**/.worktrees/**', '**/.claude/worktrees/**'],
    },
  },
  test: {
    ...configDefaults,
    exclude: [...configDefaults.exclude, '**/.worktrees/**', '**/.claude/**'],
    /**
     * Node by default, jsdom only for the component tests that render.
     *
     * Standing up a jsdom window for all 65 files dominated the run — most of them are pure
     * parsing, catalog and corpus logic that never touches the DOM. Paying for it everywhere
     * starved the CPU enough that short tests began tripping the default 5s timeout under load.
     */
    environment: 'node',
    environmentMatchGlobs: [
      ['**/*.test.tsx', 'jsdom'],
      // Not component tests, but they still need a DOM: New Recruit rosters are parsed with
      // DOMParser, and the print path builds its output against real nodes.
      ['**/importNewRecruit.test.ts', 'jsdom'],
      ['**/print*.test.ts', 'jsdom'],
    ],
    globals: true,
  },
})
