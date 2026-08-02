import { access, mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  BSDATA_ADAPTER_VERSION,
  FileArtifactCache,
  artifactChecksum,
  assertArtifactChecksum,
  createArtifactManifest,
  extractBsDataFactionOptions,
  extractBsDataWarscrolls,
  extractGamesWorkshopBattleProfileSupplement,
  extractGamesWorkshopBattleProfiles,
  extractGamesWorkshopPdfText,
  mergeBsDataFactionOptions,
  mergeBsDataWarscrolls,
  type BsDataCommunitySourceInput,
  type BsDataFactionOptionSourceInput,
  factionRootWarscrollScope,
  filterNativeWahapediaFactionWarscrolls,
  mergeCurrentWahapediaWarscrollPages,
  parseWahapediaFactionHtml,
  parseWahapediaFactionRootWarscrollsHtml,
  parseWahapediaRulesHtml,
  parseWahapediaWarscrollCollectionHtml,
  parseWahapediaWarscrollHtml,
  type ArtifactManifest,
  type ArtifactManifestEntry,
  type GamesWorkshopBattleProfileFact,
  type WahapediaHtmlFactionPageRecord,
  type WahapediaHtmlReconciliation,
  type WahapediaHtmlRulesPageRecord,
  type WahapediaHtmlWarscrollRecord,
} from '../data'
import {
  WAHAPEDIA_EXPORT_FILES,
  decodeWahapediaExports,
  type WahapediaDecodeResult,
  type WahapediaExportInputs,
} from '../data/wahapedia'
import { validateCatalog, type RulesContextId, type SourceRecordId } from '../domain'
import { runCertificationCheck } from '../review/certificationCommand'
import { buildAos4Corpus, createCorpusIdentityRegistry, type CorpusReview } from './corpus'
import { validateIdentityRegistry, type IdentityRegistry } from './identityRegistry'
import { validateGenerationIntegrity } from './integrity'
import { loadProfileOnlyDeviationLedger, profileOnlyGateIssues } from './profileOnlyGate'
import {
  createOfficialBattleProfileCatalog,
  type ReviewedOfficialBattleProfileFact,
} from './officialBattleProfiles'
import { createRuntimeProjection, serializeRuntimeProjection } from './runtimeProjection'
import { serializeAuditCatalog, stableJson } from './serialization'

const DEFAULT_ACCEPTED_MANIFEST = path.join('data', 'aos4', 'manifests', 'accepted-2026-08-02.json')
const DEFAULT_REVIEW = path.join('data', 'aos4', 'reviews', 'corpus-2026-08-02.json')
const DEFAULT_IDENTITIES = path.join('data', 'aos4', 'identities', 'corpus.json')
const DEFAULT_AUDIT_CATALOG = path.join('data', 'aos4', 'catalog', 'catalog.json')
const DEFAULT_OFFICIAL_BATTLE_PROFILES = path.join('data', 'aos4', 'catalog', 'official-battle-profiles.json')
const DEFAULT_RUNTIME = path.join('src', 'aos4', 'generated', 'corpus', 'runtime.json')
const DEFAULT_DEFAULTS = path.join('src', 'aos4', 'generated', 'corpus', 'defaults.json')
const DEFAULT_REPORT = path.join('data', 'aos4', 'reports', 'corpus-2026-08-02-summary.json')
const DEFAULT_RECONCILIATION = path.join('data', 'aos4', 'reports', 'corpus-2026-08-02-reconciliation.json')
const DEFAULT_CACHE = path.join('.cache', 'aos4', 'artifacts')
const DEFAULT_BETA_READINESS = path.join('data', 'aos4', 'certifications', 'beta.json')
const DEFAULT_PROFILE_ONLY_DEVIATIONS = path.join('data', 'aos4', 'reviews', 'profile-only-deviations.json')

interface CorpusCommandArguments {
  acceptedManifestPath: string
  reviewPath: string
  identitiesPath: string
  auditCatalogPath: string
  officialBattleProfilesPath: string
  runtimePath: string
  defaultsPath: string
  reportPath: string
  reconciliationPath: string
  profileOnlyDeviationsPath: string
  cacheDirectory: string
  initializeIdentities: boolean
  candidate: boolean
  write: boolean
}

interface CorpusBetaReadinessResult {
  ok: boolean
  status: 'pass' | 'blocked' | 'stale'
}

export const assertCorpusWriteWorkflow = (
  arguments_: Pick<CorpusCommandArguments, 'candidate' | 'write'>
): void => {
  if (arguments_.write && !arguments_.candidate) {
    throw new Error('Writing corpus outputs requires the explicit --candidate workflow')
  }
}

export const assertAcceptedCorpusBetaReadiness = async (
  hasBetaReadiness: boolean,
  candidate: boolean,
  check: () => Promise<CorpusBetaReadinessResult>
): Promise<void> => {
  if (candidate) return
  if (!hasBetaReadiness) {
    throw new Error(
      'Accepted corpus beta readiness is missing; use the explicit --candidate workflow until automated verification passes'
    )
  }
  const readiness = await check()
  if (!readiness.ok || readiness.status !== 'pass') {
    throw new Error(`Accepted corpus beta readiness is ${readiness.status}`)
  }
}

interface GeneratedProduct {
  path: string
  bytes: string
}

export interface AcceptedCorpusSourceArguments {
  acceptedManifestPath: string
  reviewPath: string
  cacheDirectory: string
}

export interface AcceptedCorpusSourceData {
  manifest: ArtifactManifest
  review: CorpusReview
  acceptedDecoded: WahapediaDecodeResult
  decoded: WahapediaDecodeResult
  officialBattleProfiles: {
    effective: GamesWorkshopBattleProfileFact[]
    reviewed: ReviewedOfficialBattleProfileFact[]
  }
  reconciliation: WahapediaHtmlReconciliation
  officialPageTextBySourceRecordId: Map<string, string>
}

