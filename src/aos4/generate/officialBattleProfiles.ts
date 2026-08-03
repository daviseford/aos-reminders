import type { GamesWorkshopBattleProfileFact, WahapediaHtmlReconciliation } from '../data'
import { canonicalNameKey } from '../normalize/nameKey'

export interface ReviewedOfficialBattleProfileFact {
  artifactChecksum: string
  documentTitle: string
  status: 'effective' | 'superseded'
  fact: GamesWorkshopBattleProfileFact
}

export interface OfficialBattleProfileCatalog {
  schemaVersion: 1
  generatedAt: string
  authority: 'games-workshop'
  records: Array<
    ReviewedOfficialBattleProfileFact & {
      id: string
      disposition: 'applied-to-runtime' | 'profile-only' | 'structured-reference' | 'superseded'
    }
  >
  summary: {
    records: number
    effective: number
    superseded: number
    units: number
    rosterOptions: number
    regimentsOfRenown: number
    appliedToRuntime: number
    profileOnly: number
    structuredReference: number
  }
}

/**
 * The name key used to match an official regiment-of-renown profile row to the runtime content
 * group generated from its Wahapedia datasheet. Reviewed `officialProfileName` mappings cover the
 * rows whose official spelling differs beyond punctuation and case.
 *
 * Delegates to the shared Unicode-hardened key (issue #1875); the shared key produces the same
 * output as the historical inline implementation for every input, because both keep only
 * `[a-z0-9]`, so reviewed dispositions cannot shift.
 */
export const canonicalOfficialProfileName = (value: string): string => canonicalNameKey(value)

export const createOfficialBattleProfileCatalog = (
  reviewed: ReviewedOfficialBattleProfileFact[],
  reconciliation: WahapediaHtmlReconciliation,
  generatedAt: string,
  appliedRegimentOfRenownNames: ReadonlySet<string> = new Set()
): OfficialBattleProfileCatalog => {
  const unmatched = new Set(reconciliation.unmatchedOfficialUnitFacts.map(record => record.factChecksum))
  const effectiveUnits = reviewed.filter(
    record => record.status === 'effective' && record.fact.kind === 'unit'
  )
  if (
    effectiveUnits.length !==
    reconciliation.matchedOfficialUnitFacts + reconciliation.unmatchedOfficialUnitFacts.length
  ) {
    throw new Error('Official unit profile reconciliation does not disposition every effective fact')
  }

  const records = reviewed
    .map(record => {
      const id = ['games-workshop', record.artifactChecksum, record.fact.kind, record.fact.key].join(':')
      const disposition =
        record.status === 'superseded'
          ? ('superseded' as const)
          : record.fact.kind === 'regiment-of-renown'
            ? // A regiment-of-renown row applies once its classified runtime content group exists
              // (issue #1858); a row with no accepted rules source yet (Wahapedia lags Okar's
              // Torrbad and Urrgar's Maulerguts) honestly remains a structured reference.
              appliedRegimentOfRenownNames.has(canonicalOfficialProfileName(record.fact.name))
              ? ('applied-to-runtime' as const)
              : ('structured-reference' as const)
            : record.fact.kind !== 'unit'
              ? ('structured-reference' as const)
              : unmatched.has(record.fact.factChecksum)
                ? ('profile-only' as const)
                : ('applied-to-runtime' as const)
      return { ...record, id, disposition }
    })
    .sort((left, right) => left.id.localeCompare(right.id))

  if (new Set(records.map(record => record.id)).size !== records.length) {
    throw new Error('Official battle-profile catalog contains duplicate fact identities')
  }

  return {
    schemaVersion: 1,
    generatedAt,
    authority: 'games-workshop',
    records,
    summary: {
      records: records.length,
      effective: records.filter(record => record.status === 'effective').length,
      superseded: records.filter(record => record.status === 'superseded').length,
      units: records.filter(record => record.fact.kind === 'unit').length,
      rosterOptions: records.filter(record => record.fact.kind === 'roster-option').length,
      regimentsOfRenown: records.filter(record => record.fact.kind === 'regiment-of-renown').length,
      appliedToRuntime: records.filter(record => record.disposition === 'applied-to-runtime').length,
      profileOnly: records.filter(record => record.disposition === 'profile-only').length,
      structuredReference: records.filter(record => record.disposition === 'structured-reference').length,
    },
  }
}
