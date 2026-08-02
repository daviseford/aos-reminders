import { createHash } from 'node:crypto'
import type { ArtifactManifestEntry, WahapediaRulesPageReview } from '../data'
import {
  normalizeWahapediaAbility,
  normalizeWahapediaWeapon,
  WAHAPEDIA_ATTRIBUTION,
  type WahapediaDataset,
  type WahapediaDecodeResult,
  type WahapediaDiagnostic,
  type WahapediaFactionAbilityRecord,
  type WahapediaGeneralRuleAbilityRecord,
  type WahapediaRecordMeta,
  type WahapediaSourceRecord,
  type WahapediaWarscrollAbilityRecord,
  type WahapediaWarscrollRecord,
} from '../data/wahapedia'
import {
  AOS4_CATALOG_SCHEMA_VERSION,
  artifactId,
  sourceRecordId as domainSourceRecordId,
  type Ability,
  type AbilityCost,
  type AbilityKind,
  type AbilityTiming,
  type Aos4Catalog,
  type BattleProfile,
  type CanonicalId,
  type ContentEntity,
  type ContentGroup,
  type ContentRelationship,
  type EntityKind,
  type Faction,
  type Publication,
  type RulesContext,
  type RulesContextId,
  type SourceArtifact,
  type SourceRecord,
  type SourceRecordId,
  type SourceReference,
  type Warscroll,
  type Weapon,
  type WeaponKeyword,
} from '../domain'
import { normalizeSourceText } from '../normalize'
import type { IdentityAlias, IdentityRegistry, IdentityRegistryEntry } from './identityRegistry'
import type { SourceDisposition } from './integrity'

export const AOS4_CORPUS_REVIEW_SCHEMA_VERSION = 1 as const

export interface CorpusDiagnosticPolicy {
  code: string
  reason: string
  file?: string
  row?: number
  sourceRecordId?: SourceRecordId
  officialSourceRecordIds?: SourceRecordId[]
}

export interface CorpusIgnoredSourceRecord {
  sourceRecordId: SourceRecordId
  reason: string
}

export interface CorpusTimingOverride {
  sourceRecordId: SourceRecordId
  abilityKind: AbilityKind
  timings: AbilityTiming[]
  reason: string
  officialSourceRecordIds: SourceRecordId[]
}

export interface CorpusAbilityTextOverride {
  sourceRecordId: SourceRecordId
  text: Ability['text']
  reason: string
  officialSourceRecordIds: SourceRecordId[]
}

export interface CorpusOfficialSourceRecord {
  id: SourceRecordId
  page: number
  recordChecksum: string
  section?: string
}

export interface CorpusOfficialDocument {
  artifact: ArtifactManifestEntry
  title: string
  documentKind?: 'reference' | 'battle-profiles' | 'battle-profile-supplement'
  rulesContextIds: RulesContextId[]
  faction?: string
  version?: string
  publicationDate?: string
  effectiveDate?: string
  sourceRecords: CorpusOfficialSourceRecord[]
}

export interface CorpusContextOverride {
  sourceRecordId: SourceRecordId
  rulesContextIds: RulesContextId[]
  reason: string
  officialSourceRecordIds?: SourceRecordId[]
}

export interface CorpusWeaponProfileOverride {
  sourceRecordId: SourceRecordId
  profile: Partial<Pick<Weapon['profile'], 'rangeInches' | 'attacks' | 'hit' | 'wound' | 'rend' | 'damage'>>
  reason: string
  officialSourceRecordIds: SourceRecordId[]
}

export interface CorpusWarscrollKeywordOverride {
  sourceRecordId: SourceRecordId
  remove: string[]
  reason: string
  officialSourceRecordIds: SourceRecordId[]
}

export interface CorpusCommunityWarscrollUnit {
  /** The official unit name; it must match exactly one effective official unit fact. */
  name: string
  /** The catalogue section the extractor derives, e.g. `unit:tyrant-on-glutthorn`. */
  section: string
  /** The pinned checksum of the extracted warscroll fact. */
  recordChecksum: string
}

export interface CorpusCommunityFactionOption {
  /** The option name exactly as the BSData catalogue spells it; the official spelling wins. */
  name: string
  optionType: 'battle-formation' | 'heroic-trait' | 'artefact-of-power'
  /** The BSData selection-entry group the option must be found in. */
  groupName: string
  /** The catalogue section the extractor derives, e.g. `option:hunger-filled-tribe`. */
  section: string
  /** The pinned checksum of the extracted faction-option fact. */
  recordChecksum: string
}

/**
 * A reviewed community warscroll source under the standing fallback-tier source policy.
 *
 * The source hierarchy is: official Games Workshop publications (authoritative), then Wahapedia
 * (preferred secondary), then BSData as an acceptable fallback — only when an official publication
 * establishes the content, Wahapedia does not yet carry the rules, the facts are marked
 * provisional/community, and they are verified or replaced when Wahapedia or an owner-supplied
 * official source becomes available. Community facts never override official or Wahapedia facts.
 */
export interface CorpusCommunityWarscrollSource {
  artifact: ArtifactManifestEntry
  title: string
  repository: string
  branch: string
  commit: string
  policyTier: 'community-fallback'
  status: 'provisional-pending-official-verification'
  authorizedBy: string
  authorizedAt: string
  reason: string
  verificationCondition: string
  /** Official page source records establishing the content (fallback condition (a)). */
  officialSourceRecordIds: SourceRecordId[]
  units: CorpusCommunityWarscrollUnit[]
  /** Faction roster options (battle formations, traits, artefacts) supplied by this source. */
  factionOptions?: CorpusCommunityFactionOption[]
}

/**
 * Wahapedia files some content behind a faction row that is not an army. Manifestations are the
 * live case: `Endless Spells` is a container for lores and warscrolls any army may take. Reviewing
 * such a container as universal offers its content groups and warscrolls to every approved faction
 * instead of to the container alone.
 */
export interface CorpusUniversalFactionContent {
  factionId: string
  reason: string
}

/**
 * A reviewed Army of Renown classification.
 *
 * The official Armies of Renown document defines the semantic: picking one replaces the faction's
 * rules ("use the faction rules on these pages instead of the [faction] rules"). Each entry names
 * the faction-page ability-type group that is the army's root; generation types that root
 * `army-of-renown`, rewires its subgroups behind it, and emits `excludes` edges applying the
 * replacement to the faction's regular content groups.
 *
 * Every entry must target a group the source page itself classifies as an Army of Renown (the
 * decoded record's `armyOfRenown` marker), and every source-classified group must have a reviewed
 * entry — generation fails closed in both directions, so a new Army of Renown appearing on a
 * faction page can never silently decode as a generic content group again (issue #1844).
 */
export interface CorpusArmyOfRenown {
  /** Source record of the faction-page ability-type group that is the Army of Renown root. */
  sourceRecordId: SourceRecordId
  reason: string
  officialSourceRecordIds: SourceRecordId[]
  /**
   * Evidence basis for the classification. `official` (the default) requires at least one cited
   * official source record naming the army. `secondary-provisional` classifies on the accepted
   * secondary transcription's own explicit marking under the three-tier source policy
   * (owner ruling 2026-08-01, daviseford/aos-reminders#1812, extended for #1844): battletome and
   * White Dwarf Armies of Renown whose official naming is not in any free accepted document.
   * Cited official records remain corroborating evidence; the entry is verified or upgraded when
   * an official document naming the army is accepted.
   */
  evidenceTier?: 'official' | 'secondary-provisional'
}

export interface CorpusReview {
  schemaVersion: typeof AOS4_CORPUS_REVIEW_SCHEMA_VERSION
  revision: string
  generatedAt: string
  rulesContext: {
    id: RulesContext['id']
    name: string
    mode: RulesContext['mode']
    status: RulesContext['status']
    battlepack?: string
    season?: string
    validFrom?: string
    validTo?: string
  }
  additionalRulesContexts?: Array<{
    id: RulesContext['id']
    name: string
    mode: RulesContext['mode']
    status: RulesContext['status']
    battlepack?: string
    season?: string
    validFrom?: string
    validTo?: string
  }>
  approvedFactionIds: string[]
  universalFactionContent?: CorpusUniversalFactionContent[]
  armiesOfRenown?: CorpusArmyOfRenown[]
  decoderDiagnosticPolicies: CorpusDiagnosticPolicy[]
  normalizationDiagnosticPolicies: CorpusDiagnosticPolicy[]
  ignoredSourceRecords: CorpusIgnoredSourceRecord[]
  timingOverrides: CorpusTimingOverride[]
  officialDocuments: CorpusOfficialDocument[]
  currentWahapediaHtml?: {
    expectedArtifacts: number
    expectedFactionArtifacts?: number
    expectedCollectionArtifacts?: number
    expectedWarscrolls?: number
    expectedFactionRootWarscrolls?: number
    expectedFactionGroups?: number
    expectedFactionAbilities?: number
    expectedRulesArtifacts?: number
    expectedRulesGroups?: number
    expectedRulesAbilities?: number
    expectedWarnings?: number
    /**
     * Reviewed cross-faction adoptions: datasheets a collection page carries whose keyword line
     * names another faction, but whose roster home an official publication establishes (e.g.
     * Lorai, Child of the Abyss on the Stormcast Eternals collection). Each entry must match
     * exactly one non-native datasheet on its page; a stale entry fails generation.
     */
    adoptedWarscrolls?: Array<{
      url: string
      name: string
      reason: string
      officialSourceRecordIds: SourceRecordId[]
    }>
    rulesPages?: WahapediaRulesPageReview[]
    reconciliation?: {
      checksum: string
      expectedPages: number
      expectedMatchedOfficialUnitFacts: number
      expectedUnmatchedOfficialUnitFacts: number
      expectedDiscrepancies: number
    }
    reviewedAt: string
  }
  supersededSourceRecords?: {
    expectedCount: number
    checksum: string
    reason: string
  }
  defaultRulesContextId?: RulesContextId
  communityWarscrollSources?: CorpusCommunityWarscrollSource[]
  abilityTextOverrides?: CorpusAbilityTextOverride[]
  contextOverrides?: CorpusContextOverride[]
  weaponProfileOverrides?: CorpusWeaponProfileOverride[]
  warscrollKeywordOverrides?: CorpusWarscrollKeywordOverride[]
}

export type CorpusGenerationDiagnosticCode =
  | 'faction-approval-mismatch'
  | 'identity-not-found'
  | 'invalid-review'
  | 'missing-official-source-record'
  | 'unclassified-army-of-renown'
  | 'unreviewed-normalization-diagnostic'
  | 'unreviewed-source-diagnostic'

export interface CorpusGenerationDiagnostic {
  code: CorpusGenerationDiagnosticCode
  severity: 'warning' | 'error'
  subject: string
  message: string
}

export interface CorpusGenerationSummary {
  schemaVersion: 1
  status: 'strict-pass' | 'blocked'
  revision: string
  attribution: typeof WAHAPEDIA_ATTRIBUTION
  factions: number
  publications: number
  warscrolls: number
  battleProfiles: number
  abilities: number
  weapons: number
  contentGroups: number
  relationships: number
  sourceArtifacts: number
  sourceRecords: number
  ignoredSourceRecords: number
}

export interface CorpusGenerationResult {
  catalog: Aos4Catalog
  diagnostics: CorpusGenerationDiagnostic[]
  dispositions: SourceDisposition[]
  supersededSourceRecords: {
    count: number
    checksum: string
    reason: string
  }
  summary: CorpusGenerationSummary
}