export const officialSourceRecordContexts = (
  review: CorpusReview,
  records: ReviewedOfficialBattleProfileFact[]
): Map<SourceRecordId, RulesContextId[]> => {
  const contexts = [review.rulesContext, ...(review.additionalRulesContexts ?? [])]
  const contextById = new Map(contexts.map(context => [context.id, context]))
  const documentBySourceRecordId = new Map(
    review.officialDocuments.flatMap(document =>
      document.sourceRecords.map(record => [record.id, document] as const)
    )
  )
  const result = new Map<SourceRecordId, Set<RulesContextId>>()
  records.forEach(record => {
    const document = documentBySourceRecordId.get(record.fact.sourceRecordId)
    if (!document) {
      throw new Error(`Official fact references an unknown source record: ${record.fact.sourceRecordId}`)
    }
    const applicable = document.rulesContextIds.filter(contextId => {
      const context = contextById.get(contextId)
      if (!context) return false
      if (record.fact.context === 'legends') return context.status === 'legends'
      if (record.fact.context === 'seasonal') return context.status === 'seasonal'
      return (
        context.mode === 'standard' &&
        (context.status === 'current' || context.status === 'seasonal' || context.status === 'historical')
      )
    })
    if (!applicable.length) {
      throw new Error(
        `Official fact ${record.fact.factChecksum} has no applicable rules context in its document`
      )
    }
    const current = result.get(record.fact.sourceRecordId) ?? new Set()
    applicable.forEach(contextId => current.add(contextId))
    result.set(record.fact.sourceRecordId, current)
  })
  return new Map(
    Array.from(result, ([sourceRecordId, contextIds]) => [sourceRecordId, Array.from(contextIds).sort()])
  )
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === 'object' && !Array.isArray(value)

const readJson = async (filePath: string): Promise<unknown> =>
  JSON.parse(await readFile(filePath, 'utf8')) as unknown

const collectGarbage = (): void => {
  const runtime = globalThis as typeof globalThis & { gc?: () => void }
  runtime.gc?.()
}

const loadManifest = async (filePath: string): Promise<ArtifactManifest> => {
  const value = await readJson(filePath)
  if (!isRecord(value) || value.schemaVersion !== 1 || !Array.isArray(value.artifacts)) {
    throw new Error(`Accepted manifest ${filePath} has an incompatible schema`)
  }
  const artifacts = value.artifacts.map((artifact, index) => {
    if (
      !isRecord(artifact) ||
      typeof artifact.requestUrl !== 'string' ||
      typeof artifact.finalUrl !== 'string' ||
      !Array.isArray(artifact.redirectChain) ||
      artifact.redirectChain.some(item => typeof item !== 'string') ||
      typeof artifact.retrievedAt !== 'string' ||
      typeof artifact.adapterVersion !== 'string' ||
      typeof artifact.mediaType !== 'string' ||
      typeof artifact.byteLength !== 'number' ||
      typeof artifact.checksum !== 'string'
    ) {
      throw new Error(`Accepted manifest artifact ${index + 1} is invalid`)
    }
    return artifact as unknown as ArtifactManifestEntry
  })
  return createArtifactManifest(artifacts)
}

const loadReview = async (filePath: string): Promise<CorpusReview> => {
  const value = await readJson(filePath)
  if (
    !isRecord(value) ||
    value.schemaVersion !== 1 ||
    typeof value.revision !== 'string' ||
    typeof value.generatedAt !== 'string' ||
    !isRecord(value.rulesContext) ||
    !Array.isArray(value.approvedFactionIds) ||
    !Array.isArray(value.decoderDiagnosticPolicies) ||
    !Array.isArray(value.normalizationDiagnosticPolicies) ||
    !Array.isArray(value.ignoredSourceRecords) ||
    !Array.isArray(value.timingOverrides) ||
    !Array.isArray(value.officialDocuments) ||
    (value.universalFactionContent !== undefined && !Array.isArray(value.universalFactionContent))
  ) {
    throw new Error(`Corpus review ${filePath} has an incompatible schema`)
  }
  return value as unknown as CorpusReview
}

const loadIdentities = async (filePath: string): Promise<IdentityRegistry> => {
  const value = await readJson(filePath)
  if (!isRecord(value) || value.schemaVersion !== 1 || !Array.isArray(value.entries)) {
    throw new Error(`Identity registry ${filePath} has an incompatible schema`)
  }
  return value as unknown as IdentityRegistry
}

const artifactForWahapediaFile = (
  manifest: ArtifactManifest,
  file: (typeof WAHAPEDIA_EXPORT_FILES)[number]
): ArtifactManifestEntry => {
  const matching = manifest.artifacts.filter(
    artifact =>
      artifact.adapterVersion === 'wahapedia-export/1' &&
      new URL(artifact.requestUrl).pathname.endsWith(`/${file}`)
  )
  if (matching.length !== 1) {
    throw new Error(`Accepted manifest must contain exactly one Wahapedia artifact for ${file}`)
  }
  return matching[0]
}

const loadWahapediaInputs = async (
  manifest: ArtifactManifest,
  cache: FileArtifactCache
): Promise<WahapediaExportInputs> => {
  const entries = await Promise.all(
    WAHAPEDIA_EXPORT_FILES.map(async file => {
      const artifact = artifactForWahapediaFile(manifest, file)
      const bytes = await cache.get(artifact.checksum)
      if (!bytes) {
        throw new Error(`Accepted artifact ${artifact.checksum} is missing from the local cache`)
      }
      assertArtifactChecksum(bytes, artifact.checksum, 'cache-corrupt')
      if (bytes.byteLength !== artifact.byteLength) {
        throw new Error(`Accepted artifact ${artifact.checksum} has an unexpected byte length`)
      }
      return [file, { bytes, artifact }] as const
    })
  )
  return Object.fromEntries(entries) as WahapediaExportInputs
}

const verifyAcceptedArtifacts = async (
  manifest: ArtifactManifest,
  cache: FileArtifactCache
): Promise<void> => {
  for (const artifact of manifest.artifacts) {
    const bytes = await cache.get(artifact.checksum)
    if (!bytes) {
      throw new Error(`Accepted artifact ${artifact.checksum} is missing from the local cache`)
    }
    assertArtifactChecksum(bytes, artifact.checksum, 'cache-corrupt')
    if (bytes.byteLength !== artifact.byteLength) {
      throw new Error(`Accepted artifact ${artifact.checksum} has an unexpected byte length`)
    }
  }
}

const validateOfficialDocuments = (manifest: ArtifactManifest, review: CorpusReview): void => {
  const acceptedByChecksum = new Map(manifest.artifacts.map(artifact => [artifact.checksum, artifact]))
  const acceptedRulesContextIds = new Set([
    review.rulesContext.id,
    ...(review.additionalRulesContexts ?? []).map(context => context.id),
  ])
  review.officialDocuments.forEach(document => {
    const accepted = acceptedByChecksum.get(document.artifact.checksum)
    const reviewed = document.artifact
    if (
      !accepted ||
      accepted.requestUrl !== reviewed.requestUrl ||
      accepted.finalUrl !== reviewed.finalUrl ||
      accepted.redirectChain.join('|') !== reviewed.redirectChain.join('|') ||
      accepted.retrievedAt !== reviewed.retrievedAt ||
      accepted.adapterVersion !== 'games-workshop-pdf/1' ||
      accepted.mediaType !== reviewed.mediaType ||
      accepted.byteLength !== reviewed.byteLength ||
      accepted.checksum !== reviewed.checksum ||
      accepted.etag !== reviewed.etag ||
      accepted.lastModified !== reviewed.lastModified
    ) {
      throw new Error(`Official document ${document.title} is not pinned in the accepted manifest`)
    }
    if (
      !Array.isArray(document.rulesContextIds) ||
      !document.rulesContextIds.length ||
      new Set(document.rulesContextIds).size !== document.rulesContextIds.length ||
      document.rulesContextIds.some(contextId => !acceptedRulesContextIds.has(contextId))
    ) {
      throw new Error(`Official document ${document.title} has invalid reviewed rules contexts`)
    }
  })
  const reviewedChecksums = new Set(review.officialDocuments.map(document => document.artifact.checksum))
  const unreviewed = manifest.artifacts.filter(
    artifact =>
      artifact.adapterVersion === 'games-workshop-pdf/1' && !reviewedChecksums.has(artifact.checksum)
  )
  if (unreviewed.length) {
    throw new Error(
      `Accepted official artifacts are missing review metadata: ${unreviewed
        .map(artifact => artifact.checksum)
        .join(', ')}`
    )
  }
}

const validateCommunityWarscrollSources = (manifest: ArtifactManifest, review: CorpusReview): void => {
  const acceptedByChecksum = new Map(manifest.artifacts.map(artifact => [artifact.checksum, artifact]))
  const sources = review.communityWarscrollSources ?? []
  sources.forEach(source => {
    const accepted = acceptedByChecksum.get(source.artifact.checksum)
    const reviewed = source.artifact
    if (
      !accepted ||
      accepted.requestUrl !== reviewed.requestUrl ||
      accepted.finalUrl !== reviewed.finalUrl ||
      accepted.redirectChain.join('|') !== reviewed.redirectChain.join('|') ||
      accepted.retrievedAt !== reviewed.retrievedAt ||
      accepted.adapterVersion !== BSDATA_ADAPTER_VERSION ||
      accepted.mediaType !== reviewed.mediaType ||
      accepted.byteLength !== reviewed.byteLength ||
      accepted.checksum !== reviewed.checksum
    ) {
      throw new Error(`Community warscroll source ${source.title} is not pinned in the accepted manifest`)
    }
  })
  const reviewedChecksums = new Set(sources.map(source => source.artifact.checksum))
  const unreviewed = manifest.artifacts.filter(
    artifact =>
      artifact.adapterVersion === BSDATA_ADAPTER_VERSION && !reviewedChecksums.has(artifact.checksum)
  )
  if (unreviewed.length) {
    throw new Error(
      `Accepted community artifacts are missing review metadata: ${unreviewed
        .map(artifact => artifact.checksum)
        .join(', ')}`
    )
  }
}

const extractCommunityWarscrollFacts = async (
  review: CorpusReview,
  cache: FileArtifactCache
): Promise<BsDataCommunitySourceInput[]> => {
  const inputs: BsDataCommunitySourceInput[] = []
  for (const source of review.communityWarscrollSources ?? []) {
    const bytes = await cache.get(source.artifact.checksum)
    if (!bytes) throw new Error(`Community artifact ${source.artifact.checksum} is missing`)
    const extracted = extractBsDataWarscrolls(
      bytes,
      source.artifact.checksum,
      source.units.map(unit => unit.name)
    )
    const errors = extracted.diagnostics.filter(diagnostic => diagnostic.severity === 'error')
    if (errors.length) {
      throw new Error(
        `Community warscroll extraction failed for ${source.title}:\n${errors
          .map(diagnostic => `- ${diagnostic.code}: ${diagnostic.message}`)
          .join('\n')}`
      )
    }
    // A community fact enters generation only when its reviewed section and checksum both pin the
    // extracted content exactly; a drifted transcription must fail closed, never silently update.
    source.units.forEach(unit => {
      const fact = extracted.facts.find(candidate => candidate.name === unit.name)
      if (!fact || fact.section !== unit.section || fact.factChecksum !== unit.recordChecksum) {
        throw new Error(
          `Community warscroll ${unit.name} no longer matches its reviewed section or checksum ` +
            `(${fact ? `${fact.section} ${fact.factChecksum}` : 'not extracted'})`
        )
      }
    })
    inputs.push({
      artifact: source.artifact,
      repository: source.repository,
      facts: extracted.facts,
      officialSourceRecordIds: source.officialSourceRecordIds,
    })
  }
  return inputs
}

const extractCommunityFactionOptionFacts = async (
  review: CorpusReview,
  cache: FileArtifactCache
): Promise<BsDataFactionOptionSourceInput[]> => {
  const inputs: BsDataFactionOptionSourceInput[] = []
  for (const source of review.communityWarscrollSources ?? []) {
    const options = source.factionOptions ?? []
    if (!options.length) continue
    const bytes = await cache.get(source.artifact.checksum)
    if (!bytes) throw new Error(`Community artifact ${source.artifact.checksum} is missing`)
    const extracted = extractBsDataFactionOptions(
      bytes,
      source.artifact.checksum,
      options.map(option => ({
        name: option.name,
        optionType: option.optionType,
        groupName: option.groupName,
        ...(option.faction ? { faction: option.faction } : {}),
        ...(option.typeSourceRecordId ? { typeSourceRecordId: option.typeSourceRecordId } : {}),
      }))
    )
    const errors = extracted.diagnostics.filter(diagnostic => diagnostic.severity === 'error')
    if (errors.length) {
      throw new Error(
        `Community faction-option extraction failed for ${source.title}:\n${errors
          .map(diagnostic => `- ${diagnostic.code}: ${diagnostic.message}`)
          .join('\n')}`
      )
    }
    // A community fact enters generation only when its reviewed section and checksum both pin the
    // extracted content exactly; a drifted transcription must fail closed, never silently update.
    options.forEach(option => {
      const fact = extracted.facts.find(candidate => candidate.name === option.name)
      if (!fact || fact.section !== option.section || fact.factChecksum !== option.recordChecksum) {
        throw new Error(
          `Community faction option ${option.name} no longer matches its reviewed section or checksum ` +
            `(${fact ? `${fact.section} ${fact.factChecksum}` : 'not extracted'})`
        )
      }
    })
    inputs.push({
      artifact: source.artifact,
      repository: source.repository,
      facts: extracted.facts,
      officialSourceRecordIds: source.officialSourceRecordIds,
    })
  }
  return inputs
}

const loadWahapediaHtmlPages = async (
  manifest: ArtifactManifest,
  review: CorpusReview,
  cache: FileArtifactCache
): Promise<{
  warscrolls: WahapediaHtmlWarscrollRecord[]
  factions: WahapediaHtmlFactionPageRecord[]
  rules: WahapediaHtmlRulesPageRecord[]
}> => {
  const artifacts = manifest.artifacts.filter(artifact => artifact.adapterVersion === 'wahapedia-html/1')
  const expected = review.currentWahapediaHtml?.expectedArtifacts ?? 0
  if (artifacts.length !== expected) {
    throw new Error(
      `Accepted Wahapedia HTML artifact count ${artifacts.length} does not match reviewed count ${expected}`
    )
  }
  const factionArtifacts = artifacts.filter(artifact =>
    /^\/aos4\/factions\/[^/]+\/$/i.test(new URL(artifact.finalUrl).pathname)
  )
  const expectedFactionArtifacts = review.currentWahapediaHtml?.expectedFactionArtifacts ?? 0
  if (factionArtifacts.length !== expectedFactionArtifacts) {
    throw new Error(
      `Accepted Wahapedia faction artifact count ${factionArtifacts.length} does not match reviewed count ${expectedFactionArtifacts}`
    )
  }
  const collectionArtifacts = artifacts.filter(artifact =>
    new URL(artifact.finalUrl).pathname.endsWith('/warscrolls.html')
  )
  const expectedCollectionArtifacts = review.currentWahapediaHtml?.expectedCollectionArtifacts ?? 0
  if (collectionArtifacts.length !== expectedCollectionArtifacts) {
    throw new Error(
      `Accepted Wahapedia collection artifact count ${collectionArtifacts.length} does not match reviewed count ${expectedCollectionArtifacts}`
    )
  }
  const rulesArtifacts = artifacts.filter(artifact =>
    /^\/aos4\/the-rules\/[^/]+\/$/i.test(new URL(artifact.finalUrl).pathname)
  )
  const expectedRulesArtifacts = review.currentWahapediaHtml?.expectedRulesArtifacts ?? 0
  if (rulesArtifacts.length !== expectedRulesArtifacts) {
    throw new Error(
      `Accepted Wahapedia rules artifact count ${rulesArtifacts.length} does not match reviewed count ${expectedRulesArtifacts}`
    )
  }
  const pages: WahapediaHtmlWarscrollRecord[] = []
  const factions: WahapediaHtmlFactionPageRecord[] = []
  const rules: WahapediaHtmlRulesPageRecord[] = []
  let factionRootWarscrolls = 0
  let warningCount = 0
  const wahapediaPageUrls = artifacts.map(artifact => artifact.finalUrl)
  const adoptionsByUrl = new Map<string, Array<{ name: string; reason: string }>>()
  ;(review.currentWahapediaHtml?.adoptedWarscrolls ?? []).forEach(adoption => {
    if (!adoption.name.trim() || !adoption.reason.trim() || !adoption.officialSourceRecordIds.length) {
      throw new Error(`Adopted warscroll review entry for ${adoption.url} is malformed`)
    }
    adoptionsByUrl.set(adoption.url, [
      ...(adoptionsByUrl.get(adoption.url) ?? []),
      { name: adoption.name, reason: adoption.reason },
    ])
  })
  for (const artifact of artifacts) {
    const bytes = await cache.get(artifact.checksum)
    if (!bytes) throw new Error(`Wahapedia HTML artifact ${artifact.checksum} is missing`)
    const isFactionPage = /^\/aos4\/factions\/[^/]+\/$/i.test(new URL(artifact.finalUrl).pathname)
    const isCollectionPage = new URL(artifact.finalUrl).pathname.endsWith('/warscrolls.html')
    const isRulesPage = /^\/aos4\/the-rules\/[^/]+\/$/i.test(new URL(artifact.finalUrl).pathname)
    const factionPage = isFactionPage ? parseWahapediaFactionHtml({ bytes, artifact }) : undefined
    const rulesPage = isRulesPage ? parseWahapediaRulesHtml({ bytes, artifact }) : undefined
    const collectionPage = isCollectionPage
      ? parseWahapediaWarscrollCollectionHtml({ bytes, artifact })
      : undefined
    const warscrollPage =
      !isFactionPage && !isCollectionPage && !isRulesPage
        ? parseWahapediaWarscrollHtml({ bytes, artifact })
        : undefined
    const factionRoot = isFactionPage
      ? parseWahapediaFactionRootWarscrollsHtml(
          { bytes, artifact },
          factionRootWarscrollScope(artifact.finalUrl, wahapediaPageUrls)
        )
      : undefined
    const diagnostics = [
      ...(factionPage?.diagnostics ?? []),
      ...(rulesPage?.diagnostics ?? []),
      ...(collectionPage?.diagnostics ?? []),
      ...(warscrollPage?.diagnostics ?? []),
      ...(factionRoot?.diagnostics ?? []),
    ]
    warningCount += diagnostics.filter(diagnostic => diagnostic.severity === 'warning').length
    const adoptions = isCollectionPage ? (adoptionsByUrl.get(artifact.finalUrl) ?? []) : []
    const parsedPages = collectionPage
      ? filterNativeWahapediaFactionWarscrolls(
          collectionPage.pages,
          new Set(adoptions.map(adoption => adoption.name))
        )
      : []
    // An adoption must keep matching exactly one datasheet the native filter would otherwise drop;
    // a stale entry (renamed, removed, or now keyed native) fails closed for review.
    adoptions.forEach(adoption => {
      const withoutAdoptions = collectionPage
        ? filterNativeWahapediaFactionWarscrolls(collectionPage.pages)
        : []
      const adopted = parsedPages.filter(
        page => page.recordKind === 'warscroll' && page.name === adoption.name
      )
      if (
        adopted.length !== 1 ||
        withoutAdoptions.some(page => page.recordKind === 'warscroll' && page.name === adoption.name)
      ) {
        throw new Error(
          `Adopted warscroll ${adoption.name} no longer matches exactly one non-native datasheet on ${artifact.finalUrl}`
        )
      }
    })
    if (
      (isFactionPage && !factionPage?.page) ||
      (isRulesPage && !rulesPage?.page) ||
      (!isFactionPage && !isCollectionPage && !isRulesPage && !warscrollPage?.page) ||
      (isCollectionPage && !parsedPages.length) ||
      diagnostics.some(diagnostic => diagnostic.severity === 'error')
    ) {
      throw new Error(
        `Wahapedia HTML parsing failed for ${artifact.finalUrl}: ${diagnostics
          .map(diagnostic => `${diagnostic.code}: ${diagnostic.message}`)
          .join('; ')}`
      )
    }
    if (isFactionPage) {
      factions.push(factionPage!.page!)
      pages.push(...(factionRoot?.pages ?? []))
      factionRootWarscrolls += factionRoot?.pages.filter(page => page.recordKind === 'warscroll').length ?? 0
    } else if (isRulesPage) {
      rules.push(rulesPage!.page!)
    } else if (isCollectionPage) {
      pages.push(...parsedPages)
    } else {
      pages.push(warscrollPage!.page!)
    }
    collectGarbage()
  }
  const reviewedHtml = review.currentWahapediaHtml
  const warscrolls = pages.filter(page => page.recordKind === 'warscroll').length
  const checks = [
    ['warscrolls', warscrolls, reviewedHtml?.expectedWarscrolls],
    ['faction-root warscrolls', factionRootWarscrolls, reviewedHtml?.expectedFactionRootWarscrolls],
    [
      'faction groups',
      factions.reduce((sum, page) => sum + page.groups.length, 0),
      reviewedHtml?.expectedFactionGroups,
    ],
    [
      'faction abilities',
      factions.reduce((sum, page) => sum + page.abilities.length, 0),
      reviewedHtml?.expectedFactionAbilities,
    ],
    [
      'rules groups',
      rules.reduce((sum, page) => sum + page.groups.length, 0),
      reviewedHtml?.expectedRulesGroups,
    ],
    [
      'rules abilities',
      rules.reduce((sum, page) => sum + page.abilities.length, 0),
      reviewedHtml?.expectedRulesAbilities,
    ],
    ['warnings', warningCount, reviewedHtml?.expectedWarnings],
  ] as const
  checks.forEach(([label, actual, expectedCount]) => {
    if (expectedCount !== undefined && actual !== expectedCount) {
      throw new Error(
        `Accepted Wahapedia ${label} count ${actual} does not match reviewed count ${expectedCount}`
      )
    }
  })
  return { warscrolls: pages, factions, rules }
}

const extractOfficialBattleProfileFacts = async (
  review: CorpusReview,
  cache: FileArtifactCache
): Promise<{
  effective: GamesWorkshopBattleProfileFact[]
  reviewed: ReviewedOfficialBattleProfileFact[]
}> => {
  const supplementFactions = new Set(
    review.officialDocuments
      .filter(document => document.documentKind === 'battle-profile-supplement')
      .map(document => document.faction)
      .filter((faction): faction is string => Boolean(faction))
  )
  const effective: GamesWorkshopBattleProfileFact[] = []
  const reviewed: ReviewedOfficialBattleProfileFact[] = []
  for (const document of review.officialDocuments) {
    if (
      document.documentKind !== 'battle-profiles' &&
      document.documentKind !== 'battle-profile-supplement'
    ) {
      continue
    }
    const bytes = await cache.get(document.artifact.checksum)
    if (!bytes) throw new Error(`Official artifact ${document.artifact.checksum} is missing`)
    const extracted =
      document.documentKind === 'battle-profiles'
        ? await extractGamesWorkshopBattleProfiles(bytes, document.artifact.checksum)
        : await extractGamesWorkshopBattleProfileSupplement(
            bytes,
            document.artifact.checksum,
            document.faction ?? ''
          )
    if (extracted.diagnostics.some(diagnostic => diagnostic.severity === 'error')) {
      throw new Error(`Battle-profile extraction failed for ${document.title}`)
    }
    extracted.facts.forEach(fact => {
      const superseded =
        document.documentKind === 'battle-profiles' &&
        fact.kind !== 'regiment-of-renown' &&
        supplementFactions.has(fact.faction)
      reviewed.push({
        artifactChecksum: document.artifact.checksum,
        documentTitle: document.title,
        status: superseded ? 'superseded' : 'effective',
        fact,
      })
      if (!superseded) effective.push(fact)
    })
  }
  return { effective, reviewed }
}

const validateOfficialEvidence = async (
  review: CorpusReview,
  cache: FileArtifactCache
): Promise<Map<string, string>> => {
  const pageTextBySourceRecordId = new Map<string, string>()
  for (const document of review.officialDocuments) {
    const bytes = await cache.get(document.artifact.checksum)
    if (!bytes) {
      throw new Error(`Official artifact ${document.artifact.checksum} is missing from the cache`)
    }
    const extraction = await extractGamesWorkshopPdfText(
      {
        bytes,
        artifact: document.artifact,
        download: {
          externalId: `sha256:${document.artifact.checksum}`,
          title: document.title,
          url: document.artifact.finalUrl,
          categories: [],
          gameSystems: ['warhammer-age-of-sigmar'],
          topics: [],
          discoveryMethod: 'page-link',
        },
      },
      {
        maxPages: 400,
        maxTextBytes: 32 * 1024 * 1024,
        timeoutMs: 120_000,
      }
    )
    if (!extraction.document || extraction.diagnostics.some(diagnostic => diagnostic.severity === 'error')) {
      throw new Error(`Official evidence extraction failed for ${document.title}`)
    }
    const extractedById = new Map(extraction.document.sourceRecords.map(record => [record.id, record]))
    const pageTextByPage = new Map(extraction.document.pages.map(page => [page.page, page.text]))
    document.sourceRecords.forEach(reviewedRecord => {
      const extracted = extractedById.get(reviewedRecord.id)
      if (
        !extracted ||
        extracted.recordChecksum !== reviewedRecord.recordChecksum ||
        extracted.locator.kind !== 'page' ||
        extracted.locator.page !== reviewedRecord.page
      ) {
        throw new Error(`Official evidence record ${reviewedRecord.id} no longer matches ${document.title}`)
      }
      pageTextBySourceRecordId.set(reviewedRecord.id, pageTextByPage.get(reviewedRecord.page) ?? '')
    })
  }
  return pageTextBySourceRecordId
}

const checksum = (value: string): string => artifactChecksum(new TextEncoder().encode(value))

const validateReviewedReconciliation = (
  review: CorpusReview,
  reconciliation: WahapediaHtmlReconciliation
): void => {
  const expected = review.currentWahapediaHtml?.reconciliation
  if (!expected) {
    throw new Error('Current Wahapedia HTML requires a reviewed reconciliation gate')
  }
  const actual = {
    checksum: checksum(stableJson(reconciliation)),
    expectedPages: reconciliation.pages,
    expectedMatchedOfficialUnitFacts: reconciliation.matchedOfficialUnitFacts,
    expectedUnmatchedOfficialUnitFacts: reconciliation.unmatchedOfficialUnitFacts.length,
    expectedDiscrepancies: reconciliation.discrepancies.length,
  }
  const mismatches = Object.entries(actual).filter(
    ([key, value]) => expected[key as keyof typeof expected] !== value
  )
  if (mismatches.length) {
    throw new Error(
      `Wahapedia/official reconciliation has changed: ${mismatches
        .map(([key, value]) => `${key}=${value} (reviewed ${expected[key as keyof typeof expected]})`)
        .join(', ')}`
    )
  }
}

const ensureNoErrors = (
  label: string,
  issues: Array<{ severity?: string; code: string; subject: string; message: string }>
): void => {
  const errors = issues.filter(issue => issue.severity === undefined || issue.severity === 'error')
  if (!errors.length) return
  throw new Error(
    `${label} failed:\n${errors
      .map(issue => `- ${issue.code} ${issue.subject}: ${issue.message}`)
      .join('\n')}`
  )
}

const writeProduct = async (product: GeneratedProduct): Promise<void> => {
  await mkdir(path.dirname(product.path), { recursive: true })
  await writeFile(product.path, product.bytes, 'utf8')
}

const verifyProduct = async (product: GeneratedProduct): Promise<void> => {
  let current: string
  try {
    current = await readFile(product.path, 'utf8')
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      throw new Error(`Generated product is missing: ${product.path}`)
    }
    throw error
  }
  // Git's text checkout may materialize committed LF JSON as CRLF on Windows.
  // Product checksums and semantic generation remain LF-normalized.
  if (current.replaceAll('\r\n', '\n') !== product.bytes) {
    throw new Error(`Generated product has drifted: ${product.path}`)
  }
}

