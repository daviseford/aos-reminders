import react from '@vitejs/plugin-react-swc'
import { defineConfig, type Plugin } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'
import { configDefaults } from 'vitest/config'
import path from 'path'

/*
 * The generated corpus is 11.6 MiB as a built chunk, against Workbox's 2 MiB precache ceiling — and
 * the plugin throws rather than warns above it. Precaching it would also download the whole catalog
 * before the worker could activate, which is the worst case on the venue wifi that motivates offline
 * support in the first place.
 *
 * So it is excluded from the precache manifest and served by a runtime route instead. The chunk is
 * content-hashed, so CacheFirst is safe: a new build is a new URL and therefore a miss. `sw-extras.js`
 * warms that URL on activation so an update does not leave the user one online fetch short.
 */
const CATALOG_CHUNK_NAME = 'aos4-catalog-data'
const CATALOG_CHUNK_GLOB = `assets/${CATALOG_CHUNK_NAME}-*.js`
const CATALOG_CHUNK_URL = new RegExp(`/assets/${CATALOG_CHUNK_NAME}-[^/]+\\.js$`)

/*
 * Shared because two writers have to agree on it: Workbox's CacheFirst route writes here, and the
 * generated sw-extras.js prunes and warms it. If these names ever drifted apart, Workbox would fill
 * one cache while sw-extras pruned another -- unbounded growth, and nothing would fail loudly.
 */
const CATALOG_CACHE_NAME = 'aos4-catalog'

/*
 * Files the default `**\/*.{js,css,html}` precache glob picks up but that nothing should ever be
 * served from the precache: the worker's own importScripts payload, the emergency rollback worker
 * (deployed by hand over the live worker, never fetched by the app), and Google's site-verification
 * page. Precaching them costs install bandwidth and, in the rollback worker's case, would pin a copy
 * of the escape hatch inside the very worker it exists to replace.
 */
const NON_APP_PRECACHE_GLOBS = ['sw-extras.js', 'rollback-service-worker.js', 'google*.html']

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

/*
 * Emits the `sw-extras.js` that the generated worker importScripts. Two things have to happen that
 * Workbox config cannot express, and they sit on different lifecycle events for a reason.
 *
 * 1. Warm the catalog, on `install`. A new build gives the chunk a new hashed URL, so the CacheFirst
 *    route misses until something requests it online — and a user who takes an update and is next
 *    offline would get a working shell and no army data, exactly the case offline support exists for.
 *    A rejected `install` waitUntil aborts the update, so a failed warm leaves the client on its
 *    previous worker, which still has its own catalog cached and still works offline. That is the
 *    whole point of warming here rather than on `activate`: activation cannot be refused, so a
 *    failure there would commit the client to a build it cannot run offline. The hourly poll retries.
 * 2. Prune, and drop the CRA-era `images` runtime cache, on `activate`. Both are cheap and
 *    fault-tolerant. Nothing slow belongs here: activation holds fetch events until waitUntil
 *    settles, and the page reloads the moment the worker takes control, so a download on this path
 *    would leave that reload on a blank screen. `cleanupOutdatedCaches` only matches Workbox's own
 *    precache naming, so the custom-named legacy cache needs deleting by hand.
 *
 * The URL is baked in at build time because the worker has no other way to learn a content-hashed
 * name. This file also owns the catalog cache rather than an ExpirationPlugin: writing to a
 * Workbox-managed cache directly would bypass its IndexedDB bookkeeping and leave entry counts wrong.
 * One current entry is the whole policy — after activation the previous build's URL is never
 * requested again.
 */
