import { execFile } from 'node:child_process'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { promisify } from 'node:util'
import {
  buildAos4PublishedChangelog,
  diffAos4Catalogs,
  retainedLedgerEntries,
  validateChangelogLedger,
  AOS4_CHANGELOG_SCHEMA_VERSION,
  type ChangelogAcceptanceRecords,
  type ChangelogLedgerEntry,
} from '../changelog'
import { artifactChecksum } from '../data/artifact'
import type { Aos4Catalog } from '../domain'
import { inflateRuntimeProjection } from '../runtimeProjection/inflate'
import { stableJson } from './serialization'

const DEFAULT_LEDGER = path.join('data', 'aos4', 'changelog', 'ledger.json')
const DEFAULT_RECORDS_DIRECTORY = path.join('data', 'aos4', 'changelog', 'records')
const DEFAULT_ARTIFACT = path.join('src', 'aos4', 'generated', 'changelog', 'changelog.json')
const DEFAULT_RUNTIME = path.join('src', 'aos4', 'generated', 'corpus', 'runtime.json')

export interface ChangelogCommandArguments {
  ledgerPath: string
  recordsDirectory: string
  artifactPath: string
  runtimePath: string
  write: boolean
}

export interface ChangelogCommandIo {
  /**
   * Resolves the prior runtime projection bytes an acceptance diffed against. The CLI resolves
   * them from git history (`git cat-file blob <commit>:<runtime path>`); tests inject fixture
   * bytes. Verification never calls this: it recomputes the artifact from checked-in files alone.
   */
  resolvePriorProjectionBytes: (entry: ChangelogLedgerEntry) => Promise<Uint8Array>
}

const execFileAsync = promisify(execFile)

export const createGitPriorProjectionResolver = (
  runtimePath = DEFAULT_RUNTIME
): ChangelogCommandIo['resolvePriorProjectionBytes'] => {
  const blobPath = runtimePath.replaceAll('\\', '/')
  return async entry => {
    const revision = `${entry.prior.commit}:${blobPath}`
    try {
      const { stdout } = await execFileAsync('git', ['cat-file', 'blob', revision], {
        encoding: 'buffer',
        maxBuffer: 256 * 1024 * 1024,
        timeout: 60_000,
      })
      return new Uint8Array(stdout)
    } catch (error) {
      throw new Error(
        `git cat-file blob ${revision} failed while resolving the prior runtime projection for ` +
          `changelog entry ${entry.id}: ${(error as Error).message}`
      )
    }
  }
}

const nextValue = (arguments_: string[], index: number, flag: string): string => {
  const value = arguments_[index + 1]
  if (!value || value.startsWith('--')) throw new Error(`${flag} requires a value`)
  return value
}

export const parseChangelogCommandArguments = (arguments_: string[]): ChangelogCommandArguments => {
  const parsed: ChangelogCommandArguments = {
    ledgerPath: DEFAULT_LEDGER,
    recordsDirectory: DEFAULT_RECORDS_DIRECTORY,
    artifactPath: DEFAULT_ARTIFACT,
    runtimePath: DEFAULT_RUNTIME,
    write: false,
  }
  const valueFlags: Record<string, keyof ChangelogCommandArguments> = {
    '--ledger': 'ledgerPath',
    '--records': 'recordsDirectory',
    '--artifact': 'artifactPath',
    '--runtime': 'runtimePath',
  }
  for (let index = 0; index < arguments_.length; index += 1) {
    const argument = arguments_[index]
    if (argument === '--write') {
      parsed.write = true
    } else if (valueFlags[argument]) {
      parsed[valueFlags[argument]] = nextValue(arguments_, index, argument) as never
      index += 1
    } else {
      throw new Error(`Unknown argument: ${argument}`)
    }
  }
  return parsed
}

const checksumOfText = (content: string): string => artifactChecksum(new TextEncoder().encode(content))

// Git's text checkout may materialize committed LF JSON as CRLF on Windows. Ledger pins,
// product checksums, and drift comparisons are all LF-normalized.
const normalizeEol = (content: string): string => content.replaceAll('\r\n', '\n')

export const loadChangelogLedger = async (ledgerPath: string): Promise<ChangelogLedgerEntry[]> => {
  let content: string
  try {
    content = await readFile(ledgerPath, 'utf8')
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      throw new Error(`Changelog ledger is missing: ${ledgerPath}`)
    }
    throw error
  }
  return validateChangelogLedger(JSON.parse(content))
}

