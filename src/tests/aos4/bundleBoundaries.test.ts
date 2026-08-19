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

describe('initial bundle boundaries', () => {
  it('keeps the AoS 4 catalog out of the application bootstrap graph', async () => {
    const [main, router, home, viteConfig] = await Promise.all([
      source('src/main.tsx'),
      source('src/bootstrap/router.tsx'),
      source('src/components/routes/Home.tsx'),
      source('vite.config.mts'),
    ])

    // The lazy route table lives in the router singleton so the Auth0 callback and analytics can
    // share one data router; the catalog must stay behind those lazy boundaries.
    expect(router).toMatch(/const Home = lazy\(\(\) => import\('components\/routes\/Home'\)\)/)
    expect(main).not.toContain("from 'context/useArmyCollection'")
    expect(home).toMatch(/import \{ ArmyCollectionProvider[^}]*\} from 'context\/useArmyCollection'/)
    expect(main.indexOf("import './bootstrap/captureShareLink'")).toBeLessThan(
      main.indexOf("import App from 'components/App'")
    )
    // The chunk name is a shared constant: the PWA config also needs it, to keep the catalog out of
    // the precache. Pin both the value and the manualChunks use so neither can drift alone.
    expect(viteConfig).toContain("const CATALOG_CHUNK_NAME = 'aos4-catalog-data'")
    expect(viteConfig).toContain('return CATALOG_CHUNK_NAME')
    expect(viteConfig).toContain("name: 'initial-entry-chunk-budget'")
  })

  it('loads import and PDF implementation only when their controls are used', async () => {
    const home = await source('src/components/routes/Home.tsx')

    expect(home).toContain(
      "const ImportArmyModal = lazy(() => import('components/input/importArmy/importArmyModal'))"
    )
    expect(home).toContain("const PrintModal = lazy(() => import('components/print/printModal'))")
    expect(home).toContain("await import('../../aos4/print')")
    expect(home).not.toMatch(/^import\s+\{[^}]*renderPrintPlanToPdf[^}]*\}\s+from\s+['"]/m)
  })

  /*
   * The corpus modules, as opposed to everything generated. The corpus now arrives in halves, so the
   * sources loader and both derived artifacts are named alongside the certified whole — an import of
   * `runtime.sources.json` from the shell would put all 7 MB of citations on the first-paint path.
   *
   * Two files under the directory are deliberately exempt, which is why this is a file list and not
   * a directory prefix: `corpus/defaults.json` is 130 bytes and is imported from the shell today
   * (see armyStorage), and `corpus/faction-index.json` is ~10 KB and the Home shell will import it
   * in a later PR. Filtering on the directory would forbid the very edges the split exists to allow.
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
})