type AbilityRecord =
  | WahapediaWarscrollAbilityRecord
  | WahapediaFactionAbilityRecord
  | WahapediaGeneralRuleAbilityRecord

interface IdentityDefinition {
  kind: EntityKind
  name: string
  alias: IdentityAlias
}

const compare = (left: string, right: string): number => left.localeCompare(right)
const uniqueSorted = <T extends string>(values: Iterable<T>): T[] => Array.from(new Set(values)).sort(compare)

const uuidFromIdentity = (kind: EntityKind, alias: IdentityAlias): string => {
  const bytes = createHash('sha256')
    .update(`aos-reminders:aos4:corpus:v1:${kind}:${alias.publisher}:${alias.externalId}`, 'utf8')
    .digest()
    .subarray(0, 16)
  bytes[6] = (bytes[6] & 0x0f) | 0x50
  bytes[8] = (bytes[8] & 0x3f) | 0x80
  const hex = bytes.toString('hex')
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`
}

const canonicalIdForDefinition = (definition: IdentityDefinition): CanonicalId =>
  `${definition.kind}:${uuidFromIdentity(definition.kind, definition.alias)}` as CanonicalId

const RECORD_ALIAS_PREFIXES: Array<{ prefix: string; publisher: IdentityAlias['publisher'] }> = [
  { prefix: 'source-record:wahapedia:', publisher: 'wahapedia' },
  // BSData community records use the generic `other` publisher: the alias namespace is the
  // record ID itself, which already carries the bsdata provider and artifact checksum.
  { prefix: 'source-record:bsdata:', publisher: 'other' },
]

const recordAliasEntry = (
  meta: WahapediaRecordMeta
): { prefix: string; publisher: IdentityAlias['publisher'] } => {
  const identitySourceRecordId = meta.identitySourceRecordId ?? meta.sourceRecordId
  const entry = RECORD_ALIAS_PREFIXES.find(candidate => identitySourceRecordId.startsWith(candidate.prefix))
  if (!entry) {
    throw new Error(`Unexpected source record ID for identity aliasing: ${identitySourceRecordId}`)
  }
  return entry
}

const recordAlias = (meta: WahapediaRecordMeta): string => {
  const identitySourceRecordId = meta.identitySourceRecordId ?? meta.sourceRecordId
  const entry = recordAliasEntry(meta)
  return decodeURIComponent(identitySourceRecordId.slice(entry.prefix.length))
}

const recordPublisher = (meta: WahapediaRecordMeta): IdentityAlias['publisher'] =>
  recordAliasEntry(meta).publisher

const battleProfileAlias = (record: WahapediaWarscrollRecord): string =>
  `${recordAlias(record.meta)}:battle-profile`

const choiceGroupAlias = (record: AbilityRecord): string => `choice:${recordAlias(record.meta)}`

const hasWarscrollCharacteristics = (record: WahapediaWarscrollRecord): boolean =>
  [record.move, record.save, record.control, record.health].every(value => value.trim())

const integerValue = (value: string): number | undefined => {
  const normalized = value.replace(/\s+/g, '')
  if (!/^\d+$/.test(normalized)) return undefined
  const parsed = Number.parseInt(normalized, 10)
  return Number.isSafeInteger(parsed) ? parsed : undefined
}

const isSpearheadWarscroll = (record: WahapediaWarscrollRecord): boolean =>
  record.meta.rulesContextKinds?.includes('spearhead') === true || /\bspearhead\s*:/i.test(record.notesHtml)

const contextLabel = (value: string): string =>
  value
    .normalize('NFKD')
    .replace(/<[^>]*>/g, ' ')
    .replace(/[’']/g, '')
    .replace(/[^a-z0-9]+/gi, ' ')
    .trim()
    .toLowerCase()

const isLegendsWarscroll = (
  record: WahapediaWarscrollRecord,
  sourceById: Map<string, WahapediaSourceRecord>,
  generatedAt: string
): boolean => {
  if (record.meta.rulesContextKinds?.includes('legends')) return true
  const source = sourceById.get(record.sourceId)
  if (source && /\blegends?\b/i.test(source.name)) return true
  if (/\blegends?\s+warscroll\b/i.test(record.notesHtml)) return true
  const moveDate = record.notesHtml
    .replace(/<[^>]*>/g, ' ')
    .replace(/\u00a0/g, ' ')
    .match(/\bmove to Warhammer Legends on\s+([^.<]+)/i)?.[1]
  if (!moveDate) return false
  const effectiveAt = Date.parse(`${moveDate.trim()} UTC`)
  const snapshotAt = Date.parse(generatedAt)
  return !Number.isNaN(effectiveAt) && !Number.isNaN(snapshotAt) && effectiveAt <= snapshotAt
}

const isWarscrollRecord = (record: WahapediaWarscrollRecord): boolean =>
  hasWarscrollCharacteristics(record) && (!record.virtual || integerValue(record.unitSize) !== undefined)

const hasBattleProfile = (record: WahapediaWarscrollRecord): boolean => {
  const unitSize = integerValue(record.unitSize)
  const points = integerValue(record.cost)
  return (
    isWarscrollRecord(record) &&
    unitSize !== undefined &&
    unitSize > 0 &&
    (points !== undefined || isSpearheadWarscroll(record))
  )
}

const groupType = (value: string): string => {
  const normalized = value
    .normalize('NFKD')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
  const aliases: Record<string, string> = {
    'artefacts-of-power': 'artefact-of-power',
    'battle-formations': 'battle-formation',
    'battle-traits': 'battle-trait',
    'heroic-traits': 'heroic-trait',
    'manifestation-lore': 'manifestation-lore',
    'prayer-lore': 'prayer-lore',
    'spell-lore': 'spell-lore',
  }
  return aliases[normalized] ?? (normalized || 'other')
}

const isMandatoryType = (name: string): boolean => /^battle traits$/i.test(name.trim())

/**
 * The regular faction content an Army of Renown replaces. The official rule is total ("use the
 * faction rules on these pages instead of the [faction] rules"), so every regular rules-choice
 * group of the faction is excluded while an Army of Renown root is selected; universal
 * manifestation lores and general rules modules are army-agnostic and remain.
 */
const ARMY_OF_RENOWN_REPLACED_GROUP_TYPES = new Set([
  'battle-trait',
  'battle-formation',
  'heroic-trait',
  'artefact-of-power',
  'spell-lore',
  'prayer-lore',
  'monstrous-traits',
  'big-names',
])

const abilitiesByType = (
  dataset: WahapediaDataset,
  factionId: string,
  typeId: string
): WahapediaFactionAbilityRecord[] =>
  dataset.factionAbilities.filter(ability => ability.factionId === factionId && ability.typeId === typeId)

const identityDefinitions = (dataset: WahapediaDataset, review: CorpusReview): IdentityDefinition[] => {
  const definitions: IdentityDefinition[] = []
  const add = (kind: EntityKind, name: string, externalId: string, publisher: IdentityAlias['publisher']) =>
    definitions.push({ kind, name: name.trim(), alias: { publisher, externalId } })

  dataset.sources.forEach(record => add('publication', record.name, recordAlias(record.meta), 'wahapedia'))
  if (dataset.lastUpdate) {
    add(
      'publication',
      `Wahapedia AoS 4 export ${dataset.lastUpdate.raw}`,
      recordAlias(dataset.lastUpdate.meta),
      'wahapedia'
    )
  }
  review.officialDocuments.forEach(document =>
    add('publication', document.title, `official:${document.artifact.checksum}`, 'games-workshop')
  )
  ;(review.communityWarscrollSources ?? []).forEach(source =>
    add('publication', source.title, `community:${source.artifact.checksum}`, 'other')
  )
  dataset.factions.forEach(record => add('faction', record.name, recordAlias(record.meta), 'wahapedia'))
  dataset.warscrolls.forEach(record => {
    add(
      isWarscrollRecord(record) ? 'warscroll' : 'content-group',
      record.name,
      recordAlias(record.meta),
      recordPublisher(record.meta)
    )
    if (hasBattleProfile(record)) {
      add(
        'battle-profile',
        `${record.name} battle profile`,
        battleProfileAlias(record),
        recordPublisher(record.meta)
      )
    }
  })
  dataset.warscrollAbilities.forEach(record =>
    add('ability', record.name, recordAlias(record.meta), recordPublisher(record.meta))
  )
  dataset.factionAbilities.forEach(record =>
    add('ability', record.name, recordAlias(record.meta), recordPublisher(record.meta))
  )
  ;(dataset.generalRulesPages ?? []).forEach(record =>
    add('content-group', record.title, recordAlias(record.meta), 'wahapedia')
  )
  ;(dataset.generalRuleGroups ?? []).forEach(record =>
    add('content-group', record.name, recordAlias(record.meta), 'wahapedia')
  )
  ;(dataset.generalRuleAbilities ?? []).forEach(record =>
    add('ability', record.name, recordAlias(record.meta), 'wahapedia')
  )
  dataset.warscrollWeapons.forEach(record =>
    add('weapon', record.name, recordAlias(record.meta), recordPublisher(record.meta))
  )
  dataset.factionAbilityTypes.forEach(record =>
    add('content-group', record.name, recordAlias(record.meta), recordPublisher(record.meta))
  )
  dataset.factionAbilitySubtypes.forEach(record =>
    add('content-group', record.name, recordAlias(record.meta), recordPublisher(record.meta))
  )
  dataset.factionAbilityTypes.forEach(type => {
    if (isMandatoryType(type.name)) return
    const subtypes = dataset.factionAbilitySubtypes.filter(
      subtype => subtype.factionId === type.factionId && subtype.typeId === type.id
    )
    const subtypeIds = new Set(subtypes.map(subtype => subtype.id))
    abilitiesByType(dataset, type.factionId, type.id)
      .filter(ability => !ability.subtypeId || !subtypeIds.has(ability.subtypeId))
      .forEach(ability => add('content-group', ability.name, choiceGroupAlias(ability), 'wahapedia'))
  })

  return Array.from(
    new Map(
      definitions.map(definition => [
        `${definition.kind}:${definition.alias.publisher}:${definition.alias.externalId}`,
        definition,
      ])
    ).values()
  ).sort(
    (left, right) =>
      left.kind.localeCompare(right.kind) ||
      left.alias.publisher.localeCompare(right.alias.publisher) ||
      left.alias.externalId.localeCompare(right.alias.externalId)
  )
}

export const createCorpusIdentityRegistry = (
  dataset: WahapediaDataset,
  review: CorpusReview
): IdentityRegistry => ({
  schemaVersion: 1,
  entries: identityDefinitions(dataset, review).map(definition => ({
    kind: definition.kind,
    canonicalId: canonicalIdForDefinition(definition),
    name: definition.name,
    aliases: [definition.alias],
  })),
})

const identityLookup = (
  registry: IdentityRegistry,
  diagnostics: CorpusGenerationDiagnostic[]
): ((
  kind: EntityKind,
  publisher: IdentityAlias['publisher'],
  externalId: string
) => CanonicalId | undefined) => {
  const byAlias = new Map<string, IdentityRegistryEntry>()
  registry.entries.forEach(entry =>
    entry.aliases.forEach(alias => byAlias.set(`${entry.kind}:${alias.publisher}:${alias.externalId}`, entry))
  )
  return (kind, publisher, externalId) => {
    const entry = byAlias.get(`${kind}:${publisher}:${externalId}`)
    if (!entry) {
      diagnostics.push({
        code: 'identity-not-found',
        severity: 'error',
        subject: `${kind}:${publisher}:${externalId}`,
        message: 'The reviewed identity registry does not contain this source alias',
      })
    }
    return entry?.canonicalId
  }
}

const allWahapediaMetas = (dataset: WahapediaDataset): WahapediaRecordMeta[] => [
  ...dataset.factions.map(record => record.meta),
  ...dataset.sources.map(record => record.meta),
  ...dataset.warscrolls.map(record => record.meta),
  ...dataset.warscrollAbilities.map(record => record.meta),
  ...dataset.warscrollWeapons.map(record => record.meta),
  ...dataset.warscrollKeywords.map(record => record.meta),
  ...dataset.warscrollBases.map(record => record.meta),
  ...dataset.warscrollOrganisation.map(record => record.meta),
  ...dataset.regimentOfRenownFactions.map(record => record.meta),
  ...dataset.factionAbilityTypes.map(record => record.meta),
  ...dataset.factionAbilitySubtypes.map(record => record.meta),
  ...dataset.factionAbilities.map(record => record.meta),
  ...(dataset.generalRulesPages ?? []).map(record => record.meta),
  ...(dataset.generalRuleGroups ?? []).map(record => record.meta),
  ...(dataset.generalRuleAbilities ?? []).map(record => record.meta),
  ...(dataset.lastUpdate ? [dataset.lastUpdate.meta] : []),
]

const reviewRulesContexts = (review: CorpusReview): CorpusReview['rulesContext'][] => [
  review.rulesContext,
  ...(review.additionalRulesContexts ?? []),
]

const sourceRulesContextIds = (
  dataset: WahapediaDataset,
  review: CorpusReview
): Map<SourceRecordId, RulesContextId[]> => {
  const contexts = reviewRulesContexts(review)
  const allContextIds = contexts.map(context => context.id)
  const spearheadContextId = contexts.find(context => context.mode === 'spearhead')?.id
  const seasonalContextId = contexts.find(context => context.status === 'seasonal')?.id
  const legendsContextId = contexts.find(context => context.status === 'legends')?.id
  const currentContextIds = uniqueSorted([
    review.rulesContext.id,
    ...(seasonalContextId ? [seasonalContextId] : []),
  ])
  const historicalContextId = contexts.find(context => context.status === 'historical')?.id
  const contextIdsForMeta = (meta: WahapediaRecordMeta): RulesContextId[] | undefined => {
    const kinds = meta.rulesContextKinds ?? (meta.rulesContextKind ? [meta.rulesContextKind] : [])
    if (!kinds.length) return undefined
    return uniqueSorted(
      kinds.flatMap(kind => {
        if (kind === 'standard') return currentContextIds
        if (kind === 'seasonal') {
          if (!seasonalContextId) {
            throw new Error(`Seasonal record ${meta.sourceRecordId} requires a seasonal context`)
          }
          return [seasonalContextId]
        }
        if (kind === 'spearhead') {
          if (!spearheadContextId) {
            throw new Error(`Spearhead record ${meta.sourceRecordId} requires a Spearhead context`)
          }
          return [spearheadContextId]
        }
        if (kind === 'legends') {
          if (!legendsContextId) {
            throw new Error(`Legends record ${meta.sourceRecordId} requires a Legends context`)
          }
          return [legendsContextId]
        }
        if (!historicalContextId) {
          throw new Error(`Historical record ${meta.sourceRecordId} requires a historical context`)
        }
        return [historicalContextId]
      })
    )
  }
  const sourceById = new Map(dataset.sources.map(source => [source.id, source]))
  const legendsWarscrollSourceRecordIds = new Set(
    dataset.warscrolls
      .filter(record => isLegendsWarscroll(record, sourceById, review.generatedAt))
      .map(record => record.meta.sourceRecordId)
  )
  const eligibleWarscrollCountsByFaction = new Map<string, { all: number; legends: number }>()
  dataset.warscrolls.forEach(record => {
    if (record.virtual === true || !hasWarscrollCharacteristics(record)) return
    const counts = eligibleWarscrollCountsByFaction.get(record.factionId) ?? { all: 0, legends: 0 }
    counts.all += 1
    if (legendsWarscrollSourceRecordIds.has(record.meta.sourceRecordId)) counts.legends += 1
    eligibleWarscrollCountsByFaction.set(record.factionId, counts)
  })
  const legendsFactionIds = new Set(
    Array.from(eligibleWarscrollCountsByFaction)
      .filter(([, counts]) => counts.all > 0 && counts.legends > counts.all / 2)
      .map(([factionId]) => factionId)
  )
  const overrideBySourceRecordId = new Map(
    (review.contextOverrides ?? []).map(override => [override.sourceRecordId, override.rulesContextIds])
  )
  const contextIdsForWarscroll = (record: WahapediaWarscrollRecord): RulesContextId[] => {
    // A reviewed context override outranks the context the secondary source implies: it exists to
    // apply official precedence (e.g. a battletome superseding index-era options).
    const overridden = overrideBySourceRecordId.get(record.meta.sourceRecordId)
    if (overridden) return overridden
    const explicit = contextIdsForMeta(record.meta)
    if (explicit) return explicit
    if (isSpearheadWarscroll(record)) {
      if (!spearheadContextId) {
        throw new Error(`Spearhead record ${record.meta.sourceRecordId} requires a Spearhead context`)
      }
      return [spearheadContextId]
    }
    if (
      legendsFactionIds.has(record.factionId) ||
      legendsWarscrollSourceRecordIds.has(record.meta.sourceRecordId)
    ) {
      if (!legendsContextId) {
        throw new Error(`Legends record ${record.meta.sourceRecordId} requires a Legends context`)
      }
      return [legendsContextId]
    }
    return currentContextIds
  }
  const warscrollContexts = new Map(
    dataset.warscrolls.map(record => [record.id, contextIdsForWarscroll(record)])
  )
  const factionsWithCurrentWarscrolls = new Set(
    dataset.warscrolls
      .filter(record => warscrollContexts.get(record.id)?.includes(review.rulesContext.id))
      .map(record => record.factionId)
  )
  const spearheadGroupNames = new Set(
    dataset.warscrolls.flatMap(record => {
      const name = record.notesHtml.match(/\bspearhead\s*:\s*([^<\r\n]+)/i)?.[1]
      return name ? [contextLabel(name)] : []
    })
  )
  const sourceContexts = new Map<string, RulesContextId[]>()
  dataset.warscrolls.forEach(record => {
    if (!record.sourceId) return
    sourceContexts.set(
      record.sourceId,
      uniqueSorted([
        ...(sourceContexts.get(record.sourceId) ?? []),
        ...(warscrollContexts.get(record.id) ?? currentContextIds),
      ])
    )
  })
  const typeContexts = new Map(
    dataset.factionAbilityTypes.map(record => [
      `${record.factionId}:${record.id}`,
      /\bspearhead\b/i.test(record.name) || spearheadGroupNames.has(contextLabel(record.name))
        ? spearheadContextId
          ? [spearheadContextId]
          : currentContextIds
        : factionsWithCurrentWarscrolls.has(record.factionId)
          ? currentContextIds
          : legendsContextId
            ? [legendsContextId]
            : currentContextIds,
    ])
  )
  const subtypeContexts = new Map(
    dataset.factionAbilitySubtypes.map(record => [
      `${record.factionId}:${record.id}`,
      typeContexts.get(`${record.factionId}:${record.typeId}`) ?? currentContextIds,
    ])
  )
  const bySourceRecordId = new Map<SourceRecordId, RulesContextId[]>()
  const assign = (meta: WahapediaRecordMeta, contextIds: RulesContextId[]) =>
    bySourceRecordId.set(
      meta.sourceRecordId,
      uniqueSorted(
        overrideBySourceRecordId.get(meta.sourceRecordId) ?? contextIdsForMeta(meta) ?? contextIds
      )
    )

  const factionContexts = new Map<string, RulesContextId[]>()
  dataset.warscrolls.forEach(record =>
    factionContexts.set(
      record.factionId,
      uniqueSorted([
        ...(factionContexts.get(record.factionId) ?? []),
        ...(warscrollContexts.get(record.id) ?? currentContextIds),
      ])
    )
  )
  dataset.factionAbilityTypes.forEach(record =>
    factionContexts.set(
      record.factionId,
      uniqueSorted([
        ...(factionContexts.get(record.factionId) ?? []),
        ...(typeContexts.get(`${record.factionId}:${record.id}`) ?? []),
      ])
    )
  )
  dataset.factions.forEach(record => assign(record.meta, factionContexts.get(record.id) ?? currentContextIds))
  dataset.sources.forEach(record => {
    if (/\bspearhead\b/i.test(record.name)) {
      assign(record.meta, spearheadContextId ? [spearheadContextId] : currentContextIds)
      return
    }
    if (/\blegends?\b/i.test(record.name)) {
      assign(record.meta, legendsContextId ? [legendsContextId] : currentContextIds)
      return
    }
    if (/\bgeneral.s handbook\b/i.test(record.name)) {
      assign(record.meta, seasonalContextId ? [seasonalContextId] : currentContextIds)
      return
    }
    assign(record.meta, sourceContexts.get(record.id) ?? currentContextIds)
  })
  if (dataset.lastUpdate) assign(dataset.lastUpdate.meta, allContextIds)
  dataset.warscrolls.forEach(record =>
    assign(record.meta, warscrollContexts.get(record.id) ?? currentContextIds)
  )
  dataset.warscrollAbilities.forEach(record =>
    assign(record.meta, warscrollContexts.get(record.warscrollId) ?? currentContextIds)
  )
  dataset.warscrollWeapons.forEach(record =>
    assign(record.meta, warscrollContexts.get(record.warscrollId) ?? currentContextIds)
  )
  dataset.warscrollKeywords.forEach(record =>
    assign(record.meta, warscrollContexts.get(record.warscrollId) ?? currentContextIds)
  )
  dataset.warscrollBases.forEach(record =>
    assign(record.meta, warscrollContexts.get(record.warscrollId) ?? currentContextIds)
  )
  dataset.warscrollOrganisation.forEach(record =>
    assign(record.meta, warscrollContexts.get(record.warscrollId) ?? currentContextIds)
  )
  dataset.regimentOfRenownFactions.forEach(record =>
    assign(record.meta, warscrollContexts.get(record.warscrollId) ?? currentContextIds)
  )
  dataset.factionAbilityTypes.forEach(record =>
    assign(record.meta, typeContexts.get(`${record.factionId}:${record.id}`) ?? currentContextIds)
  )
  dataset.factionAbilitySubtypes.forEach(record =>
    assign(record.meta, subtypeContexts.get(`${record.factionId}:${record.id}`) ?? currentContextIds)
  )
  dataset.factionAbilities.forEach(record =>
    assign(
      record.meta,
      subtypeContexts.get(`${record.factionId}:${record.subtypeId}`) ??
        typeContexts.get(`${record.factionId}:${record.typeId}`) ??
        currentContextIds
    )
  )
  ;[
    ...(dataset.generalRulesPages ?? []),
    ...(dataset.generalRuleGroups ?? []),
    ...(dataset.generalRuleAbilities ?? []),
  ].forEach(record => assign(record.meta, currentContextIds))
  return bySourceRecordId
}

const sourceReference = (sourceRecordId: SourceRecordId, transformation?: string): SourceReference => ({
  sourceRecordId,
  ...(transformation ? { transformation } : {}),
})

const entityRevision = (meta: WahapediaRecordMeta): string => {
  const officialSourceRecordIds = uniqueSorted(meta.officialSourceRecordIds ?? [])
  if (!officialSourceRecordIds.length) return meta.recordChecksum
  return createHash('sha256')
    .update([meta.recordChecksum, ...officialSourceRecordIds].join('\n'), 'utf8')
    .digest('hex')
}

const sortedSourceReferences = (references: SourceReference[]): SourceReference[] =>
  Array.from(
    new Map(
      references.map(reference => [
        `${reference.sourceRecordId}:${reference.field ?? ''}:${reference.transformation ?? ''}`,
        reference,
      ])
    ).values()
  ).sort(
    (left, right) =>
      left.sourceRecordId.localeCompare(right.sourceRecordId) ||
      (left.field ?? '').localeCompare(right.field ?? '') ||
      (left.transformation ?? '').localeCompare(right.transformation ?? '')
  )

const sourceArtifacts = (dataset: WahapediaDataset, review: CorpusReview): SourceArtifact[] => {
  const wahapedia = Object.entries(dataset.artifacts).flatMap(([file, entry]) =>
    entry
      ? [
          {
            id: artifactId(entry.checksum),
            publisher: 'wahapedia' as const,
            authority: { kind: 'secondary' as const },
            title: `Wahapedia AoS 4 ${file}`,
            edition: '4',
            language: 'en',
            retrievedAt: entry.retrievedAt,
            sourceUrl: entry.finalUrl,
            checksum: entry.checksum,
            mediaType: entry.mediaType,
            ...(dataset.lastUpdate?.raw ? { version: dataset.lastUpdate.raw } : {}),
          },
        ]
      : []
  )
  const official = review.officialDocuments.map(document => ({
    id: artifactId(document.artifact.checksum),
    publisher: 'games-workshop' as const,
    authority: { kind: 'official' as const },
    title: document.title,
    edition: '4',
    language: 'en',
    retrievedAt: document.artifact.retrievedAt,
    sourceUrl: document.artifact.finalUrl,
    checksum: document.artifact.checksum,
    mediaType: document.artifact.mediaType,
    ...(document.version ? { version: document.version } : {}),
    ...(document.publicationDate ? { publicationDate: document.publicationDate } : {}),
    ...(document.effectiveDate ? { effectiveDate: document.effectiveDate } : {}),
  }))
  const community = (review.communityWarscrollSources ?? []).map(source => ({
    id: artifactId(source.artifact.checksum),
    publisher: 'other' as const,
    authority: { kind: 'community' as const },
    title: source.title,
    edition: '4',
    language: 'en',
    retrievedAt: source.artifact.retrievedAt,
    sourceUrl: source.artifact.finalUrl,
    checksum: source.artifact.checksum,
    mediaType: source.artifact.mediaType,
    version: source.commit,
  }))
  const html = (dataset.htmlArtifacts ?? []).map(entry => {
    const sourcePath = new URL(entry.finalUrl).pathname
    const isRulesPage = /^\/aos4\/the-rules\//i.test(sourcePath)
    return {
      id: artifactId(entry.checksum),
      publisher: 'wahapedia' as const,
      authority: { kind: 'secondary' as const },
      title: `Wahapedia AoS 4 ${isRulesPage ? 'rules' : 'warscroll'}: ${decodeURIComponent(
        sourcePath.split('/').filter(Boolean).at(-1) ?? (isRulesPage ? 'rules' : 'warscroll')
      ).replaceAll('-', ' ')}`,
      edition: '4',
      language: 'en',
      retrievedAt: entry.retrievedAt,
      sourceUrl: entry.finalUrl,
      checksum: entry.checksum,
      mediaType: entry.mediaType,
    }
  })
  return [...wahapedia, ...html, ...official, ...community].sort((left, right) =>
    left.id.localeCompare(right.id)
  )
}

const sourceRecords = (
  dataset: WahapediaDataset,
  review: CorpusReview,
  rulesContextIdsBySourceRecord: Map<SourceRecordId, RulesContextId[]>,
  officialRulesContextIdsBySourceRecord: ReadonlyMap<SourceRecordId, RulesContextId[]>
): SourceRecord[] => {
  const wahapedia = allWahapediaMetas(dataset).map(meta => ({
    id: meta.sourceRecordId,
    artifactId: meta.artifactId,
    locator: meta.section
      ? { kind: 'section' as const, section: meta.section }
      : { kind: 'row' as const, row: meta.row },
    recordChecksum: meta.recordChecksum,
    rulesContextIds: rulesContextIdsBySourceRecord.get(meta.sourceRecordId) ?? [review.rulesContext.id],
  }))
  const official = review.officialDocuments.flatMap(document =>
    document.sourceRecords.map(record => ({
      id: record.id,
      artifactId: artifactId(document.artifact.checksum),
      locator: {
        kind: 'page' as const,
        page: record.page,
        ...(record.section ? { section: record.section } : {}),
      },
      recordChecksum: record.recordChecksum,
      rulesContextIds: officialRulesContextIdsBySourceRecord.get(record.id) ?? document.rulesContextIds,
    }))
  )
  return Array.from(new Map([...wahapedia, ...official].map(record => [record.id, record])).values()).sort(
    (left, right) => left.id.localeCompare(right.id)
  )
}

const decoderPolicyMatches = (diagnostic: WahapediaDiagnostic, policy: CorpusDiagnosticPolicy): boolean =>
  diagnostic.code === policy.code &&
  (policy.file === undefined || diagnostic.file === policy.file) &&
  (policy.row === undefined || diagnostic.row === policy.row)

const reviewDiagnostics = (
  decoded: WahapediaDecodeResult,
  review: CorpusReview
): CorpusGenerationDiagnostic[] => {
  const diagnostics: CorpusGenerationDiagnostic[] = []
  decoded.diagnostics.forEach(diagnostic => {
    const policy = review.decoderDiagnosticPolicies.find(candidate =>
      decoderPolicyMatches(diagnostic, candidate)
    )
    if (!policy?.reason.trim()) {
      diagnostics.push({
        code: 'unreviewed-source-diagnostic',
        severity: 'error',
        subject: `${diagnostic.file}:${diagnostic.row ?? 0}:${diagnostic.code}`,
        message: diagnostic.message,
      })
    }
  })

  const approved = uniqueSorted(review.approvedFactionIds)
  const present = uniqueSorted(decoded.dataset.factions.map(faction => faction.id))
  if (approved.join('|') !== present.join('|')) {
    diagnostics.push({
      code: 'faction-approval-mismatch',
      severity: 'error',
      subject: approved.join(','),
      message: `Approved factions do not match decoded factions (${present.join(', ')})`,
    })
  }
  ;(review.universalFactionContent ?? []).forEach(entry => {
    if (approved.includes(entry.factionId) && entry.reason.trim()) return
    diagnostics.push({
      code: 'invalid-review',
      severity: 'error',
      subject: entry.factionId || '(missing faction)',
      message: 'Universal faction content requires an approved faction ID and a reason',
    })
  })
  if (!review.revision.trim() || Number.isNaN(new Date(review.generatedAt).valueOf())) {
    diagnostics.push({
      code: 'invalid-review',
      severity: 'error',
      subject: review.revision || '(missing revision)',
      message: 'Corpus review requires a revision and valid generatedAt timestamp',
    })
  }
  const supersededIds = uniqueSorted((decoded.dataset.supersededMetas ?? []).map(meta => meta.sourceRecordId))
  const supersededChecksum = createHash('sha256').update(supersededIds.join('\n'), 'utf8').digest('hex')
  const supersededReview = review.supersededSourceRecords
  if (
    supersededIds.length !== (supersededReview?.expectedCount ?? 0) ||
    (supersededIds.length > 0 &&
      (supersededReview?.checksum !== supersededChecksum || !supersededReview.reason.trim()))
  ) {
    diagnostics.push({
      code: 'invalid-review',
      severity: 'error',
      subject: 'superseded-source-records',
      message:
        `Superseded source review does not match ${supersededIds.length} records ` +
        `(${supersededChecksum})`,
    })
  }
  if (
    review.defaultRulesContextId &&
    !reviewRulesContexts(review).some(context => context.id === review.defaultRulesContextId)
  ) {
    diagnostics.push({
      code: 'invalid-review',
      severity: 'error',
      subject: review.defaultRulesContextId,
      message: 'The default rules context is not present in the reviewed contexts',
    })
  }
  const weaponSourceIds = new Set(decoded.dataset.warscrollWeapons.map(record => record.meta.sourceRecordId))
  const seenWeaponOverrides = new Set<SourceRecordId>()
  ;(review.weaponProfileOverrides ?? []).forEach(override => {
    const profileEntries = Object.entries(override.profile)
    const invalidProfile =
      profileEntries.length === 0 ||
      profileEntries.some(([field, value]) =>
        field === 'rangeInches'
          ? !Number.isSafeInteger(value) || (value as number) <= 0
          : typeof value !== 'string' || !value.trim()
      )
    if (
      seenWeaponOverrides.has(override.sourceRecordId) ||
      !weaponSourceIds.has(override.sourceRecordId) ||
      invalidProfile ||
      !override.reason.trim() ||
      override.officialSourceRecordIds.length === 0
    ) {
      diagnostics.push({
        code: 'invalid-review',
        severity: 'error',
        subject: override.sourceRecordId,
        message:
          'Weapon profile override must uniquely target an accepted weapon, change a non-empty profile field, and cite official evidence',
      })
    }
    seenWeaponOverrides.add(override.sourceRecordId)
  })
  const abilitySourceIds = new Set(
    [
      ...decoded.dataset.warscrollAbilities,
      ...decoded.dataset.factionAbilities,
      ...(decoded.dataset.generalRuleAbilities ?? []),
    ]
      .map(record => record.meta.sourceRecordId)
      .filter(
        sourceRecordId =>
          !review.ignoredSourceRecords.some(ignored => ignored.sourceRecordId === sourceRecordId)
      )
  )
  const seenAbilityTextOverrides = new Set<SourceRecordId>()
  ;(review.abilityTextOverrides ?? []).forEach(override => {
    if (
      seenAbilityTextOverrides.has(override.sourceRecordId) ||
      !abilitySourceIds.has(override.sourceRecordId) ||
      !override.text.effect.trim() ||
      [override.text.declare, override.text.reactionTrigger].some(
        value => value !== undefined && !value.trim()
      ) ||
      !override.reason.trim() ||
      override.officialSourceRecordIds.length === 0
    ) {
      diagnostics.push({
        code: 'invalid-review',
        severity: 'error',
        subject: override.sourceRecordId,
        message:
          'Ability text override must uniquely target an accepted ability, provide valid text, and cite official evidence',
      })
    }
    seenAbilityTextOverrides.add(override.sourceRecordId)
  })
  const communityChecksums = new Set<string>()
  ;(review.communityWarscrollSources ?? []).forEach(source => {
    const factionOptions = source.factionOptions ?? []
    const unitsValid =
      source.units.every(
        unit => unit.name.trim() && unit.section.trim() && /^[0-9a-f]{64}$/.test(unit.recordChecksum)
      ) && new Set(source.units.map(unit => unit.section)).size === source.units.length
    const factionOptionsValid =
      factionOptions.every(
        option =>
          option.name.trim() &&
          option.groupName.trim() &&
          option.section.trim() &&
          /^[0-9a-f]{64}$/.test(option.recordChecksum) &&
          ['battle-formation', 'heroic-trait', 'artefact-of-power'].includes(option.optionType)
      ) && new Set(factionOptions.map(option => option.section)).size === factionOptions.length
    const scopeValid =
      source.units.length + factionOptions.length > 0 && unitsValid && factionOptionsValid
    if (
      communityChecksums.has(source.artifact.checksum) ||
      source.policyTier !== 'community-fallback' ||
      source.status !== 'provisional-pending-official-verification' ||
      !source.title.trim() ||
      !/provisional/i.test(source.title) ||
      !source.repository.trim() ||
      !source.branch.trim() ||
      !/^[0-9a-f]{40}$/.test(source.commit) ||
      !source.artifact.finalUrl.includes(`/${source.commit}/`) ||
      !source.reason.trim() ||
      !source.verificationCondition.trim() ||
      !source.authorizedBy.trim() ||
      Number.isNaN(new Date(source.authorizedAt).valueOf()) ||
      source.officialSourceRecordIds.length === 0 ||
      !scopeValid
    ) {
      diagnostics.push({
        code: 'invalid-review',
        severity: 'error',
        subject: source.artifact.checksum || '(missing artifact)',
        message:
          'Community warscroll source must be commit-pinned, marked provisional in its title, scoped to ' +
          'named units or faction options with pinned checksums, and cite official evidence establishing ' +
          'the content',
      })
    }
    communityChecksums.add(source.artifact.checksum)
  })
  const warscrollBySourceRecordId = new Map(
    decoded.dataset.warscrolls.filter(isWarscrollRecord).map(record => [record.meta.sourceRecordId, record])
  )
  const keywordsByWarscrollId = new Map<string, Set<string>>()
  decoded.dataset.warscrollKeywords.forEach(record => {
    const keyword = [record.keyword, record.parameter].filter(Boolean).join(' ').trim().toUpperCase()
    if (!keyword) return
    const keywords = keywordsByWarscrollId.get(record.warscrollId) ?? new Set<string>()
    keywords.add(keyword)
    keywordsByWarscrollId.set(record.warscrollId, keywords)
  })
  const seenWarscrollKeywordOverrides = new Set<SourceRecordId>()
  ;(review.warscrollKeywordOverrides ?? []).forEach(override => {
    const warscroll = warscrollBySourceRecordId.get(override.sourceRecordId)
    const removed = uniqueSorted(override.remove.map(value => value.trim().toUpperCase()).filter(Boolean))
    const sourceKeywords = warscroll
      ? (keywordsByWarscrollId.get(warscroll.id) ?? new Set<string>())
      : new Set<string>()
    if (
      seenWarscrollKeywordOverrides.has(override.sourceRecordId) ||
      !warscroll ||
      !removed.length ||
      removed.some(value => !sourceKeywords.has(value)) ||
      !override.reason.trim() ||
      override.officialSourceRecordIds.length === 0
    ) {
      diagnostics.push({
        code: 'invalid-review',
        severity: 'error',
        subject: override.sourceRecordId,
        message:
          'Warscroll keyword override must uniquely target an accepted warscroll, change keywords, and cite official evidence',
      })
    }
    seenWarscrollKeywordOverrides.add(override.sourceRecordId)
  })
  return diagnostics
}

const supersededSourceRecordDisposition = (
  dataset: WahapediaDataset,
  review: CorpusReview
): CorpusGenerationResult['supersededSourceRecords'] => {
  const ids = uniqueSorted((dataset.supersededMetas ?? []).map(meta => meta.sourceRecordId))
  return {
    count: ids.length,
    checksum: createHash('sha256').update(ids.join('\n'), 'utf8').digest('hex'),
    reason:
      review.supersededSourceRecords?.reason ??
      'No superseded source records were accepted for the current corpus.',
  }
}

const normalizePlainText = (value: string): string =>
  normalizeSourceText(value)
    .text.replace(/%\d{6,}/g, '')
    .replace(/\s{2,}/g, ' ')
    .trim()

const splitValues = (value: string): string[] =>
  uniqueSorted(
    normalizePlainText(value)
      .split(/\s*[,;]\s*/)
      .map(item => item.trim())
      .filter(Boolean)
  )

const splitNotes = (value: string): string[] =>
  uniqueSorted(
    normalizePlainText(value)
      .split(/\s*;\s*/)
      .map(item => item.trim())
      .filter(Boolean)
  )

const officialEvidenceFor = (sourceRecordId: SourceRecordId, review: CorpusReview): SourceRecordId[] =>
  uniqueSorted([
    ...review.normalizationDiagnosticPolicies
      .filter(policy => policy.sourceRecordId === sourceRecordId)
      .flatMap(policy => policy.officialSourceRecordIds ?? []),
    ...review.timingOverrides
      .filter(override => override.sourceRecordId === sourceRecordId)
      .flatMap(override => override.officialSourceRecordIds),
    ...(review.abilityTextOverrides ?? [])
      .filter(override => override.sourceRecordId === sourceRecordId)
      .flatMap(override => override.officialSourceRecordIds),
    ...(review.contextOverrides ?? [])
      .filter(override => override.sourceRecordId === sourceRecordId)
      .flatMap(override => override.officialSourceRecordIds ?? []),
    ...(review.weaponProfileOverrides ?? [])
      .filter(override => override.sourceRecordId === sourceRecordId)
      .flatMap(override => override.officialSourceRecordIds),
    ...(review.warscrollKeywordOverrides ?? [])
      .filter(override => override.sourceRecordId === sourceRecordId)
      .flatMap(override => override.officialSourceRecordIds),
  ])

const abilityCost = (record: AbilityRecord): AbilityCost | undefined => {
  const value = integerValue(record.points)
  if (value === undefined) return undefined
  const type = record.pointsType.trim().toLowerCase()
  if (type.includes('spell')) return { kind: 'spell', value }
  if (type.includes('prayer')) return { kind: 'prayer', value }
  if (type.includes('command')) return { kind: 'command-points', value }
  return undefined
}

const weaponKeywords = (values: string[]): WeaponKeyword[] =>
  values.map(raw => {
    const normalized = raw.toLowerCase()
    if (/^anti\b/.test(normalized)) return { kind: 'anti', raw }
    if (/^charge\b/.test(normalized)) return { kind: 'charge', raw }
    if (normalized === 'companion') return { kind: 'companion', raw }
    if (/crit.*2 hits/.test(normalized)) return { kind: 'crit-two-hits', raw }
    if (/crit.*auto.?wound/.test(normalized)) return { kind: 'crit-auto-wound', raw }
    if (/crit.*mortal/.test(normalized)) return { kind: 'crit-mortal', raw }
    if (/shoot in combat/.test(normalized)) return { kind: 'shoot-in-combat', raw }
    return { kind: 'other', raw }
  })

const relationshipId = (
  kind: ContentRelationship['kind'],
  from: CanonicalId,
  to: CanonicalId
): `relationship:${string}` =>
  `relationship:${createHash('sha256').update(`${kind}:${from}:${to}`, 'utf8').digest('hex').slice(0, 32)}`

export const buildAos4Corpus = (
  decoded: WahapediaDecodeResult,
  identities: IdentityRegistry,
  review: CorpusReview,
  officialRulesContextIdsBySourceRecord: ReadonlyMap<SourceRecordId, RulesContextId[]> = new Map()
): CorpusGenerationResult => {
  const diagnostics = reviewDiagnostics(decoded, review)
  const lookup = identityLookup(identities, diagnostics)
  const dataset = decoded.dataset
  const contextId = review.rulesContext.id
  const reviewedRulesContexts = reviewRulesContexts(review)
  const allContextIds = reviewedRulesContexts.map(context => context.id)
  const rulesContextIdsBySourceRecord = sourceRulesContextIds(dataset, review)
  const contextsFor = (meta: WahapediaRecordMeta): RulesContextId[] =>
    rulesContextIdsBySourceRecord.get(meta.sourceRecordId) ?? [contextId]
  const ignoredSourceRecordIds = new Set(review.ignoredSourceRecords.map(record => record.sourceRecordId))
  const entities: ContentEntity[] = []
  const relationships: ContentRelationship[] = []
  const relationKeys = new Set<string>()
  const addRelationship = (
    kind: ContentRelationship['kind'],
    from: CanonicalId | undefined,
    to: CanonicalId | undefined
  ) => {
    if (!from || !to) return
    const key = `${kind}:${from}:${to}`
    if (relationKeys.has(key)) return
    relationKeys.add(key)
    relationships.push({ id: relationshipId(kind, from, to), kind, from, to })
  }

  const officialSourceIds = new Set(
    review.officialDocuments.flatMap(document => document.sourceRecords.map(record => record.id))
  )
  review.normalizationDiagnosticPolicies
    .flatMap(policy => policy.officialSourceRecordIds ?? [])
    .concat(review.timingOverrides.flatMap(override => override.officialSourceRecordIds))
    .concat((review.abilityTextOverrides ?? []).flatMap(override => override.officialSourceRecordIds))
    .concat((review.contextOverrides ?? []).flatMap(override => override.officialSourceRecordIds ?? []))
    .concat((review.weaponProfileOverrides ?? []).flatMap(override => override.officialSourceRecordIds))
    .concat((review.warscrollKeywordOverrides ?? []).flatMap(override => override.officialSourceRecordIds))
    .concat((review.communityWarscrollSources ?? []).flatMap(source => source.officialSourceRecordIds))
    .concat(
      (review.currentWahapediaHtml?.adoptedWarscrolls ?? []).flatMap(
        adoption => adoption.officialSourceRecordIds
      )
    )
    .concat((review.armiesOfRenown ?? []).flatMap(entry => entry.officialSourceRecordIds))
    .forEach(id => {
      if (!officialSourceIds.has(id)) {
        diagnostics.push({
          code: 'missing-official-source-record',
          severity: 'error',
          subject: id,
          message: 'Reviewed official evidence is not present in an accepted official document',
        })
      }
    })

  dataset.sources.forEach(record => {
    const id = lookup('publication', 'wahapedia', recordAlias(record.meta)) as
      | CanonicalId<'publication'>
      | undefined
    if (!id) return
    entities.push({
      id,
      kind: 'publication',
      revision: record.meta.recordChecksum,
      name: record.name.trim(),
      publisher: 'wahapedia',
      rulesContextIds: contextsFor(record.meta),
      sourceRefs: [sourceReference(record.meta.sourceRecordId)],
    } satisfies Publication)
  })
  if (dataset.lastUpdate) {
    const id = lookup('publication', 'wahapedia', recordAlias(dataset.lastUpdate.meta)) as
      | CanonicalId<'publication'>
      | undefined
    if (id) {
      entities.push({
        id,
        kind: 'publication',
        revision: dataset.lastUpdate.meta.recordChecksum,
        name: `Wahapedia AoS 4 export ${dataset.lastUpdate.raw}`,
        publisher: 'wahapedia',
        rulesContextIds: allContextIds,
        sourceRefs: [sourceReference(dataset.lastUpdate.meta.sourceRecordId)],
      } satisfies Publication)
    }
  }
  review.officialDocuments.forEach(document => {
    const id = lookup('publication', 'games-workshop', `official:${document.artifact.checksum}`) as
      | CanonicalId<'publication'>
      | undefined
    if (!id) return
    entities.push({
      id,
      kind: 'publication',
      revision: document.artifact.checksum,
      name: document.title,
      publisher: 'games-workshop',
      rulesContextIds: document.rulesContextIds,
      sourceRefs: document.sourceRecords.map(record => sourceReference(record.id)),
    } satisfies Publication)
  })
  const seasonalReviewContextId = reviewedRulesContexts.find(context => context.status === 'seasonal')?.id
  const currentReviewContextIds = uniqueSorted([
    contextId,
    ...(seasonalReviewContextId ? [seasonalReviewContextId] : []),
  ])
  ;(review.communityWarscrollSources ?? []).forEach(source => {
    const id = lookup('publication', 'other', `community:${source.artifact.checksum}`) as
      | CanonicalId<'publication'>
      | undefined
    if (!id) return
    entities.push({
      id,
      kind: 'publication',
      revision: source.artifact.checksum,
      name: source.title,
      publisher: 'other',
      rulesContextIds: currentReviewContextIds,
      sourceRefs: [
        ...source.units.map(unit => unit.section),
        ...(source.factionOptions ?? []).map(option => option.section),
      ].map(section =>
        sourceReference(
          domainSourceRecordId('bsdata', `${source.artifact.checksum}:${section}`),
          'provisional community transcription'
        )
      ),
    } satisfies Publication)
  })

  const factionByExternalId = new Map<string, CanonicalId<'faction'>>()
  dataset.factions.forEach(record => {
    const id = lookup('faction', 'wahapedia', recordAlias(record.meta)) as CanonicalId<'faction'> | undefined
    if (!id) return
    factionByExternalId.set(record.id, id)
    entities.push({
      id,
      kind: 'faction',
      revision: record.meta.recordChecksum,
      name: record.name.trim(),
      rulesContextIds: contextsFor(record.meta),
      sourceRefs: [sourceReference(record.meta.sourceRecordId)],
    } satisfies Faction)
  })

  const validRegimentRecords = dataset.regimentOfRenownFactions.filter(record =>
    factionByExternalId.has(record.factionId)
  )
  const regimentRecordsByWarscroll = new Map<string, typeof validRegimentRecords>()
  validRegimentRecords.forEach(record =>
    regimentRecordsByWarscroll.set(record.warscrollId, [
      ...(regimentRecordsByWarscroll.get(record.warscrollId) ?? []),
      record,
    ])
  )
  const keywordsByWarscroll = new Map<string, typeof dataset.warscrollKeywords>()
  dataset.warscrollKeywords.forEach(record =>
    keywordsByWarscroll.set(record.warscrollId, [
      ...(keywordsByWarscroll.get(record.warscrollId) ?? []),
      record,
    ])
  )
  const basesByWarscroll = new Map<string, typeof dataset.warscrollBases>()
  dataset.warscrollBases.forEach(record =>
    basesByWarscroll.set(record.warscrollId, [...(basesByWarscroll.get(record.warscrollId) ?? []), record])
  )
  const organisationByWarscroll = new Map<string, typeof dataset.warscrollOrganisation>()
  dataset.warscrollOrganisation.forEach(record =>
    organisationByWarscroll.set(record.warscrollId, [
      ...(organisationByWarscroll.get(record.warscrollId) ?? []),
      record,
    ])
  )

  const parentByWarscrollExternalId = new Map<string, CanonicalId>()
  const warscrollKeywordOverrides = new Map(
    (review.warscrollKeywordOverrides ?? []).map(override => [override.sourceRecordId, override])
  )
  const universalFactionIds = new Set((review.universalFactionContent ?? []).map(entry => entry.factionId))
  const everyArmyFactionId = uniqueSorted(
    dataset.factions.flatMap(faction => {
      const id = factionByExternalId.get(faction.id)
      return id && !universalFactionIds.has(faction.id) ? [id] : []
    })
  )
  /**
   * Who offers the content a faction row owns.
   *
   * A reviewed universal container is not an army — it exists so that content every army may take
   * has a row to hang on — so its content is offered by all the real armies and by nothing else.
   * Leaving the container offering its own warscrolls would put it back in the army selector
   * (#1796), which is what `armyFactions` reads the relationship graph to decide.
   */
  const offeringFactionIds = (ownerExternalFactionId: string): CanonicalId<'faction'>[] =>
    universalFactionIds.has(ownerExternalFactionId)
      ? everyArmyFactionId
      : [factionByExternalId.get(ownerExternalFactionId)].flatMap(id => (id ? [id] : []))
  dataset.warscrolls.forEach(record => {
    const parentKind: EntityKind = isWarscrollRecord(record) ? 'warscroll' : 'content-group'
    const id = lookup(parentKind, recordPublisher(record.meta), recordAlias(record.meta))
    if (!id) return
    parentByWarscrollExternalId.set(record.id, id)
    const keywordRecords = keywordsByWarscroll.get(record.id) ?? []
    const regimentRecords = regimentRecordsByWarscroll.get(record.id) ?? []
    const baseRecords = basesByWarscroll.get(record.id) ?? []
    const organisationRecords = organisationByWarscroll.get(record.id) ?? []
    const profileExists = hasBattleProfile(record)
    const keywordOverride = warscrollKeywordOverrides.get(record.meta.sourceRecordId)
    const removedKeywords = new Set((keywordOverride?.remove ?? []).map(value => value.trim().toUpperCase()))
    const keywords = uniqueSorted([
      ...keywordRecords
        .map(item => [item.keyword, item.parameter].filter(Boolean).join(' ').trim().toUpperCase())
        .filter(keyword => keyword && !removedKeywords.has(keyword)),
    ])
    const parentRefs = sortedSourceReferences([
      sourceReference(record.meta.sourceRecordId),
      ...keywordRecords.map(item => sourceReference(item.meta.sourceRecordId, 'normalized keyword')),
      ...regimentRecords.map(item =>
        sourceReference(item.meta.sourceRecordId, 'normalized faction availability')
      ),
      ...(!profileExists
        ? [...baseRecords, ...organisationRecords].map(item =>
            sourceReference(item.meta.sourceRecordId, 'retained on profile-less content')
          )
        : []),
      ...officialEvidenceFor(record.meta.sourceRecordId, review).map(sourceRecordId =>
        sourceReference(sourceRecordId, 'reviewed official reconciliation evidence')
      ),
      ...(record.meta.officialSourceRecordIds ?? []).map(sourceRecordId =>
        sourceReference(sourceRecordId, 'authoritative battle-profile reconciliation')
      ),
    ])
    const factionIds = uniqueSorted([
      ...offeringFactionIds(record.factionId),
      ...regimentRecords.flatMap(item => {
        const factionId = factionByExternalId.get(item.factionId)
        return factionId ? [factionId] : []
      }),
    ])

    if (parentKind === 'warscroll') {
      entities.push({
        id: id as CanonicalId<'warscroll'>,
        kind: 'warscroll',
        revision: keywordOverride
          ? createHash('sha256')
              .update(
                [
                  entityRevision(record.meta),
                  ...keywords,
                  ...officialEvidenceFor(record.meta.sourceRecordId, review),
                ].join('\n'),
                'utf8'
              )
              .digest('hex')
          : entityRevision(record.meta),
        name: record.name.trim(),
        factionIds,
        keywords,
        characteristics: {
          move: record.move.trim(),
          save: record.save.trim(),
          control: record.control.trim(),
          health: record.health.trim(),
          ...(record.ward.trim() ? { ward: record.ward.trim() } : {}),
        },
        rulesContextIds: contextsFor(record.meta),
        sourceRefs: parentRefs,
      } satisfies Warscroll)
    } else {
      entities.push({
        id: id as CanonicalId<'content-group'>,
        kind: 'content-group',
        revision: entityRevision(record.meta),
        name: record.name.trim(),
        groupType: groupType(record.role || 'supplemental-content'),
        rulesContextIds: contextsFor(record.meta),
        sourceRefs: parentRefs,
      } satisfies ContentGroup)
    }
    if (!record.parentWarscrollId) {
      factionIds.forEach(factionId => addRelationship('offers', factionId, id))
    }

    if (profileExists && parentKind === 'warscroll') {
      const profileId = lookup('battle-profile', recordPublisher(record.meta), battleProfileAlias(record)) as
        | CanonicalId<'battle-profile'>
        | undefined
      if (profileId) {
        const points = integerValue(record.cost)
        entities.push({
          id: profileId,
          kind: 'battle-profile',
          revision: entityRevision(record.meta),
          name: `${record.name.trim()} battle profile`,
          warscrollId: id as CanonicalId<'warscroll'>,
          unitSize: integerValue(record.unitSize)!,
          ...(points === undefined ? { pointsStatus: 'not-applicable' as const } : { points }),
          baseSizes: uniqueSorted(baseRecords.map(item => normalizePlainText(item.base)).filter(Boolean)),
          regimentOptions: splitValues(record.regimentOptions),
          notes: uniqueSorted([
            ...splitNotes(record.notesHtml),
            ...(record.noReinforced ? ['This unit cannot be reinforced.'] : []),
            ...organisationRecords
              .map(item => normalizePlainText([item.unit, item.size].filter(Boolean).join(' ')))
              .filter(Boolean),
          ]),
          rulesContextIds: contextsFor(record.meta),
          sourceRefs: sortedSourceReferences([
            sourceReference(record.meta.sourceRecordId, 'normalized battle profile'),
            ...(record.meta.officialSourceRecordIds ?? []).map(sourceRecordId =>
              sourceReference(sourceRecordId, 'authoritative battle-profile fact')
            ),
            ...baseRecords.map(item => sourceReference(item.meta.sourceRecordId, 'normalized base size')),
            ...organisationRecords.map(item =>
              sourceReference(item.meta.sourceRecordId, 'normalized unit organization')
            ),
          ]),
        } satisfies BattleProfile)
        addRelationship('includes', id, profileId)
      }
    }
  })
  dataset.warscrolls.forEach(record => {
    if (!record.parentWarscrollId) return
    addRelationship(
      'includes',
      parentByWarscrollExternalId.get(record.parentWarscrollId),
      parentByWarscrollExternalId.get(record.id)
    )
  })

  const typeGroupByKey = new Map<string, CanonicalId<'content-group'>>()
  const factionAbilityTypeByKey = new Map(
    dataset.factionAbilityTypes.map(record => [`${record.factionId}:${record.id}`, record])
  )
  // Reviewed Army of Renown classification: the named faction-page ability-type groups become
  // `army-of-renown` roots that replace the faction's regular rules (see CorpusArmyOfRenown).
  const armiesOfRenownBySourceRecordId = new Map(
    (review.armiesOfRenown ?? []).map(entry => [entry.sourceRecordId, entry])
  )
  const matchedArmyOfRenownSourceRecordIds = new Set<SourceRecordId>()
  const armyOfRenownRootByTypeKey = new Map<string, CanonicalId<'content-group'>>()
  const replaceableGroupsByExternalFactionId = new Map<string, CanonicalId<'content-group'>[]>()
  const armyOfRenownRootsByExternalFactionId = new Map<string, CanonicalId<'content-group'>[]>()
  const trackReplaceable = (
    externalFactionId: string,
    id: CanonicalId<'content-group'>,
    resolvedGroupType: string
  ): void => {
    if (!ARMY_OF_RENOWN_REPLACED_GROUP_TYPES.has(resolvedGroupType)) return
    replaceableGroupsByExternalFactionId.set(externalFactionId, [
      ...(replaceableGroupsByExternalFactionId.get(externalFactionId) ?? []),
      id,
    ])
  }
  const sourceMarkedArmyOfRenownRecordIds = new Set(
    dataset.factionAbilityTypes
      .filter(record => record.armyOfRenown)
      .map(record => record.meta.sourceRecordId)
  )
  dataset.factionAbilityTypes.forEach(record => {
    const id = lookup('content-group', recordPublisher(record.meta), recordAlias(record.meta)) as
      | CanonicalId<'content-group'>
      | undefined
    if (!id) return
    typeGroupByKey.set(`${record.factionId}:${record.id}`, id)
    const armyOfRenown = armiesOfRenownBySourceRecordId.get(record.meta.sourceRecordId)
    if (record.armyOfRenown && !armyOfRenown) {
      // The source page classifies this group as an Army of Renown. Without a reviewed entry it
      // would decode as a generic content group offering its replacement rules piecemeal — the
      // #1844 bug class — so generation stops until the classification is reviewed.
      diagnostics.push({
        code: 'unclassified-army-of-renown',
        severity: 'error',
        subject: record.meta.sourceRecordId,
        message: `Source-classified Army of Renown "${record.name.trim()}" has no reviewed armiesOfRenown entry`,
      })
    }
    if (armyOfRenown) matchedArmyOfRenownSourceRecordIds.add(armyOfRenown.sourceRecordId)
    const resolvedGroupType = armyOfRenown ? 'army-of-renown' : groupType(record.name)
    entities.push({
      id,
      kind: 'content-group',
      revision: record.meta.recordChecksum,
      name: record.name.trim(),
      groupType: resolvedGroupType,
      rulesContextIds: contextsFor(record.meta),
      sourceRefs: [
        sourceReference(record.meta.sourceRecordId),
        ...(armyOfRenown
          ? armyOfRenown.officialSourceRecordIds.map(officialId =>
              sourceReference(officialId, 'reviewed Army of Renown classification')
            )
          : []),
      ],
    } satisfies ContentGroup)
    const factionId = factionByExternalId.get(record.factionId)
    if (isMandatoryType(record.name)) addRelationship('includes', factionId, id)
    if (armyOfRenown) {
      // The root itself is the top-level choice: offered by its faction, never auto-included.
      armyOfRenownRootByTypeKey.set(`${record.factionId}:${record.id}`, id)
      armyOfRenownRootsByExternalFactionId.set(record.factionId, [
        ...(armyOfRenownRootsByExternalFactionId.get(record.factionId) ?? []),
        id,
      ])
      offeringFactionIds(record.factionId).forEach(offeringId => addRelationship('offers', offeringId, id))
    }
    trackReplaceable(record.factionId, id, resolvedGroupType)
  })
  ;(review.armiesOfRenown ?? []).forEach(entry => {
    const requiresOfficialEvidence = (entry.evidenceTier ?? 'official') === 'official'
    if (
      !matchedArmyOfRenownSourceRecordIds.has(entry.sourceRecordId) ||
      !entry.reason.trim() ||
      (requiresOfficialEvidence && entry.officialSourceRecordIds.length === 0)
    ) {
      diagnostics.push({
        code: 'invalid-review',
        severity: 'error',
        subject: entry.sourceRecordId,
        message:
          'Army of Renown classification must target an existing faction ability-type group and cite official evidence (or declare the secondary-provisional tier)',
      })
    }
    if (!sourceMarkedArmyOfRenownRecordIds.has(entry.sourceRecordId)) {
      // Both tiers require the source page's own classification: an entry targeting an unmarked
      // group is a typo or a stale pin, never a valid classification.
      diagnostics.push({
        code: 'invalid-review',
        severity: 'error',
        subject: entry.sourceRecordId,
        message:
          'Army of Renown classification targets a group the source page does not classify as an Army of Renown',
      })
    }
  })
  const subtypeGroupByKey = new Map<string, CanonicalId<'content-group'>>()
  dataset.factionAbilitySubtypes.forEach(record => {
    const id = lookup('content-group', recordPublisher(record.meta), recordAlias(record.meta)) as
      | CanonicalId<'content-group'>
      | undefined
    if (!id) return
    subtypeGroupByKey.set(`${record.factionId}:${record.id}`, id)
    const type = factionAbilityTypeByKey.get(`${record.factionId}:${record.typeId}`)
    const armyOfRenownRootId = armyOfRenownRootByTypeKey.get(`${record.factionId}:${record.typeId}`)
    // An Army of Renown subgroup keeps its real rules category (`spell-lore`, `heroic-trait`, …)
    // rather than the army-slug type, so its granted content presents inside the standard
    // category cards instead of clustering under an army card. The name stays exactly the
    // source's heading; the army context is carried by the relationship graph.
    const resolvedGroupType = armyOfRenownRootId
      ? groupType(record.name)
      : groupType(type?.name || record.name)
    entities.push({
      id,
      kind: 'content-group',
      revision: record.meta.recordChecksum,
      name: record.name.trim(),
      groupType: resolvedGroupType,
      rulesContextIds: contextsFor(record.meta),
      sourceRefs: [sourceReference(record.meta.sourceRecordId)],
    } satisfies ContentGroup)
    if (armyOfRenownRootId) {
      // An Army of Renown grants its whole rules set: every subgroup auto-applies with the root.
      addRelationship('includes', armyOfRenownRootId, id)
      return
    }
    addRelationship('includes', typeGroupByKey.get(`${record.factionId}:${record.typeId}`), id)
    if (!type || !isMandatoryType(type.name)) {
      offeringFactionIds(record.factionId).forEach(factionId => addRelationship('offers', factionId, id))
    }
    trackReplaceable(record.factionId, id, resolvedGroupType)
  })

  const generalRulesPageByExternalId = new Map(
    (dataset.generalRulesPages ?? []).map(record => [record.id, record])
  )
  const generalRuleGroupByExternalId = new Map(
    (dataset.generalRuleGroups ?? []).map(record => [record.id, record])
  )
  const generalRulesPageIdByExternalId = new Map(
    (dataset.generalRulesPages ?? []).flatMap(record => {
      const id = lookup('content-group', 'wahapedia', recordAlias(record.meta)) as
        | CanonicalId<'content-group'>
        | undefined
      return id ? [[record.id, id] as const] : []
    })
  )
  const generalRuleGroupIdByExternalId = new Map(
    (dataset.generalRuleGroups ?? []).flatMap(record => {
      const id = lookup('content-group', 'wahapedia', recordAlias(record.meta)) as
        | CanonicalId<'content-group'>
        | undefined
      return id ? [[record.id, id] as const] : []
    })
  )
  ;(dataset.generalRulesPages ?? []).forEach(record => {
    const id = generalRulesPageIdByExternalId.get(record.id)
    if (!id) return
    entities.push({
      id,
      kind: 'content-group',
      revision: record.meta.recordChecksum,
      name: record.title.trim(),
      groupType: 'rules-module',
      rulesContextIds: contextsFor(record.meta),
      sourceRefs: [sourceReference(record.meta.sourceRecordId, record.reason)],
    } satisfies ContentGroup)
    if (record.application === 'reference') return
    const relationshipKind = record.application === 'universal' ? 'includes' : 'offers'
    dataset.factions.forEach(faction =>
      addRelationship(relationshipKind, factionByExternalId.get(faction.id), id)
    )
  })
  ;(dataset.generalRuleGroups ?? []).forEach(record => {
    const id = generalRuleGroupIdByExternalId.get(record.id)
    if (!id) return
    entities.push({
      id,
      kind: 'content-group',
      revision: record.meta.recordChecksum,
      name: record.name.trim(),
      groupType: 'general-rules',
      rulesContextIds: contextsFor(record.meta),
      sourceRefs: [sourceReference(record.meta.sourceRecordId, record.reason)],
    } satisfies ContentGroup)
    const page = generalRulesPageByExternalId.get(record.pageId)
    const parent = record.parentId ? generalRuleGroupByExternalId.get(record.parentId) : undefined
    const containerApplication = parent?.application ?? page?.application
    const containerId = record.parentId
      ? generalRuleGroupIdByExternalId.get(record.parentId)
      : generalRulesPageIdByExternalId.get(record.pageId)
    if (record.application === containerApplication && record.application !== 'reference') {
      addRelationship('includes', containerId, id)
    } else if (record.application !== 'reference') {
      const relationshipKind = record.application === 'universal' ? 'includes' : 'offers'
      dataset.factions.forEach(faction =>
        addRelationship(relationshipKind, factionByExternalId.get(faction.id), id)
      )
    }
    if (!page) {
      diagnostics.push({
        code: 'invalid-review',
        severity: 'error',
        subject: record.meta.sourceRecordId,
        message: `General-rules group ${record.name} has no reviewed page`,
      })
    }
  })

  const normalizationPolicies = new Map(
    review.normalizationDiagnosticPolicies
      .filter(policy => policy.sourceRecordId)
      .map(policy => [`${policy.sourceRecordId}:${policy.code}`, policy])
  )
  const normalizationPoliciesByCode = new Map(
    review.normalizationDiagnosticPolicies
      .filter(policy => !policy.sourceRecordId)
      .map(policy => [policy.code, policy])
  )
  const timingOverrides = new Map(review.timingOverrides.map(override => [override.sourceRecordId, override]))
  const abilityTextOverrides = new Map(
    (review.abilityTextOverrides ?? []).map(override => [override.sourceRecordId, override])
  )
  const abilityIdBySource = new Map<SourceRecordId, CanonicalId<'ability'>>()
  const addAbility = (record: AbilityRecord, actor: Ability['actor']) => {
    if (ignoredSourceRecordIds.has(record.meta.sourceRecordId)) return
    const id = lookup('ability', recordPublisher(record.meta), recordAlias(record.meta)) as
      | CanonicalId<'ability'>
      | undefined
    if (!id) return
    abilityIdBySource.set(record.meta.sourceRecordId, id)
    const normalized = normalizeWahapediaAbility(record, actor)
    normalized.diagnostics.forEach(diagnostic => {
      const policy =
        normalizationPolicies.get(`${record.meta.sourceRecordId}:${diagnostic.code}`) ??
        normalizationPoliciesByCode.get(diagnostic.code)
      if (!policy?.reason.trim()) {
        diagnostics.push({
          code: 'unreviewed-normalization-diagnostic',
          severity: 'error',
          subject: `${record.meta.sourceRecordId}:${diagnostic.code}`,
          message: diagnostic.message,
        })
      }
    })
    const timingOverride = timingOverrides.get(record.meta.sourceRecordId)
    const textOverride = abilityTextOverrides.get(record.meta.sourceRecordId)
    const abilityKind = timingOverride?.abilityKind ?? normalized.abilityKind
    const cost = abilityCost(record)
    const officialEvidence = officialEvidenceFor(record.meta.sourceRecordId, review)
    const nonReactionText = {
      ...(normalized.text.declare ? { declare: normalized.text.declare } : {}),
      effect: normalized.text.effect,
    }
    const reactionText =
      !normalized.text.effect && normalized.text.declare
        ? {
            effect: normalized.text.declare,
            ...(normalized.text.reactionTrigger ? { reactionTrigger: normalized.text.reactionTrigger } : {}),
          }
        : normalized.text
    const text = textOverride?.text ?? (abilityKind === 'reaction' ? reactionText : nonReactionText)
    entities.push({
      id,
      kind: 'ability',
      revision:
        timingOverride || textOverride
          ? createHash('sha256')
              .update(
                [
                  entityRevision(record.meta),
                  abilityKind,
                  JSON.stringify(timingOverride?.timings ?? normalized.timings),
                  JSON.stringify(text),
                  ...officialEvidence,
                ].join('\n'),
                'utf8'
              )
              .digest('hex')
          : record.meta.recordChecksum,
      name: normalized.name,
      abilityKind,
      actor: normalized.actor,
      text,
      timings: timingOverride?.timings ?? normalized.timings,
      keywords: normalized.keywords,
      ...(cost ? { cost } : {}),
      rulesContextIds: contextsFor(record.meta),
      sourceRefs: sortedSourceReferences([
        sourceReference(record.meta.sourceRecordId, 'normalized reminder ability'),
        ...officialEvidence.map(sourceRecordId =>
          sourceReference(sourceRecordId, 'reviewed official reconciliation evidence')
        ),
      ]),
    } satisfies Ability)
  }
  dataset.warscrollAbilities.forEach(record => addAbility(record, 'unit'))
  dataset.factionAbilities.forEach(record => addAbility(record, 'army'))
  ;(dataset.generalRuleAbilities ?? []).forEach(record => addAbility(record, record.actor))

  dataset.warscrollAbilities.forEach(record =>
    addRelationship(
      'includes',
      parentByWarscrollExternalId.get(record.warscrollId),
      abilityIdBySource.get(record.meta.sourceRecordId)
    )
  )
  dataset.factionAbilities.forEach(record => {
    const abilityId = abilityIdBySource.get(record.meta.sourceRecordId)
    const type = factionAbilityTypeByKey.get(`${record.factionId}:${record.typeId}`)
    const subtypeId = subtypeGroupByKey.get(`${record.factionId}:${record.subtypeId}`)
    if (subtypeId) {
      addRelationship('includes', subtypeId, abilityId)
      return
    }
    const typeId = typeGroupByKey.get(`${record.factionId}:${record.typeId}`)
    if (type && isMandatoryType(type.name)) {
      addRelationship('includes', typeId, abilityId)
      return
    }
    // An ability sitting directly on an Army of Renown root (no subgroup) applies whenever the
    // army is chosen; it must never become a faction-offered selection wrapper.
    const armyOfRenownRootId = armyOfRenownRootByTypeKey.get(`${record.factionId}:${record.typeId}`)
    if (armyOfRenownRootId) {
      addRelationship('includes', armyOfRenownRootId, abilityId)
      return
    }
    const choiceId = lookup('content-group', 'wahapedia', choiceGroupAlias(record)) as
      | CanonicalId<'content-group'>
      | undefined
    if (!choiceId) return
    const wrapperGroupType = groupType(type?.name || record.typeName || 'other')
    entities.push({
      id: choiceId,
      kind: 'content-group',
      revision: record.meta.recordChecksum,
      name: record.name.trim(),
      groupType: wrapperGroupType,
      rulesContextIds: contextsFor(record.meta),
      sourceRefs: [sourceReference(record.meta.sourceRecordId, 'selection wrapper')],
    } satisfies ContentGroup)
    offeringFactionIds(record.factionId).forEach(factionId => addRelationship('offers', factionId, choiceId))
    addRelationship('includes', choiceId, abilityId)
    trackReplaceable(record.factionId, choiceId, wrapperGroupType)
  })
  // Apply the Army of Renown replacement: while a classified root is selected, every regular
  // rules-choice group of its faction is excluded (official rule: "use the faction rules on
  // these pages instead of the [faction] rules").
  armyOfRenownRootsByExternalFactionId.forEach((rootIds, externalFactionId) => {
    const replaced = replaceableGroupsByExternalFactionId.get(externalFactionId) ?? []
    rootIds.forEach(rootId =>
      replaced.forEach(replacedId => addRelationship('excludes', rootId, replacedId))
    )
  })
  ;(dataset.generalRuleAbilities ?? []).forEach(record =>
    addRelationship(
      'includes',
      generalRuleGroupIdByExternalId.get(record.groupId),
      abilityIdBySource.get(record.meta.sourceRecordId)
    )
  )

  const weaponProfileOverrides = new Map(
    (review.weaponProfileOverrides ?? []).map(override => [override.sourceRecordId, override])
  )
  dataset.warscrollWeapons.forEach(record => {
    if (ignoredSourceRecordIds.has(record.meta.sourceRecordId)) return
    const id = lookup('weapon', recordPublisher(record.meta), recordAlias(record.meta)) as
      | CanonicalId<'weapon'>
      | undefined
    if (!id) return
    const normalized = normalizeWahapediaWeapon(record)
    normalized.diagnostics.forEach(diagnostic => {
      const policy =
        normalizationPolicies.get(`${record.meta.sourceRecordId}:${diagnostic.code}`) ??
        normalizationPoliciesByCode.get(diagnostic.code)
      if (!policy?.reason.trim()) {
        diagnostics.push({
          code: 'unreviewed-normalization-diagnostic',
          severity: 'error',
          subject: `${record.meta.sourceRecordId}:${diagnostic.code}`,
          message: diagnostic.message,
        })
      }
    })
    if (normalized.weaponType === 'unknown') {
      diagnostics.push({
        code: 'unreviewed-normalization-diagnostic',
        severity: 'error',
        subject: `${record.meta.sourceRecordId}:unknown-weapon-type`,
        message: `Unknown weapon type ${record.weaponType}`,
      })
      return
    }
    const range = normalized.profile.range.match(/\d+/)?.[0]
    const profileOverride = weaponProfileOverrides.get(record.meta.sourceRecordId)
    const profile: Weapon['profile'] = {
      ...(range ? { rangeInches: Number.parseInt(range, 10) } : {}),
      attacks: normalized.profile.attacks.trim(),
      hit: normalized.profile.hit.trim(),
      wound: normalized.profile.wound.trim(),
      rend: normalized.profile.rend.trim(),
      damage: normalized.profile.damage.trim(),
      ...profileOverride?.profile,
    }
    const sourceIncompleteCharacteristics = Object.entries(profile)
      .filter(
        ([name, value]) =>
          name !== 'rangeInches' &&
          name !== 'sourceIncompleteCharacteristics' &&
          typeof value === 'string' &&
          !value.trim()
      )
      .map(([name]) => name) as Array<'attacks' | 'hit' | 'wound' | 'rend' | 'damage'>
    if (sourceIncompleteCharacteristics.length) {
      profile.sourceIncompleteCharacteristics = sourceIncompleteCharacteristics
    }
    const officialEvidence = officialEvidenceFor(record.meta.sourceRecordId, review)
    entities.push({
      id,
      kind: 'weapon',
      revision: profileOverride
        ? createHash('sha256')
            .update(
              [
                record.meta.recordChecksum,
                profile.rangeInches ?? '',
                profile.attacks,
                profile.hit,
                profile.wound,
                profile.rend,
                profile.damage,
                ...officialEvidence,
              ].join('\n'),
              'utf8'
            )
            .digest('hex')
        : record.meta.recordChecksum,
      name: normalized.name,
      weaponType: normalized.weaponType,
      profile,
      keywords: weaponKeywords(normalized.abilityLabels),
      rulesContextIds: contextsFor(record.meta),
      sourceRefs: sortedSourceReferences([
        sourceReference(record.meta.sourceRecordId, 'normalized weapon profile'),
        ...officialEvidence.map(sourceRecordId =>
          sourceReference(sourceRecordId, 'reviewed official weapon profile evidence')
        ),
      ]),
    } satisfies Weapon)
    addRelationship('includes', parentByWarscrollExternalId.get(record.warscrollId), id)
  })

  const entityById = new Map(entities.map(entity => [entity.id, entity]))
  const rulesContexts: RulesContext[] = reviewedRulesContexts.map(context => ({
    ...context,
    publicationIds: uniqueSorted(
      entities
        .filter(
          (entity): entity is Publication =>
            entity.kind === 'publication' && entity.rulesContextIds.includes(context.id)
        )
        .map(entity => entity.id)
    ),
  }))
  const contextualRelationships = relationships.flatMap(relationship => {
    const from = entityById.get(relationship.from)
    const to = entityById.get(relationship.to)
    if (!from || !to) return [relationship]
    if (relationship.kind === 'excludes') {
      // A replacement crosses contexts: the builder's Legends/historical overlays let a
      // current-context army see other contexts' content, so an Army of Renown's exclusion stays
      // applicable wherever either endpoint exists — an intersection would silently drop the
      // exclusion of exactly the overlay content it must suppress.
      return [
        {
          ...relationship,
          rulesContextIds: uniqueSorted([...from.rulesContextIds, ...to.rulesContextIds]),
        },
      ]
    }
    const toContextIds = new Set(to.rulesContextIds)
    const sharedContextIds = from.rulesContextIds.filter(id => toContextIds.has(id))
    return sharedContextIds.length
      ? [{ ...relationship, rulesContextIds: uniqueSorted(sharedContextIds) }]
      : []
  })
  const meaningfulKinds = new Set<ContentEntity['kind']>(['ability', 'battle-profile', 'warscroll', 'weapon'])
  const outgoingByEntityId = new Map<CanonicalId, ContentRelationship[]>()
  contextualRelationships.forEach(relationship =>
    outgoingByEntityId.set(relationship.from, [
      ...(outgoingByEntityId.get(relationship.from) ?? []),
      relationship,
    ])
  )
  const hasMeaningfulContent = (entityId: CanonicalId, visited = new Set<CanonicalId>()): boolean => {
    if (visited.has(entityId)) return false
    const entity = entityById.get(entityId)
    if (!entity) return false
    if (meaningfulKinds.has(entity.kind)) return true
    visited.add(entityId)
    return (outgoingByEntityId.get(entityId) ?? [])
      .filter(relationship => relationship.kind === 'includes' || relationship.kind === 'requires')
      .some(relationship => hasMeaningfulContent(relationship.to, new Set(visited)))
  }
  const selectableRelationships = contextualRelationships.filter(relationship => {
    if (relationship.kind !== 'offers') return true
    const target = entityById.get(relationship.to)
    return target?.kind !== 'content-group' || hasMeaningfulContent(target.id)
  })
  const catalog: Aos4Catalog = {
    schemaVersion: AOS4_CATALOG_SCHEMA_VERSION,
    generatedAt: review.generatedAt,
    rulesContexts,
    sourceArtifacts: sourceArtifacts(dataset, review),
    sourceRecords: sourceRecords(
      dataset,
      review,
      rulesContextIdsBySourceRecord,
      officialRulesContextIdsBySourceRecord
    ),
    entities: entities.sort(
      (left, right) => left.kind.localeCompare(right.kind) || left.id.localeCompare(right.id)
    ),
    relationships: selectableRelationships.sort((left, right) => left.id.localeCompare(right.id)),
  }
  const currentSourceRecordIds = new Set(catalog.sourceRecords.map(record => record.id))
  const dispositions: SourceDisposition[] = review.ignoredSourceRecords
    .filter(disposition => currentSourceRecordIds.has(disposition.sourceRecordId))
    .map(disposition => ({
      sourceRecordId: disposition.sourceRecordId,
      status: 'ignored' as const,
      reason: disposition.reason,
    }))
    .sort((left, right) => left.sourceRecordId.localeCompare(right.sourceRecordId))
  const supersededSourceRecords = supersededSourceRecordDisposition(dataset, review)
  const status = diagnostics.some(diagnostic => diagnostic.severity === 'error') ? 'blocked' : 'strict-pass'
  const countKind = (kind: ContentEntity['kind']): number =>
    catalog.entities.filter(entity => entity.kind === kind).length

  return {
    catalog,
    diagnostics: diagnostics.sort(
      (left, right) =>
        left.code.localeCompare(right.code) ||
        left.subject.localeCompare(right.subject) ||
        left.message.localeCompare(right.message)
    ),
    dispositions,
    supersededSourceRecords,
    summary: {
      schemaVersion: 1,
      status,
      revision: review.revision,
      attribution: WAHAPEDIA_ATTRIBUTION,
      factions: countKind('faction'),
      publications: countKind('publication'),
      warscrolls: countKind('warscroll'),
      battleProfiles: countKind('battle-profile'),
      abilities: countKind('ability'),
      weapons: countKind('weapon'),
      contentGroups: countKind('content-group'),
      relationships: catalog.relationships.length,
      sourceArtifacts: catalog.sourceArtifacts.length,
      sourceRecords: catalog.sourceRecords.length,
      ignoredSourceRecords: dispositions.length + supersededSourceRecords.count,
    },
  }
}
