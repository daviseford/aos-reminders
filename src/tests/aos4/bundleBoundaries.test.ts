import { existsSync, statSync } from 'node:fs'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

const source = (relativePath: string) => readFile(path.resolve(process.cwd(), relativePath), 'utf8')

const SOURCE_ROOT = path.resolve(process.cwd(), 'src')

const resolveModulePath = (specifier: string, fromFile: string): string | null => {
  // Bare specifiers resolve against `src` — both the tsconfig `baseUrl` and the Vite aliases point
  // there — so anything that does not resolve to a file under it is a package, and not our graph.
  const base = specifier.startsWith('.')
    ? path.resolve(path.dirname(fromFile), specifier)
    : path.resolve(SOURCE_ROOT, specifier)
  const candidates = [
    base,
    ...['.ts', '.tsx', '.js', '.jsx', '.json'].map(extension => `${base}${extension}`),
    ...['.ts', '.tsx'].map(extension => path.join(base, `index${extension}`)),
  ]
  return candidates.find(candidate => existsSync(candidate) && statSync(candidate).isFile()) ?? null
}

// Static edges only. `import type` erases before the bundler sees it, and `await import()` is the
// boundary being asserted rather than a leak through it, so neither counts as an edge here.
const staticImportSpecifiers = (contents: string): string[] =>
  [
    /(?:^|\n)\s*import\s+(?!type\s)[^'"();]*?from\s*['"]([^'"]+)['"]/g,
    /(?:^|\n)\s*export\s+(?!type\s)[^'"();]*?from\s*['"]([^'"]+)['"]/g,
    /(?:^|\n)\s*import\s*['"]([^'"]+)['"]/g,
  ].flatMap(pattern => Array.from(contents.matchAll(pattern), match => match[1]))

const staticGraphFrom = async (entry: string): Promise<string[]> => {
  const visited = new Set<string>()
  const queue = [path.resolve(process.cwd(), entry)]
  while (queue.length > 0) {
    const file = queue.shift() as string
    if (visited.has(file)) continue
    visited.add(file)
    if (file.endsWith('.json')) continue
    for (const specifier of staticImportSpecifiers(await readFile(file, 'utf8'))) {
      const resolved = resolveModulePath(specifier, file)
      if (resolved) queue.push(resolved)
    }
  }
  return Array.from(visited, file => path.relative(process.cwd(), file).split(path.sep).join('/'))
}

/*
 * The built output, for the two things no reading of source can answer. Kept to one directory
 * constant and one hand-written limit; see the entry-budget test below for why the limit is written
 * out again here rather than imported from the config that enforces it.
 */
const DIST_DIR = path.resolve(process.cwd(), 'dist')
const INITIAL_ENTRY_CHUNK_LIMIT_BYTES = 850 * 1024

/**
 * The text of a `const <name> = … => {` declaration, matched with balanced braces.
 *
 * A regex cannot do this: `handleToggle[^}]*` stops at the first `}`, so the first object literal,
 * template hole, or nested arrow inside the handler hides the rest of it. Scanning for the matching
 * brace is what makes "every call to this lives in here" mean it. Throws rather than returning
 * nothing when the declaration is gone, because a scan over an empty string passes every filter.
 */
const arrowFunctionBody = (contents: string, declaration: string): string => {
  const start = contents.indexOf(declaration)
  if (start < 0) throw new Error(`\`${declaration}\` is no longer declared — this scan pins nothing.`)
  let cursor = start + declaration.length
  let depth = 1
  while (cursor < contents.length && depth > 0) {
    if (contents[cursor] === '{') depth += 1
    else if (contents[cursor] === '}') depth -= 1
    cursor += 1
  }
  return contents.slice(start, cursor)
}

