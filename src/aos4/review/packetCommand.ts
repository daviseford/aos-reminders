import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  createArtifactCache,
  assertArtifactChecksum,
  type ArtifactManifest,
  type WahapediaHtmlReconciliation,
} from '../data'
import type { WahapediaDataset, WahapediaRecordMeta } from '../data/wahapedia'
import {
  artifactId,
  type Aos4Catalog,
  type CanonicalId,
  type ContentEntity,
  type RulesContextId,
  type SourceRecord,
  type SourceRecordId,
} from '../domain'
import { loadAcceptedCorpusSourceData } from '../generate/corpusCommand'
import type { IdentityRegistry } from '../generate/identityRegistry'
import type { OfficialBattleProfileCatalog } from '../generate/officialBattleProfiles'
import { stableCompactJson, stableJson } from '../generate/serialization'
import {
  ignoredRecordCandidateKey,
  officialRecordCandidateKey,
  prepareReviewPackets,
  profileOnlyFactCandidateKey,
  reconciliationDiscrepancyCandidateKey,
  REQUIRED_HIGH_RISK_COHORTS,
  sourceRecordCandidateKey,
  type ReviewCalibrationCase,
  type ReviewCandidateSourceEvidence,
  type ReviewPacketCandidate,
  type ReviewPacketPair,
} from './packets'
import {
  AOS4_GOLDEN_TRUTH_CASES,
  inspectCatalogPathologies,
  pathologyReviewCohorts,
  type PathologyIssue,
} from './pathology'
import { AOS4_REVIEW_PROTOCOL_VERSION, AOS4_REVIEW_RUBRIC_VERSION } from './records'
import { writeCreateOnlyDirectory } from './reviewWorkspace'

const DEFAULT_ACCEPTED_MANIFEST = path.join('data', 'aos4', 'manifests', 'accepted-2026-08-18.json')
const DEFAULT_REVIEW = path.join('data', 'aos4', 'reviews', 'corpus-2026-08-18.json')
const DEFAULT_CATALOG = path.join('data', 'aos4', 'catalog', 'catalog.json')
const DEFAULT_OFFICIAL_PROFILES = path.join('data', 'aos4', 'catalog', 'official-battle-profiles.json')
const DEFAULT_IDENTITIES = path.join('data', 'aos4', 'identities', 'corpus.json')
const DEFAULT_RUNTIME = path.join('src', 'aos4', 'generated', 'corpus', 'runtime.json')
const DEFAULT_CACHE = path.join('.cache', 'aos4', 'artifacts')
const REVIEW_CACHE = path.join('.cache', 'aos4', 'review')
const DEFAULT_WORKSPACE = path.join(REVIEW_CACHE, 'workspace')
const PACKET_SHARD_SIZE = 250
const MAX_EXCERPT_LENGTH = 1_200
export const identityAliasesRequireAdversarialReview = (aliasCount: number): boolean => aliasCount > 1

/**
 * `environment` is threaded through to `createArtifactCache`, which reads `AOS4_ARTIFACT_STORE_*` and
 * upgrades a plain local cache into one that restores misses from S3 over the AWS CLI. Production
 * wants that. A caller that must stay offline — a test asserting the missing-artifact message — has
 * no other way to say so, because the default is the ambient process environment.
 */
export const assertReviewCacheComplete = async (
  manifest: ArtifactManifest,
  cacheDirectory: string,
  environment: Record<string, string | undefined> = process.env
): Promise<void> => {
  const cache = createArtifactCache(cacheDirectory, environment)
  for (const artifact of manifest.artifacts) {
    const bytes = await cache.get(artifact.checksum)
    if (!bytes) {
      throw new Error(
        `Accepted artifact ${artifact.checksum} is missing from ${cacheDirectory}; ` +
          'populate the local accepted-source cache before preparing review packets'
      )
    }
    assertArtifactChecksum(bytes, artifact.checksum, 'cache-corrupt')
    if (bytes.byteLength !== artifact.byteLength) {
      throw new Error(
        `Accepted artifact ${artifact.checksum} in ${cacheDirectory} has an unexpected byte length`
      )
    }
  }
}

interface PacketCommandArguments {
  acceptedManifestPath: string
  reviewPath: string
  catalogPath: string
  officialProfilesPath: string
  identitiesPath: string
  runtimePath: string
  cacheDirectory: string
  workspaceDirectory: string
}

interface SourceSnapshot {
  meta: WahapediaRecordMeta
  recordKind: string
  structuredValue: Record<string, unknown>
}

interface RuntimeProjection {
  entities: Array<Record<string, unknown> & { id: CanonicalId }>
}

interface SourceEntityIndexes {
  entitiesBySourceRecord: Map<SourceRecordId, ContentEntity[]>
  factionIdsBySourceRecord: Map<SourceRecordId, CanonicalId<'faction'>[]>
}

const readJson = async <T>(filePath: string): Promise<T> => JSON.parse(await readFile(filePath, 'utf8')) as T

const normalizedWorkspacePath = (workspaceDirectory: string): string => {
  const allowedRoot = path.resolve(REVIEW_CACHE)
  const requested = path.resolve(workspaceDirectory)
  if (requested !== allowedRoot && !requested.startsWith(`${allowedRoot}${path.sep}`)) {
    throw new Error(`Review packet workspace must remain under ${REVIEW_CACHE}`)
  }
  return requested
}

export const parsePacketCommandArguments = (arguments_: string[]): PacketCommandArguments => {
  const parsed: PacketCommandArguments = {
    acceptedManifestPath: DEFAULT_ACCEPTED_MANIFEST,
    reviewPath: DEFAULT_REVIEW,
    catalogPath: DEFAULT_CATALOG,
    officialProfilesPath: DEFAULT_OFFICIAL_PROFILES,
    identitiesPath: DEFAULT_IDENTITIES,
    runtimePath: DEFAULT_RUNTIME,
    cacheDirectory: DEFAULT_CACHE,
    workspaceDirectory: DEFAULT_WORKSPACE,
  }
  const flags: Record<string, keyof PacketCommandArguments> = {
    '--accepted-manifest': 'acceptedManifestPath',
    '--review': 'reviewPath',
    '--catalog': 'catalogPath',
    '--official-profiles': 'officialProfilesPath',
    '--identities': 'identitiesPath',
    '--runtime': 'runtimePath',
    '--cache': 'cacheDirectory',
    '--workspace': 'workspaceDirectory',
  }
  for (let index = 0; index < arguments_.length; index += 1) {
    const flag = arguments_[index]
    const key = flags[flag]
    if (!key) throw new Error(`Unknown argument: ${flag}`)
    const value = arguments_[index + 1]
    if (!value || value.startsWith('--')) throw new Error(`${flag} requires a value`)
    parsed[key] = value
    index += 1
  }
  normalizedWorkspacePath(parsed.workspaceDirectory)
  return parsed
}

