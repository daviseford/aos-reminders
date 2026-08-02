import { execFile } from 'node:child_process'
import { randomUUID } from 'node:crypto'
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { artifactChecksum, assertArtifactChecksum } from './artifact'
import { FileArtifactCache, type ArtifactCache } from './cache'
import type { ArtifactManifest } from './manifest'

const SHA256_PATTERN = /^[0-9a-f]{64}$/
const BUCKET_PATTERN = /^(?!-)(?!.*\.\.)(?!.*\.-)(?!.*-\.)(?!.*-$)[a-z0-9][a-z0-9.-]{1,61}[a-z0-9]$/
const PREFIX_SEGMENT_PATTERN = /^[A-Za-z0-9._-]+$/
const PROFILE_PATTERN = /^[A-Za-z0-9_.@+-]{1,128}$/
const REGION_PATTERN = /^[a-z0-9-]{1,64}$/
const EXPECTED_OWNER_PATTERN = /^\d{12}$/
const MAX_AWS_OUTPUT_BYTES = 1024 * 1024

export type ArtifactStoreErrorCode =
  | 'invalid-store-configuration'
  | 'remote-missing'
  | 'remote-corrupt'
  | 'remote-conflict'
  | 'remote-command-failed'
  | 'local-missing'
  | 'local-corrupt'

export class ArtifactStoreError extends Error {
  constructor(
    readonly code: ArtifactStoreErrorCode,
    message: string,
    readonly cause?: unknown
  ) {
    super(message)
    this.name = 'ArtifactStoreError'
  }
}

export interface ArtifactStoreMetadata {
  checksum: string
  byteLength: number
}

export interface ArtifactStore {
  inspect(checksum: string): Promise<ArtifactStoreMetadata | undefined>
  read(checksum: string): Promise<Uint8Array | undefined>
  create(checksum: string, bytes: Uint8Array): Promise<'created' | 'exists'>
}

export interface ArtifactTransferSummary {
  total: number
  transferred: number
  reused: number
  missing: number
}

export interface AwsCliResult {
  exitCode: number
  stdout: string
  stderr: string
}

export type AwsCliRunner = (arguments_: string[]) => Promise<AwsCliResult>

export interface AwsS3ArtifactStoreConfiguration {
  bucket: string
  prefix?: string
  expectedOwner: string
  profile?: string
  region?: string
}

type ArtifactStoreEnvironment = Record<string, string | undefined>

interface ArtifactRequirement {
  checksum: string
  byteLength: number
}

const normalizedChecksum = (checksum: string): string => {
  const normalized = checksum.toLowerCase()
  if (!SHA256_PATTERN.test(normalized)) {
    throw new ArtifactStoreError('local-corrupt', `Invalid artifact checksum: ${checksum}`)
  }
  return normalized
}

const checksumBase64 = (checksum: string): string =>
  Buffer.from(normalizedChecksum(checksum), 'hex').toString('base64')

const invalidConfiguration = (field: string): never => {
  throw new ArtifactStoreError('invalid-store-configuration', `Invalid private artifact store ${field}`)
}

const validatedConfiguration = (
  configuration: AwsS3ArtifactStoreConfiguration
): Required<Pick<AwsS3ArtifactStoreConfiguration, 'bucket' | 'expectedOwner'>> &
  Pick<AwsS3ArtifactStoreConfiguration, 'prefix' | 'profile' | 'region'> => {
  if (!BUCKET_PATTERN.test(configuration.bucket)) invalidConfiguration('bucket')
  if (!EXPECTED_OWNER_PATTERN.test(configuration.expectedOwner)) invalidConfiguration('expected owner')
  const prefix = configuration.prefix?.replace(/^\/+|\/+$/g, '')
  if (
    prefix &&
    (!prefix.split('/').every(segment => PREFIX_SEGMENT_PATTERN.test(segment) && segment !== '..') ||
      prefix.includes('//'))
  ) {
    invalidConfiguration('prefix')
  }
  if (configuration.profile && !PROFILE_PATTERN.test(configuration.profile)) {
    invalidConfiguration('profile')
  }
  if (configuration.region && !REGION_PATTERN.test(configuration.region)) {
    invalidConfiguration('region')
  }
  return { ...configuration, prefix }
}

const defaultAwsCliRunner: AwsCliRunner = arguments_ =>
  new Promise(resolve => {
    execFile(
      'aws',
      arguments_,
      { encoding: 'utf8', maxBuffer: MAX_AWS_OUTPUT_BYTES, windowsHide: true },
      (error, stdout, stderr) => {
        const rawCode: unknown = error && 'code' in error ? error.code : undefined
        const exitCode = typeof rawCode === 'number' ? rawCode : error ? 1 : 0
        resolve({ exitCode, stdout, stderr })
      }
    )
  })

