import react from '@vitejs/plugin-react'
import { createHash } from 'node:crypto'
import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { defineConfig, type Plugin } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'
import { configDefaults } from 'vitest/config'
// Extension included deliberately: `configLoader: 'native'` hands this file to Node, which does not
// resolve extensionless specifiers. See the resolve aliases below for the other half of that move.
import { SERVICE_WORKER_ACTIVATION_MESSAGE } from './src/bootstrap/serviceWorkerProtocol.ts'

/*
 * The generated corpus is 11.6 MiB as a built chunk, against Workbox's 2 MiB precache ceiling — and
 * the plugin throws rather than warns above it. Precaching it would also download the whole catalog
 * before the worker could activate, which is the worst case on the venue wifi that motivates offline
 * support in the first place.
 *
 * So it is excluded from the precache manifest and served by a runtime route instead. The chunk is
 * content-hashed, so CacheFirst is safe: a new build is a new URL and therefore a miss. The generated
 * `sw-extras-<hash>.js` warms that URL during install so an update does not leave the user one online
 * fetch short.
 */
const CATALOG_CHUNK_NAME = 'aos4-catalog-data'
const CATALOG_CHUNK_GLOB = `assets/${CATALOG_CHUNK_NAME}-*.js`
const CATALOG_CHUNK_URL = new RegExp(`/assets/${CATALOG_CHUNK_NAME}-[^/]+\\.js$`)

/*
 * Shared because two writers have to agree on it: Workbox's CacheFirst route writes here, and the
 * generated sw-extras module prunes and warms it. If these names ever drifted apart, Workbox would fill
 * one cache while sw-extras pruned another -- unbounded growth, and nothing would fail loudly.
 */
const CATALOG_CACHE_NAME = 'aos4-catalog'
const serviceWorkerExtrasImports: string[] = []

const catalogCacheWillUpdate = async ({ response }: { response: Response }) =>
  response.status === 200 && (response.headers.get('content-type') || '').toLowerCase().includes('javascript')
    ? response
    : null

/*
 * Files the default `**\/*.{js,css,html}` precache glob picks up but that nothing should ever be
 * served from the precache: the worker's own importScripts payload, the emergency rollback worker
 * (deployed by hand over the live worker, never fetched by the app), and Google's site-verification
 * page. Precaching them costs install bandwidth and, in the rollback worker's case, would pin a copy
 * of the escape hatch inside the very worker it exists to replace.
 */
const NON_APP_PRECACHE_GLOBS = ['sw-extras-*.js', 'rollback-service-worker.js', 'google*.html']

/*
 * The entry chunk is what the browser must parse before the app shell exists. Splitting the
 * generated corpus out took it from 12,516 kB to 795 kB raw (1,418 kB to 259 kB gzipped), and this
 * budget keeps it there.
 *
 * The 850 kB limit leaves the current entry only modest headroom and fails the build the next time
 * something large lands there by accident.
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
 * Workbox's generated message handler accepts the generic `SKIP_WAITING` token. The CRA worker
 * currently controlling production tabs posts that token automatically when it sees an update,
 * which would bypass this release's user-facing prompt. Replace the generated handler's one token
 * with this app generation's private protocol, and fail closed if Workbox ever changes its output.
 */
const privatizeServiceWorkerActivation = (): Plugin => {
  let workerPath = path.resolve('dist/service-worker.js')

  return {
    name: 'private-service-worker-activation',
    apply: 'build',
    enforce: 'post',
    configResolved(config) {
      workerPath = path.resolve(config.root, config.build.outDir, 'service-worker.js')
    },
    async closeBundle() {
      const source = await readFile(workerPath, 'utf8')
      const genericToken = JSON.stringify('SKIP_WAITING')
      const privateToken = JSON.stringify(SERVICE_WORKER_ACTIVATION_MESSAGE)
      const occurrences = source.split(genericToken).length - 1

      if (occurrences !== 1) {
        this.error(
          `Expected exactly one Workbox ${genericToken} activation token in ${workerPath}; found ${occurrences}.`
        )
      }

      await writeFile(workerPath, source.replace(genericToken, privateToken))
    },
  }
}

