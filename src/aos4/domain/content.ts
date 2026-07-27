import type { Ability } from './ability'
import type { DomainEntity } from './entity'
import { isTurnPhaseId } from './game'
import type { CanonicalId, RulesContextId } from './identity'
import type { RulesContext } from './rulesContext'
import type { SourceArtifact, SourceRecord } from './source'
import type { Weapon } from './weapon'

export const AOS4_CATALOG_SCHEMA_VERSION = 1 as const

export interface Publication extends DomainEntity<'publication'> {
  publisher: SourceArtifact['publisher']
}

export interface Faction extends DomainEntity<'faction'> {}

export interface Warscroll extends DomainEntity<'warscroll'> {
  factionIds: CanonicalId<'faction'>[]
  keywords: string[]
}

export interface ContentGroup extends DomainEntity<'content-group'> {
  groupType: string
}

export type ContentEntity = Publication | Faction | Warscroll | Ability | Weapon | ContentGroup

export type ContentRelationshipKind = 'belongs-to' | 'offers' | 'requires' | 'includes' | 'excludes'

export interface ContentRelationship {
  id: `relationship:${string}`
  kind: ContentRelationshipKind
  from: CanonicalId
  to: CanonicalId
  rulesContextIds?: RulesContextId[]
}

export interface Aos4Catalog {
  schemaVersion: typeof AOS4_CATALOG_SCHEMA_VERSION
  generatedAt: string
  rulesContexts: RulesContext[]
  sourceArtifacts: SourceArtifact[]
  sourceRecords: SourceRecord[]
  entities: ContentEntity[]
  relationships: ContentRelationship[]
}

export type DomainValidationIssueCode =
  | 'duplicate-artifact-id'
  | 'duplicate-source-record-id'
  | 'duplicate-rules-context-id'
  | 'duplicate-entity-id'
  | 'missing-source-artifact'
  | 'missing-source-record-rules-context'
  | 'missing-rules-context-publication'
  | 'missing-source-record'
  | 'missing-rules-context'
  | 'missing-entity-provenance'
  | 'invalid-turn-phase'
  | 'missing-ability-effect'
  | 'missing-reaction-trigger'
  | 'invalid-passive-timing'
  | 'invalid-usage-limit'
  | 'invalid-weapon-profile'
  | 'missing-relationship-source'
  | 'missing-relationship-target'
  | 'missing-relationship-rules-context'

export interface DomainValidationIssue {
  code: DomainValidationIssueCode
  subject: string
  message: string
}

const duplicateIssues = (
  values: string[],
  code: DomainValidationIssueCode,
  subjectType: string
): DomainValidationIssue[] => {
  const seen = new Set<string>()

  return values.reduce((issues, value) => {
    if (seen.has(value)) {
      issues.push({
        code,
        subject: value,
        message: `Duplicate ${subjectType} ID: ${value}`,
      })
    }
    seen.add(value)
    return issues
  }, [] as DomainValidationIssue[])
}

