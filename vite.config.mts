import react from '@vitejs/plugin-react-swc'
import { defineConfig, type Plugin } from 'vite'
import { configDefaults } from 'vitest/config'
import path from 'path'

const INITIAL_ENTRY_CHUNK_LIMIT_BYTES = 750 * 1024

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
    environment: 'jsdom',
    globals: true,
  },
})
