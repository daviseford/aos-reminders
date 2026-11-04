import type {
  Aos4Catalog,
  CanonicalId,
  ContentEntity,
  ContentRelationship,
  RulesContext,
  RulesContextId,
} from '../domain'
import { createCatalogIndex, type CatalogIndex } from './catalog'
import { normalizeSelectionDiagnostics, type SelectionDiagnostic } from './diagnostics'

export interface ResolveSelectionInput {
  explicitIds: CanonicalId[]
  rulesContextId: RulesContextId
  /**
   * Overlay the Legends rules context(s) on top of `rulesContextId`.
   *
   * Legends warscrolls are catalogued in their own context, disjoint from the current and
   * seasonal ones, so a document whose roster opted into Legends holds entities from two
   * contexts at once. With the overlay on, an entity or relationship is applicable when it
   * belongs to *either* context; diagnostics still report against the primary context.
   */
  allowsLegends?: boolean
  /**
   * Overlay the historical rules context(s) on top of `rulesContextId`.
   *
   * A General's Handbook lapses each summer, and the content it introduced moves to the historical
   * context rather than disappearing. An army built during that season is a mixture: current
   * warscrolls picked from a battletome that is still in print, alongside seasonal formations and
   * unit variants that are not. With the overlay on, an entity or relationship is applicable when
   * it belongs to *either* context; diagnostics still report against the primary context.
   */
  allowsHistorical?: boolean
}

export interface SelectionCause {
  entityId: CanonicalId
  rootId: CanonicalId
  entityPath: CanonicalId[]
  relationshipPath: string[]
}

export interface ResolvedSelection {
  explicitIds: CanonicalId[]
  selectedIds: CanonicalId[]
  availableIds: CanonicalId[]
  causes: SelectionCause[]
  diagnostics: SelectionDiagnostic[]
}

const AUTO_SELECT_RELATIONSHIPS = new Set<ContentRelationship['kind']>(['includes', 'requires'])

const sortIds = (ids: Iterable<CanonicalId>): CanonicalId[] =>
  Array.from(ids).sort((left, right) => left.localeCompare(right))

const isEntityApplicable = (entity: ContentEntity, rulesContextIds: ReadonlySet<RulesContextId>): boolean =>
  entity.rulesContextIds.some(id => rulesContextIds.has(id))

const isRelationshipApplicable = (
  relationship: ContentRelationship,
  rulesContextIds: ReadonlySet<RulesContextId>
): boolean =>
  !relationship.rulesContextIds?.length || relationship.rulesContextIds.some(id => rulesContextIds.has(id))

const causeSignature = (cause: SelectionCause): string =>
  `${cause.rootId}|${cause.entityPath.join('>')}|${cause.relationshipPath.join('>')}`

const sortCauses = (causes: SelectionCause[]): SelectionCause[] =>
  causes.sort(
    (left, right) =>
      left.entityId.localeCompare(right.entityId) ||
      left.rootId.localeCompare(right.rootId) ||
      left.relationshipPath.join('>').localeCompare(right.relationshipPath.join('>'))
  )

interface ApplicableRelationships {
  contextIds: ReadonlySet<RulesContextId>
  excludes: readonly ContentRelationship[]
  danglingDiagnostics: readonly SelectionDiagnostic[]
}

/**
 * The army-independent half of selection resolution, computed once per catalog snapshot.
 *
 * The snapshot is owned by whoever prepares it and reflects the catalog at that moment: it keeps
 * references to the catalog's entities and relationships, so re-prepare after mutating the catalog.
 * `resolveSelection` prepares afresh on every call; hold a prepared catalog only where the catalog
 * cannot change between resolves.
 */
export interface PreparedSelectionCatalog {
  readonly index: CatalogIndex
  readonly rulesContexts: readonly RulesContext[]
  readonly contextIds: ReadonlySet<RulesContextId>
  readonly missingContextDiagnostics: readonly SelectionDiagnostic[]
  /** Every relationship, sorted by id once; filtering keeps this order. */
  readonly relationshipsById: readonly ContentRelationship[]
  /** Applicable relationships per rules context and overlay combination, filled on first use. */
  readonly applicableByKey: Map<string, ApplicableRelationships>
}

export const prepareSelectionCatalog = (catalog: Aos4Catalog): PreparedSelectionCatalog => {
  const contextIds = new Set(catalog.rulesContexts.map(context => context.id))
  const missingContextDiagnostics: SelectionDiagnostic[] = []
  catalog.relationships.forEach(relationship => {
    relationship.rulesContextIds?.forEach(contextId => {
      if (!contextIds.has(contextId)) {
        missingContextDiagnostics.push({
          code: 'missing-relationship-context',
          severity: 'error',
          subject: relationship.id,
          message: `Relationship ${relationship.id} refers to missing rules context ${contextId}`,
          rulesContextId: contextId,
        })
      }
    })
  })

  return {
    index: createCatalogIndex(catalog),
    rulesContexts: [...catalog.rulesContexts],
    contextIds,
    missingContextDiagnostics,
    relationshipsById: [...catalog.relationships].sort((left, right) => left.id.localeCompare(right.id)),
    applicableByKey: new Map(),
  }
}

