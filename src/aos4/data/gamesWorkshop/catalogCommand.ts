import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { stableJson } from '../../generate/serialization'
import { createPinnedHttpsTransport } from '../http'
import { resolveDnsAddresses } from '../urlPolicy'
import {
  createGamesWorkshopDownloadSearchRequest,
  searchCurrentGamesWorkshopDownloads,
} from './downloadCatalog'

interface Arguments {
  output: string
  language: string
  searchTerm: string
}

const nextValue = (values: string[], index: number, flag: string): string => {
  const value = values[index + 1]
  if (!value || value.startsWith('--')) throw new Error(`${flag} requires a value`)
  return value
}

export const parseGamesWorkshopCatalogArguments = (values: string[]): Arguments => {
  const parsed: Arguments = {
    output: path.join('.cache', 'aos4', 'games-workshop', 'downloads.json'),
    language: 'english',
    searchTerm: '',
  }
  for (let index = 0; index < values.length; index += 1) {
    const value = values[index]
    if (value === '--output') {
      parsed.output = nextValue(values, index, value)
      index += 1
    } else if (value === '--language') {
      parsed.language = nextValue(values, index, value)
      index += 1
    } else if (value === '--search') {
      parsed.searchTerm = nextValue(values, index, value)
      index += 1
    } else {
      throw new Error(`Unknown argument: ${value}`)
    }
  }
  return parsed
}

const run = async (): Promise<void> => {
  const arguments_ = parseGamesWorkshopCatalogArguments(process.argv.slice(2))
  const result = await searchCurrentGamesWorkshopDownloads(
    {
      transport: createPinnedHttpsTransport(),
      policy: {
        allowedHosts: ['www.warhammer-community.com'],
        resolveAddresses: resolveDnsAddresses,
      },
    },
    createGamesWorkshopDownloadSearchRequest(arguments_.language, arguments_.searchTerm)
  )
  if (!result.downloads.length) {
    throw new Error(
      result.diagnostics.map(diagnostic => diagnostic.message).join('\n') ||
        'Games Workshop returned no downloads'
    )
  }
  const output = path.resolve(arguments_.output)
  await mkdir(path.dirname(output), { recursive: true })
  await writeFile(
    output,
    stableJson({
      schemaVersion: 1,
      retrievedAt: new Date().toISOString(),
      request: createGamesWorkshopDownloadSearchRequest(arguments_.language, arguments_.searchTerm),
      downloads: result.downloads,
      diagnostics: result.diagnostics,
    }),
    'utf8'
  )
  console.log(`Discovered ${result.downloads.length} Games Workshop downloads: ${output}`)
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  run().catch(error => {
    console.error(error)
    process.exitCode = 1
  })
}
