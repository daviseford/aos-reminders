import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  DEFAULT_OFFICIAL_NAMING_DISCREPANCIES_PATH,
  loadOfficialNamingDiscrepancyLedger,
  sweepOfficialRosterOptions,
  type OfficialProfileSweepEntity,
  type OfficialProfileSweepRecord,
} from './officialProfileSweep'

/**
 * `yarn data:aos4:sweep` — the re-runnable official-profile sweep (issue #1875). Compares every
 * effective officially-established roster option in the checked-in Battle Profiles ledger against
 * the checked-in runtime projection and fails when any finding remains: an unmatched option, a
 * conflated pair of official names, or a stale reviewed naming discrepancy.
 */

interface Arguments {
  officialProfilesPath: string
  runtimePath: string
  discrepanciesPath: string
}

const nextValue = (values: string[], index: number, flag: string): string => {
  const value = values[index + 1]
  if (!value || value.startsWith('--')) throw new Error(`${flag} requires a value`)
  return value
}

export const parseOfficialProfileSweepArguments = (values: string[]): Arguments => {
  const parsed: Arguments = {
    officialProfilesPath: path.join('data', 'aos4', 'catalog', 'official-battle-profiles.json'),
    runtimePath: path.join('src', 'aos4', 'generated', 'corpus', 'runtime.json'),
    discrepanciesPath: DEFAULT_OFFICIAL_NAMING_DISCREPANCIES_PATH,
  }
  for (let index = 0; index < values.length; index += 1) {
    const value = values[index]
    if (value === '--official-battle-profiles') {
      parsed.officialProfilesPath = nextValue(values, index, value)
      index += 1
    } else if (value === '--runtime') {
      parsed.runtimePath = nextValue(values, index, value)
      index += 1
    } else if (value === '--naming-discrepancies') {
      parsed.discrepanciesPath = nextValue(values, index, value)
      index += 1
    } else {
      throw new Error(`Unknown argument: ${value}`)
    }
  }
  return parsed
}

const readJson = async <T>(filePath: string): Promise<T> => JSON.parse(await readFile(filePath, 'utf8')) as T

const run = async (): Promise<void> => {
  const arguments_ = parseOfficialProfileSweepArguments(process.argv.slice(2))
  const [ledger, runtime, discrepancyLedger] = await Promise.all([
    readJson<{ records: OfficialProfileSweepRecord[] }>(arguments_.officialProfilesPath),
    readJson<{ entities: OfficialProfileSweepEntity[] }>(arguments_.runtimePath),
    loadOfficialNamingDiscrepancyLedger(arguments_.discrepanciesPath),
  ])
  const result = sweepOfficialRosterOptions(ledger.records, runtime.entities, discrepancyLedger.discrepancies)
  console.log(
    `Swept ${result.comparedRosterOptions} effective officially-established roster options ` +
      `(${result.rosterOptionRecords} total): ${result.matchedByName} matched by name, ` +
      `${result.matchedByReviewedDiscrepancy} by reviewed naming discrepancy, ` +
      `${result.findings.length} findings`
  )
  result.findings.forEach(finding => {
    console.error(`[${finding.code}] ${finding.message}`)
  })
  if (result.findings.length) process.exitCode = 1
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  run().catch(error => {
    console.error(error)
    process.exitCode = 1
  })
}
