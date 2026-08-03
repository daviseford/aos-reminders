import { canonicalNameKey } from '../normalize/nameKey'

/**
 * The official-profile sweep (issues #1851, #1875).
 *
 * The official Battle Profiles ledger establishes roster options (battle formations, traits,
 * artefacts, faction terrain, and similar) that players can put on a roster. This sweep checks
 * that every effective officially-established roster option is carried by the runtime under a
 * matching name, so a genuinely missing option surfaces as a finding instead of resting silently
 * in a `structured-reference` disposition.
 *
 * Issue #1851 was produced by an ad hoc version of this comparison whose matcher lowercased and
 * trimmed but did not fold Unicode punctuation: the runtime's `HEAT-SEEKING AUTO‑ENDRIN`
 * (U+2011 non-breaking hyphen) failed to match the official `Heat-seeking Auto-endrin`, and four
 * curly-quote/apostrophe variants failed the same way. The matcher here is the shared
 * Unicode-hardened key from `src/aos4/normalize/nameKey.ts` — dash variants, quote variants,
 * combining marks, and case all fold before comparison.
 *
 * Two guards keep the hardening honest:
 *
 * - a collision guard reports two *different* official names in the same faction and context that
 *   fold onto one key, so the normalizer can never silently collapse two distinct options onto
 *   one runtime entity;
 * - the reviewed naming-discrepancy list is validated live — an entry whose runtime name vanished
 *   or whose official name now matches directly is reported stale, so a resolved discrepancy
 *   cannot shield a future regression.
 */

export interface OfficialProfileSweepRecord {
  status: 'effective' | 'superseded'
  fact: {
    kind: string
    name: string
    faction: string
    context: string
    optionType?: string
    page?: number
    row?: number
  }
}

export interface OfficialProfileSweepEntity {
  name: string
}

/**
 * A reviewed, genuine naming difference between the official Battle Profiles document and the
 * accepted runtime source. These are not gaps and not matcher weaknesses; the discrepancy itself
 * is worth preserving (issue #1851), so the sweep accepts the pair while the names stay distinct.
 */
export interface OfficialNamingDiscrepancy {
  officialName: string
  runtimeName: string
  reason: string
}

export const OFFICIAL_NAMING_DISCREPANCIES: OfficialNamingDiscrepancy[] = [
  {
    officialName: 'Shard of the Necris',
    runtimeName: 'SHARD OF NECRIS',
    reason:
      'The official Battle Profiles document names the Ossiarch Bonereapers artefact "Shard of ' +
      'the Necris" while the accepted Wahapedia ability is "SHARD OF NECRIS" - a real ' +
      'GW-vs-Wahapedia wording difference preserved per issue #1851, not a runtime gap.',
  },
]

export type OfficialProfileSweepFinding =
  | {
      code: 'unmatched-roster-option'
      name: string
      faction: string
      context: string
      optionType: string
      page: number | undefined
      row: number | undefined
      message: string
    }
  | {
      code: 'conflated-official-options'
      nameKey: string
      names: string[]
      faction: string
      context: string
      message: string
    }
  | {
      code: 'stale-naming-discrepancy'
      officialName: string
      runtimeName: string
      message: string
    }

export interface OfficialProfileSweepResult {
  rosterOptionRecords: number
  comparedRosterOptions: number
  matchedByName: number
  matchedByReviewedDiscrepancy: number
  findings: OfficialProfileSweepFinding[]
}

const findingSubject = (finding: OfficialProfileSweepFinding): string => {
  switch (finding.code) {
    case 'unmatched-roster-option':
      return `${finding.faction}|${finding.context}|${finding.name}`
    case 'conflated-official-options':
      return `${finding.faction}|${finding.context}|${finding.nameKey}`
    case 'stale-naming-discrepancy':
      return finding.officialName
  }
}

/**
 * Compares every effective officially-established roster option against the runtime entity names
 * using the shared Unicode-hardened name key. Superseded rows are replaced official history and
 * are counted but never required in runtime.
 */
