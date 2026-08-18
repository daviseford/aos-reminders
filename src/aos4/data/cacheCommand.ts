import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  AwsS3ArtifactStore,
  pullArtifactManifest,
  pushArtifactManifest,
  type AwsS3ArtifactStoreConfiguration,
} from './artifactStore'
import { ACCEPTED_MANIFEST_PATH } from './acceptedRevision'
import { FileArtifactCache } from './cache'
import type { ArtifactManifest } from './manifest'

const DEFAULT_ACCEPTED_MANIFEST = ACCEPTED_MANIFEST_PATH
const DEFAULT_CACHE_DIRECTORY = '.cache/aos4/artifacts'
const DEFAULT_CONCURRENCY = 4

export interface ArtifactCacheArguments {
  operation: 'pull' | 'push'
  manifestPath: string
  cacheDirectory: string
  concurrency: number
  store: AwsS3ArtifactStoreConfiguration
}

type Environment = Record<string, string | undefined>

const nextValue = (arguments_: string[], index: number, flag: string): string => {
  const value = arguments_[index + 1]
  if (!value || value.startsWith('--')) throw new Error(`${flag} requires a value`)
  return value
}

export const parseArtifactCacheArguments = (
  arguments_: string[],
  environment: Environment = process.env
): ArtifactCacheArguments => {
  const [operation, ...options] = arguments_
  if (operation !== 'pull' && operation !== 'push') {
    throw new Error('Artifact cache command requires pull or push')
  }
  const parsed: ArtifactCacheArguments = {
    operation,
    manifestPath: DEFAULT_ACCEPTED_MANIFEST,
    cacheDirectory: DEFAULT_CACHE_DIRECTORY,
    concurrency: DEFAULT_CONCURRENCY,
    store: {
      bucket: environment.AOS4_ARTIFACT_STORE_BUCKET ?? '',
      prefix: environment.AOS4_ARTIFACT_STORE_PREFIX,
      expectedOwner: environment.AOS4_ARTIFACT_STORE_EXPECTED_OWNER ?? '',
      profile: environment.AWS_PROFILE,
      region: environment.AWS_REGION ?? environment.AWS_DEFAULT_REGION,
    },
  }

  for (let index = 0; index < options.length; index += 1) {
    const argument = options[index]
    if (argument === '--manifest') parsed.manifestPath = nextValue(options, index++, argument)
    else if (argument === '--cache') parsed.cacheDirectory = nextValue(options, index++, argument)
    else if (argument === '--bucket') parsed.store.bucket = nextValue(options, index++, argument)
    else if (argument === '--prefix') parsed.store.prefix = nextValue(options, index++, argument)
    else if (argument === '--expected-owner') {
      parsed.store.expectedOwner = nextValue(options, index++, argument)
    } else if (argument === '--profile') parsed.store.profile = nextValue(options, index++, argument)
    else if (argument === '--region') parsed.store.region = nextValue(options, index++, argument)
    else if (argument === '--jobs') {
      const value = nextValue(options, index++, argument)
      if (!/^\d+$/.test(value) || Number(value) < 1 || Number(value) > 32) {
        throw new Error('--jobs must be an integer from 1 through 32')
      }
      parsed.concurrency = Number(value)
    } else throw new Error(`Unknown artifact cache argument: ${argument}`)
  }

  if (!parsed.store.bucket) {
    throw new Error('--bucket or AOS4_ARTIFACT_STORE_BUCKET is required')
  }
  if (!parsed.store.expectedOwner) {
    throw new Error('--expected-owner or AOS4_ARTIFACT_STORE_EXPECTED_OWNER is required')
  }
  return parsed
}

const loadManifest = async (manifestPath: string): Promise<ArtifactManifest> => {
  const value: unknown = JSON.parse(await readFile(manifestPath, 'utf8'))
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error('Artifact manifest must be an object')
  }
  const manifest = value as Partial<ArtifactManifest>
  if (manifest.schemaVersion !== 1 || !Array.isArray(manifest.artifacts)) {
    throw new Error('Artifact manifest has an incompatible schema')
  }
  return manifest as ArtifactManifest
}

export const runArtifactCacheCommand = async (
  arguments_: string[] = process.argv.slice(2),
  environment: Environment = process.env
): Promise<void> => {
  const parsed = parseArtifactCacheArguments(arguments_, environment)
  const manifest = await loadManifest(parsed.manifestPath)
  const cache = new FileArtifactCache(parsed.cacheDirectory)
  const store = new AwsS3ArtifactStore(parsed.store)
  const summary =
    parsed.operation === 'pull'
      ? await pullArtifactManifest(manifest, cache, store, parsed.concurrency)
      : await pushArtifactManifest(manifest, cache, store, parsed.concurrency)
  console.log(`Artifact cache ${parsed.operation}: ${JSON.stringify(summary)}`)
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  runArtifactCacheCommand().catch(error => {
    console.error(error instanceof Error ? error.message : 'Artifact cache command failed')
    process.exitCode = 1
  })
}
