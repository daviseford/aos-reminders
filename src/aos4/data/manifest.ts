export const ARTIFACT_MANIFEST_SCHEMA_VERSION = 1 as const

export interface ArtifactManifestEntry {
  requestUrl: string
  finalUrl: string
  redirectChain: string[]
  retrievedAt: string
  adapterVersion: string
  mediaType: string
  byteLength: number
  checksum: string
  etag?: string
  lastModified?: string
}

export interface ArtifactManifest {
  schemaVersion: typeof ARTIFACT_MANIFEST_SCHEMA_VERSION
  artifacts: ArtifactManifestEntry[]
}

const sortEntries = (entries: ArtifactManifestEntry[]): ArtifactManifestEntry[] =>
  [...entries].sort(
    (left, right) =>
      left.requestUrl.localeCompare(right.requestUrl) || left.checksum.localeCompare(right.checksum)
  )

export const createArtifactManifest = (artifacts: ArtifactManifestEntry[] = []): ArtifactManifest => ({
  schemaVersion: ARTIFACT_MANIFEST_SCHEMA_VERSION,
  artifacts: sortEntries(artifacts),
})

export const findArtifactEntry = (
  manifest: ArtifactManifest | undefined,
  requestUrl: string
): ArtifactManifestEntry | undefined => manifest?.artifacts.find(entry => entry.requestUrl === requestUrl)

export const upsertArtifactEntry = (
  manifest: ArtifactManifest | undefined,
  entry: ArtifactManifestEntry
): ArtifactManifest =>
  createArtifactManifest([
    ...(manifest?.artifacts.filter(existing => existing.requestUrl !== entry.requestUrl) ?? []),
    entry,
  ])

export const serializeArtifactManifest = (manifest: ArtifactManifest): string => {
  const artifacts = sortEntries(manifest.artifacts).map(entry => ({
    requestUrl: entry.requestUrl,
    finalUrl: entry.finalUrl,
    redirectChain: [...entry.redirectChain],
    retrievedAt: entry.retrievedAt,
    adapterVersion: entry.adapterVersion,
    mediaType: entry.mediaType,
    byteLength: entry.byteLength,
    checksum: entry.checksum,
    ...(entry.etag ? { etag: entry.etag } : {}),
    ...(entry.lastModified ? { lastModified: entry.lastModified } : {}),
  }))

  return `${JSON.stringify(
    {
      schemaVersion: ARTIFACT_MANIFEST_SCHEMA_VERSION,
      artifacts,
    },
    null,
    2
  )}\n`
}
