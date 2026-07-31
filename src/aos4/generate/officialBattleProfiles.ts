import type { GamesWorkshopBattleProfileFact, WahapediaHtmlReconciliation } from '../data'

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

export const createOfficialBattleProfileCatalog = (
  reviewed: ReviewedOfficialBattleProfileFact[],
  reconciliation: WahapediaHtmlReconciliation,
  generatedAt: string
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
