export type EntityKind =
  | 'publication'
  | 'faction'
  | 'warscroll'
  | 'ability'
  | 'weapon'
  | 'content-group'

declare const canonicalIdBrand: unique symbol
declare const artifactIdBrand: unique symbol
declare const sourceRecordIdBrand: unique symbol
declare const rulesContextIdBrand: unique symbol

export type CanonicalId<TKind extends EntityKind = EntityKind> = `${TKind}:${string}` & {
  readonly [canonicalIdBrand]: TKind
}

export type ArtifactId = `artifact:sha256:${string}` & {
  readonly [artifactIdBrand]: true
}

export type SourceRecordId = `source-record:${string}` & {
  readonly [sourceRecordIdBrand]: true
}

export type RulesContextId = `rules-context:${string}` & {
  readonly [rulesContextIdBrand]: true
}

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
const SHA256_PATTERN = /^[0-9a-f]{64}$/i

const canonicalId = <TKind extends EntityKind>(kind: TKind, uuid: string): CanonicalId<TKind> => {
  if (!UUID_PATTERN.test(uuid)) {
    throw new Error(`Invalid ${kind} UUID: ${uuid}`)
  }

  return `${kind}:${uuid.toLowerCase()}` as CanonicalId<TKind>
}

export const publicationId = (uuid: string) => canonicalId('publication', uuid)
export const factionId = (uuid: string) => canonicalId('faction', uuid)
export const warscrollId = (uuid: string) => canonicalId('warscroll', uuid)
export const abilityId = (uuid: string) => canonicalId('ability', uuid)
export const weaponId = (uuid: string) => canonicalId('weapon', uuid)
export const contentGroupId = (uuid: string) => canonicalId('content-group', uuid)

export const rulesContextId = (uuid: string): RulesContextId => {
  if (!UUID_PATTERN.test(uuid)) {
    throw new Error(`Invalid rules context UUID: ${uuid}`)
  }

  return `rules-context:${uuid.toLowerCase()}` as RulesContextId
}

export const artifactId = (checksum: string): ArtifactId => {
  if (!SHA256_PATTERN.test(checksum)) {
    throw new Error(`Invalid artifact SHA-256 checksum: ${checksum}`)
  }

  return `artifact:sha256:${checksum.toLowerCase()}` as ArtifactId
}

export const sourceRecordId = (provider: string, externalId: string): SourceRecordId => {
  const normalizedProvider = provider.trim()
  const normalizedExternalId = externalId.trim()

  if (!normalizedProvider || !normalizedExternalId) {
    throw new Error('Source record IDs require a provider and external ID')
  }

  return `source-record:${encodeURIComponent(normalizedProvider)}:${encodeURIComponent(
    normalizedExternalId
  )}` as SourceRecordId
}

