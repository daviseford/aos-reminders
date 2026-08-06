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

describe('architecture boundaries', () => {
  it('keeps the domain layer free of outward dependencies', async () => {
    const sourceDirectories = new Set(
      (await readdir(sourceRoot, { withFileTypes: true }))
        .filter(entry => entry.isDirectory() && entry.name !== 'aos4')
        .map(entry => entry.name)
    )
    // Read concurrently: this walks every file under src/aos4, and doing it one await at a time
    // left the test slow enough to trip the default timeout when the suite is under load.
    const violations = (
      await Promise.all(
        (await sourceFiles(aos4Root)).map(async file => {
          const source = await readFile(file, 'utf8')
          return importedSpecifiers(source).flatMap(specifier => {
            if (specifier.startsWith('.')) {
              const resolved = path.resolve(path.dirname(file), specifier)
              const outside = resolved !== aos4Root && !resolved.startsWith(`${aos4Root}${path.sep}`)
              return outside ? [`${path.relative(sourceRoot, file)} -> ${specifier}`] : []
            }
            const topLevel = specifier.split('/')[0]
            return sourceDirectories.has(topLevel)
              ? [`${path.relative(sourceRoot, file)} -> ${specifier}`]
              : []
          })
        })
      )
    ).flat()

    expect(violations).toEqual([])
  })
})