const parsedObject = (value: string, operation: string): Record<string, unknown> => {
  try {
    const parsed: unknown = JSON.parse(value)
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      return parsed as Record<string, unknown>
    }
  } catch {
    // Converted into a bounded, store-safe error below.
  }
  throw new ArtifactStoreError(
    'remote-command-failed',
    `Private artifact store ${operation} returned invalid metadata`
  )
}

const missingObject = (result: AwsCliResult): boolean => {
  if (/(?:NoSuchBucket|AccessDenied|PermanentRedirect|AuthorizationHeaderMalformed)/i.test(result.stderr)) {
    return false
  }
  return /(?:NoSuchKey|Not Found|status code:\s*404|\(404\))/i.test(result.stderr)
}

const conditionalExists = (result: AwsCliResult): boolean =>
  /(?:PreconditionFailed|status code:\s*412|\(412\))/i.test(result.stderr)

const conditionalConflict = (result: AwsCliResult): boolean =>
  /(?:ConditionalRequestConflict|status code:\s*409|\(409\))/i.test(result.stderr)

const awsErrorCode = (result: AwsCliResult): string | undefined => {
  const match = /An error occurred \(([A-Za-z0-9._-]{1,64})\)/i.exec(result.stderr)
  return match?.[1]
}

const remoteCommandError = (
  operation: string,
  result: AwsCliResult,
  code: ArtifactStoreErrorCode = 'remote-command-failed'
): ArtifactStoreError => {
  const detail = awsErrorCode(result)
  return new ArtifactStoreError(
    code,
    `Private artifact store ${operation} failed${detail ? ` (${detail})` : ''}`
  )
}

const assertRemoteMetadata = (
  checksum: string,
  metadata: Record<string, unknown>,
  operation: string
): ArtifactStoreMetadata => {
  const byteLength = metadata.ContentLength
  const remoteChecksum = metadata.ChecksumSHA256
  if (
    typeof byteLength !== 'number' ||
    !Number.isSafeInteger(byteLength) ||
    byteLength < 0 ||
    remoteChecksum !== checksumBase64(checksum)
  ) {
    throw new ArtifactStoreError(
      'remote-corrupt',
      `Private artifact store ${operation} returned unexpected integrity metadata`
    )
  }
  return { checksum: normalizedChecksum(checksum), byteLength }
}

export class AwsS3ArtifactStore implements ArtifactStore {
  private readonly configuration: ReturnType<typeof validatedConfiguration>

  constructor(
    configuration: AwsS3ArtifactStoreConfiguration,
    private readonly runner: AwsCliRunner = defaultAwsCliRunner
  ) {
    this.configuration = validatedConfiguration(configuration)
  }

  private keyFor(checksum: string): string {
    const blobKey = `blobs/${normalizedChecksum(checksum)}`
    return this.configuration.prefix ? `${this.configuration.prefix}/${blobKey}` : blobKey
  }

  private commonArguments(checksum: string): string[] {
    return [
      '--bucket',
      this.configuration.bucket,
      '--key',
      this.keyFor(checksum),
      '--expected-bucket-owner',
      this.configuration.expectedOwner,
      ...(this.configuration.profile ? ['--profile', this.configuration.profile] : []),
      ...(this.configuration.region ? ['--region', this.configuration.region] : []),
    ]
  }

  async inspect(checksum: string): Promise<ArtifactStoreMetadata | undefined> {
    const result = await this.runner([
      's3api',
      'head-object',
      '--bucket',
      this.configuration.bucket,
      '--key',
      this.keyFor(checksum),
      '--checksum-mode',
      'ENABLED',
      '--expected-bucket-owner',
      this.configuration.expectedOwner,
      ...(this.configuration.profile ? ['--profile', this.configuration.profile] : []),
      ...(this.configuration.region ? ['--region', this.configuration.region] : []),
      '--output',
      'json',
    ])
    if (result.exitCode !== 0) {
      if (missingObject(result)) return undefined
      throw remoteCommandError('metadata request', result)
    }
    return assertRemoteMetadata(checksum, parsedObject(result.stdout, 'metadata request'), 'metadata request')
  }

  async read(checksum: string): Promise<Uint8Array | undefined> {
    const directory = await mkdtemp(path.join(tmpdir(), 'aos4-artifact-store-'))
    const destination = path.join(directory, randomUUID())
    try {
      const result = await this.runner([
        's3api',
        'get-object',
        ...this.commonArguments(checksum),
        '--checksum-mode',
        'ENABLED',
        '--output',
        'json',
        destination,
      ])
      if (result.exitCode !== 0) {
        if (missingObject(result)) return undefined
        throw remoteCommandError('download', result)
      }
      const metadata = assertRemoteMetadata(checksum, parsedObject(result.stdout, 'download'), 'download')
      const value = new Uint8Array(await readFile(destination))
      if (value.byteLength !== metadata.byteLength || artifactChecksum(value) !== metadata.checksum) {
        throw new ArtifactStoreError(
          'remote-corrupt',
          `Remote artifact ${normalizedChecksum(checksum)} failed local integrity verification`
        )
      }
      return value
    } finally {
      await rm(directory, { recursive: true, force: true })
    }
  }

