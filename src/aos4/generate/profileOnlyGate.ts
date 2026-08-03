import { readFile } from 'node:fs/promises'
import type { WahapediaHtmlReconciliation } from '../data'
import type { CorpusOfficialDocument } from './corpus'

/**
 * The official-first intake gate (#1820).
 *
 * A `profile-only` official unit fact means Games Workshop published a unit whose rules no
 * accepted source carries. That is exactly the signal that intake work exists, so it must force
 * an explicit decision instead of resting in a reconciliation report: every profile-only unit
 * fact needs a reviewed deviation entry carrying a rationale and a target date, or generation and
 * the beta certification gate fail closed. The deployment workflow runs the beta gate, so a
 * release that would ship a new profile-only unit stops before S3.
 *
 * The deviation ledger is `data/aos4/reviews/profile-only-deviations.json`. It outlives corpus
 * revisions: the accepted population is whatever the ledger records, and any increase beyond it
 * is unaccepted until reviewed. Stale entries (deviations whose unit is no longer profile-only)
 * fail too, so resolved gaps cannot silently shield a future regression.
 */

export const DEFAULT_PROFILE_ONLY_DEVIATIONS_PATH = 'data/aos4/reviews/profile-only-deviations.json'

export interface ProfileOnlyDeviation {
  faction: string
  name: string
  reason: string
  /** The date by which the gap is expected to be resolved or re-reviewed (ISO date). */
  targetDate: string
  recordedAt: string
}

export interface ProfileOnlyDeviationLedger {
  schemaVersion: 1
  deviations: ProfileOnlyDeviation[]
}

export type ProfileOnlyGateIssueCode =
  'unaccepted-profile-only-unit' | 'invalid-profile-only-deviation' | 'stale-profile-only-deviation'

export interface ProfileOnlyGateIssue {
  code: ProfileOnlyGateIssueCode
  severity: 'error'
  subject: string
  message: string
}

type ProfileOnlyFact = WahapediaHtmlReconciliation['unmatchedOfficialUnitFacts'][number]

const isRecord = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === 'object' && !Array.isArray(value)

const isIsoDate = (value: unknown): value is string =>
  typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(value))

export const parseProfileOnlyDeviationLedger = (value: unknown): ProfileOnlyDeviationLedger => {
  if (!isRecord(value) || value.schemaVersion !== 1 || !Array.isArray(value.deviations)) {
    throw new Error('Profile-only deviation ledger has an incompatible schema')
  }
  value.deviations.forEach((entry, index) => {
    if (
      !isRecord(entry) ||
      typeof entry.faction !== 'string' ||
      typeof entry.name !== 'string' ||
      typeof entry.reason !== 'string' ||
      typeof entry.targetDate !== 'string' ||
      typeof entry.recordedAt !== 'string'
    ) {
      throw new Error(`Profile-only deviation ${index + 1} is malformed`)
    }
  })
  return value as unknown as ProfileOnlyDeviationLedger
}

export const loadProfileOnlyDeviationLedger = async (
  filePath: string
): Promise<ProfileOnlyDeviationLedger> => {
  let raw: string
  try {
    raw = await readFile(filePath, 'utf8')
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      // A missing ledger is an empty ledger: the gate stays active and any profile-only unit
      // fact is unaccepted until a reviewed deviation exists.
      return { schemaVersion: 1, deviations: [] }
    }
    throw error
  }
  return parseProfileOnlyDeviationLedger(JSON.parse(raw) as unknown)
}

const deviationKey = (faction: string, name: string): string =>
  `${faction.trim().toLowerCase()}|${name.trim().toLowerCase()}`

const publicationTitleFor = (
  fact: ProfileOnlyFact,
  officialDocuments: Pick<CorpusOfficialDocument, 'artifact' | 'title'>[]
): string => {
  const checksum = decodeURIComponent(String(fact.sourceRecordId)).match(
    /^source-record:games-workshop:([0-9a-f]{64}):/
  )?.[1]
  const document = checksum
    ? officialDocuments.find(candidate => candidate.artifact.checksum === checksum)
    : undefined
  return document?.title ?? 'unknown official publication'
}

export const profileOnlyGateIssues = (
  profileOnlyFacts: ProfileOnlyFact[],
  ledger: ProfileOnlyDeviationLedger,
  officialDocuments: Pick<CorpusOfficialDocument, 'artifact' | 'title'>[]
): ProfileOnlyGateIssue[] => {
  const issues: ProfileOnlyGateIssue[] = []
  const deviationByKey = new Map<string, ProfileOnlyDeviation>()

  ledger.deviations.forEach(deviation => {
    const key = deviationKey(deviation.faction, deviation.name)
    const subject = `${deviation.faction}: ${deviation.name}`
    if (deviationByKey.has(key)) {
      issues.push({
        code: 'invalid-profile-only-deviation',
        severity: 'error',
        subject,
        message: 'Profile-only deviation is recorded more than once',
      })
      return
    }
    deviationByKey.set(key, deviation)
    if (
      !deviation.faction.trim() ||
      !deviation.name.trim() ||
      !deviation.reason.trim() ||
      !isIsoDate(deviation.targetDate) ||
      !isIsoDate(deviation.recordedAt)
    ) {
      issues.push({
        code: 'invalid-profile-only-deviation',
        severity: 'error',
        subject,
        message:
          'Profile-only deviation requires a faction, unit name, non-empty rationale, and ISO ' +
          'recordedAt/targetDate dates',
      })
    }
  })

  const factKeys = new Set<string>()
  profileOnlyFacts.forEach(fact => {
    const key = deviationKey(fact.faction, fact.name)
    factKeys.add(key)
    if (deviationByKey.has(key)) return
    const publication = publicationTitleFor(fact, officialDocuments)
    issues.push({
      code: 'unaccepted-profile-only-unit',
      severity: 'error',
      subject: `${fact.faction}: ${fact.name}`,
      message:
        `Official unit "${fact.name}" (${fact.faction}, from ${publication}) has a battle profile ` +
        'but no rules in any accepted source, and no reviewed deviation accepts the gap. An ' +
        'official publication drives reviewed rules intake immediately: complete intake (official ' +
        'extraction, or the BSData fallback tier when its conditions hold) or record a ' +
        `profile-only deviation with a rationale and target date in ${DEFAULT_PROFILE_ONLY_DEVIATIONS_PATH}.`,
    })
  })

  deviationByKey.forEach((deviation, key) => {
    if (factKeys.has(key)) return
    issues.push({
      code: 'stale-profile-only-deviation',
      severity: 'error',
      subject: `${deviation.faction}: ${deviation.name}`,
      message:
        'Profile-only deviation no longer matches any profile-only official unit fact; remove the ' +
        'resolved entry so it cannot shield a future regression',
    })
  })

  return issues.sort(
    (left, right) =>
      left.code.localeCompare(right.code) ||
      left.subject.localeCompare(right.subject) ||
      left.message.localeCompare(right.message)
  )
}
