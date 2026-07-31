import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { stableJson } from '../generate/serialization'
import {
  createGamesWorkshopSourceObservation,
  type GamesWorkshopDiscoverySnapshot,
  type GamesWorkshopObservationClassifications,
} from './gamesWorkshopObservation'

interface Arguments {
  inputPath: string
  classificationsPath?: string
  outputPath: string
}

const nextValue = (values: string[], index: number, flag: string): string => {
  const value = values[index + 1]
  if (!value || value.startsWith('--')) throw new Error(`${flag} requires a value`)
  return value
}

export const parseGamesWorkshopObservationArguments = (values: string[]): Arguments => {
  const parsed: Arguments = {
    inputPath: path.join('.cache', 'aos4', 'games-workshop', 'downloads.json'),
    outputPath: path.join('.cache', 'aos4', 'review', 'games-workshop-observation.json'),
  }
  for (let index = 0; index < values.length; index += 1) {
    const value = values[index]
    if (value === '--input') {
      parsed.inputPath = nextValue(values, index, value)
      index += 1
    } else if (value === '--classifications') {
      parsed.classificationsPath = nextValue(values, index, value)
      index += 1
    } else if (value === '--output') {
      parsed.outputPath = nextValue(values, index, value)
      index += 1
    } else {
      throw new Error(`Unknown argument: ${value}`)
    }
  }
  return parsed
}

const readJson = async <T>(filePath: string): Promise<T> => JSON.parse(await readFile(filePath, 'utf8')) as T

const run = async (): Promise<void> => {
  const arguments_ = parseGamesWorkshopObservationArguments(process.argv.slice(2))
  const [snapshot, classifications] = await Promise.all([
    readJson<GamesWorkshopDiscoverySnapshot>(arguments_.inputPath),
    arguments_.classificationsPath
      ? readJson<GamesWorkshopObservationClassifications>(arguments_.classificationsPath)
      : Promise.resolve(undefined),
  ])
  const observation = createGamesWorkshopSourceObservation(snapshot, classifications)
  const output = path.resolve(arguments_.outputPath)
  await mkdir(path.dirname(output), { recursive: true })
  await writeFile(output, stableJson(observation), 'utf8')
  const nonMaterial = observation.entries.filter(entry => entry.scope === 'explicit-non-material').length
  console.log(
    `Observed ${observation.entries.length} Games Workshop sources: ${output} ` +
      `(${nonMaterial} explicitly non-material)`
  )
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  run().catch(error => {
    console.error(error)
    process.exitCode = 1
  })
}