const datasetSnapshots = (dataset: WahapediaDataset): Map<SourceRecordId, SourceSnapshot> => {
  const snapshots = new Map<SourceRecordId, SourceSnapshot>()
  const collections: Array<[string, unknown[]]> = [
    ['faction', dataset.factions],
    ['publication', dataset.sources],
    ['warscroll', dataset.warscrolls],
    ['warscroll-ability', dataset.warscrollAbilities],
    ['warscroll-weapon', dataset.warscrollWeapons],
    ['warscroll-keyword', dataset.warscrollKeywords],
    ['warscroll-base', dataset.warscrollBases],
    ['warscroll-organisation', dataset.warscrollOrganisation],
    ['regiment-of-renown-faction', dataset.regimentOfRenownFactions],
    ['faction-ability-type', dataset.factionAbilityTypes],
    ['faction-ability-subtype', dataset.factionAbilitySubtypes],
    ['faction-ability', dataset.factionAbilities],
    ['general-rules-page', dataset.generalRulesPages ?? []],
    ['general-rule-group', dataset.generalRuleGroups ?? []],
    ['general-rule-ability', dataset.generalRuleAbilities ?? []],
    ...(dataset.lastUpdate ? ([['last-update', [dataset.lastUpdate]]] as Array<[string, unknown[]]>) : []),
  ]
  collections.forEach(([recordKind, values]) =>
    values.forEach(value => {
      const record = value as Record<string, unknown> & { meta: WahapediaRecordMeta }
      const { meta, ...structuredValue } = record
      snapshots.set(meta.sourceRecordId, { meta, recordKind, structuredValue })
    })
  )
  return snapshots
}

const factionIdsByEntity = (catalog: Aos4Catalog): Map<CanonicalId, Set<CanonicalId<'faction'>>> => {
  const byEntity = new Map<CanonicalId, Set<CanonicalId<'faction'>>>()
  catalog.entities.forEach(entity => {
    if (entity.kind === 'faction') {
      byEntity.set(entity.id, new Set([entity.id]))
    } else if (entity.kind === 'warscroll') {
      byEntity.set(entity.id, new Set(entity.factionIds))
    }
  })
  let changed = true
  while (changed) {
    changed = false
    catalog.relationships
      .filter(relationship => relationship.kind === 'offers' || relationship.kind === 'includes')
      .forEach(relationship => {
        const from = byEntity.get(relationship.from)
        if (!from?.size) return
        const to = byEntity.get(relationship.to) ?? new Set<CanonicalId<'faction'>>()
        const priorSize = to.size
        from.forEach(factionId => to.add(factionId))
        byEntity.set(relationship.to, to)
        if (to.size !== priorSize) changed = true
      })
  }
  return byEntity
}

const sourceEntityIndexes = (catalog: Aos4Catalog): SourceEntityIndexes => {
  const factionsByEntity = factionIdsByEntity(catalog)
  const entitiesBySourceRecord = new Map<SourceRecordId, ContentEntity[]>()
  const factionSetsBySourceRecord = new Map<SourceRecordId, Set<CanonicalId<'faction'>>>()
  catalog.entities.forEach(entity =>
    entity.sourceRefs.forEach(reference => {
      const entities = entitiesBySourceRecord.get(reference.sourceRecordId) ?? []
      if (!entities.some(existing => existing.id === entity.id)) entities.push(entity)
      entitiesBySourceRecord.set(reference.sourceRecordId, entities)
      const factionIds =
        factionSetsBySourceRecord.get(reference.sourceRecordId) ?? new Set<CanonicalId<'faction'>>()
      factionsByEntity.get(entity.id)?.forEach(factionId => factionIds.add(factionId))
      factionSetsBySourceRecord.set(reference.sourceRecordId, factionIds)
    })
  )
  return {
    entitiesBySourceRecord,
    factionIdsBySourceRecord: new Map(
      Array.from(factionSetsBySourceRecord, ([sourceRecordId, factionIds]) => [
        sourceRecordId,
        Array.from(factionIds).sort((left, right) => left.localeCompare(right)),
      ])
    ),
  }
}

const sourceExcerpt = (value: unknown): string => {
  const compact = stableCompactJson(value)
  return compact.length <= MAX_EXCERPT_LENGTH ? compact : `${compact.slice(0, MAX_EXCERPT_LENGTH)}…`
}

const canonicalSearchText = (value: string): { text: string; offsets: number[] } => {
  const characters: string[] = []
  const offsets: number[] = []
  Array.from(value).forEach((character, offset) => {
    const normalized = character
      .normalize('NFKD')
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '')
    Array.from(normalized).forEach(value_ => {
      characters.push(value_)
      offsets.push(offset)
    })
  })
  return { text: characters.join(''), offsets }
}

export const pageExcerpt = (pageText: string | undefined, needle?: string): string | undefined => {
  const text = pageText?.replace(/\s+/g, ' ').trim()
  if (!text) return undefined
  const searchable = canonicalSearchText(text)
  const needles = needle
    ? [needle, needle.replace(/^Scourge of Aqshy\s+/i, '')].map(value => canonicalSearchText(value).text)
    : []
  const matchIndexes = Array.from(
    new Set(
      needles.flatMap(value => {
        if (!value) return []
        const matches: number[] = []
        let offset = 0
        while (offset < searchable.text.length) {
          const match = searchable.text.indexOf(value, offset)
          if (match < 0) break
          matches.push(searchable.offsets[match] ?? 0)
          offset = match + Math.max(1, value.length)
        }
        return matches
      })
    )
  ).sort((left, right) => left - right)
  const ranges = (matchIndexes.length ? matchIndexes : [0])
    .map(matchIndex => ({
      start: Math.max(0, matchIndex - 300),
      end: Math.min(text.length, matchIndex - 300 + MAX_EXCERPT_LENGTH),
    }))
    .reduce<Array<{ start: number; end: number }>>((merged, range) => {
      const previous = merged.at(-1)
      if (previous && range.start <= previous.end) {
        previous.end = Math.max(previous.end, range.end)
      } else {
        merged.push(range)
      }
      return merged
    }, [])
  return ranges
    .map(
      ({ start, end }) => `${start > 0 ? '…' : ''}${text.slice(start, end)}${end < text.length ? '…' : ''}`
    )
    .join('\n')
}

