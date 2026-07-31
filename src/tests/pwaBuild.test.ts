// @vitest-environment node

import fs from 'fs'
import path from 'path'
import { describe, expect, it } from 'vitest'

/**
 * Assertions over the built PWA output.
 *
 * These read `dist/` rather than mocking, which is the established shape for build-shape guarantees
 * here (see `src/tests/aos4/bundleBoundaries.test.ts`). CI builds before it tests for this reason.
 *
 * They exist because nothing else catches a PWA config regression: Lighthouse removed its PWA
 * category in 12.0.0 and no current release carries an installability audit, so there is no
 * first-party CI answer to "is this still installable". See docs/pwa.md for the manual checks these
 * cannot replace.
 */

const distDir = path.resolve(process.cwd(), 'dist')
const read = (relativePath: string) => fs.readFileSync(path.join(distDir, relativePath), 'utf8')
const exists = (relativePath: string) => fs.existsSync(path.join(distDir, relativePath))

if (!fs.existsSync(distDir)) {
  throw new Error('dist/ is missing. These assertions read build output — run `yarn build` first.')
}

const serviceWorkerSource = read('service-worker.js')
const manifest = JSON.parse(read('site.webmanifest'))

/** The `{url, revision}` entries Workbox baked into the generated worker. */
const precachedUrls = (source: string) =>
  Array.from(source.matchAll(/\{url:"([^"]+)",revision:/g)).map(match => match[1])

/** The invariant the catalog exclusion exists to hold. Shared so it can be tested against itself. */
const catalogEntries = (urls: string[]) => urls.filter(url => url.includes('aos4-catalog-data'))

const precached = precachedUrls(serviceWorkerSource)

describe('web app manifest', () => {
  it('carries every field an install prompt requires', () => {
    expect(manifest.name).toBeTruthy()
    expect(manifest.short_name).toBeTruthy()
    expect(manifest.start_url).toBeTruthy()
    expect(manifest.scope).toBeTruthy()
    expect(['standalone', 'fullscreen', 'minimal-ui']).toContain(manifest.display)
    expect(manifest.theme_color).toBeTruthy()
    expect(manifest.background_color).toBeTruthy()
  })

  it('declares a stable identity so a later start_url change updates installs', () => {
    // Without `id`, identity falls back to start_url and changing it orphans every install.
    expect(manifest.id).toBeTruthy()
  })

  it('offers the two icon sizes Chromium requires plus a maskable variant', () => {
    const sizes = manifest.icons.map((icon: { sizes: string }) => icon.sizes)
    expect(sizes).toContain('192x192')
    expect(sizes).toContain('512x512')
    expect(manifest.icons.some((icon: { purpose?: string }) => icon.purpose === 'maskable')).toBe(true)
  })

  it('points every icon at a file that shipped', () => {
    const missing = manifest.icons
      .map((icon: { src: string }) => icon.src.split('?')[0].replace(/^\//, ''))
      .filter((file: string) => !exists(file))

    expect(missing).toEqual([])
  })

  it('agrees with the masthead colour index.html sets', () => {
    // In standalone mode the manifest wins, so a mismatch puts the wrong chrome above a dark header.
    const lightThemeColor = read('index.html').match(/<meta name="theme-color" content="([^"]+)">/)
    expect(manifest.theme_color).toBe(lightThemeColor?.[1])
  })
})

describe('generated service worker', () => {
  it('is emitted at the output root', () => {
    // Scope is a path-prefix test: a worker under assets/ could not control the site root, and the
    // filename has to stay the one pre-Vite CRA registrations poll.
    expect(exists('service-worker.js')).toBe(true)
    expect(exists('assets/service-worker.js')).toBe(false)
  })

  it('precaches the shell', () => {
    const entryChunk = read('index.html').match(/src="\/(assets\/[^"]+\.js)"/)?.[1]

    expect(entryChunk).toBeTruthy()
    expect(precached).toContain('index.html')
    expect(precached).toContain(entryChunk)
    expect(precached.some(url => url.endsWith('.css'))).toBe(true)
  })

  it('precaches every built asset except the catalog', () => {
    const built = fs
      .readdirSync(path.join(distDir, 'assets'))
      .filter(file => file.endsWith('.js') || file.endsWith('.css'))
      .map(file => `assets/${file}`)
    const expected = built.filter(file => !file.includes('aos4-catalog-data'))

    expect(built.length).toBeGreaterThan(expected.length) // the catalog exists to be excluded
    expect(precached.slice().sort()).toEqual(expect.arrayContaining(expected.sort()))
  })

  it('leaves the catalog chunk out of the precache manifest', () => {
    // 11.6 MiB, against a 2 MiB ceiling the plugin throws on. Precaching it would also block
    // activation on the venue wifi that motivates offline support.
    expect(catalogEntries(precached)).toEqual([])
  })

  it('would fail if the catalog ever entered the precache manifest', () => {
    // Proves the assertion above is load-bearing rather than tautological. The precache glob cannot
    // be used as the mutation point: a catalog entry over the ceiling throws during the build, so
    // there would be no output to assert against.
    const withCatalog = [...precached, 'assets/aos4-catalog-data-deadbeef.js']

    expect(catalogEntries(withCatalog)).not.toEqual([])
  })

  it('serves the catalog from a runtime route and caches nothing authenticated', () => {
    expect(serviceWorkerSource).toContain('aos4-catalog')

    // The worker caches build output and the catalog. Nothing else — least of all a response from
    // the Auth0, army, or subscription APIs, which are origin-scoped and outlive a session.
    for (const forbidden of ['auth0.com', 'api.aosreminders.com', 'stripe.com']) {
      expect(serviceWorkerSource).not.toContain(forbidden)
    }
  })

  it('pulls in the generated extras with the catalog URL baked in', () => {
    expect(serviceWorkerSource).toContain('sw-extras.js')

    const extras = read('sw-extras.js')
    const catalogUrl = extras.match(/CATALOG_URL = "([^"]+)"/)?.[1]

    expect(catalogUrl).toMatch(/^\/assets\/aos4-catalog-data-.+\.js$/)
    expect(exists(catalogUrl!.replace(/^\//, ''))).toBe(true)
    expect(extras).toContain("caches.delete") // the CRA-era `images` cache
  })
})
