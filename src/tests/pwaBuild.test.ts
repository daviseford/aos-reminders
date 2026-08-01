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

/*
 * Freshness, not just existence. A `dist/` left over from another branch satisfies every assertion
 * below while telling you nothing about the current source — which would make this file report green
 * on precisely the regression it exists to catch.
 */
const BUILD_INPUTS = ['vite.config.mts', 'public/site.webmanifest', 'package.json']
const workerPath = path.join(distDir, 'service-worker.js')

if (!fs.existsSync(workerPath)) {
  throw new Error(
    'dist/service-worker.js is missing. These assertions read build output — run `yarn build` first.'
  )
}

const builtAt = fs.statSync(workerPath).mtimeMs
const staleAgainst = BUILD_INPUTS.filter(
  file => fs.statSync(path.resolve(process.cwd(), file)).mtimeMs > builtAt
)
if (staleAgainst.length > 0) {
  throw new Error(`dist/ predates ${staleAgainst.join(', ')} — run \`yarn build\` first.`)
}

const serviceWorkerSource = read('service-worker.js')
const manifest = JSON.parse(read('site.webmanifest'))
const extrasImports = Array.from(
  serviceWorkerSource.matchAll(/(?:importScripts\(|,)"(sw-extras-[a-f0-9]+\.js)"/g)
).map(match => match[1])

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

  it('leaves the non-app files out of the precache manifest', () => {
    // Precaching rollback-service-worker.js would pin a copy of the escape hatch inside the very
    // worker it exists to replace; sw-extras-<hash>.js is imported, not fetched as a precache entry.
    expect(precached.filter(url => !url.includes('/'))).toEqual(['index.html'])
  })

  it('would fail if the catalog ever entered the precache manifest', () => {
    /*
     * Mutates the parser's input, not its output. Injecting into the already-parsed array would only
     * re-test Array.filter, and would still pass if a Workbox format change silently emptied
     * `precached` — the one failure that makes the assertion above vacuous.
     *
     * The precache glob cannot serve as the mutation point either: a catalog entry over the ceiling
     * throws during the build, leaving no output to assert against.
     */
    const withCatalog = serviceWorkerSource.replace(
      '{url:"index.html"',
      '{url:"assets/aos4-catalog-data-deadbeef.js",revision:null},{url:"index.html"'
    )

    expect(withCatalog).not.toBe(serviceWorkerSource) // the splice point still exists
    expect(catalogEntries(precachedUrls(withCatalog))).not.toEqual([])
  })

  it('serves the catalog CacheFirst from the cache the generated extras prunes', () => {
    // CacheFirst is the offline guarantee. NetworkFirst would still look fine online and silently
    // drop cold-offline army data, which is the behaviour this whole change exists to deliver.
    expect(serviceWorkerSource).toContain('CacheFirst')

    // The two writers must name the same cache, or Workbox fills one while sw-extras prunes another.
    expect(extrasImports).toHaveLength(1)
    const catalogCache = read(extrasImports[0]).match(/CATALOG_CACHE = "([^"]+)"/)?.[1]
    expect(catalogCache).toBeTruthy()
    expect(serviceWorkerSource).toContain(`cacheName:"${catalogCache}"`)
  })

  it('admits only successful JavaScript responses to the runtime catalog cache', () => {
    // These strings come from the custom cacheWillUpdate callback in the generated worker. Unlike
    // cacheableResponse's status-only shorthand, the callback rejects the SPA's 200 HTML fallback.
    expect(serviceWorkerSource).toContain('cacheWillUpdate')
    expect(serviceWorkerSource).toContain('content-type')
    expect(serviceWorkerSource).toContain('javascript')
    expect(serviceWorkerSource).toMatch(/(?:status.{0,20}200|200.{0,20}status)/)
  })

  it('caches nothing authenticated', () => {
    // Caches are origin-scoped, not per-user, so an authenticated response landing in one is a
    // cross-user exposure on a shared device. Assert the route set rather than hunting hostnames:
    // a catch-all route would name no host at all.
    const runtimeCaches = Array.from(serviceWorkerSource.matchAll(/cacheName:"([^"]+)"/g)).map(
      match => match[1]
    )
    expect(runtimeCaches).toEqual(['aos4-catalog'])

    // Belt and braces on the real hosts. `api.aosreminders.com` is an Auth0 *audience*, not an
    // endpoint the app fetches — the army and subscription APIs both live on execute-api.
    for (const forbidden of ['auth0.com', 'execute-api', 'stripe.com']) {
      expect(serviceWorkerSource).not.toContain(forbidden)
    }
  })

  it('pulls in the generated extras with the catalog URL baked in', () => {
    expect(extrasImports).toHaveLength(1)
    expect(serviceWorkerSource).not.toContain('"sw-extras.js"')

    const emittedExtras = fs.readdirSync(distDir).filter(file => /^sw-extras-[a-f0-9]+\.js$/.test(file))
    expect(emittedExtras).toEqual(extrasImports)

    const extras = read(extrasImports[0])
    const catalogUrl = extras.match(/CATALOG_URL = "([^"]+)"/)?.[1]

    expect(catalogUrl).toMatch(/^\/assets\/aos4-catalog-data-.+\.js$/)
    expect(exists(catalogUrl!.replace(/^\//, ''))).toBe(true)
    expect(extras).toContain('caches.delete') // the CRA-era `images` cache
  })

  it('claims clients only after the prompt-controlled worker is explicitly activated', () => {
    expect(serviceWorkerSource).toContain('clientsClaim')
    // Prompt mode keeps only the message-driven skipWaiting path; there is no eager top-level call.
    expect(serviceWorkerSource).toContain('"SKIP_WAITING"')
    expect(serviceWorkerSource.match(/skipWaiting\(\)/g)).toHaveLength(1)
  })
})