const normalizedEntityValue = (entity: Aos4Catalog['entities'][number]): unknown => {
  return Object.fromEntries(
    Object.entries(entity).filter(([key]) => key !== 'revision' && key !== 'sourceRefs')
  )
}

const contextCohorts = (catalog: Aos4Catalog, rulesContextIds: RulesContextId[]): string[] =>
  rulesContextIds.flatMap(contextId => {
    const context = catalog.rulesContexts.find(value => value.id === contextId)
    if (!context) return []
    return [
      `context:${context.mode}`,
      `context-status:${context.status}`,
      `high-risk:context-boundary:${context.mode === 'spearhead' ? 'spearhead' : context.status}`,
    ]
  })

const riskCohorts = (
  sourceRecordId: SourceRecordId,
  snapshot: SourceSnapshot | undefined,
  rulesContextIds: RulesContextId[],
  catalog: Aos4Catalog,
  entities: ContentEntity[],
  identitiesByEntity: Map<CanonicalId, IdentityRegistry['entries'][number]>,
  review: Awaited<ReturnType<typeof loadAcceptedCorpusSourceData>>['review'],
  diagnostics: Awaited<ReturnType<typeof loadAcceptedCorpusSourceData>>['decoded']['diagnostics']
): string[] => {
  const cohorts: string[] = []
  const isPolicyOrOverride =
    review.decoderDiagnosticPolicies.some(policy => policy.sourceRecordId === sourceRecordId) ||
    review.normalizationDiagnosticPolicies.some(policy => policy.sourceRecordId === sourceRecordId) ||
    review.timingOverrides.some(override => override.sourceRecordId === sourceRecordId) ||
    review.abilityTextOverrides?.some(override => override.sourceRecordId === sourceRecordId) ||
    review.contextOverrides?.some(override => override.sourceRecordId === sourceRecordId) ||
    review.weaponProfileOverrides?.some(override => override.sourceRecordId === sourceRecordId) ||
    review.warscrollKeywordOverrides?.some(override => override.sourceRecordId === sourceRecordId)
  if (isPolicyOrOverride) cohorts.push('high-risk:policy-or-override')
  if (review.timingOverrides.some(override => override.sourceRecordId === sourceRecordId)) {
    cohorts.push('high-risk:phase-timing-conflict')
  }
  const normalizationPolicyCodes = review.normalizationDiagnosticPolicies
    .filter(policy => policy.sourceRecordId === sourceRecordId)
    .map(policy => policy.code)
  if (normalizationPolicyCodes.some(code => /(?:phase|timing|reaction)/i.test(code))) {
    cohorts.push('high-risk:phase-timing-conflict')
  }
  if (normalizationPolicyCodes.some(code => /(?:unknown|incomplete|missing|placeholder)/i.test(code))) {
    cohorts.push('high-risk:unknown-or-incomplete')
  }
  if (normalizationPolicyCodes.some(code => /duplicate/i.test(code))) {
    cohorts.push('high-risk:duplicate-candidate')
  }
  if (
    entities.some(
      entity =>
        entity.kind === 'ability' &&
        (entity.abilityKind === 'reaction' || entity.timings.some(timing => timing.kind === 'reaction'))
    ) ||
    snapshot?.structuredValue.isReaction === true
  ) {
    cohorts.push('high-risk:reaction')
  }
  if (
    entities.some(entity =>
      identityAliasesRequireAdversarialReview(identitiesByEntity.get(entity.id)?.aliases.length ?? 0)
    )
  ) {
    cohorts.push('high-risk:identity-alias-or-rename')
  }
  const artifactById = new Map(catalog.sourceArtifacts.map(artifact => [artifact.id, artifact]))
  const sourceRecordById = new Map(catalog.sourceRecords.map(record => [record.id, record]))
  const entityHasOfficialSource = entities.some(entity =>
    entity.sourceRefs.some(reference => {
      const record = sourceRecordById.get(reference.sourceRecordId)
      return record && artifactById.get(record.artifactId)?.publisher === 'games-workshop'
    })
  )
  if (snapshot?.meta.officialSourceRecordIds?.length || entityHasOfficialSource) {
    cohorts.push('high-risk:official-override')
  }
  if (
    diagnostics.some(
      diagnostic =>
        diagnostic.file === snapshot?.meta.file &&
        diagnostic.row === snapshot.meta.row &&
        diagnostic.code.startsWith('duplicate-')
    )
  ) {
    cohorts.push('high-risk:duplicate-candidate')
  }
  if (
    snapshot &&
    /\b(?:unknown|incomplete|placeholder|tbd)\b|[?]{2,}/i.test(stableCompactJson(snapshot.structuredValue))
  ) {
    cohorts.push('high-risk:unknown-or-incomplete')
  }
  cohorts.push(...contextCohorts(catalog, rulesContextIds))
  return Array.from(new Set(cohorts)).sort((left, right) => left.localeCompare(right))
}

const runtimeDestinationsById = (runtime: RuntimeProjection): Map<CanonicalId, Record<string, unknown>> =>
  new Map(runtime.entities.map(entity => [entity.id, entity]))

const generatedDestinations = (
  sourceRecord: SourceRecord,
  entities: Aos4Catalog['entities'],
  runtimeById: Map<CanonicalId, Record<string, unknown>>
): ReviewPacketCandidate['generatedDestinations'] => [
  {
    path: 'data/aos4/catalog/catalog.json',
    field: 'sourceRecords',
    value: sourceRecord,
  },
  ...entities.flatMap(entity => [
    {
      path: 'data/aos4/catalog/catalog.json',
      canonicalEntityId: entity.id,
      field: 'entity',
      value: normalizedEntityValue(entity),
    },
    ...(runtimeById.has(entity.id)
      ? [
          {
            path: 'src/aos4/generated/corpus/runtime.json',
            canonicalEntityId: entity.id,
            field: 'entity',
            value: runtimeById.get(entity.id),
          },
        ]
      : []),
  ]),
]

