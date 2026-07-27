import { normalizeWahapediaAbility, normalizeWahapediaWeapon } from './normalize'
import type { WahapediaDataset, WahapediaDiagnostic, WahapediaRecordMeta } from './records'

export interface WahapediaFactionCohortReport {
  schemaVersion: 1
  status: 'blocked' | 'cohort-review-required'
  faction: {
    id: string
    name: string
  }
  counts: {
    sources: number
    warscrolls: number
    warscrollAbilities: number
    warscrollWeapons: number
    warscrollKeywords: number
    warscrollBases: number
    warscrollOrganisation: number
    regimentOfRenownFactions: number
    factionAbilityTypes: number
    factionAbilitySubtypes: number
    factionAbilities: number
  }
  normalization: {
    abilities: number
    weapons: number
    unknownWeaponSourceRecordIds: string[]
    unresolvedTimingSourceRecordIds: string[]
    sourcePhaseFallbackSourceRecordIds: string[]
    sourceTimingCorrectionSourceRecordIds: string[]
    reactionFlagMismatchSourceRecordIds: string[]
  }
  diagnostics: {
    errors: number
    warnings: number
    byCode: Record<string, number>
  }
  sourceIds: string[]
  sourceRecords: Array<{
    id: string
    file: string
    row: number
    recordChecksum: string
  }>
}

const compare = (left: string, right: string): number => left.localeCompare(right)

const uniqueSorted = (values: Iterable<string>): string[] => Array.from(new Set(values)).sort(compare)

const metaKey = (meta: WahapediaRecordMeta): string => `${meta.file}:${meta.row}`

const countDiagnostics = (
  diagnostics: WahapediaDiagnostic[]
): WahapediaFactionCohortReport['diagnostics'] => {
  const byCode = diagnostics.reduce<Record<string, number>>((counts, diagnostic) => {
    counts[diagnostic.code] = (counts[diagnostic.code] ?? 0) + 1
    return counts
  }, {})

  return {
    errors: diagnostics.filter(diagnostic => diagnostic.severity === 'error').length,
    warnings: diagnostics.filter(diagnostic => diagnostic.severity === 'warning').length,
    byCode: Object.fromEntries(Object.entries(byCode).sort(([left], [right]) => compare(left, right))),
  }
}

