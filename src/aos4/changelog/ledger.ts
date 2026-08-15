import type { CanonicalId } from '../domain'
import {
  AOS4_CHANGELOG_SCHEMA_VERSION,
  toChangelogPublication,
  type ChangeRecord,
  type ChangelogCohortInput,
  type ChangelogFactSelector,
  type ChangelogPublication,
  type ChangelogPublicationInput,
} from './types'

/** How many of the newest rules-driven acceptances the published changelog artifact retains. */
export const AOS4_CHANGELOG_RETAINED_ACCEPTANCES = 6

/**
 * One reviewed acceptance in the append-only changelog ledger (newest last).
 *
 * `prior.runtimeBlobSha256` pins the SHA-256 of the git blob bytes of the runtime projection at
 * `prior.commit`; `current.runtimeSha256` pins the SHA-256 of the checked-in runtime projection
 * LF-normalized, so the pin is stable across checkout line-ending conventions.
 */
export interface ChangelogLedgerEntry {
  id: string
  prior: { commit: string; runtimeBlobSha256: string }
  current: { runtimeSha256: string }
  publications: ChangelogPublicationInput[]
  cohorts: ChangelogCohortInput[]
}

/** The command-generated, checked-in change records for one accepted ledger entry. */
export interface ChangelogAcceptanceRecords {
  schemaVersion: typeof AOS4_CHANGELOG_SCHEMA_VERSION
  entryId: string
  priorGeneratedAt: string
  currentGeneratedAt: string
  publications: ChangelogPublication[]
  records: ChangeRecord[]
}

/** The deterministic, retention-merged changelog artifact the application ships. */
export interface Aos4PublishedChangelog {
  schemaVersion: typeof AOS4_CHANGELOG_SCHEMA_VERSION
  /** The newest ledger entry id, or null while the ledger is empty. */
  revision: string | null
  /** Retained rules-driven acceptance ids, newest first. */
  retainedEntryIds: string[]
  /** Every retained acceptance's publication ids, newest acceptance first. */
  retainedPublicationIds: CanonicalId<'publication'>[]
  publications: ChangelogPublication[]
  /** Publication-attributed change records, newest acceptance first. */
  records: ChangeRecord[]
  /** Correction-attributed change records, newest acceptance first. */
  corrections: ChangeRecord[]
}

const SHA256_PATTERN = /^[0-9a-f]{64}$/
const ENTRY_ID_PATTERN = /^[a-z0-9][a-z0-9-]*$/