const nextValue = (arguments_: string[], index: number, flag: string): string => {
  const value = arguments_[index + 1]
  if (!value || value.startsWith('--')) throw new Error(`${flag} requires a value`)
  return value
}

export const parseCorpusCommandArguments = (arguments_: string[]): CorpusCommandArguments => {
  const parsed: CorpusCommandArguments = {
    acceptedManifestPath: DEFAULT_ACCEPTED_MANIFEST,
    reviewPath: DEFAULT_REVIEW,
    identitiesPath: DEFAULT_IDENTITIES,
    auditCatalogPath: DEFAULT_AUDIT_CATALOG,
    officialBattleProfilesPath: DEFAULT_OFFICIAL_BATTLE_PROFILES,
    runtimePath: DEFAULT_RUNTIME,
    defaultsPath: DEFAULT_DEFAULTS,
    reportPath: DEFAULT_REPORT,
    reconciliationPath: DEFAULT_RECONCILIATION,
    profileOnlyDeviationsPath: DEFAULT_PROFILE_ONLY_DEVIATIONS,
    cacheDirectory: DEFAULT_CACHE,
    initializeIdentities: false,
    candidate: false,
    write: false,
  }
  const valueFlags: Record<string, keyof CorpusCommandArguments> = {
    '--accepted-manifest': 'acceptedManifestPath',
    '--review': 'reviewPath',
    '--identities': 'identitiesPath',
    '--audit-catalog': 'auditCatalogPath',
    '--official-battle-profiles': 'officialBattleProfilesPath',
    '--runtime': 'runtimePath',
    '--defaults': 'defaultsPath',
    '--report': 'reportPath',
    '--reconciliation': 'reconciliationPath',
    '--profile-only-deviations': 'profileOnlyDeviationsPath',
    '--cache': 'cacheDirectory',
  }
  for (let index = 0; index < arguments_.length; index += 1) {
    const argument = arguments_[index]
    if (argument === '--initialize-identities') {
      parsed.initializeIdentities = true
    } else if (argument === '--candidate') {
      parsed.candidate = true
    } else if (argument === '--write') {
      parsed.write = true
    } else if (valueFlags[argument]) {
      const key = valueFlags[argument]
      parsed[key] = nextValue(arguments_, index, argument) as never
      index += 1
    } else {
      throw new Error(`Unknown argument: ${argument}`)
    }
  }
  return parsed
}