const applicableRelationshipsFor = (
  prepared: PreparedSelectionCatalog,
  input: ResolveSelectionInput
): ApplicableRelationships => {
  const key = `${input.rulesContextId}|${Boolean(input.allowsLegends)}|${Boolean(input.allowsHistorical)}`
  const cached = prepared.applicableByKey.get(key)
  if (cached) return cached

  const overlayStatuses = new Set(
    [input.allowsLegends ? 'legends' : undefined, input.allowsHistorical ? 'historical' : undefined].filter(
      (status): status is string => Boolean(status)
    )
  )
  const contextIds = new Set<RulesContextId>([
    input.rulesContextId,
    ...prepared.rulesContexts
      .filter(context => overlayStatuses.has(context.status))
      .map(context => context.id),
  ])
  const relationships = prepared.relationshipsById.filter(relationship =>
    isRelationshipApplicable(relationship, contextIds)
  )
  const danglingDiagnostics: SelectionDiagnostic[] = []
  relationships.forEach(relationship => {
    if (!prepared.index.entitiesById.has(relationship.from)) {
      danglingDiagnostics.push({
        code: 'dangling-relationship-source',
        severity: 'error',
        subject: relationship.id,
        message: `Relationship ${relationship.id} has missing source ${relationship.from}`,
        entityIds: [relationship.from],
      })
    }
    if (!prepared.index.entitiesById.has(relationship.to)) {
      danglingDiagnostics.push({
        code: 'dangling-relationship-target',
        severity: 'error',
        subject: relationship.id,
        message: `Relationship ${relationship.id} has missing target ${relationship.to}`,
        entityIds: [relationship.to],
      })
    }
  })
  const applicable = {
    contextIds,
    excludes: relationships.filter(relationship => relationship.kind === 'excludes'),
    danglingDiagnostics,
  }
  prepared.applicableByKey.set(key, applicable)
  return applicable
}

// Prepared diagnostics are shared across resolves; hand each result its own copies.
const copyDiagnostic = (diagnostic: SelectionDiagnostic): SelectionDiagnostic => ({
  ...diagnostic,
  ...(diagnostic.entityIds ? { entityIds: [...diagnostic.entityIds] } : {}),
})

export const resolveSelection = (catalog: Aos4Catalog, input: ResolveSelectionInput): ResolvedSelection =>
  resolvePreparedSelection(prepareSelectionCatalog(catalog), input)

