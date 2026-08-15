import { execFile } from 'node:child_process'
import { createHash } from 'node:crypto'
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
    const { stdout } = await execFileAsync('git', ['cat-file', 'blob', `${entry.prior.commit}:${blobPath}`], {
      encoding: 'buffer',
      maxBuffer: 256 * 1024 * 1024,
    })
    return new Uint8Array(stdout)
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

const sha256Hex = (bytes: Uint8Array): string => createHash('sha256').update(bytes).digest('hex')

const checksumOfText = (content: string): string => sha256Hex(new TextEncoder().encode(content))

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
  currentRuntime: string,
  runtimeChecksum: string,
  io: ChangelogCommandIo
): Promise<string> => {
  // A missing record file can only be regenerated while its accepted runtime snapshot is the
  // checked-in one; older acceptances keep their append-only record files instead.
  assertCurrentRuntimePin(entry, runtimeChecksum)
  const priorBytes = await io.resolvePriorProjectionBytes(entry)
  const priorChecksum = sha256Hex(priorBytes)
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
  const current = inflateCatalog(
    currentRuntime,
    `Checked-in runtime projection for changelog entry ${entry.id} is invalid`
  )
  const diffed = diffAos4Catalogs(prior, current, {
    publications: entry.publications,
    cohorts: entry.cohorts,
  })
  const records: ChangelogAcceptanceRecords = {
    schemaVersion: AOS4_CHANGELOG_SCHEMA_VERSION,
    entryId: entry.id,
    priorGeneratedAt: diffed.priorGeneratedAt,
    currentGeneratedAt: diffed.currentGeneratedAt,
    publications: diffed.publications,
    records: diffed.records,
  }
  return stableJson(records)
}

const loadAcceptanceRecords = async (
  recordsDirectory: string,
  entry: ChangelogLedgerEntry
): Promise<ChangelogAcceptanceRecords> => {
  const filePath = recordFilePath(recordsDirectory, entry.id)
  let content: string
  try {
    content = await readFile(filePath, 'utf8')
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      throw new Error(`Changelog record file is missing for entry ${entry.id}: ${filePath}`)
    }
    throw error
  }
  const value = JSON.parse(content) as ChangelogAcceptanceRecords
  if (value.schemaVersion !== AOS4_CHANGELOG_SCHEMA_VERSION || value.entryId !== entry.id) {
    throw new Error(`Changelog record file ${filePath} has an incompatible schema`)
  }
  return value
}

const fileExists = async (filePath: string): Promise<boolean> =>
  readFile(filePath, 'utf8').then(
    () => true,
    error => {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') return false
      throw error
    }
  )

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
  if (newest) {
    const currentRuntime = await readCheckedInRuntime(arguments_.runtimePath)
    const runtimeChecksum = checksumOfText(currentRuntime)
    assertCurrentRuntimePin(newest, runtimeChecksum)
    if (arguments_.write) {
      for (const entry of entries) {
        if (await fileExists(recordFilePath(arguments_.recordsDirectory, entry.id))) continue
        const bytes = await generateAcceptanceRecords(entry, currentRuntime, runtimeChecksum, io)
        await writeProduct(recordFilePath(arguments_.recordsDirectory, entry.id), bytes)
      }
    }
  }
  const recordsByEntryId = new Map<string, ChangelogAcceptanceRecords>()
  for (const entry of retainedLedgerEntries(entries)) {
    recordsByEntryId.set(entry.id, await loadAcceptanceRecords(arguments_.recordsDirectory, entry))
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