const authorityByArtifact = (
  catalog: Aos4Catalog
): Map<SourceRecord['artifactId'], ReviewCandidateSourceEvidence['authority']> =>
  new Map(catalog.sourceArtifacts.map(sourceArtifact => [sourceArtifact.id, sourceArtifact.authority.kind]))

const buildSourceCandidates = (
  sourceData: Awaited<ReturnType<typeof loadAcceptedCorpusSourceData>>,
  catalog: Aos4Catalog,
  identities: IdentityRegistry,
  runtime: RuntimeProjection,
  sourceIndexes: SourceEntityIndexes,
  reviewPath: string
): ReviewPacketCandidate[] => {
  const snapshots = datasetSnapshots(sourceData.decoded.dataset)
  const { entitiesBySourceRecord, factionIdsBySourceRecord } = sourceIndexes
  const authority = authorityByArtifact(catalog)
  const identitiesByEntity = new Map(identities.entries.map(entry => [entry.canonicalId, entry]))
  const runtimeById = runtimeDestinationsById(runtime)
  const sourceRecordById = new Map(catalog.sourceRecords.map(record => [record.id, record]))
  const pathologiesByEntity = new Map<CanonicalId, PathologyIssue[]>()
  inspectCatalogPathologies(catalog).forEach(pathology => {
    const entityId = pathology.subject as CanonicalId
    pathologiesByEntity.set(entityId, [...(pathologiesByEntity.get(entityId) ?? []), pathology])
  })
  return catalog.sourceRecords.map(sourceRecord => {
    const snapshot = snapshots.get(sourceRecord.id)
    const entities = entitiesBySourceRecord.get(sourceRecord.id) ?? []
    const officialPageText = sourceData.officialPageTextBySourceRecordId.get(sourceRecord.id)
    const structuredValue =
      snapshot?.structuredValue ??
      (officialPageText
        ? {
            recordKind: 'official-page',
            reviewedChecksum: sourceRecord.recordChecksum,
          }
        : {
            recordKind: 'provenance-only',
            reviewedChecksum: sourceRecord.recordChecksum,
          })
    const sourceAuthority = authority.get(sourceRecord.artifactId) ?? 'unknown'
    const keyword =
      snapshot?.recordKind === 'warscroll-keyword'
        ? [snapshot.structuredValue.keyword, snapshot.structuredValue.parameter]
            .filter(Boolean)
            .join(' ')
            .trim()
            .toUpperCase()
        : undefined
    const ignoredDisposition = sourceData.review.ignoredSourceRecords.find(
      disposition => disposition.sourceRecordId === sourceRecord.id
    )
    const reviewOverrides = [
      ...(sourceData.review.abilityTextOverrides ?? [])
        .filter(override => override.sourceRecordId === sourceRecord.id)
        .map(override => ({ field: 'abilityTextOverrides', value: override })),
      ...sourceData.review.timingOverrides
        .filter(override => override.sourceRecordId === sourceRecord.id)
        .map(override => ({ field: 'timingOverrides', value: override })),
      ...(sourceData.review.warscrollKeywordOverrides ?? [])
        .filter(
          override =>
            override.sourceRecordId === sourceRecord.id ||
            (keyword &&
              (override.remove ?? []).some(value => value.trim().toUpperCase() === keyword) &&
              entities.some(
                entity =>
                  entity.kind === 'warscroll' &&
                  entity.sourceRefs.some(reference => reference.sourceRecordId === override.sourceRecordId)
              ))
        )
        .map(override => ({ field: 'warscrollKeywordOverrides', value: override })),
    ]
    const officialOverrideSourceIds = Array.from(
      new Set(reviewOverrides.flatMap(({ value }) => value.officialSourceRecordIds))
    ).sort((left, right) => left.localeCompare(right))
    let preferredOverrideEntityKind: ContentEntity['kind'] | undefined
    if (reviewOverrides.some(override => override.field === 'warscrollKeywordOverrides')) {
      preferredOverrideEntityKind = 'warscroll'
    } else if (
      reviewOverrides.some(
        override => override.field === 'abilityTextOverrides' || override.field === 'timingOverrides'
      )
    ) {
      preferredOverrideEntityKind = 'ability'
    }
    const overrideExcerptFocus =
      entities.find(entity => entity.kind === preferredOverrideEntityKind)?.name ??
      entities.find(entity => entity.kind === 'warscroll')?.name ??
      entities[0]?.name ??
      keyword
    const officialOverrideEvidence = officialOverrideSourceIds.map(sourceRecordId => {
      const officialRecord = sourceRecordById.get(sourceRecordId)
      if (!officialRecord) {
        throw new Error(`Official override references missing source record ${sourceRecordId}`)
      }
      const officialAuthority = authority.get(officialRecord.artifactId) ?? 'unknown'
      if (officialAuthority !== 'official') {
        throw new Error(`Official override evidence ${sourceRecordId} is not from an official artifact`)
      }
      return {
        sourceRecordId: officialRecord.id,
        artifactId: officialRecord.artifactId,
        recordChecksum: officialRecord.recordChecksum,
        locator: officialRecord.locator,
        authority: officialAuthority,
        structuredValue: {
          recordKind: 'official-override-evidence',
          reviewedChecksum: officialRecord.recordChecksum,
        },
        excerpt:
          pageExcerpt(
            sourceData.officialPageTextBySourceRecordId.get(officialRecord.id),
            overrideExcerptFocus
          ) ??
          sourceExcerpt({
            recordKind: 'official-override-evidence',
            reviewedChecksum: officialRecord.recordChecksum,
          }),
      }
    })
    return {
      key: sourceRecordCandidateKey(sourceRecord.id),
      category: 'source-record',
      cohortIds: Array.from(
        new Set([
          sourceAuthority === 'secondary' ? 'secondary-semantic' : `source-authority:${sourceAuthority}`,
          ...(snapshot ? [`source-kind:${snapshot.recordKind}`] : ['source-kind:official-page']),
          ...riskCohorts(
            sourceRecord.id,
            snapshot,
            sourceRecord.rulesContextIds,
            catalog,
            entities,
            identitiesByEntity,
            sourceData.review,
            sourceData.decoded.diagnostics
          ),
          ...reviewOverrides.map(({ field }) => `high-risk:official-${field}`),
          ...(ignoredDisposition ? ['high-risk:policy-or-override'] : []),
          ...pathologyReviewCohorts(entities.flatMap(entity => pathologiesByEntity.get(entity.id) ?? [])),
        ])
      ),
      ...(entities.length === 1 ? { canonicalEntityId: entities[0].id } : {}),
      factionIds: factionIdsBySourceRecord.get(sourceRecord.id) ?? [],
      rulesContextIds: sourceRecord.rulesContextIds,
      independentlyDerivable: true,
      sourceEvidence: [
        {
          sourceRecordId: sourceRecord.id,
          artifactId: sourceRecord.artifactId,
          recordChecksum: sourceRecord.recordChecksum,
          locator: sourceRecord.locator,
          authority: sourceAuthority,
          structuredValue,
          excerpt:
            pageExcerpt(officialPageText) ??
            sourceExcerpt({
              recordKind: snapshot?.recordKind ?? 'provenance-only',
              value: structuredValue,
            }),
        },
        ...officialOverrideEvidence,
      ],
      generatedDestinations: [
        ...generatedDestinations(sourceRecord, entities, runtimeById),
        ...reviewOverrides.map(override => ({
          path: reviewPath.replaceAll('\\', '/'),
          field: override.field,
          value: override.value,
        })),
        // A live-but-ignored source record intentionally generates no entity; bind the durable
        // review disposition so the independent comparison verifies the absence instead of
        // reporting a missing generated entity.
        ...(ignoredDisposition
          ? [
              {
                path: reviewPath.replaceAll('\\', '/'),
                field: 'ignoredSourceRecords',
                value: ignoredDisposition,
              },
            ]
          : []),
      ],
    }
  })
}