const recordFilePath = (recordsDirectory: string, entryId: string): string =>
  path.join(recordsDirectory, `${entryId}.json`)

/**
 * SHA-256 of the canonical stable-JSON serialization of the full ledger entry (selectors and
 * snapshot pins included), stamped into each record file so editing an entry after generation
 * can never be paired with its stale records.
 */
const ledgerEntryChecksum = (entry: ChangelogLedgerEntry): string => checksumOfText(stableJson(entry))

const readCheckedInRuntime = async (runtimePath: string): Promise<string> => {
  try {
    return normalizeEol(await readFile(runtimePath, 'utf8'))
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      throw new Error(`Checked-in runtime projection is missing: ${runtimePath}`)
    }
    throw error
  }
}

const assertCurrentRuntimePin = (entry: ChangelogLedgerEntry, runtimeChecksum: string): void => {
  if (runtimeChecksum !== entry.current.runtimeSha256) {
    throw new Error(
      `Checked-in runtime projection checksum ${runtimeChecksum} does not match changelog entry ` +
        `${entry.id}, which pins current.runtimeSha256 ${entry.current.runtimeSha256}`
    )
  }
}

const inflateCatalog = (content: string, label: string): Aos4Catalog => {
  try {
    return inflateRuntimeProjection(JSON.parse(content)).catalog
  } catch (error) {
    throw new Error(`${label}: ${(error as Error).message}`)
  }
}

const generateAcceptanceRecords = async (
  entry: ChangelogLedgerEntry,
  inflateCurrentCatalog: (entryId: string) => Aos4Catalog,
  runtimeChecksum: string,
  io: ChangelogCommandIo
): Promise<string> => {
  // A missing record file can only be regenerated while its accepted runtime snapshot is the
  // checked-in one; older acceptances keep their append-only record files instead.
  assertCurrentRuntimePin(entry, runtimeChecksum)
  const priorBytes = await io.resolvePriorProjectionBytes(entry)
  const priorChecksum = artifactChecksum(priorBytes)
  if (priorChecksum !== entry.prior.runtimeBlobSha256) {
    throw new Error(
      `Prior runtime blob for changelog entry ${entry.id} has checksum ${priorChecksum}; the ledger ` +
        `pins ${entry.prior.runtimeBlobSha256} at ${entry.prior.commit}`
    )
  }
  const prior = inflateCatalog(
    new TextDecoder().decode(priorBytes),
    `Prior runtime projection for changelog entry ${entry.id} is invalid`
  )
  const current = inflateCurrentCatalog(entry.id)
  const diffed = diffAos4Catalogs(prior, current, {
    publications: entry.publications,
    cohorts: entry.cohorts,
  })
  const records: ChangelogAcceptanceRecords = {
    schemaVersion: AOS4_CHANGELOG_SCHEMA_VERSION,
    entryId: entry.id,
    ledgerEntrySha256: ledgerEntryChecksum(entry),
    priorGeneratedAt: diffed.priorGeneratedAt,
    currentGeneratedAt: diffed.currentGeneratedAt,
    publications: diffed.publications,
    records: diffed.records,
  }
  return stableJson(records)
}

/** Loads and validates one acceptance's record file, or returns null when the file is absent. */
const loadAcceptanceRecordsIfPresent = async (
  recordsDirectory: string,
  entry: ChangelogLedgerEntry
): Promise<ChangelogAcceptanceRecords | null> => {
  const filePath = recordFilePath(recordsDirectory, entry.id)
  let content: string
  try {
    content = await readFile(filePath, 'utf8')
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return null
    throw error
  }
  const value = JSON.parse(content) as ChangelogAcceptanceRecords
  if (value.schemaVersion !== AOS4_CHANGELOG_SCHEMA_VERSION || value.entryId !== entry.id) {
    throw new Error(`Changelog record file ${filePath} has an incompatible schema`)
  }
  return value
}

const loadAcceptanceRecords = async (
  recordsDirectory: string,
  entry: ChangelogLedgerEntry
): Promise<ChangelogAcceptanceRecords> => {
  const records = await loadAcceptanceRecordsIfPresent(recordsDirectory, entry)
  if (!records) {
    const filePath = recordFilePath(recordsDirectory, entry.id)
    throw new Error(`Changelog record file is missing for entry ${entry.id}: ${filePath}`)
  }
  if (records.ledgerEntrySha256 !== ledgerEntryChecksum(entry)) {
    throw new Error(
      `Changelog record file for entry ${entry.id} no longer matches its ledger entry: the ledger ` +
        `entry changed after its records were generated; restore the entry or regenerate with --write`
    )
  }
  return records
}

