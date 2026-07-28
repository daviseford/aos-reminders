import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  FileArtifactCache,
  artifactChecksum,
  assertArtifactChecksum,
  createArtifactManifest,
  extractGamesWorkshopBattleProfileSupplement,
  extractGamesWorkshopBattleProfiles,
  extractGamesWorkshopPdfText,
  filterNativeWahapediaFactionWarscrolls,
  mergeCurrentWahapediaWarscrollPages,
  parseWahapediaFactionHtml,
  parseWahapediaSpearheadWarscrollsHtml,
  parseWahapediaWarscrollCollectionHtml,
  parseWahapediaWarscrollHtml,
  type ArtifactManifest,
  type ArtifactManifestEntry,
  type GamesWorkshopBattleProfileFact,
  type WahapediaHtmlFactionPageRecord,
  type WahapediaHtmlReconciliation,
  type WahapediaHtmlWarscrollRecord,
} from '../data'
import { WAHAPEDIA_EXPORT_FILES, decodeWahapediaExports, type WahapediaExportInputs } from '../data/wahapedia'
import { validateCatalog } from '../domain'
import { buildAos4Corpus, createCorpusIdentityRegistry, type CorpusReview } from './corpus'
import { validateIdentityRegistry, type IdentityRegistry } from './identityRegistry'
import { validateGenerationIntegrity } from './integrity'
import {
  createOfficialBattleProfileCatalog,
  type ReviewedOfficialBattleProfileFact,
} from './officialBattleProfiles'
import { createRuntimeProjection, serializeRuntimeProjection } from './runtimeProjection'
import { serializeAuditCatalog, stableJson } from './serialization'

const DEFAULT_ACCEPTED_MANIFEST = path.join('data', 'aos4', 'manifests', 'accepted-2026-07-27.json')
const DEFAULT_REVIEW = path.join('data', 'aos4', 'reviews', 'corpus-2026-07-27.json')
const DEFAULT_IDENTITIES = path.join('data', 'aos4', 'identities', 'corpus.json')
const DEFAULT_AUDIT_CATALOG = path.join('data', 'aos4', 'catalog', 'catalog.json')
const DEFAULT_OFFICIAL_BATTLE_PROFILES = path.join('data', 'aos4', 'catalog', 'official-battle-profiles.json')
const DEFAULT_RUNTIME = path.join('src', 'aos4', 'generated', 'corpus', 'runtime.json')
const DEFAULT_DEFAULTS = path.join('src', 'aos4', 'generated', 'corpus', 'defaults.json')
const DEFAULT_REPORT = path.join('data', 'aos4', 'reports', 'corpus-2026-07-27-summary.json')
const DEFAULT_RECONCILIATION = path.join('data', 'aos4', 'reports', 'corpus-2026-07-27-reconciliation.json')
const DEFAULT_CACHE = path.join('.cache', 'aos4', 'artifacts')

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
  cacheDirectory: string
  initializeIdentities: boolean
  write: boolean
}