const factionByName = (catalog: Aos4Catalog): Map<string, CanonicalId<'faction'>> =>
  new Map(
    catalog.entities
      .filter(entity => entity.kind === 'faction')
      .map(entity => [entity.name.toLowerCase(), entity.id as CanonicalId<'faction'>])
  )

const contextIdsForLabel = (catalog: Aos4Catalog, label: string): RulesContextId[] => {
  const normalized = label.toLowerCase()
  const matches = catalog.rulesContexts.filter(context => {
    if (normalized === 'spearhead') return context.mode === 'spearhead'
    if (normalized === 'legends') return context.status === 'legends'
    if (normalized === 'historical') return context.status === 'historical'
    if (normalized === 'seasonal') return context.status === 'seasonal'
    return context.status === 'current' || context.status === 'seasonal'
  })
  return matches.map(context => context.id)
}

const buildOfficialCandidates = (
  catalog: Aos4Catalog,
  profiles: OfficialBattleProfileCatalog,
  officialPageTextBySourceRecordId: Map<string, string>,
  entitiesBySourceRecord: SourceEntityIndexes['entitiesBySourceRecord']
): ReviewPacketCandidate[] => {
  const sourceRecordById = new Map(catalog.sourceRecords.map(record => [record.id, record]))
  const factions = factionByName(catalog)
  return profiles.records.map(record => {
    const sourceRecord = sourceRecordById.get(record.fact.sourceRecordId)
    const entities = entitiesBySourceRecord.get(record.fact.sourceRecordId) ?? []
    return {
      key: officialRecordCandidateKey(record.id),
      category: 'official-record',
      cohortIds: [
        'official-fact',
        `official-status:${record.status}`,
        `official-disposition:${record.disposition}`,
        ...(record.disposition === 'applied-to-runtime' ? ['high-risk:official-override'] : []),
      ],
      ...(entities.length === 1 ? { canonicalEntityId: entities[0].id } : {}),
      factionIds: factions.has(record.fact.faction.toLowerCase())
        ? [factions.get(record.fact.faction.toLowerCase())!]
        : [],
      rulesContextIds: contextIdsForLabel(catalog, record.fact.context),
      independentlyDerivable: true,
      sourceEvidence: [
        {
          sourceRecordId: record.fact.sourceRecordId,
          artifactId: artifactId(record.artifactChecksum),
          recordChecksum: sourceRecord?.recordChecksum ?? record.fact.factChecksum,
          locator: sourceRecord?.locator ?? {
            kind: 'page',
            page: record.fact.page,
          },
          authority: 'official',
          structuredValue: {
            fact: record.fact,
            applicationStatus: record.status,
            disposition: record.disposition,
          },
          excerpt:
            pageExcerpt(officialPageTextBySourceRecordId.get(record.fact.sourceRecordId), record.fact.name) ??
            sourceExcerpt(record.fact),
        },
      ],
      generatedDestinations: [
        {
          path: 'data/aos4/catalog/official-battle-profiles.json',
          field: 'record',
          value: record,
        },
        ...entities.map(entity => ({
          path: 'data/aos4/catalog/catalog.json',
          canonicalEntityId: entity.id,
          field: 'entity',
          value: normalizedEntityValue(entity),
        })),
      ],
    }
  })
}