export const sweepOfficialRosterOptions = (
  records: readonly OfficialProfileSweepRecord[],
  runtimeEntities: readonly OfficialProfileSweepEntity[],
  namingDiscrepancies: readonly OfficialNamingDiscrepancy[] = OFFICIAL_NAMING_DISCREPANCIES
): OfficialProfileSweepResult => {
  const findings: OfficialProfileSweepFinding[] = []
  const runtimeKeys = new Set(runtimeEntities.map(entity => canonicalNameKey(entity.name)))

  const discrepancyByOfficialKey = new Map<string, OfficialNamingDiscrepancy>()
  namingDiscrepancies.forEach(discrepancy => {
    const officialKey = canonicalNameKey(discrepancy.officialName)
    if (!runtimeKeys.has(canonicalNameKey(discrepancy.runtimeName))) {
      findings.push({
        code: 'stale-naming-discrepancy',
        officialName: discrepancy.officialName,
        runtimeName: discrepancy.runtimeName,
        message:
          `The runtime no longer carries "${discrepancy.runtimeName}"; the reviewed naming ` +
          'discrepancy cannot vouch for a runtime entity that does not exist - re-review the entry',
      })
      return
    }
    if (runtimeKeys.has(officialKey)) {
      findings.push({
        code: 'stale-naming-discrepancy',
        officialName: discrepancy.officialName,
        runtimeName: discrepancy.runtimeName,
        message:
          `The official name "${discrepancy.officialName}" now matches the runtime directly; ` +
          'remove the resolved discrepancy so it cannot shield a future regression',
      })
      return
    }
    discrepancyByOfficialKey.set(officialKey, discrepancy)
  })

  const rosterOptions = records.filter(record => record.fact.kind === 'roster-option')
  const effective = rosterOptions.filter(record => record.status === 'effective')

  const namesByGroupKey = new Map<string, { faction: string; context: string; names: Set<string> }>()
  effective.forEach(record => {
    const groupKey = [record.fact.faction, record.fact.context, canonicalNameKey(record.fact.name)].join('|')
    const group = namesByGroupKey.get(groupKey) ?? {
      faction: record.fact.faction,
      context: record.fact.context,
      names: new Set<string>(),
    }
    group.names.add(record.fact.name)
    namesByGroupKey.set(groupKey, group)
  })
  namesByGroupKey.forEach((group, groupKey) => {
    if (group.names.size < 2) return
    findings.push({
      code: 'conflated-official-options',
      nameKey: groupKey.split('|').at(-1) ?? '',
      names: Array.from(group.names).sort((left, right) => left.localeCompare(right)),
      faction: group.faction,
      context: group.context,
      message:
        'Two distinct official roster-option names fold onto one name key; the matcher would ' +
        'collapse them onto one runtime entity - the normalizer or the rows need review',
    })
  })

  let matchedByName = 0
  let matchedByReviewedDiscrepancy = 0
  effective.forEach(record => {
    const key = canonicalNameKey(record.fact.name)
    if (runtimeKeys.has(key)) {
      matchedByName += 1
      return
    }
    if (discrepancyByOfficialKey.has(key)) {
      matchedByReviewedDiscrepancy += 1
      return
    }
    findings.push({
      code: 'unmatched-roster-option',
      name: record.fact.name,
      faction: record.fact.faction,
      context: record.fact.context,
      optionType: record.fact.optionType ?? 'unknown',
      page: record.fact.page,
      row: record.fact.row,
      message:
        `Officially-established roster option "${record.fact.name}" (${record.fact.faction}, ` +
        `${record.fact.context}) has no runtime entity with a matching name and no reviewed ` +
        'naming discrepancy - either the runtime genuinely lacks it or the names need review',
    })
  })

  return {
    rosterOptionRecords: rosterOptions.length,
    comparedRosterOptions: effective.length,
    matchedByName,
    matchedByReviewedDiscrepancy,
    findings: findings.sort(
      (left, right) =>
        left.code.localeCompare(right.code) || findingSubject(left).localeCompare(findingSubject(right))
    ),
  }
}
