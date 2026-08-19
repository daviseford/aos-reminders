// @vitest-environment node

import fs from 'fs'
import path from 'path'
import { describe, expect, it } from 'vitest'
import { SERVICE_WORKER_ACTIVATION_MESSAGE } from '../bootstrap/serviceWorkerProtocol'

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
const BUILD_INPUTS = [
  'vite.config.mts',
  'src/bootstrap/serviceWorkerProtocol.ts',
  'public/site.webmanifest',
  'public/rollback-service-worker.js',
  'package.json',
]
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

/**
 * Every `waitUntil(...)` argument in a worker source, matched with balanced parentheses.
 *
 * A regex cannot do this: `waitUntil\([^)]*X` stops at the first `)`, so anything nested inside the
 * argument — an `await` of a call, an IIFE — hides the rest of it from the assertion. Scanning for
 * the matching paren is what makes "nothing in here mentions the sources chunk" mean it.
 */
const waitUntilArguments = (source: string): string[] => {
  const opener = /waitUntil\(/g
  const args: string[] = []
  let match: RegExpExecArray | null
  while ((match = opener.exec(source)) !== null) {
    const start = match.index + match[0].length
    let cursor = start
    let depth = 1
    while (cursor < source.length && depth > 0) {
      if (source[cursor] === '(') depth += 1
      else if (source[cursor] === ')') depth -= 1
      cursor += 1
    }
    args.push(source.slice(start, cursor - 1))
  }
  return args
}

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
    // The optional slash keeps this off Prettier's void-tag style: index.html is formatted now, and
    // an anchor on `">` silently stopped matching the moment the tag became self-closing, which read
    // as "the manifest has no theme_color" rather than as a broken pattern.
    const lightThemeColor = read('index.html').match(/<meta name="theme-color" content="([^"]+)"\s*\/?>/)
    expect(lightThemeColor?.[1], 'index.html no longer declares a light theme-color').toBeDefined()
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

    /*
     * The obvious inversion — rename a catalog chunk out of the `aos4-catalog-data` prefix so the
     * exclusion glob stops matching it — cannot be run as a red assertion here, and not only for the
     * reason 'would fail if the catalog ever entered the precache manifest' gives below. It never
     * reaches the manifest at all: it fails the *build*.
     *
     * Observed, not reasoned about. With `manualChunks` no longer matching, the corpus inlined into
     * the Home chunk at 6.68 MB and the build stopped with `Configure
     * "workbox.maximumFileSizeToCacheInBytes"`, naming both oversized assets. Each catalog chunk is
     * roughly 3x Workbox's 2,097,152-byte ceiling, so any misnaming that puts one in front of the
     * precache glob is loud at build time and leaves no `dist/` for this file to read.
     */
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
    const sourcesUrl = extras.match(/SOURCES_URL = "([^"]+)"/)?.[1]

    // The negative lookahead is load-bearing: both chunks share the `aos4-catalog-data` prefix, so
    // without it `aos4-catalog-data-sources-<hash>.js` matches too and two swapped URLs pass.
    expect(catalogUrl).toMatch(/^\/assets\/aos4-catalog-data-(?!sources-)[^/]+\.js$/)
    expect(exists(catalogUrl!.replace(/^\//, ''))).toBe(true)
    expect(sourcesUrl).toBeTruthy()
    expect(catalogUrl).not.toBe(sourcesUrl)
    expect(extras).toContain('caches.delete') // the CRA-era `images` cache
  })

  it('emits the catalog as two content-hashed chunks under one prefix', () => {
    /*
     * The source records ship separately so a session that never opens a source menu never parses
     * them. Both names share the `aos4-catalog-data` prefix on purpose — that is what keeps the
     * precache glob, the runtime-cache route, and the filter above matching both with no change.
     */
    const chunks = fs
      .readdirSync(path.join(distDir, 'assets'))
      .filter(file => file.startsWith('aos4-catalog-data') && file.endsWith('.js'))
      .sort()

    expect(chunks).toHaveLength(2)
    expect(chunks[0]).toMatch(/^aos4-catalog-data-[^.]+\.js$/)
    expect(chunks[1]).toMatch(/^aos4-catalog-data-sources-[^.]+\.js$/)
    expect(catalogEntries(precached)).toEqual([])
  })

  it('warms the catalog on install and the source records without holding activation', () => {
    expect(extrasImports).toHaveLength(1)
    const extras = read(extrasImports[0])

    const sourcesUrl = extras.match(/SOURCES_URL = "([^"]+)"/)?.[1]
    expect(sourcesUrl).toMatch(/^\/assets\/aos4-catalog-data-sources-.+\.js$/)
    expect(exists(sourcesUrl!.replace(/^\//, ''))).toBe(true)

    // The catalog keeps the abort-on-failure contract: a failed warm must reject install rather than
    // activate a build that cannot load army data offline.
    expect(extras).toMatch(/waitUntil\(warmChunk\(CATALOG_URL\)\)/)

    /*
     * The source records must not join it. Activation holds fetch events until waitUntil settles and
     * the page reloads the moment the worker takes control, so awaiting a 7 MB fetch there would
     * strand that reload on a blank screen — and blocking the whole app update on data most sessions
     * never open would widen the abort surface out of proportion to what it protects.
     */
    expect(extras).toMatch(/^\s*if \(SOURCES_URL\) warmChunk\(SOURCES_URL\)\.catch\(\(\) => \{\}\)\s*$/m)

    // Both lifecycle handlers hold something, so an empty scan cannot make the filter below vacuous.
    const heldWork = waitUntilArguments(extras)
    expect(heldWork).toHaveLength(2)
    expect(heldWork.filter(argument => argument.includes('SOURCES_URL'))).toEqual([])
  })

  it('prunes to the current build across both chunks', () => {
    const extras = read(extrasImports[0])

    // One cache holds both entries, so the prune is a membership test. Single-URL equality would
    // delete whichever chunk it was not written against on every activation.
    expect(extras).toContain('CURRENT_URLS.includes')
    expect(extras).toMatch(/CURRENT_URLS = \[CATALOG_URL, SOURCES_URL\]/)
  })

  it('bounds the catalog warm on browsers without AbortSignal.timeout', () => {
    expect(extrasImports).toHaveLength(1)
    const extras = read(extrasImports[0])

    expect(extras).toContain('new AbortController')
    expect(extras).toContain('setTimeout')
    expect(extras).toContain('controller.abort')
    expect(extras).toContain('finally')
    expect(extras).toContain('clearTimeout')
    expect(extras).not.toContain('AbortSignal.timeout')
  })

  it('claims clients only after the prompt-controlled worker is explicitly activated', () => {
    expect(serviceWorkerSource).toContain('clientsClaim')
    // The private token prevents legacy CRA clients from bypassing the new app's explicit prompt.
    expect(serviceWorkerSource).toContain(JSON.stringify(SERVICE_WORKER_ACTIVATION_MESSAGE))
    expect(serviceWorkerSource).not.toContain('"SKIP_WAITING"')
    expect(serviceWorkerSource.match(/skipWaiting\(\)/g)).toHaveLength(1)
  })

  it('ships a rollback worker that marks clients before navigating them', () => {
    const rollbackWorker = read('rollback-service-worker.js')

    expect(rollbackWorker).toContain("searchParams.set('aos-reminders-rollback', '1')")
    expect(rollbackWorker).toContain('client.navigate(destination.href)')
  })
})