const buildReconciliationCandidates = (
  catalog: Aos4Catalog,
  reconciliation: WahapediaHtmlReconciliation
): ReviewPacketCandidate[] => {
  const sourceRecordById = new Map(catalog.sourceRecords.map(record => [record.id, record]))
  const factions = factionByName(catalog)
  const discrepancyCandidates = reconciliation.discrepancies.map((discrepancy, index) => {
    const sourceRecord = sourceRecordById.get(discrepancy.officialSourceRecordId)
    if (!sourceRecord) {
      throw new Error(
        `Reconciliation discrepancy references missing source record ${discrepancy.officialSourceRecordId}`
      )
    }
    return {
      key: reconciliationDiscrepancyCandidateKey(index),
      category: 'reconciliation-discrepancy' as const,
      cohortIds: [
        'reconciliation-discrepancy',
        `reconciliation-field:${discrepancy.field}`,
        'high-risk:official-secondary-disagreement',
      ],
      factionIds: [],
      rulesContextIds: sourceRecord.rulesContextIds,
      independentlyDerivable: true,
      sourceEvidence: [
        {
          sourceRecordId: sourceRecord.id,
          artifactId: sourceRecord.artifactId,
          recordChecksum: sourceRecord.recordChecksum,
          locator: sourceRecord.locator,
          authority: 'official' as const,
          structuredValue: {
            field: discrepancy.field,
            official: discrepancy.official,
            secondary: discrepancy.secondary,
            secondaryUrl: discrepancy.url,
          },
          excerpt: sourceExcerpt(discrepancy),
        },
      ],
      generatedDestinations: [
        {
          path: 'data/aos4/reports/corpus-2026-08-18-reconciliation.json',
          field: `discrepancies[${index}]`,
          value: discrepancy,
        },
      ],
    }
  })
  const profileOnlyCandidates = reconciliation.unmatchedOfficialUnitFacts.map((fact, index) => {
    const sourceRecord = sourceRecordById.get(fact.sourceRecordId)
    if (!sourceRecord) {
      throw new Error(`Profile-only fact references missing source record ${fact.sourceRecordId}`)
    }
    const factionId = factions.get(fact.faction.toLowerCase())
    return {
      key: profileOnlyFactCandidateKey(fact.factChecksum),
      category: 'profile-only-fact' as const,
      cohortIds: ['profile-only-fact', 'high-risk:official-profile-only'],
      factionIds: factionId ? [factionId] : [],
      rulesContextIds: contextIdsForLabel(catalog, fact.context),
      independentlyDerivable: true,
      sourceEvidence: [
        {
          sourceRecordId: sourceRecord.id,
          artifactId: sourceRecord.artifactId,
          recordChecksum: sourceRecord.recordChecksum,
          locator: sourceRecord.locator,
          authority: 'official' as const,
          structuredValue: fact,
          excerpt: sourceExcerpt(fact),
        },
      ],
      generatedDestinations: [
        {
          path: 'data/aos4/reports/corpus-2026-08-18-reconciliation.json',
          field: `unmatchedOfficialUnitFacts[${index}]`,
          value: fact,
        },
      ],
    }
  })
  return [...discrepancyCandidates, ...profileOnlyCandidates]
}

const buildGoldenTruthCandidates = (
  catalog: Aos4Catalog,
  runtime: RuntimeProjection,
  sourceIndexes: SourceEntityIndexes,
  officialPageTextBySourceRecordId: Map<string, string>
): ReviewPacketCandidate[] => {
  const sourceRecordById = new Map(catalog.sourceRecords.map(record => [record.id, record]))
  const runtimeById = runtimeDestinationsById(runtime)
  return AOS4_GOLDEN_TRUTH_CASES.map(goldenCase => {
    const sourceRecord = sourceRecordById.get(goldenCase.sourceRecordId)
    if (!sourceRecord) {
      throw new Error(`Golden truth case ${goldenCase.id} references a missing source record`)
    }
    const section = goldenCase.locator.kind === 'page' ? goldenCase.locator.section : undefined
    const matchingEntities = (
      sourceIndexes.entitiesBySourceRecord.get(goldenCase.sourceRecordId) ?? []
    ).filter(
      entity =>
        (!section || entity.name.toLowerCase().includes(section.toLowerCase())) &&
        JSON.stringify(entity).includes(JSON.stringify(goldenCase.expectedValue))
    )
    if (matchingEntities.length !== 1) {
      throw new Error(
        `Golden truth case ${goldenCase.id} resolved to ${matchingEntities.length} generated entities`
      )
    }
    const entity = matchingEntities[0]
    return {
      key: goldenCase.id,
      category: 'golden-truth',
      cohortIds: ['golden-truth', 'high-risk:pathology-regression'],
      canonicalEntityId: entity.id,
      factionIds: sourceIndexes.factionIdsBySourceRecord.get(goldenCase.sourceRecordId) ?? [],
      rulesContextIds: entity.rulesContextIds,
      independentlyDerivable: true,
      sourceEvidence: [
        {
          sourceRecordId: sourceRecord.id,
          artifactId: sourceRecord.artifactId,
          recordChecksum: sourceRecord.recordChecksum,
          locator: goldenCase.locator,
          authority: 'official',
          structuredValue: { field: goldenCase.field },
          excerpt:
            pageExcerpt(officialPageTextBySourceRecordId.get(goldenCase.sourceRecordId), section) ??
            sourceExcerpt({ locator: goldenCase.locator }),
        },
      ],
      generatedDestinations: [
        {
          path: 'src/aos4/review/goldenTruth.json',
          canonicalEntityId: entity.id,
          field: goldenCase.field,
          value: goldenCase.expectedValue,
        },
        {
          path: 'data/aos4/catalog/catalog.json',
          canonicalEntityId: entity.id,
          field: 'entity',
          value: normalizedEntityValue(entity),
        },
        ...(runtimeById.has(entity.id)
          ? [
              {
                path: 'src/aos4/generated/corpus/runtime.json',
                canonicalEntityId: entity.id,
                field: 'entity',
                value: runtimeById.get(entity.id),
              },
            ]
          : []),
      ],
    }
  })
}

const contextIdsForMeta = (catalog: Aos4Catalog, meta: WahapediaRecordMeta): RulesContextId[] => {
  const kinds = meta.rulesContextKinds ?? (meta.rulesContextKind ? [meta.rulesContextKind] : [])
  if (!kinds.length) return catalog.rulesContexts.map(context => context.id)
  return catalog.rulesContexts
    .filter(context =>
      kinds.some(kind => {
        if (kind === 'standard') return context.status === 'current' || context.status === 'seasonal'
        if (kind === 'seasonal') return context.status === 'seasonal'
        if (kind === 'spearhead') return context.mode === 'spearhead'
        return context.status === kind
      })
    )
    .map(context => context.id)
}

