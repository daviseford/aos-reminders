import { createHash } from 'node:crypto'
import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import type { ArtifactManifest } from '../data'
import { stableCompactJson, stableJson } from '../generate/serialization'
import {
  evaluateCertification,
  verifyCertificationManifest,
  type CertificationInventoryBinding,
  type CertificationIssue,
  type SourceInventory,
} from './certification'
import { parseCertificationManifest, parseReviewLedger, validateReviewLedger } from './findings'
import type { ReviewPacketSafeIndex, ReviewPacketWorkspace } from './packets'
import {
  AOS4_REVIEW_SCHEMA_VERSION,
  type CertificationInput,
  type FindingResolution,
  type FindingVerification,
  type HumanReviewSignoff,
  type ReviewAssignment,
  type ReviewCalibration,
  type ReviewFinding,
  type ReviewerResult,
} from './records'

const DEFAULT_CURRENT = path.join('data', 'aos4', 'certifications', 'current.json')
const DEFAULT_WORKSPACE_INDEX = path.join('.cache', 'aos4', 'review', 'index.json')
const DEFAULT_WORKSPACE = path.join('.cache', 'aos4', 'review', 'workspace.json')

export interface CertificationCommandArguments {
  currentPath: string
  certificationDirectory?: string
  full: boolean
  writeSummary: boolean
}

interface CertificationPointer {
  schemaVersion: 1
  directory: string
}

interface ProtocolFile {
  protocolVersion: string
}

interface RubricFile {
  rubricVersion: string
}

const readJson = async <T>(filePath: string): Promise<T> => JSON.parse(await readFile(filePath, 'utf8')) as T

const repoPath = (repoRoot: string, relativePath: string): string => {
  const resolved = path.resolve(repoRoot, relativePath)
  if (resolved !== repoRoot && !resolved.startsWith(`${repoRoot}${path.sep}`)) {
    throw new Error(`Certification path escapes the repository: ${relativePath}`)
  }
  return resolved
}

const checksumText = (value: string): string =>
  createHash('sha256').update(value.replaceAll('\r\n', '\n'), 'utf8').digest('hex')

export const parseCertificationCommandArguments = (arguments_: string[]): CertificationCommandArguments => {
  const parsed: CertificationCommandArguments = {
    currentPath: DEFAULT_CURRENT,
    full: false,
    writeSummary: false,
  }
  for (let index = 0; index < arguments_.length; index += 1) {
    const argument = arguments_[index]
    if (argument === '--full') {
      parsed.full = true
    } else if (argument === '--write-summary') {
      parsed.writeSummary = true
    } else if (argument === '--current' || argument === '--certification-dir') {
      const value = arguments_[index + 1]
      if (!value || value.startsWith('--')) throw new Error(`${argument} requires a value`)
      if (argument === '--current') parsed.currentPath = value
      else parsed.certificationDirectory = value
      index += 1
    } else {
      throw new Error(`Unknown argument: ${argument}`)
    }
  }
  return parsed
}

const certificationDirectory = async (
  repoRoot: string,
  arguments_: CertificationCommandArguments
): Promise<string> => {
  if (arguments_.certificationDirectory) {
    return repoPath(repoRoot, arguments_.certificationDirectory)
  }
  const pointerPath = repoPath(repoRoot, arguments_.currentPath)
  const pointer = await readJson<CertificationPointer>(pointerPath)
  if (pointer.schemaVersion !== 1 || !pointer.directory || path.isAbsolute(pointer.directory)) {
    throw new Error(`Invalid certification pointer: ${arguments_.currentPath}`)
  }
  return repoPath(repoRoot, pointer.directory)
}

const namedJson = <T>(
  name: string,
  inputs: Array<{ name: string; path: string }>,
  files: ReadonlyMap<string, string>
): T => {
  const binding = inputs.find(value => value.name === name)
  if (!binding) throw new Error(`Certification input is missing: ${name}`)
  const content = files.get(binding.path)
  if (content === undefined) {
    throw new Error(`Certification input file is missing: ${binding.path}`)
  }
  return JSON.parse(content) as T
}

const combinedStatus = (
  evaluationStatus: 'pass' | 'blocked' | 'stale',
  issues: CertificationIssue[]
): 'pass' | 'blocked' | 'stale' =>
  issues.some(value => value.state === 'stale')
    ? 'stale'
    : issues.length || evaluationStatus === 'blocked'
      ? 'blocked'
      : evaluationStatus

