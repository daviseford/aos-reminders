import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'
import { configDefaults } from 'vitest/config'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
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