const buildIgnoredCandidates = (
  sourceData: Awaited<ReturnType<typeof loadAcceptedCorpusSourceData>>,
  catalog: Aos4Catalog,
  reviewPath: string
): ReviewPacketCandidate[] => {
  const snapshots = datasetSnapshots(sourceData.acceptedDecoded.dataset)
  const supersededMetas = sourceData.decoded.dataset.supersededMetas ?? []
  const supersededIds = new Set(supersededMetas.map(meta => meta.sourceRecordId))
  const explicit: ReviewPacketCandidate[] = sourceData.review.ignoredSourceRecords.map(disposition => {
    const sourceRecord = catalog.sourceRecords.find(record => record.id === disposition.sourceRecordId)
    const snapshot = snapshots.get(disposition.sourceRecordId)
    if (!sourceRecord && !snapshot) {
      throw new Error(
        `Ignored source disposition references unavailable record ${disposition.sourceRecordId}`
      )
    }
    const rulesContextIds = sourceRecord?.rulesContextIds ?? contextIdsForMeta(catalog, snapshot!.meta)
    const locator =
      sourceRecord?.locator ??
      (snapshot!.meta.section
        ? ({ kind: 'section', section: snapshot!.meta.section } as const)
        : ({ kind: 'row', row: snapshot!.meta.row } as const))
    return {
      key: ignoredRecordCandidateKey(disposition.sourceRecordId),
      category: 'ignored-record' as const,
      cohortIds: [
        'ignored-record',
        'high-risk:policy-or-override',
        ...(supersededIds.has(disposition.sourceRecordId) ? ['superseded-source-record'] : []),
      ],
      factionIds: [],
      rulesContextIds,
      independentlyDerivable: true,
      sourceEvidence: [
        {
          sourceRecordId: disposition.sourceRecordId,
          artifactId: sourceRecord?.artifactId ?? snapshot!.meta.artifactId,
          recordChecksum: sourceRecord?.recordChecksum ?? snapshot!.meta.recordChecksum,
          locator,
          authority: 'secondary' as const,
          structuredValue: {
            disposition: 'ignored',
            reason: disposition.reason,
            sourceValue: snapshot?.structuredValue,
          },
          excerpt: sourceExcerpt({
            ...disposition,
            sourceValue: snapshot?.structuredValue,
          }),
        },
      ],
      generatedDestinations: [
        {
          path: reviewPath.replaceAll('\\', '/'),
          field: 'ignoredSourceRecords',
          value: disposition,
        },
      ],
    }
  })
  const reason =
    sourceData.review.supersededSourceRecords?.reason ?? 'Superseded by the accepted current-source snapshot.'
  const superseded: ReviewPacketCandidate[] = supersededMetas.map(meta => ({
    key: ignoredRecordCandidateKey(meta.sourceRecordId),
    category: 'ignored-record' as const,
    cohortIds: [
      'ignored-record',
      'superseded-source-record',
      ...(sourceData.decoded.diagnostics.some(
        diagnostic =>
          diagnostic.file === meta.file &&
          diagnostic.row === meta.row &&
          diagnostic.code.startsWith('duplicate-')
      )
        ? ['high-risk:duplicate-candidate']
        : []),
      ...(meta.officialSourceRecordIds?.length ? ['high-risk:official-override'] : []),
      ...contextCohorts(catalog, contextIdsForMeta(catalog, meta)),
    ],
    factionIds: [],
    rulesContextIds: contextIdsForMeta(catalog, meta),
    independentlyDerivable: true,
    sourceEvidence: [
      {
        sourceRecordId: meta.sourceRecordId,
        artifactId: meta.artifactId,
        recordChecksum: meta.recordChecksum,
        locator: meta.section
          ? ({ kind: 'section', section: meta.section } as const)
          : ({ kind: 'row', row: meta.row } as const),
        authority: 'secondary' as const,
        structuredValue: {
          disposition: 'superseded',
          reason,
          sourceFile: meta.file,
        },
        excerpt: sourceExcerpt({
          disposition: 'superseded',
          reason,
          sourceFile: meta.file,
          row: meta.row,
          section: meta.section,
        }),
      },
    ],
    generatedDestinations: [
      {
        path: reviewPath.replaceAll('\\', '/'),
        field: 'supersededSourceRecords',
        value: { sourceRecordId: meta.sourceRecordId, reason },
      },
    ],
  }))
  const byKey = new Map(superseded.map(candidate => [candidate.key, candidate]))
  explicit.forEach(candidate => {
    const existing = byKey.get(candidate.key)
    byKey.set(
      candidate.key,
      existing
        ? {
            ...candidate,
            cohortIds: Array.from(new Set([...existing.cohortIds, ...candidate.cohortIds])).sort(
              (left, right) => left.localeCompare(right)
            ),
            generatedDestinations: [...existing.generatedDestinations, ...candidate.generatedDestinations],
          }
        : candidate
    )
  })
  return Array.from(byKey.values()).sort((left, right) => left.key.localeCompare(right.key))
}

const calibrationCases = (
  official: ReviewPacketCandidate[],
  reconciliation: ReviewPacketCandidate[]
): ReviewCalibrationCase[] => {
  const knownPass = official[0]
  const knownDisagreement = reconciliation.find(
    candidate => candidate.category === 'reconciliation-discrepancy'
  )
  if (!knownPass || !knownDisagreement) {
    throw new Error('Calibration requires official pass and reconciliation disagreement candidates')
  }
  const knownDefect: ReviewPacketCandidate = {
    ...knownPass,
    key: 'seeded-known-defect',
    generatedDestinations: [
      {
        path: 'calibration/seeded-defect.json',
        field: 'intentionallyIncorrectValue',
        value: '__SEEDED_BLOCKER_MISMATCH__',
      },
    ],
  }
  const insufficient: ReviewPacketCandidate = {
    ...knownPass,
    key: 'seeded-insufficient-evidence',
    cohortIds: ['calibration-insufficient-evidence'],
    sourceEvidence: knownPass.sourceEvidence.map(evidence => ({
      ...evidence,
      structuredValue: undefined,
      excerpt: undefined,
    })),
    generatedDestinations: [],
  }
  return [
    { id: 'known-pass', kind: 'pass', candidate: knownPass },
    { id: 'known-defect', kind: 'defect', candidate: knownDefect },
    { id: 'known-disagreement', kind: 'disagreement', candidate: knownDisagreement },
    { id: 'insufficient-evidence', kind: 'insufficient-evidence', candidate: insufficient },
  ]
}