export const resolvePreparedSelection = (
  prepared: PreparedSelectionCatalog,
  input: ResolveSelectionInput
): ResolvedSelection => {
  const { index, contextIds } = prepared
  const applicable = applicableRelationshipsFor(prepared, input)
  const applicableContextIds = applicable.contextIds
  const overlayNames = [
    input.allowsLegends ? 'Legends' : undefined,
    input.allowsHistorical ? 'historical content' : undefined,
  ].filter((name): name is string => Boolean(name))
  const availabilityDescription = overlayNames.length
    ? `${input.rulesContextId} or ${overlayNames.join(' or ')}`
    : input.rulesContextId
  const diagnostics: SelectionDiagnostic[] = []

  if (!contextIds.has(input.rulesContextId)) {
    diagnostics.push({
      code: 'missing-rules-context',
      severity: 'error',
      subject: input.rulesContextId,
      message: `Rules context ${input.rulesContextId} does not exist in the catalog`,
      rulesContextId: input.rulesContextId,
    })
  }

  diagnostics.push(
    ...prepared.missingContextDiagnostics.map(copyDiagnostic),
    ...applicable.danglingDiagnostics.map(copyDiagnostic)
  )

  interface ResolutionPass {
    selectedIds: Set<CanonicalId>
    availableIds: Set<CanonicalId>
    causes: SelectionCause[]
    diagnostics: SelectionDiagnostic[]
  }

  const runPass = (suppressedIds: ReadonlySet<CanonicalId>): ResolutionPass => {
    const selectedIds = new Set<CanonicalId>()
    const availableIds = new Set<CanonicalId>()
    const passDiagnostics: SelectionDiagnostic[] = []
    const causes: SelectionCause[] = []
    const queuedCauseSignatures = new Set<string>()
    const queue: SelectionCause[] = []

    sortIds(new Set(input.explicitIds)).forEach(entityId => {
      const entity = index.entitiesById.get(entityId)
      if (!entity) {
        passDiagnostics.push({
          code: 'missing-explicit-selection',
          severity: 'error',
          subject: entityId,
          message: `Explicit selection ${entityId} does not exist in the catalog`,
          entityIds: [entityId],
        })
        return
      }
      if (!isEntityApplicable(entity, applicableContextIds)) {
        passDiagnostics.push({
          code: 'inapplicable-explicit-selection',
          severity: 'error',
          subject: entityId,
          message: `Explicit selection ${entityId} is not available in ${availabilityDescription}`,
          entityIds: [entityId],
          rulesContextId: input.rulesContextId,
        })
        return
      }

      const cause: SelectionCause = {
        entityId,
        rootId: entityId,
        entityPath: [entityId],
        relationshipPath: [],
      }
      selectedIds.add(entityId)
      causes.push(cause)
      queuedCauseSignatures.add(causeSignature(cause))
      queue.push(cause)
    })

    for (let queueIndex = 0; queueIndex < queue.length; queueIndex += 1) {
      const cause = queue[queueIndex]
      const outgoing = index.outgoingByEntityId.get(cause.entityId) ?? []

      outgoing
        .filter(relationship => isRelationshipApplicable(relationship, applicableContextIds))
        .forEach(relationship => {
          const target = index.entitiesById.get(relationship.to)
          if (!target) return
          // A replaced (suppressed) entity is unreachable: not offered, not auto-included.
          if (suppressedIds.has(target.id)) return

          if (!isEntityApplicable(target, applicableContextIds)) {
            passDiagnostics.push({
              code: 'inapplicable-relationship-target',
              severity: 'error',
              subject: relationship.id,
              message: `Relationship ${relationship.id} targets content outside ${availabilityDescription}`,
              entityIds: [relationship.from, relationship.to],
              rulesContextId: input.rulesContextId,
            })
            return
          }

          if (relationship.kind === 'offers') {
            availableIds.add(target.id)
            return
          }
          if (!AUTO_SELECT_RELATIONSHIPS.has(relationship.kind)) return

          if (cause.entityPath.includes(target.id)) {
            passDiagnostics.push({
              code: 'relationship-cycle',
              severity: 'error',
              subject: relationship.id,
              message: `Relationship ${relationship.id} creates a selection cycle`,
              entityIds: [...cause.entityPath, target.id],
            })
            return
          }

          const nextCause: SelectionCause = {
            entityId: target.id,
            rootId: cause.rootId,
            entityPath: [...cause.entityPath, target.id],
            relationshipPath: [...cause.relationshipPath, relationship.id],
          }
          const signature = causeSignature(nextCause)
          if (queuedCauseSignatures.has(signature)) return

          selectedIds.add(target.id)
          causes.push(nextCause)
          queuedCauseSignatures.add(signature)
          queue.push(nextCause)
        })
    }

    return { selectedIds, availableIds, causes, diagnostics: passDiagnostics }
  }

  // Pass 1 resolves without suppression; any `excludes` edge whose source is then selected
  // suppresses its target for pass 2. Suppression models replacement (an Army of Renown replaces
  // the faction's regular rules): the target and anything reachable only through it disappear
  // from selection and availability. An explicit selection is never silently suppressed — it
  // stays selected and the conflict surfaces as a diagnostic instead.
  const firstPass = runPass(new Set())
  const explicitIdSet = new Set(input.explicitIds)
  const suppressedIds = new Set<CanonicalId>()
  applicable.excludes.forEach(relationship => {
    if (!firstPass.selectedIds.has(relationship.from)) return
    if (explicitIdSet.has(relationship.to)) return
    suppressedIds.add(relationship.to)
  })
  const finalPass = suppressedIds.size ? runPass(suppressedIds) : firstPass
  const { selectedIds, availableIds, causes } = finalPass
  diagnostics.push(...finalPass.diagnostics)

  applicable.excludes.forEach(relationship => {
    if (selectedIds.has(relationship.from) && selectedIds.has(relationship.to)) {
      diagnostics.push({
        code: 'excluded-selection',
        severity: 'error',
        subject: relationship.id,
        message: `Selected content ${relationship.from} excludes ${relationship.to}`,
        entityIds: [relationship.from, relationship.to],
        rulesContextId: input.rulesContextId,
      })
    }
  })

  return {
    explicitIds: sortIds(
      new Set(
        input.explicitIds.filter(entityId => {
          const entity = index.entitiesById.get(entityId)
          return Boolean(entity && isEntityApplicable(entity, applicableContextIds))
        })
      )
    ),
    selectedIds: sortIds(selectedIds),
    availableIds: sortIds(availableIds),
    causes: sortCauses(causes),
    diagnostics: normalizeSelectionDiagnostics(diagnostics),
  }
}
