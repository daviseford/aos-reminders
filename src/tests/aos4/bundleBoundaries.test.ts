import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

const source = (relativePath: string) => readFile(path.resolve(process.cwd(), relativePath), 'utf8')

describe('initial bundle boundaries', () => {
  it('keeps the AoS 4 catalog out of the application bootstrap graph', async () => {
    const [main, app, home, viteConfig] = await Promise.all([
      source('src/main.tsx'),
      source('src/components/App.tsx'),
      source('src/components/routes/Home.tsx'),
      source('vite.config.mts'),
    ])

    expect(app).toMatch(/const Home = lazy\(\(\) => import\('components\/routes\/Home'\)\)/)
    expect(main).not.toContain("import { ArmyCollectionProvider } from 'context/useArmyCollection'")
    expect(home).toContain("import { ArmyCollectionProvider } from 'context/useArmyCollection'")
    expect(main.indexOf("import './bootstrap/captureShareLink'")).toBeLessThan(
      main.indexOf("import App from 'components/App'")
    )
    expect(viteConfig).toContain("return 'aos4-catalog-data'")
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
