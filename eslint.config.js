import globals from 'globals'
import pluginJs from '@eslint/js'
import tseslint from 'typescript-eslint'
import pluginReactConfig from 'eslint-plugin-react/configs/recommended.js'
import jsxRuntimeConfig from 'eslint-plugin-react/configs/jsx-runtime.js'
import { fixupConfigRules } from '@eslint/compat'

export default [
  { files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'] },
  {
    settings: {
      react: {
        version: 'detect', // Tells eslint-plugin-react to automatically detect the version of React to use
      },
    },
  },
  { languageOptions: { parserOptions: { ecmaFeatures: { jsx: true } } } },
  { languageOptions: { globals: { ...globals.browser, ...globals.jest, ...globals.node } } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  ...fixupConfigRules(pluginReactConfig),
  ...fixupConfigRules(jsxRuntimeConfig),
]