const writeProduct = async (filePath: string, bytes: string): Promise<void> => {
  await mkdir(path.dirname(filePath), { recursive: true })
  await writeFile(filePath, bytes, 'utf8')
  console.log(`Wrote ${filePath} (${checksumOfText(bytes)})`)
}

const verifyArtifactProduct = async (artifactPath: string, bytes: string): Promise<void> => {
  let current: string
  try {
    current = await readFile(artifactPath, 'utf8')
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      throw new Error(`Generated changelog artifact is missing: ${artifactPath}`)
    }
    throw error
  }
  if (normalizeEol(current) !== bytes) {
    throw new Error(`Generated changelog artifact has drifted: ${artifactPath}`)
  }
  console.log(`Verified ${artifactPath} (${checksumOfText(bytes)})`)
}

/**
 * Generates (`--write`, git required for missing record files) or verifies (default, git-free)
 * the published changelog artifact from the reviewed acceptance ledger and its checked-in
 * per-acceptance record files.
 */
export const runChangelogCommand = async (
  arguments_: ChangelogCommandArguments,
  io: ChangelogCommandIo
): Promise<void> => {
  const entries = await loadChangelogLedger(arguments_.ledgerPath)
  const newest = entries.length ? entries[entries.length - 1] : undefined
  // Record files the write pass already read or generated, so each file is read at most once.
  const preloadedRecords = new Map<string, ChangelogAcceptanceRecords>()
  if (newest) {
    const currentRuntime = await readCheckedInRuntime(arguments_.runtimePath)
    const runtimeChecksum = checksumOfText(currentRuntime)
    assertCurrentRuntimePin(newest, runtimeChecksum)
    if (arguments_.write) {
      // The checked-in runtime is inflated at most once, shared by every entry missing a record file.
      let currentCatalog: Aos4Catalog | undefined
      const inflateCurrentCatalog = (entryId: string): Aos4Catalog =>
        (currentCatalog ??= inflateCatalog(
          currentRuntime,
          `Checked-in runtime projection for changelog entry ${entryId} is invalid`
        ))
      for (const entry of entries) {
        const existing = await loadAcceptanceRecordsIfPresent(arguments_.recordsDirectory, entry)
        // A record file is only reusable while it still binds to its ledger entry; a stale file is
        // regenerated when the entry's accepted snapshot is the checked-in runtime, and otherwise
        // the prior snapshot pin is unrecoverable, so the write fails closed.
        if (existing && existing.ledgerEntrySha256 === ledgerEntryChecksum(entry)) {
          preloadedRecords.set(entry.id, existing)
          continue
        }
        if (existing && entry.current.runtimeSha256 !== runtimeChecksum) {
          throw new Error(
            `Changelog ledger entry ${entry.id} changed after its acceptance records were generated, ` +
              `and its snapshots are no longer recomputable against the checked-in runtime; restore ` +
              `the entry or regenerate its records from a full clone`
          )
        }
        const bytes = await generateAcceptanceRecords(entry, inflateCurrentCatalog, runtimeChecksum, io)
        await writeProduct(recordFilePath(arguments_.recordsDirectory, entry.id), bytes)
        preloadedRecords.set(entry.id, JSON.parse(bytes) as ChangelogAcceptanceRecords)
      }
    }
  }
  const recordsByEntryId = new Map<string, ChangelogAcceptanceRecords>()
  for (const entry of retainedLedgerEntries(entries)) {
    recordsByEntryId.set(
      entry.id,
      preloadedRecords.get(entry.id) ?? (await loadAcceptanceRecords(arguments_.recordsDirectory, entry))
    )
  }
  const artifactBytes = stableJson(buildAos4PublishedChangelog(entries, recordsByEntryId))
  if (arguments_.write) {
    await writeProduct(arguments_.artifactPath, artifactBytes)
  } else {
    await verifyArtifactProduct(arguments_.artifactPath, artifactBytes)
  }
}

const run = async (): Promise<void> => {
  const arguments_ = parseChangelogCommandArguments(process.argv.slice(2))
  await runChangelogCommand(arguments_, {
    resolvePriorProjectionBytes: createGitPriorProjectionResolver(arguments_.runtimePath),
  })
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  run().catch(error => {
    console.error(error)
    process.exitCode = 1
  })
}