export const generateCorpusProducts = async (
  arguments_: CorpusCommandArguments
): Promise<GeneratedProduct[]> => {
  const { review, decoded, officialBattleProfiles, reconciliation } =
    await loadAcceptedCorpusSourceData(arguments_)
  // The official-first intake gate (#1820): every profile-only official unit fact needs a
  // reviewed deviation with a rationale and target date, or generation fails closed.
  const profileOnlyLedger = await loadProfileOnlyDeviationLedger(arguments_.profileOnlyDeviationsPath)
  ensureNoErrors(
    'Official-first intake gate',
    profileOnlyGateIssues(
      reconciliation.unmatchedOfficialUnitFacts,
      profileOnlyLedger,
      review.officialDocuments
    )
  )
  const identities = arguments_.initializeIdentities
    ? createCorpusIdentityRegistry(decoded.dataset, review)
    : await loadIdentities(arguments_.identitiesPath)
  ensureNoErrors(
    'Identity registry validation',
    validateIdentityRegistry(identities).map(issue => ({ ...issue }))
  )
  const generated = buildAos4Corpus(
    decoded,
    identities,
    review,
    officialSourceRecordContexts(review, officialBattleProfiles.reviewed)
  )
  ensureNoErrors('Corpus review', generated.diagnostics)
  const entityById = new Map(generated.catalog.entities.map(entity => [entity.id, entity]))
  ensureNoErrors(
    'Catalog validation',
    validateCatalog(generated.catalog).map(issue => {
      const entity = entityById.get(issue.subject as never)
      return {
        ...issue,
        message: entity
          ? `${issue.message} (${entity.name}; ${entity.sourceRefs
              .map(reference => reference.sourceRecordId)
              .join(', ')})`
          : issue.message,
      }
    })
  )
  const integrity = validateGenerationIntegrity(generated.catalog, generated.dispositions)
  ensureNoErrors(
    'Generation integrity',
    integrity.issues.map(issue => {
      const entity = entityById.get(issue.subject as never)
      return {
        ...issue,
        message: entity
          ? `${issue.message} (${entity.name}; ${entity.sourceRefs
              .map(reference => reference.sourceRecordId)
              .join(', ')})`
          : issue.message,
      }
    })
  )
  const auditCatalog = serializeAuditCatalog(generated.catalog)
  const officialBattleProfileCatalog = stableJson(
    createOfficialBattleProfileCatalog(officialBattleProfiles.reviewed, reconciliation, review.generatedAt)
  )
  const runtime = serializeRuntimeProjection(
    createRuntimeProjection(generated.catalog, generated.summary.attribution)
  )
  const defaultFaction = generated.catalog.entities.find(
    entity => entity.kind === 'faction' && entity.name === 'Stormcast Eternals'
  )
  if (!defaultFaction) throw new Error('Stormcast Eternals is missing from the accepted corpus')
  const defaults = stableJson({
    schemaVersion: 1,
    rulesContextId: review.defaultRulesContextId ?? review.rulesContext.id,
    defaultFactionId: defaultFaction.id,
  })
  const reportWithoutProducts = {
    schemaVersion: 1,
    status: generated.summary.status,
    generatedAt: review.generatedAt,
    acceptedManifest: arguments_.acceptedManifestPath.replaceAll('\\', '/'),
    review: arguments_.reviewPath.replaceAll('\\', '/'),
    identities: arguments_.identitiesPath.replaceAll('\\', '/'),
    summary: generated.summary,
    sourceDiagnostics: {
      reviewed: decoded.diagnostics.length,
      byCode: Object.fromEntries(
        Array.from(
          decoded.diagnostics.reduce((counts, diagnostic) => {
            counts.set(diagnostic.code, (counts.get(diagnostic.code) ?? 0) + 1)
            return counts
          }, new Map<string, number>())
        ).sort(([left], [right]) => left.localeCompare(right))
      ),
    },
    integrity: {
      consumedSourceRecords: integrity.consumedSourceRecordIds.length,
      dispositions: generated.dispositions,
      supersededSourceRecords: generated.supersededSourceRecords,
      issues: integrity.issues,
    },
  }
  const products = [
    {
      path: arguments_.identitiesPath,
      bytes: stableJson(identities),
    },
    { path: arguments_.auditCatalogPath, bytes: auditCatalog },
    {
      path: arguments_.officialBattleProfilesPath,
      bytes: officialBattleProfileCatalog,
    },
    { path: arguments_.runtimePath, bytes: runtime },
    { path: arguments_.defaultsPath, bytes: defaults },
    {
      path: arguments_.reconciliationPath,
      bytes: stableJson(reconciliation),
    },
  ]
  const report = stableJson({
    ...reportWithoutProducts,
    products: Object.fromEntries(
      products.map(product => [
        product.path.replaceAll('\\', '/'),
        { checksum: checksum(product.bytes), byteLength: new TextEncoder().encode(product.bytes).byteLength },
      ])
    ),
  })
  return [...products, { path: arguments_.reportPath, bytes: report }]
}