  async create(checksum: string, bytes: Uint8Array): Promise<'created' | 'exists'> {
    const normalized = normalizedChecksum(checksum)
    assertArtifactChecksum(bytes, normalized)
    const directory = await mkdtemp(path.join(tmpdir(), 'aos4-artifact-store-'))
    const source = path.join(directory, randomUUID())
    try {
      await writeFile(source, bytes, { flag: 'wx' })
      const arguments_ = [
        's3api',
        'put-object',
        ...this.commonArguments(normalized),
        '--body',
        source,
        '--checksum-algorithm',
        'SHA256',
        '--checksum-sha256',
        checksumBase64(normalized),
        '--if-none-match',
        '*',
        '--output',
        'json',
      ]
      let result = await this.runner(arguments_)
      if (conditionalConflict(result)) result = await this.runner(arguments_)
      if (result.exitCode === 0) return 'created'
      if (conditionalExists(result)) return 'exists'
      if (conditionalConflict(result)) throw remoteCommandError('upload', result, 'remote-conflict')
      throw remoteCommandError('upload', result)
    } finally {
      await rm(directory, { recursive: true, force: true })
    }
  }
}

export class RestoringArtifactCache implements ArtifactCache {
  constructor(
    private readonly local: ArtifactCache,
    private readonly store: ArtifactStore
  ) {}

  async get(checksum: string): Promise<Uint8Array | undefined> {
    const normalized = normalizedChecksum(checksum)
    const local = await this.local.get(normalized)
    if (local) {
      if (artifactChecksum(local) !== normalized) {
        throw new ArtifactStoreError('local-corrupt', `Local artifact ${normalized} is corrupt`)
      }
      return local
    }
    const metadata = await this.store.inspect(normalized)
    if (!metadata) return undefined
    if (normalizedChecksum(metadata.checksum) !== normalized) {
      throw new ArtifactStoreError(
        'remote-corrupt',
        `Remote artifact ${normalized} has unexpected integrity metadata`
      )
    }
    const remote = await this.store.read(normalized)
    if (!remote) {
      throw new ArtifactStoreError(
        'remote-missing',
        `Remote artifact ${normalized} disappeared during restore`
      )
    }
    if (remote.byteLength !== metadata.byteLength || artifactChecksum(remote) !== normalized) {
      throw new ArtifactStoreError('remote-corrupt', `Remote artifact ${normalized} is corrupt`)
    }
    await this.local.put(normalized, remote)
    return remote
  }

  put(checksum: string, bytes: Uint8Array): Promise<void> {
    return this.local.put(checksum, bytes)
  }
}

export const createArtifactCache = (
  cacheDirectory: string,
  environment: ArtifactStoreEnvironment = process.env,
  runner?: AwsCliRunner
): ArtifactCache => {
  const local = new FileArtifactCache(cacheDirectory)
  const bucket = environment.AOS4_ARTIFACT_STORE_BUCKET
  const prefix = environment.AOS4_ARTIFACT_STORE_PREFIX
  const expectedOwner = environment.AOS4_ARTIFACT_STORE_EXPECTED_OWNER
  if (!bucket && !prefix && !expectedOwner) return local
  if (!bucket || !expectedOwner) {
    throw new ArtifactStoreError(
      'invalid-store-configuration',
      'Private artifact restore requires both bucket and expected owner'
    )
  }
  return new RestoringArtifactCache(
    local,
    new AwsS3ArtifactStore(
      {
        bucket,
        prefix,
        expectedOwner,
        profile: environment.AWS_PROFILE,
        region: environment.AWS_REGION ?? environment.AWS_DEFAULT_REGION,
      },
      runner
    )
  )
}

const requirementsFor = (manifest: ArtifactManifest): ArtifactRequirement[] => {
  if (manifest.schemaVersion !== 1 || !Array.isArray(manifest.artifacts)) {
    throw new ArtifactStoreError('local-corrupt', 'Artifact manifest has an incompatible schema')
  }
  const requirements = new Map<string, ArtifactRequirement>()
  manifest.artifacts.forEach(entry => {
    const checksum = normalizedChecksum(entry.checksum)
    if (!Number.isSafeInteger(entry.byteLength) || entry.byteLength <= 0) {
      throw new ArtifactStoreError('local-corrupt', `Artifact ${checksum} has an invalid byte length`)
    }
    const existing = requirements.get(checksum)
    if (existing && existing.byteLength !== entry.byteLength) {
      throw new ArtifactStoreError('local-corrupt', `Artifact ${checksum} has conflicting byte lengths`)
    }
    requirements.set(checksum, { checksum, byteLength: entry.byteLength })
  })
  return Array.from(requirements.values()).sort((left, right) => left.checksum.localeCompare(right.checksum))
}

