// @vitest-environment node

import fs from 'fs'
import path from 'path'
import { describe, expect, it } from 'vitest'

/**
 * Assertions over the *form* the built catalog chunk ships in, not its contents.
 *
 * The corpus is the largest thing a first visit parses, and JSON parses several times faster than
 * equivalent JavaScript source at this scale — whole seconds on a phone. `vite.config.mts` sets
 * `json.stringify` to get the `JSON.parse` form, but that option alone is a silent no-op: Vite
 * resolves stringification as `stringify === true && namedExports !== true`, and `namedExports`
 * defaults to `true`. Before #1845 the chunk shipped as a 12.7 MB object literal with backtick keys
 * and the config looked correct.
 *
 * Nothing else catches that, because the failure has no error and no warning — the build succeeds
 * and the app works, just slower. Hence a build-output assertion rather than a config-source one:
 * pinning the config text would have passed throughout the period the option was doing nothing.
 *
 * These read `dist/` rather than mocking, which is the established shape for build-shape guarantees
 * here (see `src/tests/pwaBuild.test.ts`). CI builds before it tests for this reason.
 */

const distDir = path.resolve(process.cwd(), 'dist')
const assetsDir = path.join(distDir, 'assets')

/*
 * Freshness, not just existence — a `dist/` from another branch would satisfy these assertions while
 * telling you nothing about the current config, which is exactly the regression this file exists to
 * catch.
 */
const BUILD_INPUTS = ['vite.config.mts']

if (!fs.existsSync(assetsDir)) {
  throw new Error('dist/assets is missing. These assertions read build output — run `yarn build` first.')
}

const catalogChunks = fs
  .readdirSync(assetsDir)
  .filter(name => name.startsWith('aos4-catalog-data') && name.endsWith('.js'))

if (catalogChunks.length === 0) {
  throw new Error('No aos4-catalog-data chunk in dist/assets — run `yarn build` first.')
}

const builtAt = Math.min(...catalogChunks.map(name => fs.statSync(path.join(assetsDir, name)).mtimeMs))
const staleAgainst = BUILD_INPUTS.filter(
  file => fs.statSync(path.resolve(process.cwd(), file)).mtimeMs > builtAt
)
if (staleAgainst.length > 0) {
  throw new Error(`dist/ predates ${staleAgainst.join(', ')} — run \`yarn build\` first.`)
}

/*
 * Assert on small derived facts, never on the chunk source itself. A failed `expect(source)` prints
 * the whole 12.7 MB chunk as its diff, which buries the result and floods any log reading it.
 */
const shapeOf = (name: string) => {
  const source = fs.readFileSync(path.join(assetsDir, name), 'utf8')
  return {
    parsesJson: source.includes('JSON.parse'),
    /*
     * The negative half is what makes this meaningful. `parsesJson` alone would pass on a chunk that
     * parsed one small object and left the corpus as a literal, which is a shape the bundler can
     * genuinely produce. The projection's own keys appearing as bare identifiers is the regressed
     * form: `var e={attribution:` rather than a quoted key inside a parsed string.
     */
    hasBareProjectionKeys:
      /[{,]\s*catalogSchemaVersion\s*:/.test(source) || /[{,]\s*rulesContexts\s*:\s*\[/.test(source),
  }
}

describe('catalog chunk serialization form', () => {
  it.each(catalogChunks)('ships %s as a JSON.parse call rather than a JS object literal', name => {
    expect(shapeOf(name)).toEqual({ parsesJson: true, hasBareProjectionKeys: false })
  })
})