const emitServiceWorkerExtras = (): Plugin => ({
  name: 'service-worker-extras',
  apply: 'build',
  generateBundle(_options, bundle) {
    const catalog = Object.values(bundle).find(
      output => output.type === 'chunk' && output.name === CATALOG_CHUNK_NAME
    )
    const catalogUrl = catalog ? `/${catalog.fileName}` : null

    this.emitFile({
      type: 'asset',
      fileName: 'sw-extras.js',
      source: `// Generated by vite.config.mts (service-worker-extras). Do not edit.
const CATALOG_URL = ${JSON.stringify(catalogUrl)}
const CATALOG_CACHE = ${JSON.stringify(CATALOG_CACHE_NAME)}
const LEGACY_CACHES = ['images']
const WARM_TIMEOUT_MS = 20000

/*
 * A missing object at this origin answers 200 with the SPA shell rather than 404. Caching that under
 * the catalog's URL would make CacheFirst serve HTML to a dynamic import forever, so every read and
 * write of this cache is gated on the response actually being the module.
 */
const isCatalogModule = response =>
  !!response && response.status === 200 && (response.headers.get('content-type') || '').includes('javascript')

const withTimeout = () =>
  typeof AbortSignal !== 'undefined' && AbortSignal.timeout
    ? { signal: AbortSignal.timeout(WARM_TIMEOUT_MS) }
    : undefined

/*
 * Deliberately unguarded: a rejection here rejects install's waitUntil, which aborts the update and
 * leaves the client on its previous worker -- one that still has its own catalog cached and still
 * works offline. Swallowing the failure instead would activate a build that cannot load army data
 * offline, which is worse than not updating. The hourly poll retries.
 */
const warmCatalog = async () => {
  if (!CATALOG_URL) return

  const cache = await caches.open(CATALOG_CACHE)
  const cached = await cache.match(CATALOG_URL)
  if (isCatalogModule(cached)) return
  if (cached) await cache.delete(CATALOG_URL)

  // No 'reload' cache mode: the URL is content-hashed and served immutable, so a copy the page has
  // already downloaded is by construction the right bytes and re-fetching them buys nothing.
  const response = await fetch(CATALOG_URL, withTimeout())
  if (!isCatalogModule(response)) {
    throw new Error('sw-extras: catalog warm did not return the module; aborting this update')
  }
  await cache.put(CATALOG_URL, response)
}

self.addEventListener('install', event => {
  event.waitUntil(warmCatalog())
})

self.addEventListener('activate', event => {
  event.waitUntil(
    (async () => {
      // Everything here is cheap and independently fault-tolerant. Activation holds fetch events
      // until waitUntil settles and the page reloads the moment the worker takes control, so a slow
      // step on this path would leave that reload on a blank screen.
      await Promise.all(LEGACY_CACHES.map(name => caches.delete(name).catch(() => {})))

      if (!CATALOG_URL) return
      try {
        // Drop previous builds' entries, and anything that is not the module -- that is how a cache
        // poisoned by the SPA's 200-HTML fallback heals instead of serving it until the next deploy.
        const cache = await caches.open(CATALOG_CACHE)
        for (const request of await cache.keys()) {
          const isCurrent = new URL(request.url).pathname === CATALOG_URL
          if (!isCurrent || !isCatalogModule(await cache.match(request))) await cache.delete(request)
        }
      } catch {
        // Storage refused. The runtime route still serves the catalog; the prune retries next time.
      }
    })()
  )
})
`,
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
            return CATALOG_CHUNK_NAME
          }
        },
      },
    },
  },
  plugins: [
    react(),
    VitePWA({
      strategies: 'generateSW',
      /*
       * `prompt`, not `autoUpdate`: autoUpdate reloads the page under the user mid-session, which is
       * wrong for an app people read during a game turn. The app already owns the update channel
       * (`hasNewContent` in context/useAppStatus) — src/bootstrap/registerServiceWorker.ts feeds it.
       */
      registerType: 'prompt',
      /*
       * Not the default `sw.js`. Clients still holding the pre-Vite CRA registration poll
       * `/service-worker.js` for updates; serving a real, changed script there takes those
       * registrations over in place. Any other name leaves them orphaned on a stale precache.
       */
      filename: 'service-worker.js',
      // public/site.webmanifest is authoritative and index.html already links it.
      manifest: false,
      // Registration is explicit in src/bootstrap/registerServiceWorker.ts.
      injectRegister: false,
      workbox: {
        globIgnores: [CATALOG_CHUNK_GLOB, ...NON_APP_PRECACHE_GLOBS],
        importScripts: ['sw-extras.js'],
        runtimeCaching: [
          {
            urlPattern: CATALOG_CHUNK_URL,
            handler: 'CacheFirst',
            options: {
              cacheName: CATALOG_CACHE_NAME,
              // No ExpirationPlugin: sw-extras.js owns this cache and prunes it to the current
              // build's chunk on activate. Two writers would fight over its bookkeeping.
              //
              // 200 only. An opaque (status 0) response is unreachable here -- the pattern is
              // same-origin -- so allowing it would only widen what can land in the cache. A 200
              // that is the SPA shell rather than the module is caught by sw-extras.js's prune.
              cacheableResponse: { statuses: [200] },
            },
          },
        ],
      },
    }),
    emitServiceWorkerExtras(),
    enforceInitialEntryChunkBudget(),
  ],
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