const assertBytes = (
  requirement: ArtifactRequirement,
  bytes: Uint8Array,
  location: 'local' | 'remote'
): void => {
  if (bytes.byteLength !== requirement.byteLength || artifactChecksum(bytes) !== requirement.checksum) {
    throw new ArtifactStoreError(
      location === 'local' ? 'local-corrupt' : 'remote-corrupt',
      `${location === 'local' ? 'Local' : 'Remote'} artifact ${requirement.checksum} is corrupt`
    )
  }
}

const assertMetadata = (requirement: ArtifactRequirement, metadata: ArtifactStoreMetadata): void => {
  if (
    normalizedChecksum(metadata.checksum) !== requirement.checksum ||
    metadata.byteLength !== requirement.byteLength
  ) {
    throw new ArtifactStoreError(
      'remote-corrupt',
      `Remote artifact ${requirement.checksum} has unexpected integrity metadata`
    )
  }
}

const mapBounded = async <T>(
  values: T[],
  concurrency: number,
  operation: (value: T) => Promise<void>
): Promise<void> => {
  if (!Number.isSafeInteger(concurrency) || concurrency <= 0 || concurrency > 32) {
    throw new ArtifactStoreError('invalid-store-configuration', 'Invalid artifact transfer concurrency')
  }
  let nextIndex = 0
  let firstError: unknown
  const workers = Array.from({ length: Math.min(concurrency, values.length) }, async () => {
    while (firstError === undefined && nextIndex < values.length) {
      const value = values[nextIndex]
      nextIndex += 1
      try {
        await operation(value)
      } catch (error) {
        firstError ??= error
      }
    }
  })
  await Promise.all(workers)
  if (firstError !== undefined) throw firstError
}

export const pullArtifactManifest = async (
  manifest: ArtifactManifest,
  cache: ArtifactCache,
  store: ArtifactStore,
  concurrency = 4
): Promise<ArtifactTransferSummary> => {
  const requirements = requirementsFor(manifest)
  const summary: ArtifactTransferSummary = {
    total: requirements.length,
    transferred: 0,
    reused: 0,
    missing: 0,
  }
  await mapBounded(requirements, concurrency, async requirement => {
    const local = await cache.get(requirement.checksum)
    if (local) {
      assertBytes(requirement, local, 'local')
      summary.reused += 1
      return
    }
    const metadata = await store.inspect(requirement.checksum)
    if (!metadata) {
      summary.missing += 1
      throw new ArtifactStoreError('remote-missing', `Remote artifact ${requirement.checksum} is missing`)
    }
    assertMetadata(requirement, metadata)
    const remote = await store.read(requirement.checksum)
    if (!remote) {
      summary.missing += 1
      throw new ArtifactStoreError(
        'remote-missing',
        `Remote artifact ${requirement.checksum} disappeared during download`
      )
    }
    assertBytes(requirement, remote, 'remote')
    await cache.put(requirement.checksum, remote)
    summary.transferred += 1
  })
  return summary
}

export const pushArtifactManifest = async (
  manifest: ArtifactManifest,
  cache: ArtifactCache,
  store: ArtifactStore,
  concurrency = 4
): Promise<ArtifactTransferSummary> => {
  const requirements = requirementsFor(manifest)
  for (const requirement of requirements) {
    const local = await cache.get(requirement.checksum)
    if (!local) {
      throw new ArtifactStoreError('local-missing', `Local artifact ${requirement.checksum} is missing`)
    }
    assertBytes(requirement, local, 'local')
  }

  const summary: ArtifactTransferSummary = {
    total: requirements.length,
    transferred: 0,
    reused: 0,
    missing: 0,
  }
  await mapBounded(requirements, concurrency, async requirement => {
    const existing = await store.inspect(requirement.checksum)
    if (existing) {
      assertMetadata(requirement, existing)
      summary.reused += 1
      return
    }
    const local = await cache.get(requirement.checksum)
    if (!local) {
      throw new ArtifactStoreError(
        'local-missing',
        `Local artifact ${requirement.checksum} disappeared before upload`
      )
    }
    assertBytes(requirement, local, 'local')
    const outcome = await store.create(requirement.checksum, local)
    if (outcome === 'created') {
      summary.transferred += 1
      return
    }
    const raced = await store.inspect(requirement.checksum)
    if (!raced) {
      throw new ArtifactStoreError(
        'remote-conflict',
        `Remote artifact ${requirement.checksum} did not exist after a create race`
      )
    }
    assertMetadata(requirement, raced)
    summary.reused += 1
  })
  return summary
}