export const runCertificationCheck = async (
  arguments_: CertificationCommandArguments,
  repoRoot = process.cwd()
) => {
  const directory = await certificationDirectory(repoRoot, arguments_)
  const manifest = parseCertificationManifest(await readJson<unknown>(path.join(directory, 'manifest.json')))
  const files = new Map<string, string>()
  const currentInputs: CertificationInput[] = []
  for (const input of manifest.inputs) {
    const content = await readFile(repoPath(repoRoot, input.path), 'utf8')
    files.set(input.path, content)
    currentInputs.push({
      name: input.name,
      path: input.path,
      checksum: checksumText(content),
    })
  }

  const index = namedJson<ReviewPacketSafeIndex>('review-index', manifest.inputs, files)
  const acceptedManifest = namedJson<ArtifactManifest>('accepted-manifest', manifest.inputs, files)
  const ledger = parseReviewLedger({
    schemaVersion: AOS4_REVIEW_SCHEMA_VERSION,
    assignments: namedJson<ReviewAssignment[]>('review-assignments', manifest.inputs, files),
    calibrations: namedJson<ReviewCalibration[]>('review-calibrations', manifest.inputs, files),
    results: namedJson<ReviewerResult[]>('review-results', manifest.inputs, files),
    findings: namedJson<ReviewFinding[]>('review-findings', manifest.inputs, files),
    resolutions: namedJson<FindingResolution[]>('review-resolutions', manifest.inputs, files),
    verifications: namedJson<FindingVerification[]>('review-verifications', manifest.inputs, files),
    signoffs: namedJson<HumanReviewSignoff[]>('review-signoffs', manifest.inputs, files),
  })
  const protocol = namedJson<ProtocolFile>('review-protocol', manifest.inputs, files)
  const rubric = namedJson<RubricFile>('review-rubric', manifest.inputs, files)
  const inventoryFile = namedJson<SourceInventory>('source-inventory', manifest.inputs, files)
  const inventoryInput = currentInputs.find(value => value.name === 'source-inventory')
  if (!inventoryInput) throw new Error('Certification source inventory binding is missing')
  const inventoryBinding: CertificationInventoryBinding = {
    checksum: inventoryInput.checksum,
    observedAt: inventoryFile.observedAt,
    complete: inventoryFile.complete,
  }

  const evaluation = evaluateCertification({
    index,
    ledger,
    inventory: inventoryFile,
    acceptedArtifactChecksums: acceptedManifest.artifacts.map(artifact => artifact.checksum),
  })
  const manifestIssues = verifyCertificationManifest({
    manifest,
    evaluation,
    currentInputs,
    ledger,
    inventory: inventoryBinding,
    protocolVersion: protocol.protocolVersion,
    rubricVersion: rubric.rubricVersion,
  })
  const issues = [...evaluation.issues, ...manifestIssues].sort(
    (left, right) =>
      left.path.localeCompare(right.path) ||
      left.code.localeCompare(right.code) ||
      left.message.localeCompare(right.message)
  )
  const status = combinedStatus(evaluation.status, manifestIssues)
  const summary = { ...evaluation.summary, status, issues }

  if (arguments_.full) {
    const workspaceIndex = await readJson<unknown>(repoPath(repoRoot, DEFAULT_WORKSPACE_INDEX))
    if (stableCompactJson(workspaceIndex) !== stableCompactJson(index)) {
      throw new Error('Prepared local review index differs from the checked-in certification index')
    }
    const workspace = await readJson<ReviewPacketWorkspace>(repoPath(repoRoot, DEFAULT_WORKSPACE))
    const packets = workspace.pairs.flatMap(pair => [pair.blindPacket, pair.comparisonPacket])
    const fullLedgerIssues = validateReviewLedger(ledger, packets)
    if (fullLedgerIssues.length) {
      throw new Error(
        `Full review evidence validation failed: ${fullLedgerIssues[0].code} ` +
          `${fullLedgerIssues[0].path}: ${fullLedgerIssues[0].message}`
      )
    }
  }
  if (arguments_.writeSummary) {
    await writeFile(path.join(directory, 'summary.json'), stableJson(summary), 'utf8')
  }
  return {
    ok: status === 'pass' && !issues.length,
    status,
    issues,
    summary,
    evaluation,
  }
}

const run = async (): Promise<void> => {
  const result = await runCertificationCheck(parseCertificationCommandArguments(process.argv.slice(2)))
  console.log(
    `AoS 4 certification ${result.status}: ` +
      `${result.summary.outcomeCounts.pass} pass, ` +
      `${result.summary.outcomeCounts.finding} finding, ` +
      `${result.summary.outcomeCounts['cannot-verify']} cannot-verify`
  )
  result.issues.forEach(value => console.error(`- ${value.code} ${value.path}: ${value.message}`))
  if (!result.ok) process.exitCode = 1
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  run().catch(error => {
    console.error(error)
    process.exitCode = 1
  })
}