export const validateCatalog = (catalog: Aos4Catalog): DomainValidationIssue[] => {
  const issues: DomainValidationIssue[] = []
  const artifactIds = new Set(catalog.sourceArtifacts.map(artifact => artifact.id))
  const sourceRecordIds = new Set(catalog.sourceRecords.map(record => record.id))
  const contextIds = new Set(catalog.rulesContexts.map(context => context.id))
  const entityIds = new Set(catalog.entities.map(entity => entity.id))

  issues.push(
    ...duplicateIssues(
      catalog.sourceArtifacts.map(artifact => artifact.id),
      'duplicate-artifact-id',
      'artifact'
    ),
    ...duplicateIssues(
      catalog.sourceRecords.map(record => record.id),
      'duplicate-source-record-id',
      'source record'
    ),
    ...duplicateIssues(
      catalog.rulesContexts.map(context => context.id),
      'duplicate-rules-context-id',
      'rules context'
    ),
    ...duplicateIssues(
      catalog.entities.map(entity => entity.id),
      'duplicate-entity-id',
      'entity'
    )
  )

  catalog.sourceRecords.forEach(record => {
    if (!artifactIds.has(record.artifactId)) {
      issues.push({
        code: 'missing-source-artifact',
        subject: record.id,
        message: `Source record ${record.id} refers to missing artifact ${record.artifactId}`,
      })
    }

    record.rulesContextIds.forEach(contextId => {
      if (!contextIds.has(contextId)) {
        issues.push({
          code: 'missing-source-record-rules-context',
          subject: record.id,
          message: `Source record ${record.id} refers to missing rules context ${contextId}`,
        })
      }
    })
  })

  catalog.rulesContexts.forEach(context => {
    context.publicationIds.forEach(publicationId => {
      if (!entityIds.has(publicationId)) {
        issues.push({
          code: 'missing-rules-context-publication',
          subject: context.id,
          message: `Rules context ${context.id} refers to missing publication ${publicationId}`,
        })
      }
    })
  })

  catalog.entities.forEach(entity => {
    if (!entity.sourceRefs.length) {
      issues.push({
        code: 'missing-entity-provenance',
        subject: entity.id,
        message: `Entity ${entity.id} has no source provenance`,
      })
    }

    entity.sourceRefs.forEach(reference => {
      if (!sourceRecordIds.has(reference.sourceRecordId)) {
        issues.push({
          code: 'missing-source-record',
          subject: entity.id,
          message: `Entity ${entity.id} refers to missing source record ${reference.sourceRecordId}`,
        })
      }
    })
  })

  catalog.entities.forEach(entity => {
    entity.rulesContextIds.forEach(contextId => {
      if (!contextIds.has(contextId)) {
        issues.push({
          code: 'missing-rules-context',
          subject: entity.id,
          message: `Entity ${entity.id} refers to missing rules context ${contextId}`,
        })
      }
    })
  })

  catalog.entities.forEach(entity => {
    if (entity.kind === 'weapon') {
      const { attacks, hit, wound, rend, damage } = entity.profile
      if ([attacks, hit, wound, rend, damage].some(value => !value.trim())) {
        issues.push({
          code: 'invalid-weapon-profile',
          subject: entity.id,
          message: `Weapon ${entity.id} must retain every profile characteristic`,
        })
      }
      return
    }

    if (entity.kind !== 'ability') return

    if (!entity.text.effect.trim()) {
      issues.push({
        code: 'missing-ability-effect',
        subject: entity.id,
        message: `Ability ${entity.id} must retain its effect`,
      })
    }

    entity.timings.forEach(timing => {
      if (timing.window.kind === 'turn-phase' && !isTurnPhaseId(timing.window.phase)) {
        issues.push({
          code: 'invalid-turn-phase',
          subject: entity.id,
          message: `Ability ${entity.id} has invalid turn phase ${timing.window.phase}`,
        })
      }

      if (timing.usage && (!Number.isInteger(timing.usage.limit) || timing.usage.limit < 1)) {
        issues.push({
          code: 'invalid-usage-limit',
          subject: entity.id,
          message: `Ability ${entity.id} has an invalid usage limit`,
        })
      }
    })

    if (entity.abilityKind === 'reaction' && !entity.text.reactionTrigger?.trim()) {
      issues.push({
        code: 'missing-reaction-trigger',
        subject: entity.id,
        message: `Reaction ${entity.id} must retain its trigger`,
      })
    }

    if (
      entity.abilityKind === 'passive' &&
      entity.timings.some(timing => timing.kind !== 'passive' || timing.window.kind !== 'always')
    ) {
      issues.push({
        code: 'invalid-passive-timing',
        subject: entity.id,
        message: `Passive ability ${entity.id} must use an always/passive timing`,
      })
    }
  })

  catalog.relationships.forEach(relationship => {
    if (!entityIds.has(relationship.from)) {
      issues.push({
        code: 'missing-relationship-source',
        subject: relationship.id,
        message: `Relationship ${relationship.id} has missing source ${relationship.from}`,
      })
    }
    if (!entityIds.has(relationship.to)) {
      issues.push({
        code: 'missing-relationship-target',
        subject: relationship.id,
        message: `Relationship ${relationship.id} has missing target ${relationship.to}`,
      })
    }
    relationship.rulesContextIds?.forEach(contextId => {
      if (!contextIds.has(contextId)) {
        issues.push({
          code: 'missing-relationship-rules-context',
          subject: relationship.id,
          message: `Relationship ${relationship.id} refers to missing rules context ${contextId}`,
        })
      }
    })
  })

  return issues
}
