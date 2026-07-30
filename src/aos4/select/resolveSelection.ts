import type {
  Aos4Catalog,
  CanonicalId,
  ContentEntity,
  ContentRelationship,
  RulesContextId,
} from '../domain'
import { createCatalogIndex } from './catalog'
import {
  normalizeSelectionDiagnostics,
  type SelectionDiagnostic,
} from './diagnostics'

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

export const resolveSelection = (
  catalog: Aos4Catalog,
  input: ResolveSelectionInput
): ResolvedSelection => {
  const index = createCatalogIndex(catalog)
  const contextIds = new Set(catalog.rulesContexts.map(context => context.id))
  const overlayStatuses = new Set(
    [input.allowsLegends ? 'legends' : undefined, input.allowsHistorical ? 'historical' : undefined].filter(
      (status): status is string => Boolean(status)
    )
  )
  const applicableContextIds = new Set<RulesContextId>([
    input.rulesContextId,
    ...catalog.rulesContexts
      .filter(context => overlayStatuses.has(context.status))
      .map(context => context.id),
  ])
  const overlayNames = [
    input.allowsLegends ? 'Legends' : undefined,
    input.allowsHistorical ? 'historical content' : undefined,
  ].filter((name): name is string => Boolean(name))
  const availabilityDescription = overlayNames.length
    ? `${input.rulesContextId} or ${overlayNames.join(' or ')}`
    : input.rulesContextId
  const selectedIds = new Set<CanonicalId>()
  const availableIds = new Set<CanonicalId>()
  const diagnostics: SelectionDiagnostic[] = []
  const causes: SelectionCause[] = []
  const queuedCauseSignatures = new Set<string>()
  const queue: SelectionCause[] = []

  if (!contextIds.has(input.rulesContextId)) {
    diagnostics.push({
      code: 'missing-rules-context',
      severity: 'error',
      subject: input.rulesContextId,
      message: `Rules context ${input.rulesContextId} does not exist in the catalog`,
      rulesContextId: input.rulesContextId,
    })
  }

  catalog.relationships.forEach(relationship => {
    relationship.rulesContextIds?.forEach(contextId => {
      if (!contextIds.has(contextId)) {
        diagnostics.push({
          code: 'missing-relationship-context',
          severity: 'error',
          subject: relationship.id,
          message: `Relationship ${relationship.id} refers to missing rules context ${contextId}`,
          rulesContextId: contextId,
        })
      }
    })
  })

  const applicableRelationships = catalog.relationships
    .filter(relationship => isRelationshipApplicable(relationship, applicableContextIds))
    .sort((left, right) => left.id.localeCompare(right.id))

  applicableRelationships.forEach(relationship => {
    if (!index.entitiesById.has(relationship.from)) {
      diagnostics.push({
        code: 'dangling-relationship-source',
        severity: 'error',
        subject: relationship.id,
        message: `Relationship ${relationship.id} has missing source ${relationship.from}`,
        entityIds: [relationship.from],
      })
    }
    if (!index.entitiesById.has(relationship.to)) {
      diagnostics.push({
        code: 'dangling-relationship-target',
        severity: 'error',
        subject: relationship.id,
        message: `Relationship ${relationship.id} has missing target ${relationship.to}`,
        entityIds: [relationship.to],
      })
    }
  })

  sortIds(new Set(input.explicitIds)).forEach(entityId => {
    const entity = index.entitiesById.get(entityId)
    if (!entity) {
      diagnostics.push({
        code: 'missing-explicit-selection',
        severity: 'error',
        subject: entityId,
        message: `Explicit selection ${entityId} does not exist in the catalog`,
        entityIds: [entityId],
      })
      return
    }
    if (!isEntityApplicable(entity, applicableContextIds)) {
      diagnostics.push({
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

        if (!isEntityApplicable(target, applicableContextIds)) {
          diagnostics.push({
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
          diagnostics.push({
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

  applicableRelationships
    .filter(relationship => relationship.kind === 'excludes')
    .forEach(relationship => {
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