interface GeneratedProduct {
  path: string
  bytes: string
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
    !Array.isArray(value.officialDocuments)
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

const loadWahapediaHtmlPages = async (
  manifest: ArtifactManifest,
  review: CorpusReview,
  cache: FileArtifactCache
): Promise<{
  warscrolls: WahapediaHtmlWarscrollRecord[]
  factions: WahapediaHtmlFactionPageRecord[]
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
  const pages: WahapediaHtmlWarscrollRecord[] = []
  const factions: WahapediaHtmlFactionPageRecord[] = []
  let spearheadWarscrolls = 0
  let warningCount = 0
  for (const artifact of artifacts) {
    const bytes = await cache.get(artifact.checksum)
    if (!bytes) throw new Error(`Wahapedia HTML artifact ${artifact.checksum} is missing`)
    const isFactionPage = /^\/aos4\/factions\/[^/]+\/$/i.test(new URL(artifact.finalUrl).pathname)
    const isCollectionPage = new URL(artifact.finalUrl).pathname.endsWith('/warscrolls.html')
    const factionPage = isFactionPage ? parseWahapediaFactionHtml({ bytes, artifact }) : undefined
    const collectionPage = isCollectionPage
      ? parseWahapediaWarscrollCollectionHtml({ bytes, artifact })
      : undefined
    const warscrollPage =
      !isFactionPage && !isCollectionPage ? parseWahapediaWarscrollHtml({ bytes, artifact }) : undefined
    const spearhead = isFactionPage ? parseWahapediaSpearheadWarscrollsHtml({ bytes, artifact }) : undefined
    const diagnostics = [
      ...(factionPage?.diagnostics ?? []),
      ...(collectionPage?.diagnostics ?? []),
      ...(warscrollPage?.diagnostics ?? []),
      ...(spearhead?.diagnostics ?? []),
    ]
    warningCount += diagnostics.filter(diagnostic => diagnostic.severity === 'warning').length
    const parsedPages = collectionPage ? filterNativeWahapediaFactionWarscrolls(collectionPage.pages) : []
    if (
      (isFactionPage && !factionPage?.page) ||
      (!isFactionPage && !isCollectionPage && !warscrollPage?.page) ||
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
      pages.push(...(spearhead?.pages ?? []))
      spearheadWarscrolls += spearhead?.pages.filter(page => page.recordKind === 'warscroll').length ?? 0
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
    ['Spearhead warscrolls', spearheadWarscrolls, reviewedHtml?.expectedSpearheadWarscrolls],
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
    ['warnings', warningCount, reviewedHtml?.expectedWarnings],
  ] as const
  checks.forEach(([label, actual, expectedCount]) => {
    if (expectedCount !== undefined && actual !== expectedCount) {
      throw new Error(
        `Accepted Wahapedia ${label} count ${actual} does not match reviewed count ${expectedCount}`
      )
    }
  })
  return { warscrolls: pages, factions }
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

const validateOfficialEvidence = async (review: CorpusReview, cache: FileArtifactCache): Promise<void> => {
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
    })
  }
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
  if (current !== product.bytes) {
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
    cacheDirectory: DEFAULT_CACHE,
    initializeIdentities: false,
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
    '--cache': 'cacheDirectory',
  }
  for (let index = 0; index < arguments_.length; index += 1) {
    const argument = arguments_[index]
    if (argument === '--initialize-identities') {
      parsed.initializeIdentities = true
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
  const [manifest, review] = await Promise.all([
    loadManifest(arguments_.acceptedManifestPath),
    loadReview(arguments_.reviewPath),
  ])
  validateOfficialDocuments(manifest, review)
  const cache = new FileArtifactCache(arguments_.cacheDirectory)
  await verifyAcceptedArtifacts(manifest, cache)
  await validateOfficialEvidence(review, cache)
  const decoded = decodeWahapediaExports(await loadWahapediaInputs(manifest, cache))
  const officialBattleProfiles = await extractOfficialBattleProfileFacts(review, cache)
  collectGarbage()
  const wahapediaHtml = await loadWahapediaHtmlPages(manifest, review, cache)
  collectGarbage()
  const merged = mergeCurrentWahapediaWarscrollPages(
    decoded.dataset,
    wahapediaHtml.warscrolls,
    officialBattleProfiles.effective,
    wahapediaHtml.factions
  )
  validateReviewedReconciliation(review, merged.reconciliation)
  const currentDecoded = { ...decoded, dataset: merged.dataset }
  const identities = arguments_.initializeIdentities
    ? createCorpusIdentityRegistry(currentDecoded.dataset, review)
    : await loadIdentities(arguments_.identitiesPath)
  ensureNoErrors(
    'Identity registry validation',
    validateIdentityRegistry(identities).map(issue => ({ ...issue }))
  )
  const generated = buildAos4Corpus(currentDecoded, identities, review)
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
    createOfficialBattleProfileCatalog(
      officialBattleProfiles.reviewed,
      merged.reconciliation,
      review.generatedAt
    )
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
      bytes: stableJson(merged.reconciliation),
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

const run = async (): Promise<void> => {
  const arguments_ = parseCorpusCommandArguments(process.argv.slice(2))
  const products = await generateCorpusProducts(arguments_)
  if (arguments_.write) {
    await Promise.all(products.map(writeProduct))
    products.forEach(product => console.log(`Wrote ${product.path} (${checksum(product.bytes)})`))
  } else {
    await Promise.all(products.map(verifyProduct))
    products.forEach(product => console.log(`Verified ${product.path} (${checksum(product.bytes)})`))
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  run().catch(error => {
    console.error(error)
    process.exitCode = 1
  })
}
