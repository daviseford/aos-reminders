import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

const source = (relativePath: string) => readFile(path.resolve(process.cwd(), relativePath), 'utf8')

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
})
