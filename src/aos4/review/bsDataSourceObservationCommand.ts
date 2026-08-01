import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  artifactChecksum,
  createPinnedHttpsTransport,
  readResponseBody,
  requestWithTimeout,
  resolveDnsAddresses,
  validateAcquisitionUrl,
} from '../data'
import { pinnedBsDataUrl } from '../data/bsdata'
import { stableJson } from '../generate/serialization'
import type { IndependentSourceObservation, SourceObservationEntry } from './sourceInventory'

/**
 * Independently observe commit-pinned BSData catalogue files for the source inventory.
 *
 * The observer re-fetches each reviewed pinned file live from GitHub and fingerprints the bytes,
 * without reading the accepted manifest. Like the Games Workshop and Wahapedia observers, its
 * output feeds `data:aos4:inventory`, where every material entry must match an accepted artifact.
 */

interface Arguments {
  repository: string
  ref: string
  paths: string[]
  outputPath: string
}

const nextValue = (values: string[], index: number, flag: string): string => {
  const value = values[index + 1]
  if (!value || value.startsWith('--')) throw new Error(`${flag} requires a value`)
  return value
}

export const parseBsDataSourceObservationArguments = (values: string[]): Arguments => {
  const parsed: Arguments = {
    repository: 'BSData/age-of-sigmar-4th',
    ref: '',
    paths: [],
    outputPath: path.join('.cache', 'aos4', 'review', 'bsdata-observation.json'),
  }
  for (let index = 0; index < values.length; index += 1) {
    const value = values[index]
    if (value === '--repository') {
      parsed.repository = nextValue(values, index, value)
      index += 1
    } else if (value === '--ref') {
      parsed.ref = nextValue(values, index, value)
      index += 1
    } else if (value === '--path') {
      parsed.paths.push(nextValue(values, index, value))
      index += 1
    } else if (value === '--output') {
      parsed.outputPath = nextValue(values, index, value)
      index += 1
    } else {
      throw new Error(`Unknown argument: ${value}`)
    }
  }
  if (!/^[0-9a-f]{40}$/.test(parsed.ref)) {
    throw new Error('--ref must be a full 40-character commit SHA')
  }
  if (!parsed.paths.length) throw new Error('At least one --path is required')
  return parsed
}

const run = async (): Promise<void> => {
  const arguments_ = parseBsDataSourceObservationArguments(process.argv.slice(2))
  const transport = createPinnedHttpsTransport()
  const policy = { allowedHosts: ['raw.githubusercontent.com'], resolveAddresses: resolveDnsAddresses }
  const entries: SourceObservationEntry[] = []
  for (const filePath of [...arguments_.paths].sort((left, right) => left.localeCompare(right))) {
    const url = pinnedBsDataUrl(arguments_.repository, arguments_.ref, filePath)
    const validated = await validateAcquisitionUrl(url, policy)
    let availability: SourceObservationEntry['availability'] = 'accessible'
    let fingerprint: string | undefined
    try {
      const response = await requestWithTimeout(
        transport,
        {
          url: validated.url,
          headers: { 'accept-encoding': 'identity' },
          approvedAddresses: validated.approvedAddresses,
        },
        60_000
      )
      if (response.status !== 200) {
        availability = 'inaccessible'
      } else {
        fingerprint = artifactChecksum(await readResponseBody(response, 32 * 1024 * 1024))
      }
    } catch {
      availability = 'inaccessible'
    }
    entries.push({
      publisher: 'bsdata',
      url,
      title: `${arguments_.repository}@${arguments_.ref.slice(0, 12)}: ${filePath}`,
      scope: 'material',
      availability,
      ...(fingerprint ? { fingerprint } : {}),
    })
  }
  const observation: IndependentSourceObservation = {
    schemaVersion: 1,
    observedAt: new Date().toISOString(),
    producedBy: 'bsdata-source-observer/v1 (live pinned raw.githubusercontent.com fetch)',
    independentFromAcceptedManifest: true,
    entries,
  }
  const output = path.resolve(arguments_.outputPath)
  await mkdir(path.dirname(output), { recursive: true })
  await writeFile(output, stableJson(observation), 'utf8')
  console.log(`Observed ${entries.length} BSData sources: ${output}`)
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  run().catch(error => {
    console.error(error)
    process.exitCode = 1
  })
}
