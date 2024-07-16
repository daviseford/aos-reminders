import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'
import { configDefaults } from 'vitest/config'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      api: path.resolve(__dirname, 'src/api'),
      components: path.resolve(__dirname, 'src/components'),
      context: path.resolve(__dirname, 'src/context'),
      css: path.resolve(__dirname, 'src/css'),
      ducks: path.resolve(__dirname, 'src/ducks'),
      factions: path.resolve(__dirname, 'src/factions'),
      generic_rules: path.resolve(__dirname, 'src/generic_rules'),
      meta: path.resolve(__dirname, 'src/meta'),
      store: path.resolve(__dirname, 'src/store'),
      tests: path.resolve(__dirname, 'src/tests'),
      theme: path.resolve(__dirname, 'src/theme'),
      types: path.resolve(__dirname, 'src/types'),
      utils: path.resolve(__dirname, 'src/utils'),
      // Add more aliases as needed
    },
  },
  test: {
    ...configDefaults,
    environment: 'jsdom',
    globals: true,
  },
})
