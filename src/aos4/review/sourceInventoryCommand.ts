import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import type { ArtifactManifest } from '../data'
import { stableJson } from '../generate/serialization'
import { createSourceInventory, type IndependentSourceObservation } from './sourceInventory'

interface Arguments {
  acceptedManifestPath: string
  revision: string
  observationPaths: string[]
  outputPath: string
}

const nextValue = (values: string[], index: number, flag: string): string => {
  const value = values[index + 1]
  if (!value || value.startsWith('--')) throw new Error(`${flag} requires a value`)
  return value
}

export const parseSourceInventoryArguments = (values: string[]): Arguments => {
  const parsed: Arguments = {
    acceptedManifestPath: path.join('data', 'aos4', 'manifests', 'accepted-2026-08-02.json'),
    revision: '',
    observationPaths: [],
    outputPath: path.join('.cache', 'aos4', 'review', 'source-inventory.json'),
  }
  for (let index = 0; index < values.length; index += 1) {
    const value = values[index]
    if (value === '--accepted-manifest') {
      parsed.acceptedManifestPath = nextValue(values, index, value)
      index += 1
    } else if (value === '--revision') {
      parsed.revision = nextValue(values, index, value)
      index += 1
    } else if (value === '--observation') {
      parsed.observationPaths.push(nextValue(values, index, value))
      index += 1
    } else if (value === '--output') {
      parsed.outputPath = nextValue(values, index, value)
      index += 1
    } else {
      throw new Error(`Unknown argument: ${value}`)
    }
  }
  if (!parsed.revision.trim()) throw new Error('--revision is required')
  if (!parsed.observationPaths.length) {
    throw new Error('At least one --observation is required')
  }
  return parsed
}

const readJson = async <T>(filePath: string): Promise<T> => JSON.parse(await readFile(filePath, 'utf8')) as T

const run = async (): Promise<void> => {
  const arguments_ = parseSourceInventoryArguments(process.argv.slice(2))
  const [acceptedManifest, ...observations] = await Promise.all([
    readJson<ArtifactManifest>(arguments_.acceptedManifestPath),
    ...arguments_.observationPaths.map(value => readJson<IndependentSourceObservation>(value)),
  ])
  const inventory = createSourceInventory({
    revision: arguments_.revision,
    acceptedManifest,
    observations,
  })
  const output = path.resolve(arguments_.outputPath)
  await mkdir(path.dirname(output), { recursive: true })
  await writeFile(output, stableJson(inventory), 'utf8')
  const counts = inventory.entries.reduce<Record<string, number>>((byStatus, entry) => {
    byStatus[entry.status] = (byStatus[entry.status] ?? 0) + 1
    return byStatus
  }, {})
  console.log(`Prepared ${inventory.complete ? 'complete' : 'incomplete'} source inventory: ${output}`)
  console.log(
    Object.entries(counts)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([status, count]) => `${status}=${count}`)
      .join(', ')
  )
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  run().catch(error => {
    console.error(error)
    process.exitCode = 1
  })
}
