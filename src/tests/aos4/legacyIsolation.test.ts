import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'

const sourceRoot = path.resolve(process.cwd(), 'src')
const aos4Root = path.join(sourceRoot, 'aos4')
const importPattern = /(?:\bfrom\s*|\bimport\s*\(\s*|\bimport\s*)['"]([^'"]+)['"]/g

const sourceFiles = async (directory: string): Promise<string[]> => {
  const entries = await readdir(directory, { withFileTypes: true })
  const children = await Promise.all(
    entries.map(async entry => {
      const child = path.join(directory, entry.name)
      if (entry.isDirectory()) return sourceFiles(child)
      return /\.[cm]?[jt]sx?$/.test(entry.name) ? [child] : []
    })
  )
  return children.flat().sort((left, right) => left.localeCompare(right))
}

const importedSpecifiers = (source: string): string[] =>
  Array.from(source.matchAll(importPattern), match => match[1])

describe('AoS 4 legacy isolation', () => {
  it('does not import from the AoS 3 application or rules graph', async () => {
    const sourceDirectories = new Set(
      (await readdir(sourceRoot, { withFileTypes: true }))
        .filter(entry => entry.isDirectory() && entry.name !== 'aos4')
        .map(entry => entry.name)
    )
    const violations: string[] = []

    for (const file of await sourceFiles(aos4Root)) {
      const source = await readFile(file, 'utf8')
      importedSpecifiers(source).forEach(specifier => {
        if (specifier.startsWith('.')) {
          const resolved = path.resolve(path.dirname(file), specifier)
          if (resolved !== aos4Root && !resolved.startsWith(`${aos4Root}${path.sep}`)) {
            violations.push(`${path.relative(sourceRoot, file)} -> ${specifier}`)
          }
          return
        }

        const topLevel = specifier.split('/')[0]
        if (sourceDirectories.has(topLevel)) {
          violations.push(`${path.relative(sourceRoot, file)} -> ${specifier}`)
        }
      })
    }

    expect(violations).toEqual([])
  })
})
