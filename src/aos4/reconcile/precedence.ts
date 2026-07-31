import type { RulesContextId, SourceClassification } from '../domain'
import { validateReviewedOverrides } from './overrides'
import type {
  FactPrecedenceResult,
  LinkedCandidateFact,
  ReconciliationDiagnostic,
  ReconciliationValue,
  ResolvedFact,
  ReviewedOverride,
} from './records'

const authorityRank = (authority: SourceClassification): number => {
  switch (authority.kind) {
    case 'official':
      return 3
    case 'secondary':
      return 2
    case 'community':
      return 1
    case 'unknown':
      return 0
  }
}

const stableValueKey = (value: ReconciliationValue): string => {
  if (Array.isArray(value)) return `[${value.map(stableValueKey).join(',')}]`
  if (value && typeof value === 'object') {
    return `{${Object.keys(value)
      .sort()
      .map(key => `${JSON.stringify(key)}:${stableValueKey(value[key])}`)
      .join(',')}}`
  }
  return JSON.stringify(value)
}

const effectiveTime = (fact: LinkedCandidateFact): number | undefined => {
  if (!fact.effectiveDate) return undefined
  const time = new Date(fact.effectiveDate).valueOf()
  return Number.isNaN(time) ? undefined : time
}

const topDatedRevision = (facts: LinkedCandidateFact[]): LinkedCandidateFact[] => {
  const times = facts.map(effectiveTime)
  if (times.some(time => time === undefined)) return facts
  const latest = Math.max(...(times as number[]))
  return facts.filter(fact => effectiveTime(fact) === latest)
}

const compareFacts = (left: LinkedCandidateFact, right: LinkedCandidateFact): number =>
  left.entityId.localeCompare(right.entityId) ||
  left.field.localeCompare(right.field) ||
  left.id.localeCompare(right.id)

const groupKey = (fact: LinkedCandidateFact): string => `${fact.entityId}:${fact.field}`

const applicableToContext = (
  item: { rulesContextIds: RulesContextId[] },
  contextId: RulesContextId
): boolean => !item.rulesContextIds.length || item.rulesContextIds.includes(contextId)

const secondaryNewerDiagnostic = (facts: LinkedCandidateFact[]): ReconciliationDiagnostic | undefined => {
  const officialTimes = facts
    .filter(fact => fact.authority.kind === 'official')
    .map(effectiveTime)
    .filter((time): time is number => time !== undefined)
  const secondaryTimes = facts
    .filter(fact => fact.authority.kind !== 'official')
    .map(effectiveTime)
    .filter((time): time is number => time !== undefined)
  if (
    !officialTimes.length ||
    !secondaryTimes.length ||
    Math.max(...secondaryTimes) <= Math.max(...officialTimes)
  ) {
    return undefined
  }
  return {
    code: 'secondary-newer-than-official',
    severity: 'warning',
    message: `Secondary data is dated later than the applicable official source for ${facts[0].field}`,
    entityId: facts[0].entityId,
    field: facts[0].field,
    factIds: facts.map(fact => fact.id),
  }
}

const applyOverride = (
  facts: LinkedCandidateFact[],
  overrides: ReviewedOverride[],
  contextId: RulesContextId
): { resolution?: ResolvedFact; diagnostics: ReconciliationDiagnostic[] } => {
  const matching = overrides.filter(
    override =>
      override.entityId === facts[0].entityId &&
      override.field === facts[0].field &&
      applicableToContext(override, contextId)
  )
  if (!matching.length) return { diagnostics: [] }

  const values = new Set(matching.map(override => stableValueKey(override.value)))
  if (values.size > 1) {
    return {
      diagnostics: [
        {
          code: 'conflicting-overrides',
          severity: 'error',
          message: `Reviewed overrides conflict for ${facts[0].field}`,
          entityId: facts[0].entityId,
          field: facts[0].field,
          overrideIds: matching.map(override => override.id),
        },
      ],
      resolution: {
        entityId: facts[0].entityId,
        field: facts[0].field,
        rulesContextId: contextId,
        status: 'unresolved',
        chosenFactIds: [],
        retainedFactIds: facts.map(fact => fact.id),
      },
    }
  }

  const selected = [...matching].sort((left, right) => right.reviewedAt.localeCompare(left.reviewedAt))[0]
  return {
    diagnostics: [
      {
        code: 'reviewed-override-applied',
        severity: 'warning',
        message: `Reviewed override ${selected.id} supersedes source precedence`,
        entityId: selected.entityId,
        field: selected.field,
        overrideIds: [selected.id],
      },
    ],
    resolution: {
      entityId: facts[0].entityId,
      field: facts[0].field,
      rulesContextId: contextId,
      status: 'resolved',
      value: selected.value,
      chosenFactIds: facts
        .filter(fact => selected.sourceRecordIds.includes(fact.sourceRecordId))
        .map(fact => fact.id),
      retainedFactIds: facts.map(fact => fact.id),
      overrideId: selected.id,
    },
  }
}

export const resolveFactPrecedence = (
  facts: LinkedCandidateFact[],
  contextId: RulesContextId,
  overrides: ReviewedOverride[] = []
): FactPrecedenceResult => {
  const applicable = [...facts].filter(fact => applicableToContext(fact, contextId)).sort(compareFacts)
  const validatedOverrides = validateReviewedOverrides(overrides, facts)
  const diagnostics = [...validatedOverrides.diagnostics]
  const groups = new Map<string, LinkedCandidateFact[]>()
  applicable.forEach(fact => {
    const key = groupKey(fact)
    groups.set(key, [...(groups.get(key) ?? []), fact])
  })

  const resolutions = Array.from(groups.values()).map(group => {
    const overridden = applyOverride(group, validatedOverrides.valid, contextId)
    diagnostics.push(...overridden.diagnostics)
    if (overridden.resolution) return overridden.resolution

    const newestSecondary = secondaryNewerDiagnostic(group)
    if (newestSecondary) diagnostics.push(newestSecondary)

    const highestAuthority = Math.max(...group.map(fact => authorityRank(fact.authority)))
    const authoritative = group.filter(fact => authorityRank(fact.authority) === highestAuthority)
    const currentRevision = topDatedRevision(authoritative)
    const values = new Set(currentRevision.map(fact => stableValueKey(fact.value)))
    if (values.size > 1) {
      diagnostics.push({
        code: 'conflicting-authoritative-facts',
        severity: 'error',
        message: `Equally authoritative facts conflict for ${group[0].field}`,
        entityId: group[0].entityId,
        field: group[0].field,
        factIds: currentRevision.map(fact => fact.id),
      })
      return {
        entityId: group[0].entityId,
        field: group[0].field,
        rulesContextId: contextId,
        status: 'unresolved',
        chosenFactIds: [],
        retainedFactIds: group.map(fact => fact.id),
      } satisfies ResolvedFact
    }

    return {
      entityId: group[0].entityId,
      field: group[0].field,
      rulesContextId: contextId,
      status: 'resolved',
      value: currentRevision[0].value,
      chosenFactIds: currentRevision.map(fact => fact.id),
      retainedFactIds: group.map(fact => fact.id),
    } satisfies ResolvedFact
  })

  return {
    resolutions,
    diagnostics: diagnostics.sort(
      (left, right) =>
        (left.entityId ?? '').localeCompare(right.entityId ?? '') ||
        (left.field ?? '').localeCompare(right.field ?? '') ||
        left.code.localeCompare(right.code)
    ),
  }
}