const writePacketShards = async (
  workspaceDirectory: string,
  pairs: ReviewPacketPair[]
): Promise<Array<{ path: string; pairs: number }>> => {
  const shardDirectory = path.join(workspaceDirectory, 'packets')
  await mkdir(shardDirectory, { recursive: true })
  const shards: Array<{ path: string; pairs: number }> = []
  for (let index = 0; index < pairs.length; index += PACKET_SHARD_SIZE) {
    const shardNumber = Math.floor(index / PACKET_SHARD_SIZE) + 1
    const fileName = `shard-${String(shardNumber).padStart(4, '0')}.json`
    const shardPath = path.join(shardDirectory, fileName)
    const shardPairs = pairs.slice(index, index + PACKET_SHARD_SIZE)
    await writeFile(shardPath, stableJson({ schemaVersion: 1, pairs: shardPairs }), 'utf8')
    shards.push({
      path: path.relative(workspaceDirectory, shardPath).replaceAll('\\', '/'),
      pairs: shardPairs.length,
    })
  }
  return shards
}

const run = async (): Promise<void> => {
  const arguments_ = parsePacketCommandArguments(process.argv.slice(2))
  const workspaceDirectory = normalizedWorkspacePath(arguments_.workspaceDirectory)
  const [catalog, profiles, identities, runtime] = await Promise.all([
    readJson<Aos4Catalog>(arguments_.catalogPath),
    readJson<OfficialBattleProfileCatalog>(arguments_.officialProfilesPath),
    readJson<IdentityRegistry>(arguments_.identitiesPath),
    readJson<RuntimeProjection>(arguments_.runtimePath),
  ])
  const sourceData = await loadAcceptedCorpusSourceData({
    acceptedManifestPath: arguments_.acceptedManifestPath,
    reviewPath: arguments_.reviewPath,
    cacheDirectory: arguments_.cacheDirectory,
  })
  const sourceIndexes = sourceEntityIndexes(catalog)
  const sourceCandidates = buildSourceCandidates(
    sourceData,
    catalog,
    identities,
    runtime,
    sourceIndexes,
    arguments_.reviewPath
  )
  const officialCandidates = buildOfficialCandidates(
    catalog,
    profiles,
    sourceData.officialPageTextBySourceRecordId,
    sourceIndexes.entitiesBySourceRecord
  )
  const reconciliationCandidates = buildReconciliationCandidates(catalog, sourceData.reconciliation)
  const ignoredCandidates = buildIgnoredCandidates(sourceData, catalog, arguments_.reviewPath)
  const goldenTruthCandidates = buildGoldenTruthCandidates(
    catalog,
    runtime,
    sourceIndexes,
    sourceData.officialPageTextBySourceRecordId
  )
  const overrideFields = [
    ['abilityTextOverrides', sourceData.review.abilityTextOverrides ?? []],
    ['timingOverrides', sourceData.review.timingOverrides],
    ['warscrollKeywordOverrides', sourceData.review.warscrollKeywordOverrides ?? []],
  ] as const
  overrideFields.forEach(([field, overrides]) => {
    const expectedIds = new Set(overrides.map(override => override.sourceRecordId))
    const actualIds = new Set(
      sourceCandidates.flatMap(candidate =>
        candidate.generatedDestinations.flatMap(destination =>
          destination.field === field &&
          destination.value &&
          typeof destination.value === 'object' &&
          'sourceRecordId' in destination.value
            ? [String(destination.value.sourceRecordId)]
            : []
        )
      )
    )
    if (
      actualIds.size !== expectedIds.size ||
      Array.from(expectedIds).some(sourceRecordId => !actualIds.has(sourceRecordId))
    ) {
      throw new Error(
        `Review packet preparation found ${actualIds.size}/${expectedIds.size} ${field} targets`
      )
    }
  })
  const requiredOverrideCohorts = overrideFields.flatMap(([field, overrides]) =>
    overrides.length > 0 ? [`high-risk:official-${field}`] : []
  )
  const prepared = prepareReviewPackets({
    revision: sourceData.review.revision,
    protocolVersion: AOS4_REVIEW_PROTOCOL_VERSION,
    rubricVersion: AOS4_REVIEW_RUBRIC_VERSION,
    candidates: [
      ...sourceCandidates,
      ...officialCandidates,
      ...reconciliationCandidates,
      ...ignoredCandidates,
      ...goldenTruthCandidates,
    ],
    expectedCoverage: {
      officialRecords: profiles.records.length,
      reconciliationDiscrepancies: sourceData.reconciliation.discrepancies.length,
      profileOnlyFacts: sourceData.reconciliation.unmatchedOfficialUnitFacts.length,
      sourceRecords: catalog.sourceRecords.length,
      ignoredRecords: ignoredCandidates.length,
    },
    requiredFactionContextStrata: catalog.entities
      .filter(entity => entity.kind === 'faction')
      .flatMap(entity =>
        entity.rulesContextIds.map(rulesContextId => ({
          factionId: entity.id as CanonicalId<'faction'>,
          rulesContextId,
        }))
      ),
    requiredHighRiskCohorts: [...REQUIRED_HIGH_RISK_COHORTS, ...requiredOverrideCohorts],
    calibrationCases: calibrationCases(officialCandidates, reconciliationCandidates),
  })
  const shardCount = Math.ceil(prepared.workspace.pairs.length / PACKET_SHARD_SIZE)
  await writeCreateOnlyDirectory(workspaceDirectory, async staging => {
    const shards = await writePacketShards(staging, prepared.workspace.pairs)
    await Promise.all([
      writeFile(path.join(staging, 'index.json'), stableJson(prepared.safeIndex), 'utf8'),
      writeFile(
        path.join(staging, 'workspace.json'),
        stableJson({
          schemaVersion: prepared.workspace.schemaVersion,
          revision: prepared.workspace.revision,
          protocolVersion: prepared.workspace.protocolVersion,
          rubricVersion: prepared.workspace.rubricVersion,
          publication: 'create-only-directory/v1',
          evidenceHandling: prepared.workspace.evidenceHandling,
          batches: prepared.workspace.batches,
          shards,
        }),
        'utf8'
      ),
    ])
  })
  console.log(
    `Prepared ${prepared.safeIndex.entries.length} deterministic review packet pairs ` +
      `in ${workspaceDirectory} (${shardCount} shards)`
  )
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  run().catch(error => {
    console.error(error)
    process.exitCode = 1
  })
}