export const loadAcceptedCorpusSourceData = async (
  arguments_: AcceptedCorpusSourceArguments
): Promise<AcceptedCorpusSourceData> => {
  const [manifest, review] = await Promise.all([
    loadManifest(arguments_.acceptedManifestPath),
    loadReview(arguments_.reviewPath),
  ])
  validateOfficialDocuments(manifest, review)
  validateCommunityWarscrollSources(manifest, review)
  const cache = new FileArtifactCache(arguments_.cacheDirectory)
  await verifyAcceptedArtifacts(manifest, cache)
  const officialPageTextBySourceRecordId = await validateOfficialEvidence(review, cache)
  const decoded = decodeWahapediaExports(await loadWahapediaInputs(manifest, cache))
  const officialBattleProfiles = await extractOfficialBattleProfileFacts(review, cache)
  const communitySources = await extractCommunityWarscrollFacts(review, cache)
  const communityOptionSources = await extractCommunityFactionOptionFacts(review, cache)
  collectGarbage()
  const wahapediaHtml = await loadWahapediaHtmlPages(manifest, review, cache)
  collectGarbage()
  const merged = mergeCurrentWahapediaWarscrollPages(
    decoded.dataset,
    wahapediaHtml.warscrolls,
    officialBattleProfiles.effective,
    wahapediaHtml.factions,
    wahapediaHtml.rules,
    review.currentWahapediaHtml?.rulesPages ?? []
  )
  const communityMerged = mergeBsDataWarscrolls(
    merged.dataset,
    merged.reconciliation,
    communitySources,
    officialBattleProfiles.effective
  )
  const communityOptionsMerged = mergeBsDataFactionOptions(
    communityMerged.dataset,
    communityMerged.reconciliation,
    communityOptionSources,
    officialBattleProfiles.effective
  )
  validateReviewedReconciliation(review, communityOptionsMerged.reconciliation)
  return {
    manifest,
    review,
    acceptedDecoded: decoded,
    decoded: { ...decoded, dataset: communityOptionsMerged.dataset },
    officialBattleProfiles,
    reconciliation: communityOptionsMerged.reconciliation,
    officialPageTextBySourceRecordId,
  }
}

const run = async (): Promise<void> => {
  const arguments_ = parseCorpusCommandArguments(process.argv.slice(2))
  const hasBetaReadiness = await access(DEFAULT_BETA_READINESS)
    .then(() => true)
    .catch(() => false)
  assertCorpusWriteWorkflow(arguments_)
  const products = await generateCorpusProducts(arguments_)
  if (arguments_.write) {
    await Promise.all(products.map(writeProduct))
    products.forEach(product => console.log(`Wrote ${product.path} (${checksum(product.bytes)})`))
  } else {
    await Promise.all(products.map(verifyProduct))
    products.forEach(product => console.log(`Verified ${product.path} (${checksum(product.bytes)})`))
  }
  await assertAcceptedCorpusBetaReadiness(hasBetaReadiness, arguments_.candidate, () =>
    runCertificationCheck({
      currentPath: DEFAULT_BETA_READINESS,
      full: false,
      writeSummary: false,
    })
  )
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  run().catch(error => {
    console.error(error)
    process.exitCode = 1
  })
}
