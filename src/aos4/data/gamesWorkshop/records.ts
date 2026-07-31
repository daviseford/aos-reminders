import {
  artifactId,
  type ArtifactId,
  type SourceArtifact,
  type SourceRecord,
  type SourceRecordId,
} from '../../domain'
import type { ArtifactManifestEntry } from '../manifest'

export type GamesWorkshopDiscoveryMethod = 'private-api' | 'page-link' | 'embedded-json'

export interface GamesWorkshopDownload {
  externalId: string
  title: string
  url: string
  slug?: string
  language?: string
  publicationDate?: string
  updatedDate?: string
  version?: string
  categories: string[]
  gameSystems: string[]
  topics: string[]
  discoveryMethod: GamesWorkshopDiscoveryMethod
}

export type GamesWorkshopDiagnosticCode =
  | 'private-api-unavailable'
  | 'private-api-incompatible'
  | 'private-api-empty'
  | 'page-incompatible'
  | 'invalid-download-url'
  | 'missing-download-title'
  | 'duplicate-download'
  | 'new-download-revision'
  | 'pdf-encrypted'
  | 'pdf-image-only'
  | 'pdf-page-limit'
  | 'pdf-text-byte-limit'
  | 'pdf-timeout'
  | 'pdf-extraction-error'
  | 'ambiguous-layout'
  | 'fact-not-found'
  | 'fact-conflict'

export interface GamesWorkshopDiagnostic {
  code: GamesWorkshopDiagnosticCode
  severity: 'warning' | 'error'
  message: string
  url?: string
  page?: number
  field?: string
}

export interface GamesWorkshopDiscoveryResult {
  downloads: GamesWorkshopDownload[]
  diagnostics: GamesWorkshopDiagnostic[]
  method: GamesWorkshopDiscoveryMethod | 'none'
}

export interface GamesWorkshopPdfInput {
  bytes: Uint8Array
  artifact: ArtifactManifestEntry
  download: GamesWorkshopDownload
}

export interface GamesWorkshopPdfPage {
  page: number
  text: string
}

export interface GamesWorkshopPdfDocument {
  artifactId: ArtifactId
  download: GamesWorkshopDownload
  pages: GamesWorkshopPdfPage[]
  sourceRecords: SourceRecord[]
}

export interface GamesWorkshopPdfExtractionResult {
  document?: GamesWorkshopPdfDocument
  diagnostics: GamesWorkshopDiagnostic[]
}

export interface GamesWorkshopFactLocation {
  artifactId: ArtifactId
  sourceRecordId: SourceRecordId
  page: number
}

export interface GamesWorkshopCandidateFact<TValue = string> {
  extractorId: string
  entityKind: string
  entityName: string
  field: string
  value: TValue
  location: GamesWorkshopFactLocation
}

export interface GamesWorkshopFactExtractionResult {
  facts: GamesWorkshopCandidateFact[]
  diagnostics: GamesWorkshopDiagnostic[]
}

export interface GamesWorkshopSourceArtifactOptions {
  edition?: string
  language?: string
  publicationDate?: string
  effectiveDate?: string
}

export const createGamesWorkshopSourceArtifact = (
  input: GamesWorkshopPdfInput,
  options: GamesWorkshopSourceArtifactOptions = {}
): SourceArtifact => ({
  id: artifactId(input.artifact.checksum),
  publisher: 'games-workshop',
  authority: { kind: 'official' },
  title: input.download.title,
  edition: options.edition ?? '4',
  language: options.language ?? input.download.language ?? 'unknown',
  retrievedAt: input.artifact.retrievedAt,
  sourceUrl: input.artifact.finalUrl,
  checksum: input.artifact.checksum,
  mediaType: input.artifact.mediaType,
  ...((options.publicationDate ?? input.download.publicationDate)
    ? { publicationDate: options.publicationDate ?? input.download.publicationDate }
    : {}),
  ...(options.effectiveDate ? { effectiveDate: options.effectiveDate } : {}),
  ...(input.download.version ? { version: input.download.version } : {}),
})
