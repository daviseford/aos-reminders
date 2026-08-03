import type { RulesContextId } from '../domain'
import { normalizedNameText } from '../normalize/nameKey'
import type {
  CandidateFact,
  LinkedCandidateFact,
  LinkRecordsResult,
  ReconciliationDiagnostic,
  ReconciliationEntity,
} from './records'

// The shared Unicode-hardened fold (issue #1875) produces the same output as the historical
// inline normalizer for every input - both keep only `[a-z0-9]` and spaces - so
// reconciliation matching, and therefore the generated corpus, is unchanged.
const normalizeName = normalizedNameText

const contextsOverlap = (left: RulesContextId[], right: RulesContextId[]): boolean =>
  !left.length || !right.length || left.some(id => right.includes(id))

const compareFacts = (left: CandidateFact, right: CandidateFact): number =>
  left.entityKind.localeCompare(right.entityKind) ||
  left.entityName.localeCompare(right.entityName) ||
  left.field.localeCompare(right.field) ||
  left.id.localeCompare(right.id)

export const linkRecords = (facts: CandidateFact[], entities: ReconciliationEntity[]): LinkRecordsResult => {
  const linked: LinkedCandidateFact[] = []
  const unresolved: CandidateFact[] = []
  const diagnostics: ReconciliationDiagnostic[] = []
  const seenFactIds = new Set<string>()

  ;[...facts].sort(compareFacts).forEach(fact => {
    if (seenFactIds.has(fact.id)) {
      unresolved.push(fact)
      diagnostics.push({
        code: 'duplicate-fact-id',
        severity: 'error',
        message: `Candidate fact ID ${fact.id} is not unique`,
        factIds: [fact.id],
      })
      return
    }
    seenFactIds.add(fact.id)

    const scoped = entities.filter(
      entity =>
        entity.kind === fact.entityKind && contextsOverlap(entity.rulesContextIds, fact.rulesContextIds)
    )
    const externalMatches = fact.externalEntityId
      ? scoped.filter(entity => entity.externalIds[fact.publisher]?.includes(fact.externalEntityId!))
      : []
    const matches = externalMatches.length
      ? externalMatches
      : scoped.filter(entity => normalizeName(entity.name) === normalizeName(fact.entityName))

    if (matches.length !== 1) {
      unresolved.push(fact)
      diagnostics.push({
        code: matches.length ? 'ambiguous-entity' : 'unmatched-entity',
        severity: matches.length ? 'error' : 'warning',
        message: matches.length
          ? `Candidate fact ${fact.id} matches multiple ${fact.entityKind} entities`
          : `Candidate fact ${fact.id} does not match a ${fact.entityKind} entity`,
        factIds: [fact.id],
      })
      return
    }

    const linkedBy = externalMatches.length ? 'external-id' : 'normalized-name'
    linked.push({ ...fact, entityId: matches[0].id, linkedBy })
    if (linkedBy === 'normalized-name') {
      diagnostics.push({
        code: 'normalized-name-link',
        severity: 'warning',
        message: `Candidate fact ${fact.id} was linked by normalized name`,
        factIds: [fact.id],
        entityId: matches[0].id,
      })
    }
  })

  return {
    linked,
    unresolved,
    diagnostics,
  }
}