describe('initial bundle boundaries', () => {
  it('keeps the AoS 4 catalog out of the application bootstrap graph', async () => {
    const [main, router] = await Promise.all([source('src/main.tsx'), source('src/bootstrap/router.tsx')])

    // The lazy route table lives in the router singleton so the Auth0 callback and analytics can
    // share one data router; the catalog must stay behind those lazy boundaries.
    expect(router).toMatch(/const Home = lazy\(\(\) => import\('components\/routes\/Home'\)\)/)

    // Both indexes, not just their order: `indexOf` answers -1 for an import that is gone, and -1 is
    // less than everything, so the ordering test alone passes loudest when the thing it orders has
    // been deleted.
    const shareLinkIndex = main.indexOf("import './bootstrap/captureShareLink'")
    const appIndex = main.indexOf("import App from 'components/App'")
    expect(shareLinkIndex).toBeGreaterThanOrEqual(0)
    expect(appIndex).toBeGreaterThanOrEqual(0)
    expect(shareLinkIndex).toBeLessThan(appIndex)
  })

  /*
   * The modals and the PDF renderer moved with the rest of the catalog-bound tree when Home split
   * into a shell and a lazily-loaded child, so the boundary they cross is asserted where they now
   * live. The shell itself is checked below: it may not reach any of this statically.
   */
  it('loads import and PDF implementation only when their controls are used', async () => {
    const catalogBound = await source('src/components/routes/HomeCatalogBound.tsx')

    expect(catalogBound).toContain(
      "const ImportArmyModal = lazy(() => import('components/input/importArmy/importArmyModal'))"
    )
    expect(catalogBound).toContain("const PrintModal = lazy(() => import('components/print/printModal'))")
    expect(catalogBound).toContain("await import('../../aos4/print')")
    expect(catalogBound).not.toMatch(/^import\s+\{[^}]*renderPrintPlanToPdf[^}]*\}\s+from\s+['"]/m)
  })

  /*
   * The corpus modules, as opposed to everything generated. The corpus now arrives in halves, so the
   * sources loader and both derived artifacts are named alongside the certified whole — an import of
   * `runtime.sources.json` from the shell would put all 7 MB of citations on the first-paint path.
   *
   * Two files under the directory are deliberately exempt, which is why this is a file list and not
   * a directory prefix: `corpus/defaults.json` is 130 bytes and is imported from the shell (see
   * armyStorage), and `corpus/faction-index.json` is ~10 KB and is how the shell names all 28
   * factions before the corpus arrives. Filtering on the directory would forbid the very edges the
   * split exists to allow.
   */
  const CORPUS_MODULES =
    /^src\/aos4\/generated\/(index\.ts|catalog\.ts|corpus\/(index\.ts|catalog\.ts|sources\.ts|runtime\.json|runtime\.core\.json|runtime\.sources\.json))$/

  /*
   * Cloud armies are reachable from the shell — the provider wraps Home — so nothing in that subtree
   * may drag the corpus in. Walked transitively rather than string-matched on one file, because the
   * edge is worth catching wherever in the subtree it reappears, not only where it last was.
   *
   * Preparatory, not a load-time win on its own: Home still imports the catalog statically, so the
   * corpus is on the first-render path regardless of this subtree. What this holds is that cutting
   * Home's own edge will be sufficient — that no second path reintroduces the corpus behind it.
   */
  it('keeps the generated catalog out of the cloud army context graph', async () => {
    const graph = await staticGraphFrom('src/context/useArmyCollection.tsx')

    // The walk is only meaningful if it actually resolved the module the catalog used to arrive
    // through; without this a broken resolver would report an empty graph as a clean one.
    expect(graph).toContain('src/api/armyApi.ts')
    expect(graph.filter(file => CORPUS_MODULES.test(file))).toEqual([])
  })

  /*
   * The entry itself, which is the graph that actually decides first-paint cost. It is clean today
   * only because Home is lazy; asserting it here means the Home split cannot quietly hoist the
   * corpus back into the entry chunk while the subtree assertion above still passes.
   */
  it('keeps the generated catalog out of the application entry graph', async () => {
    const graph = await staticGraphFrom('src/main.tsx')

    expect(graph).toContain('src/bootstrap/router.tsx')
    expect(graph.filter(file => CORPUS_MODULES.test(file))).toEqual([])
  })

  /*
   * The point of the shell. Home's own chunk paints the screen, and the corpus may only arrive
   * through the `lazy()` edge to HomeCatalogBound — which the walker does not follow, because a
   * dynamic import is the boundary rather than a leak through it. Anchored on the child being
   * dirty as well as the shell being clean: a walk that resolved nothing would otherwise report
   * a shell that statically imports the catalog as a clean one.
   */
  it('keeps the generated catalog out of the Home shell graph', async () => {
    const [shell, catalogBound] = await Promise.all([
      staticGraphFrom('src/components/routes/Home.tsx'),
      staticGraphFrom('src/components/routes/HomeCatalogBound.tsx'),
    ])

    expect(shell).toContain('src/components/page/footer.tsx')
    expect(shell.filter(file => CORPUS_MODULES.test(file))).toEqual([])
    expect(catalogBound.filter(file => CORPUS_MODULES.test(file)).length).toBeGreaterThan(0)

    /*
     * The masthead's faction names come from the generated index, and the index module has to be
     * deep-imported: `aos4/generated/corpus/index.ts` re-exports it through `./catalog`, so a
     * tidy-looking barrel import here would pull the whole corpus back onto the first-paint path.
     */
    expect(shell).toContain('src/aos4/generated/corpus/factionIndex.ts')
    expect(shell).toContain('src/aos4/generated/corpus/faction-index.json')
  })

  /*
   * The cloud army provider, which used to be held by a string match on Home's import line. That
   * matcher pinned where the import was written; what it was reaching for is where the provider
   * *lands* — mounted by the shell, so it travels in Home's lazy chunk instead of the entry the
   * browser must parse before anything is on screen.
   *
   * Each half anchors the other. A walk that resolved nothing would report an entry that does import
   * the provider as clean, and a shell that dropped the provider outright would satisfy the entry
   * half on its own.
   */
  it('mounts the cloud army provider from the shell rather than from the entry', async () => {
    const [entry, shell] = await Promise.all([
      staticGraphFrom('src/main.tsx'),
      staticGraphFrom('src/components/routes/Home.tsx'),
    ])

    expect(shell).toContain('src/context/useArmyCollection.tsx')
    expect(entry).not.toContain('src/context/useArmyCollection.tsx')
  })

  /*
   * The core module, from its own side. The split's parse win is that drawing a reminder never
   * touches the 20,078 citations, and the quiet way to undo it is to materialize source-record IDs
   * in `corpus/catalog.ts`: an ID belongs to a record, so reaching for one reaches for the records,
   * which pulls `runtime.sources.json` back into the chunk `./catalog` lands in and puts all 7 MB
   * back on the render path. The module says as much where it sets `sourceRefs: []`.
   *
   * Walked rather than scanned for text, because the edge is worth catching wherever in the module's
   * own graph it reappears — through `./sources`, through the barrel, or directly. The runtime half
   * of the same invariant, that the entities this module publishes carry no `sourceRefs` at all, is
   * held by catalogIntegrity's 'ships a render catalog that carries no source records at all'.
   */
  it('keeps the source records out of the core catalog module graph', async () => {
    const graph = await staticGraphFrom('src/aos4/generated/corpus/catalog.ts')

    // The half it is supposed to have. Without this an unresolved walk reports the clean result.
    expect(graph).toContain('src/aos4/generated/corpus/runtime.core.json')
    // `runtime.json` as well as `runtime.sources.json`: the certified whole carries the records too,
    // so re-importing it would restore the cost the split removed just as completely.
    expect(graph.filter(file => /\/runtime\.(sources\.)?json$/.test(file))).toEqual([])
    expect(graph).not.toContain('src/aos4/generated/corpus/sources.ts')
  })

  /*
   * The sources chunk is fetched by `getSources`, so where that prop is *called* decides whether a
   * screen of reminders costs one 7 MB download or none. It belongs to the dropdown's toggle: called
   * from a render body it would refetch on every pass and hand the deferral back.
   *
   * reminderSourceMenu's 'never resolves sources while an army merely renders' already holds this
   * behaviourally, by rendering twelve cards against a spy. This is the structural half — it names
   * the one place the call is allowed, so a call added to a branch that test's fixtures never render
   * still fails here.
   */
  it('resolves reminder sources from the menu toggle and never from a render body', async () => {
    const reminders = await source('src/components/info/reminders.tsx')
    const handler = arrowFunctionBody(reminders, 'const handleToggle = (nextShow: boolean) => {')

    // Calls, not references: `getSources={getSources}` passes the prop down and `getSources:` in the
    // prop types declares it, and neither costs a fetch.
    const callSites = Array.from(reminders.matchAll(/\bgetSources\(/g))
    const inHandler = Array.from(handler.matchAll(/\bgetSources\(/g))

    expect(inHandler.length).toBeGreaterThan(0)
    expect(callSites).toHaveLength(inHandler.length)
  })

  /*
   * The one boundary that cannot be read out of source: the size of what actually shipped.
   *
   * The matcher this replaces pinned the *name* of the `generateBundle` plugin in vite.config.mts
   * that enforces the budget — which would have gone on passing after the plugin was deleted, the
   * single change that lets the entry grow without limit. The limit is written out again here rather
   * than imported from that config on purpose: a test that reads the number it is checking moves
   * whenever the number does, and would have nothing to say about a budget quietly raised to 12 MB.
   */
  it('keeps the built entry chunk inside the 850 kB first-paint budget', async () => {
    const indexHtmlPath = path.join(DIST_DIR, 'index.html')
    if (!existsSync(indexHtmlPath)) {
      throw new Error('dist/index.html is missing. This reads build output — run `yarn build` first.')
    }
    /*
     * Freshness, not just existence — the same guard pwaBuild.test.ts opens with, for the same
     * reason: a `dist/` left over from another branch satisfies a size assertion while telling you
     * nothing about the current source. Repeated rather than shared because the two files depend on
     * different build inputs, and one shared list would make each carry the other's staleness.
     */
    if (statSync(path.resolve(process.cwd(), 'vite.config.mts')).mtimeMs > statSync(indexHtmlPath).mtimeMs) {
      throw new Error('dist/ predates vite.config.mts — run `yarn build` first.')
    }

    const entryChunk = (await readFile(indexHtmlPath, 'utf8')).match(/src="\/(assets\/[^"]+\.js)"/)?.[1]
    expect(entryChunk, 'dist/index.html no longer names an entry chunk').toBeTruthy()

    // 415 kB as this lands, so the budget is a ceiling rather than a tight fit. It is sized to catch
    // the corpus arriving back on the entry's static graph, which costs megabytes, not kilobytes.
    expect(statSync(path.join(DIST_DIR, entryChunk as string)).size).toBeLessThanOrEqual(
      INITIAL_ENTRY_CHUNK_LIMIT_BYTES
    )
  })
})