const fail = (message: string): never => {
  throw new Error(`Changelog ledger is not usable: ${message}`)
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const requireString = (value: unknown, field: string): string => {
  if (typeof value !== 'string' || !value) fail(`${field} must be a non-empty string`)
  return value as string
}

const requireSha256 = (value: unknown, field: string): string => {
  const checksum = requireString(value, field)
  if (!SHA256_PATTERN.test(checksum)) fail(`${field} must be a lowercase SHA-256 hex digest`)
  return checksum
}

const validateSelector = (value: unknown, field: string): ChangelogFactSelector | undefined => {
  if (value === undefined) return undefined
  if (!isRecord(value)) fail(`${field} must be an object`)
  const selector = value as Record<string, unknown>
  ;(['entityIds', 'factionIds', 'warscrollIds'] as const).forEach(key => {
    const ids = selector[key]
    if (ids === undefined) return
    if (!Array.isArray(ids) || ids.some(id => typeof id !== 'string' || !id)) {
      fail(`${field}.${key} must be an array of non-empty strings`)
    }
  })
  return value as ChangelogFactSelector
}

const validatePublications = (value: unknown, field: string): ChangelogPublicationInput[] => {
  if (!Array.isArray(value)) fail(`${field} must be an array`)
  const seen = new Set<string>()
  return (value as unknown[]).map((candidate, index) => {
    if (!isRecord(candidate)) fail(`${field}[${index}] must be an object`)
    const publication = candidate as Record<string, unknown>
    const publicationId = requireString(publication.publicationId, `${field}[${index}].publicationId`)
    if (!publicationId.startsWith('publication:')) {
      fail(`${field}[${index}].publicationId must be a canonical publication id`)
    }
    if (seen.has(publicationId)) fail(`${field} declares the publication ${publicationId} twice`)
    seen.add(publicationId)
    requireString(publication.name, `${field}[${index}].name`)
    requireString(publication.source, `${field}[${index}].source`)
    if (publication.effectiveDate !== undefined) {
      requireString(publication.effectiveDate, `${field}[${index}].effectiveDate`)
    }
    validateSelector(publication.selector, `${field}[${index}].selector`)
    return candidate as unknown as ChangelogPublicationInput
  })
}

const validateCohorts = (
  value: unknown,
  field: string,
  publications: ChangelogPublicationInput[]
): ChangelogCohortInput[] => {
  if (!Array.isArray(value) || !value.length) fail(`${field} must be a non-empty array`)
  const declared = new Set<string>(publications.map(publication => publication.publicationId))
  return (value as unknown[]).map((candidate, index) => {
    if (!isRecord(candidate)) fail(`${field}[${index}] must be an object`)
    const cohort = candidate as Record<string, unknown>
    const name = requireString(cohort.name, `${field}[${index}].name`)
    const disposition = cohort.disposition
    if (disposition !== 'rules-driven' && disposition !== 'correction' && disposition !== 'churn') {
      fail(`${field}[${index}].disposition must be rules-driven, correction, or churn`)
    }
    validateSelector(cohort.selector, `${field}[${index}].selector`)
    const publicationIds = cohort.publicationIds
    if (publicationIds !== undefined) {
      if (disposition !== 'rules-driven') {
        fail(`cohort "${name}" carries publicationIds but is not rules-driven`)
      }
      if (!Array.isArray(publicationIds) || !publicationIds.length) {
        fail(`${field}[${index}].publicationIds must be a non-empty array`)
      }
      ;(publicationIds as unknown[]).forEach(publicationId => {
        if (typeof publicationId !== 'string' || !declared.has(publicationId)) {
          fail(`cohort "${name}" references the undeclared publication ${String(publicationId)}`)
        }
      })
    }
    if (disposition === 'rules-driven' && !publications.length) {
      fail(`rules-driven cohort "${name}" requires the entry to declare at least one publication`)
    }
    return candidate as unknown as ChangelogCohortInput
  })
}

/** Fail-closed validation of the hand-authored, append-only acceptance ledger. */
export const validateChangelogLedger = (value: unknown): ChangelogLedgerEntry[] => {
  if (!Array.isArray(value)) fail('the ledger must be an array of acceptance entries')
  const seen = new Set<string>()
  return (value as unknown[]).map((candidate, index) => {
    if (!isRecord(candidate)) fail(`entries[${index}] must be an object`)
    const entry = candidate as Record<string, unknown>
    const id = requireString(entry.id, `entries[${index}].id`)
    if (!ENTRY_ID_PATTERN.test(id)) {
      fail(`entries[${index}].id must use lowercase letters, digits, and hyphens`)
    }
    if (seen.has(id)) fail(`entry id ${id} appears more than once`)
    seen.add(id)
    if (!isRecord(entry.prior)) fail(`entries[${index}].prior must be an object`)
    const prior = entry.prior as Record<string, unknown>
    requireString(prior.commit, `entries[${index}].prior.commit`)
    requireSha256(prior.runtimeBlobSha256, `entries[${index}].prior.runtimeBlobSha256`)
    if (!isRecord(entry.current)) fail(`entries[${index}].current must be an object`)
    requireSha256(
      (entry.current as Record<string, unknown>).runtimeSha256,
      `entries[${index}].current.runtimeSha256`
    )
    const publications = validatePublications(entry.publications, `entries[${index}].publications`)
    validateCohorts(entry.cohorts, `entries[${index}].cohorts`, publications)
    return candidate as unknown as ChangelogLedgerEntry
  })
}

const isRulesDriven = (entry: ChangelogLedgerEntry): boolean =>
  entry.cohorts.some(cohort => cohort.disposition === 'rules-driven')

/** The rules-driven acceptances the artifact retains, ordered newest first. */
export const retainedLedgerEntries = (entries: ChangelogLedgerEntry[]): ChangelogLedgerEntry[] =>
  entries.filter(isRulesDriven).slice(-AOS4_CHANGELOG_RETAINED_ACCEPTANCES).reverse()

/**
 * Deterministically merges the retained acceptances' record files into the published artifact.
 * Verification recomputes this from the checked-in ledger and record files alone, so it never
 * needs git or the prior runtime snapshots.
 */
export const buildAos4PublishedChangelog = (
  entries: ChangelogLedgerEntry[],
  recordsByEntryId: ReadonlyMap<string, ChangelogAcceptanceRecords>
): Aos4PublishedChangelog => {
  const retained = retainedLedgerEntries(entries)
  const records: ChangeRecord[] = []
  const corrections: ChangeRecord[] = []
  const publications: ChangelogPublication[] = []
  const retainedPublicationIds: CanonicalId<'publication'>[] = []
  const seenPublicationIds = new Set<string>()
  retained.forEach(entry => {
    const file = recordsByEntryId.get(entry.id)
    if (!file) throw new Error(`Changelog record file is missing for entry ${entry.id}`)
    if (file.schemaVersion !== AOS4_CHANGELOG_SCHEMA_VERSION || file.entryId !== entry.id) {
      throw new Error(`Changelog record file for entry ${entry.id} has an incompatible schema`)
    }
    file.records.forEach(record => {
      if (record.attribution.kind === 'correction') corrections.push(record)
      else records.push(record)
    })
    ;[...entry.publications]
      .sort((left, right) => left.publicationId.localeCompare(right.publicationId))
      .forEach(publication => {
        if (seenPublicationIds.has(publication.publicationId)) return
        seenPublicationIds.add(publication.publicationId)
        retainedPublicationIds.push(publication.publicationId)
        publications.push(toChangelogPublication(publication))
      })
  })
  return {
    schemaVersion: AOS4_CHANGELOG_SCHEMA_VERSION,
    revision: entries.length ? entries[entries.length - 1].id : null,
    retainedEntryIds: retained.map(entry => entry.id),
    retainedPublicationIds,
    publications,
    records,
    corrections,
  }
}