/*
 * Emits the immutable `sw-extras-<hash>.js` that the generated worker imports. Two things have to
 * happen that Workbox config cannot express, and they sit on different lifecycle events for a reason.
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

    const source = `// Generated by vite.config.mts (service-worker-extras). Do not edit.
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

const fetchCatalog = async () => {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), WARM_TIMEOUT_MS)
  try {
    return await fetch(CATALOG_URL, { signal: controller.signal })
  } finally {
    clearTimeout(timeout)
  }
}

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
  const response = await fetchCatalog()
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
`
    const sourceHash = createHash('sha256').update(source).digest('hex').slice(0, 16)
    const fileName = `sw-extras-${sourceHash}.js`

    // VitePWA resolves Workbox options before Rollup names the catalog chunk, but generateSW runs
    // later in closeBundle. Mutating this shared array here lets the emitted worker import the exact
    // immutable extras whose source was just hashed.
    serviceWorkerExtrasImports.splice(0, serviceWorkerExtrasImports.length, fileName)

    this.emitFile({
      type: 'asset',
      fileName,
      source,
    })
  },
})

// https://vitejs.dev/config/
export default defineConfig({
  /*
   * Emit imported JSON as JSON.parse("...") instead of a JS object literal. Engines parse JSON
   * several times faster than JS source at scale, and the corpus chunk is ~12 MB — on a phone the
   * literal form costs whole seconds of main-thread parse before Home can render.
   *
   * `namedExports: false` is load-bearing, not tidying. Vite resolves this option as
   * `stringify === true && namedExports !== true`, and `namedExports` defaults to true — so
   * `stringify: true` on its own is a silent no-op. It was set alone from #1843 until #1845, and the
   * corpus shipped as a 12.7 MB object literal the whole time: no error, no warning, just a slower
   * first render. Every JSON import in src/ and scripts/ is a default import, so turning named
   * exports off costs nothing. src/tests/aos4/catalogChunkForm.test.ts asserts the built form,
   * because the config reads correct in both states.
   */
  json: { stringify: true, namedExports: false },
  css: {
    preprocessorOptions: {
      scss: {
        /*
         * Bootstrap 5.3's own scss predates Dart Sass 1.80's deprecations (@import, if(), global
         * built-ins, red()/green()/blue()); our two entry imports pull it in, so the warnings all
         * originate in node_modules. quietDeps silences those rather than editing bootstrap.
         *
         * Vite 8 only drives Sass through the modern compiler API, so the legacy-js-api
         * deprecation no longer applies. The remaining `import` silencing covers Bootstrap 5.3's
         * internal @import usage — its scss is import-architecture and depends on shared global
         * scope, so our three @imports cannot become @use either. Revisit when Bootstrap moves
         * off @import.
         */
        quietDeps: true,
        silenceDeprecations: ['import'],
      },
    },
  },
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
    // Must run before vite-plugin-pwa's closeBundle generateSW step; see the shared import array.
    emitServiceWorkerExtras(),
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
        importScripts: serviceWorkerExtrasImports,
        // The worker still waits for an explicit SKIP_WAITING message. Once accepted, claim every
        // controlled tab so each reloads onto the same build whose old caches activation prunes.
        clientsClaim: true,
        runtimeCaching: [
          {
            urlPattern: CATALOG_CHUNK_URL,
            handler: 'CacheFirst',
            options: {
              cacheName: CATALOG_CACHE_NAME,
              // No ExpirationPlugin: the generated extras owns this cache and prunes it to the current
              // build's chunk on activate. Two writers would fight over its bookkeeping.
              //
              // The origin answers a missing catalog URL with the SPA's 200 HTML shell. Reject it
              // before CacheFirst writes so a transient miss cannot poison this immutable route.
              plugins: [{ cacheWillUpdate: catalogCacheWillUpdate }],
            },
          },
        ],
      },
    }),
    // Must run after vite-plugin-pwa writes the worker in closeBundle.
    privatizeServiceWorkerActivation(),
    enforceInitialEntryChunkBudget(),
  ],
  resolve: {
    alias: {
      components: path.resolve(import.meta.dirname, 'src/components'),
      context: path.resolve(import.meta.dirname, 'src/context'),
      css: path.resolve(import.meta.dirname, 'src/css'),
      tests: path.resolve(import.meta.dirname, 'src/tests'),
      theme: path.resolve(import.meta.dirname, 'src/theme'),
      types: path.resolve(import.meta.dirname, 'src/types'),
      utils: path.resolve(import.meta.dirname, 'src/utils'),
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
    /*
     * `.cache/` is the ignored acquisition tree, and parking a locked `node_modules` there under a
     * name like `stale-node-modules-<stamp>/` is the documented Windows EPERM workaround. Vitest's
     * default excludes only cover a directory literally named `node_modules`, so the parked copy's
     * own test suites were collected as if they were ours -- 56 phantom failing files, none of them
     * in this repository. Nothing under `.cache/` is ever a test of this project.
     */
    exclude: [...configDefaults.exclude, '**/.worktrees/**', '**/.claude/**', '**/.cache/**'],
    /**
     * Node by default, jsdom only for the component tests that render — those opt in with a
     * `// @vitest-environment jsdom` docblock at the top of the file (vitest 4 removed
     * `environmentMatchGlobs`, which used to carry the split).
     *
     * Standing up a jsdom window for all 65 files dominated the run — most of them are pure
     * parsing, catalog and corpus logic that never touches the DOM. Paying for it everywhere
     * starved the CPU enough that short tests began tripping the default 5s timeout under load.
     */
    environment: 'node',
    globals: true,
  },
})
