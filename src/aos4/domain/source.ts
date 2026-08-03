import type { ArtifactId, RulesContextId, SourceRecordId } from './identity'

export type SourcePublisher = 'games-workshop' | 'wahapedia' | 'other'

export type SourceClassification =
  { kind: 'official' } | { kind: 'secondary' } | { kind: 'community' } | { kind: 'unknown'; raw: string }

export type SourceLocator =
  | { kind: 'page'; page: number; section?: string }
  | { kind: 'row'; row: number }
  | { kind: 'section'; section: string }
  | { kind: 'document' }

export interface SourceArtifact {
  id: ArtifactId
  publisher: SourcePublisher
  authority: SourceClassification
  title: string
  edition: string
  language: string
  retrievedAt: string
  sourceUrl: string
  checksum: string
  mediaType: string
  publicationDate?: string
  effectiveDate?: string
  version?: string
}

export interface SourceRecord {
  id: SourceRecordId
  artifactId: ArtifactId
  locator: SourceLocator
  recordChecksum: string
  rulesContextIds: RulesContextId[]
}

export interface SourceReference {
  sourceRecordId: SourceRecordId
  field?: string
  transformation?: string
}

export const createUnknownSourceClassification = (raw: string): SourceClassification => {
  const normalized = raw.trim()
  if (!normalized) {
    throw new Error('Unknown source classifications must retain a raw value')
  }

  return { kind: 'unknown', raw: normalized }
}