export const createWahapediaFactionCohortReport = (
  dataset: WahapediaDataset,
  diagnostics: WahapediaDiagnostic[],
  factionId: string
): WahapediaFactionCohortReport => {
  const faction = dataset.factions.find(candidate => candidate.id === factionId)
  if (!faction) throw new Error(`Wahapedia faction ${factionId} does not exist`)

  const warscrolls = dataset.warscrolls.filter(record => record.factionId === factionId)
  const warscrollIds = new Set(warscrolls.map(record => record.id))
  const sourceIds = new Set(warscrolls.map(record => record.sourceId).filter(Boolean))
  const sources = dataset.sources.filter(record => sourceIds.has(record.id))
  const warscrollAbilities = dataset.warscrollAbilities.filter(record => warscrollIds.has(record.warscrollId))
  const warscrollWeapons = dataset.warscrollWeapons.filter(record => warscrollIds.has(record.warscrollId))
  const warscrollKeywords = dataset.warscrollKeywords.filter(record => warscrollIds.has(record.warscrollId))
  const warscrollBases = dataset.warscrollBases.filter(record => warscrollIds.has(record.warscrollId))
  const warscrollOrganisation = dataset.warscrollOrganisation.filter(record =>
    warscrollIds.has(record.warscrollId)
  )
  const regimentOfRenownFactions = dataset.regimentOfRenownFactions.filter(
    record => record.factionId === factionId || warscrollIds.has(record.warscrollId)
  )
  const factionAbilityTypes = dataset.factionAbilityTypes.filter(record => record.factionId === factionId)
  const factionAbilitySubtypes = dataset.factionAbilitySubtypes.filter(
    record => record.factionId === factionId
  )
  const factionAbilities = dataset.factionAbilities.filter(record => record.factionId === factionId)
  const abilityFacts = [
    ...warscrollAbilities.map(record => normalizeWahapediaAbility(record, 'unit')),
    ...factionAbilities.map(record => normalizeWahapediaAbility(record, 'army')),
  ]
  const weaponFacts = warscrollWeapons.map(normalizeWahapediaWeapon)
  const records = [
    faction,
    ...sources,
    ...warscrolls,
    ...warscrollAbilities,
    ...warscrollWeapons,
    ...warscrollKeywords,
    ...warscrollBases,
    ...warscrollOrganisation,
    ...regimentOfRenownFactions,
    ...factionAbilityTypes,
    ...factionAbilitySubtypes,
    ...factionAbilities,
  ]
  const recordLocations = new Set(records.map(record => metaKey(record.meta)))
  const cohortDiagnostics = diagnostics.filter(diagnostic => {
    if (diagnostic.row === undefined) return true
    return recordLocations.has(`${diagnostic.file}:${diagnostic.row}`)
  })
  const diagnosticCounts = countDiagnostics(cohortDiagnostics)
  const unresolvedTimingSourceRecordIds = uniqueSorted(
    abilityFacts
      .filter(fact => fact.timings.some(timing => timing.window.kind === 'unknown'))
      .map(fact => String(fact.sourceRecordId))
  )
  const sourcePhaseFallbackSourceRecordIds = uniqueSorted(
    abilityFacts
      .filter(fact => fact.diagnostics.some(diagnostic => diagnostic.code === 'source-phase-fallback'))
      .map(fact => String(fact.sourceRecordId))
  )
  const sourceTimingCorrectionSourceRecordIds = uniqueSorted(
    abilityFacts
      .filter(fact => fact.diagnostics.some(diagnostic => diagnostic.code === 'source-timing-correction'))
      .map(fact => String(fact.sourceRecordId))
  )
  const unknownWeaponSourceRecordIds = uniqueSorted(
    weaponFacts.filter(fact => fact.weaponType === 'unknown').map(fact => String(fact.sourceRecordId))
  )
  const reactionFlagMismatchSourceRecordIds = uniqueSorted(
    abilityFacts
      .filter(fact => fact.diagnostics.some(diagnostic => diagnostic.code === 'reaction-flag-mismatch'))
      .map(fact => String(fact.sourceRecordId))
  )
  const blocked =
    diagnosticCounts.errors > 0 ||
    unresolvedTimingSourceRecordIds.length > 0 ||
    unknownWeaponSourceRecordIds.length > 0 ||
    reactionFlagMismatchSourceRecordIds.length > 0

  return {
    schemaVersion: 1,
    status: blocked ? 'blocked' : 'cohort-review-required',
    faction: {
      id: faction.id,
      name: faction.name,
    },
    counts: {
      sources: sources.length,
      warscrolls: warscrolls.length,
      warscrollAbilities: warscrollAbilities.length,
      warscrollWeapons: warscrollWeapons.length,
      warscrollKeywords: warscrollKeywords.length,
      warscrollBases: warscrollBases.length,
      warscrollOrganisation: warscrollOrganisation.length,
      regimentOfRenownFactions: regimentOfRenownFactions.length,
      factionAbilityTypes: factionAbilityTypes.length,
      factionAbilitySubtypes: factionAbilitySubtypes.length,
      factionAbilities: factionAbilities.length,
    },
    normalization: {
      abilities: abilityFacts.length,
      weapons: weaponFacts.length,
      unknownWeaponSourceRecordIds,
      unresolvedTimingSourceRecordIds,
      sourcePhaseFallbackSourceRecordIds,
      sourceTimingCorrectionSourceRecordIds,
      reactionFlagMismatchSourceRecordIds,
    },
    diagnostics: diagnosticCounts,
    sourceIds: uniqueSorted(sourceIds),
    sourceRecords: records
      .map(record => ({
        id: String(record.meta.sourceRecordId),
        file: record.meta.file,
        row: record.meta.row,
        recordChecksum: record.meta.recordChecksum,
      }))
      .sort((left, right) => compare(left.id, right.id)),
  }
}
