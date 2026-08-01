import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { stableJson } from '../../generate/serialization'
import { FileArtifactCache } from '../cache'
import { acquireArtifact } from '../command'
import { createPinnedHttpsTransport, readResponseBody, requestWithTimeout } from '../http'
import { serializeArtifactManifest, createArtifactManifest } from '../manifest'
import { resolveDnsAddresses, validateAcquisitionUrl } from '../urlPolicy'
import { BSDATA_ADAPTER_VERSION, pinnedBsDataUrl } from './records'

/**
 * Acquire pinned BSData catalogue files into the immutable artifact cache.
 *
 * BSData is the community fallback source tier: acceptable only when an official Games Workshop
 * publication establishes the content but Wahapedia does not yet carry the rules. Files are always
 * pinned by commit SHA so the acquired bytes are immutable; a moving branch never enters a
 * manifest. Like every acquisition, a successful download proves retrieval, not acceptance.
 */

interface Arguments {
  repository: string
  ref: string
  paths: string[]
  outputDirectory: string
}

const nextValue = (values: string[], index: number, flag: string): string => {
  const value = values[index + 1]
  if (!value || value.startsWith('--')) throw new Error(`${flag} requires a value`)
  return value
}

export const parseBsDataAcquireArguments = (values: string[]): Arguments => {
  const parsed: Arguments = {
    repository: 'BSData/age-of-sigmar-4th',
    ref: '',
    paths: [],
    outputDirectory: path.join(
      '.cache',
      'aos4',
      'bsdata-candidates',
      new Date().toISOString().replace(/[:.]/g, '-')
    ),
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
      parsed.outputDirectory = nextValue(values, index, value)
      index += 1
    } else {
      throw new Error(`Unknown argument: ${value}`)
    }
  }
  if (!/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(parsed.repository)) {
    throw new Error('--repository must be an owner/name pair')
  }
  if (!/^[0-9a-f]{40}$/.test(parsed.ref)) {
    throw new Error('--ref must be a full 40-character commit SHA so the acquired bytes are immutable')
  }
  if (!parsed.paths.length) throw new Error('At least one --path is required')
  return parsed
}

const run = async (): Promise<void> => {
  const arguments_ = parseBsDataAcquireArguments(process.argv.slice(2))
  const transport = createPinnedHttpsTransport()
  const policy = {
    allowedHosts: ['raw.githubusercontent.com', 'api.github.com'],
    resolveAddresses: resolveDnsAddresses,
  }
  const dependencies = {
    transport,
    cache: new FileArtifactCache(path.join('.cache', 'aos4', 'artifacts')),
    now: () => new Date().toISOString(),
    policy,
  }

  // Confirm the pinned commit exists in the named repository before touching file bytes.
  const commitUrl = `https://api.github.com/repos/${arguments_.repository}/commits/${arguments_.ref}`
  const validated = await validateAcquisitionUrl(commitUrl, policy)
  const commitResponse = await requestWithTimeout(
    transport,
    {
      url: validated.url,
      headers: { accept: 'application/vnd.github+json', 'user-agent': 'aos-reminders-data-pipeline' },
      approvedAddresses: validated.approvedAddresses,
    },
    30_000
  )
  if (commitResponse.status !== 200) {
    throw new Error(`GitHub commit lookup for ${arguments_.ref} returned HTTP ${commitResponse.status}`)
  }
  const commitBody = JSON.parse(
    new TextDecoder().decode(await readResponseBody(commitResponse, 4 * 1024 * 1024))
  ) as { sha?: string; commit?: { committer?: { date?: string } } }
  if (commitBody.sha !== arguments_.ref) {
    throw new Error(`GitHub commit lookup returned ${commitBody.sha ?? '(none)'} for ${arguments_.ref}`)
  }

  const entries: import('../manifest').ArtifactManifestEntry[] = []
  for (const filePath of [...arguments_.paths].sort((left, right) => left.localeCompare(right))) {
    const result = await acquireArtifact(
      {
        url: pinnedBsDataUrl(arguments_.repository, arguments_.ref, filePath),
        adapterVersion: BSDATA_ADAPTER_VERSION,
        allowedMediaTypes: ['text/plain'],
        maxBytes: 32 * 1024 * 1024,
        timeoutMs: 60_000,
        maxRedirects: 3,
      },
      dependencies
    )
    entries.push(result.entry)
    console.log(`Acquired ${filePath}: sha256 ${result.entry.checksum} (${result.entry.byteLength} bytes)`)
  }

  const outputDirectory = path.resolve(arguments_.outputDirectory)
  await mkdir(path.dirname(outputDirectory), { recursive: true })
  await mkdir(outputDirectory)
  const manifestPath = path.join(outputDirectory, 'bsdata-manifest.json')
  await writeFile(manifestPath, serializeArtifactManifest(createArtifactManifest(entries)), {
    encoding: 'utf8',
    flag: 'wx',
  })
  await writeFile(
    path.join(outputDirectory, 'bsdata-provenance.json'),
    stableJson({
      schemaVersion: 1,
      repository: arguments_.repository,
      commit: arguments_.ref,
      committedAt: commitBody.commit?.committer?.date ?? null,
      retrievedAt: new Date().toISOString(),
      paths: [...arguments_.paths].sort((left, right) => left.localeCompare(right)),
    }),
    { encoding: 'utf8', flag: 'wx' }
  )
  console.log(`BSData candidate manifest: ${manifestPath}`)
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  run().catch(error => {
    console.error(error)
    process.exitCode = 1
  })
}
