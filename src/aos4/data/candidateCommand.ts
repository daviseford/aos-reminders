import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { stableJson } from '../generate/serialization'
import { FileArtifactCache } from './cache'
import { acquireArtifact, type AcquisitionDependencies } from './command'
import { createPinnedHttpsTransport } from './http'
import {
  createArtifactManifest,
  serializeArtifactManifest,
  type ArtifactManifest,
  type ArtifactManifestEntry,
} from './manifest'
import { resolveDnsAddresses } from './urlPolicy'
import {
  assessWahapediaFreshness,
  createWahapediaFactionCohortReport,
  decodeWahapediaExports,
  normalizeWahapediaAbility,
  normalizeWahapediaWeapon,
  type WahapediaDiagnostic,
  type WahapediaExportInputs,
  type WahapediaFactionCohortReport,
} from './wahapedia'
import {
  parseWahapediaFactionHtml,
  parseWahapediaRulesHtml,
  parseWahapediaSpearheadWarscrollsHtml,
  parseWahapediaWarscrollHtml,
  parseWahapediaWarscrollCollectionHtml,
  type WahapediaHtmlDiagnostic,
} from './wahapediaHtml'
import {
  extractGamesWorkshopPdfText,
  type GamesWorkshopDiagnostic,
  type GamesWorkshopPdfExtractionResult,
  type GamesWorkshopPdfInput,
} from './gamesWorkshop'
import {
  acquireCandidateArtifacts,
  GAMES_WORKSHOP_ADAPTER_VERSION,
  WAHAPEDIA_HTML_ADAPTER_VERSION,
} from './candidateAcquisition'

export { GAMES_WORKSHOP_ADAPTER_VERSION, WAHAPEDIA_HTML_ADAPTER_VERSION }
const DEFAULT_CACHE_DIRECTORY = path.join('.cache', 'aos4', 'artifacts')
const DEFAULT_REQUEST_PAUSE_MS = 250
const OFFICIAL_PDF_MAX_PAGES = 400
const OFFICIAL_PDF_MAX_TEXT_BYTES = 32 * 1024 * 1024
const OFFICIAL_PDF_TIMEOUT_MS = 120_000

export interface CandidateAcquisitionOptions {
  outputDirectory: string
  acceptedManifest?: ArtifactManifest
  officialDocumentUrls?: string[]
  wahapediaPageUrls?: string[]
  officialSearchTerms?: string[]
  factionIds?: string[]
  offline?: boolean
  requestPauseMs?: number
}

export interface CandidateAcquisitionReport {
  schemaVersion: 1
  status: 'candidate-review-required'
  retrievedAt: string
  wahapediaExportMarker: string | null
  artifacts: {
    wahapediaExports: number
    wahapediaPages: number
    gamesWorkshopDocuments: number
  }
  decodedRecords: {
    factions: number
    sources: number
    warscrolls: number
    warscrollAbilities: number
    warscrollWeapons: number
    warscrollKeywords: number
    warscrollBases: number
    warscrollOrganisation: number
    regimentOfRenownFactions: number
    factionAbilityTypes: number
    factionAbilitySubtypes: number
    factionAbilities: number
  }
  normalization: {
    abilities: number
    weapons: number
    unknownWeaponTypes: number
    incompleteWeaponProfiles: number
    unresolvedTimings: number
    phaseIndependentAbilities: number
    effectPhaseWindowAbilities: number
    sourcePhaseConflicts: number
    sourceTimingCorrections: number
    reactionFlagMismatches: number
  }
  diagnostics: {
    errors: number
    warnings: number
    byCode: Record<string, number>
    byFileAndField: Record<string, number>
  }
  coverage: {
    approvedCorpus: 'not-yet-reviewed'
    candidateManifestAccepted: false
  }
}

export interface CandidateAcquisitionResult {
  manifest: ArtifactManifest
  report: CandidateAcquisitionReport
  manifestPath: string
  reportPath: string
  diagnosticsPath: string
  cohortReportPaths: string[]
  officialDocumentReportPath: string
  wahapediaHtmlReportPath: string
}

export interface CandidateWahapediaHtmlReport {
  schemaVersion: 1
  status: 'blocked' | 'candidate-review-required'
  documents: Array<{
    url: string
    artifactChecksum: string
    byteLength: number
    retrievedAt: string
    parsing: {
      status: 'blocked' | 'parsed'
      pages: number
      warscrolls: number
      contentGroups: number
      factionPage: boolean
      factionGroups: number
      factionAbilities: number
      rulesPage: boolean
      rulesGroups: number
      rulesAbilities: number
      name?: string
      factionName?: string
      context?: string
      abilities: number
      weapons: number
      diagnostics: WahapediaHtmlDiagnostic[]
    }
  }>
}

export const candidateArtifactUrls = (
  explicitUrls: string[],
  acceptedManifest: ArtifactManifest | undefined,
  adapterVersion: string,
  offline: boolean
): string[] => {
  const urls =
    offline && explicitUrls.length === 0
      ? (acceptedManifest?.artifacts
          .filter(artifact => artifact.adapterVersion === adapterVersion)
          .map(artifact => artifact.requestUrl) ?? [])
      : explicitUrls
  return Array.from(new Set(urls.map(url => url.trim()).filter(Boolean))).sort((left, right) =>
    left.localeCompare(right)
  )
}

export interface CandidateOfficialDocumentReport {
  schemaVersion: 1
  status: 'blocked' | 'candidate-review-required'
  documents: Array<{
    url: string
    artifactChecksum: string
    byteLength: number
    retrievedAt: string
    mediaType: string
    extraction: {
      status: 'blocked' | 'extracted'
      pages: number
      sourceRecords: Array<{
        id: string
        page: number
        recordChecksum: string
      }>
      matches: Array<{
        term: string
        pages: number[]
      }>
      diagnostics: GamesWorkshopDiagnostic[]
    }
  }>
}

const FACTION_ID_PATTERN = /^[A-Za-z0-9_-]+$/
const MAX_OFFICIAL_SEARCH_TERMS = 20
const MAX_OFFICIAL_SEARCH_TERM_LENGTH = 100
const MAX_WAHAPEDIA_PAGE_URLS = 2_000

const countDiagnostics = (diagnostics: WahapediaDiagnostic[]): CandidateAcquisitionReport['diagnostics'] => {
  const byCode = diagnostics.reduce<Record<string, number>>((counts, diagnostic) => {
    counts[diagnostic.code] = (counts[diagnostic.code] ?? 0) + 1
    return counts
  }, {})
  const byFileAndField = diagnostics.reduce<Record<string, number>>((counts, diagnostic) => {
    const key = `${diagnostic.file}:${diagnostic.field ?? '(record)'}`
    counts[key] = (counts[key] ?? 0) + 1
    return counts
  }, {})

  return {
    errors: diagnostics.filter(diagnostic => diagnostic.severity === 'error').length,
    warnings: diagnostics.filter(diagnostic => diagnostic.severity === 'warning').length,
    byCode: Object.fromEntries(Object.entries(byCode).sort(([left], [right]) => left.localeCompare(right))),
    byFileAndField: Object.fromEntries(
      Object.entries(byFileAndField).sort(([left], [right]) => left.localeCompare(right))
    ),
  }
}

const createCandidateAnalysis = (
  inputs: WahapediaExportInputs,
  manifest: ArtifactManifest,
  retrievedAt: string,
  factionIds: string[]
): {
  report: CandidateAcquisitionReport
  diagnostics: WahapediaDiagnostic[]
  cohortReports: WahapediaFactionCohortReport[]
} => {
  const decoded = decodeWahapediaExports(inputs)
  const freshness = assessWahapediaFreshness(decoded.dataset)
  const abilities = [
    ...decoded.dataset.warscrollAbilities.map(record => normalizeWahapediaAbility(record, 'unit')),
    ...decoded.dataset.factionAbilities.map(record => normalizeWahapediaAbility(record, 'army')),
  ]
  const weapons = decoded.dataset.warscrollWeapons.map(normalizeWahapediaWeapon)
  const diagnostics = [...decoded.diagnostics, ...freshness.diagnostics]

  const report: CandidateAcquisitionReport = {
    schemaVersion: 1,
    status: 'candidate-review-required',
    retrievedAt,
    wahapediaExportMarker: decoded.dataset.lastUpdate?.instant ?? decoded.dataset.lastUpdate?.raw ?? null,
    artifacts: {
      wahapediaExports: Object.keys(inputs).length,
      wahapediaPages: manifest.artifacts.filter(
        artifact => artifact.adapterVersion === WAHAPEDIA_HTML_ADAPTER_VERSION
      ).length,
      gamesWorkshopDocuments: manifest.artifacts.filter(
        artifact => artifact.adapterVersion === GAMES_WORKSHOP_ADAPTER_VERSION
      ).length,
    },
    decodedRecords: {
      factions: decoded.dataset.factions.length,
      sources: decoded.dataset.sources.length,
      warscrolls: decoded.dataset.warscrolls.length,
      warscrollAbilities: decoded.dataset.warscrollAbilities.length,
      warscrollWeapons: decoded.dataset.warscrollWeapons.length,
      warscrollKeywords: decoded.dataset.warscrollKeywords.length,
      warscrollBases: decoded.dataset.warscrollBases.length,
      warscrollOrganisation: decoded.dataset.warscrollOrganisation.length,
      regimentOfRenownFactions: decoded.dataset.regimentOfRenownFactions.length,
      factionAbilityTypes: decoded.dataset.factionAbilityTypes.length,
      factionAbilitySubtypes: decoded.dataset.factionAbilitySubtypes.length,
      factionAbilities: decoded.dataset.factionAbilities.length,
    },
    normalization: {
      abilities: abilities.length,
      weapons: weapons.length,
      unknownWeaponTypes: weapons.filter(weapon => weapon.weaponType === 'unknown').length,
      incompleteWeaponProfiles: weapons.filter(weapon =>
        weapon.diagnostics.some(diagnostic => diagnostic.code === 'source-incomplete-weapon-profile')
      ).length,
      unresolvedTimings: abilities.filter(ability =>
        ability.timings.some(timing => timing.window.kind === 'unknown')
      ).length,
      phaseIndependentAbilities: abilities.filter(ability =>
        ability.timings.some(timing => timing.window.kind === 'phase-independent')
      ).length,
      effectPhaseWindowAbilities: abilities.filter(ability =>
        ability.diagnostics.some(diagnostic => diagnostic.code === 'effect-phase-windows')
      ).length,
      sourcePhaseConflicts: abilities.filter(ability =>
        ability.diagnostics.some(diagnostic => diagnostic.code === 'source-phase-conflict')
      ).length,
      sourceTimingCorrections: abilities.filter(ability =>
        ability.diagnostics.some(diagnostic => diagnostic.code === 'source-timing-correction')
      ).length,
      reactionFlagMismatches: abilities.filter(ability =>
        ability.diagnostics.some(diagnostic => diagnostic.code === 'reaction-flag-mismatch')
      ).length,
    },
    diagnostics: countDiagnostics(diagnostics),
    coverage: {
      approvedCorpus: 'not-yet-reviewed',
      candidateManifestAccepted: false,
    },
  }
  return {
    report,
    diagnostics,
    cohortReports: factionIds.map(factionId =>
      createWahapediaFactionCohortReport(decoded.dataset, diagnostics, factionId)
    ),
  }
}

const dependencies = (): AcquisitionDependencies => ({
  transport: createPinnedHttpsTransport(),
  cache: new FileArtifactCache(DEFAULT_CACHE_DIRECTORY),
  now: () => new Date().toISOString(),
  policy: {
    allowedHosts: [
      'wahapedia.ru',
      'www.wahapedia.ru',
      'assets.warhammer-community.com',
      'www.warhammer-community.com',
    ],
    resolveAddresses: resolveDnsAddresses,
  },
})

const officialPdfInput = (
  url: string,
  bytes: Uint8Array,
  artifact: ArtifactManifestEntry
): GamesWorkshopPdfInput => ({
  bytes,
  artifact,
  download: {
    externalId: `sha256:${artifact.checksum}`,
    title: new URL(artifact.finalUrl).pathname.split('/').at(-1) ?? 'Games Workshop PDF',
    url,
    categories: [],
    gameSystems: ['warhammer-age-of-sigmar'],
    topics: [],
    discoveryMethod: 'page-link',
  },
})

export const createCandidateOfficialDocumentReport = (
  documents: Array<{
    input: GamesWorkshopPdfInput
    extraction: GamesWorkshopPdfExtractionResult
  }>,
  searchTerms: string[] = []
): CandidateOfficialDocumentReport => {
  const reportDocuments = documents
    .map(({ input, extraction }) => ({
      url: input.download.url,
      artifactChecksum: input.artifact.checksum,
      byteLength: input.artifact.byteLength,
      retrievedAt: input.artifact.retrievedAt,
      mediaType: input.artifact.mediaType,
      extraction: {
        status: extraction.document ? ('extracted' as const) : ('blocked' as const),
        pages: extraction.document?.pages.length ?? 0,
        sourceRecords:
          extraction.document?.sourceRecords.map(record => ({
            id: String(record.id),
            page: record.locator.kind === 'page' ? record.locator.page : 0,
            recordChecksum: record.recordChecksum,
          })) ?? [],
        matches: searchTerms.map(term => ({
          term,
          pages:
            extraction.document?.pages
              .filter(page => page.text.toLowerCase().includes(term.toLowerCase()))
              .map(page => page.page) ?? [],
        })),
        diagnostics: extraction.diagnostics,
      },
    }))
    .sort((left, right) => left.url.localeCompare(right.url))

  return {
    schemaVersion: 1,
    status: reportDocuments.some(
      document =>
        document.extraction.status === 'blocked' ||
        document.extraction.diagnostics.some(diagnostic => diagnostic.severity === 'error')
    )
      ? 'blocked'
      : 'candidate-review-required',
    documents: reportDocuments,
  }
}

export const acquireCandidateData = async (
  options: CandidateAcquisitionOptions
): Promise<CandidateAcquisitionResult> => {
  const factionIds = uniqueFactionIds(options.factionIds ?? [])
  const officialSearchTerms = uniqueOfficialSearchTerms(options.officialSearchTerms ?? [])
  const acquisitionDependencies = dependencies()
  const pauseMs = options.requestPauseMs ?? DEFAULT_REQUEST_PAUSE_MS
  const inputs: WahapediaExportInputs = {}
  const officialDocuments: Array<{
    input: GamesWorkshopPdfInput
    extraction: GamesWorkshopPdfExtractionResult
  }> = []
  const wahapediaPages: Array<{
    artifact: ArtifactManifestEntry
    pageCount: number
    warscrolls: number
    contentGroups: number
    factionPage: boolean
    factionGroups: number
    factionAbilities: number
    rulesPage: boolean
    rulesGroups: number
    rulesAbilities: number
    abilities: number
    weapons: number
    name?: string
    factionName?: string
    context?: string
    diagnostics: WahapediaHtmlDiagnostic[]
  }> = []
  const officialDocumentUrls = candidateArtifactUrls(
    options.officialDocumentUrls ?? [],
    options.acceptedManifest,
    GAMES_WORKSHOP_ADAPTER_VERSION,
    options.offline === true
  )
  const wahapediaPageUrls = uniqueWahapediaPageUrls(
    candidateArtifactUrls(
      options.wahapediaPageUrls ?? [],
      options.acceptedManifest,
      WAHAPEDIA_HTML_ADAPTER_VERSION,
      options.offline === true
    )
  )
  const acquired = await acquireCandidateArtifacts({
    acceptedManifest: options.acceptedManifest,
    officialDocumentUrls,
    wahapediaPageUrls,
    offline: options.offline,
    requestPauseMs: pauseMs,
    acquire: request => acquireArtifact(request, acquisitionDependencies),
  })
  const manifest = acquired.manifest
  Object.assign(inputs, acquired.wahapediaExports)

  for (const document of acquired.officialDocuments) {
    const input = officialPdfInput(document.url, document.bytes, document.artifact)
    officialDocuments.push({
      input,
      extraction: await extractGamesWorkshopPdfText(input, {
        maxPages: OFFICIAL_PDF_MAX_PAGES,
        maxTextBytes: OFFICIAL_PDF_MAX_TEXT_BYTES,
        timeoutMs: OFFICIAL_PDF_TIMEOUT_MS,
      }),
    })
  }

  for (let index = 0; index < acquired.wahapediaPages.length; index += 1) {
    const result = acquired.wahapediaPages[index]
    const input = {
      bytes: result.bytes,
      artifact: result.artifact,
    }
    const wahapediaPath = new URL(result.artifact.finalUrl).pathname
    const isFactionPage = /^\/aos4\/factions\/[^/]+\/$/i.test(wahapediaPath)
    const isRulesPage = /^\/aos4\/the-rules\/[^/]+\/$/i.test(wahapediaPath)
    const factionPage = isFactionPage ? parseWahapediaFactionHtml(input) : undefined
    const rulesPage = isRulesPage ? parseWahapediaRulesHtml(input) : undefined
    const parsed = wahapediaPath.endsWith('/warscrolls.html')
      ? parseWahapediaWarscrollCollectionHtml(input)
      : isFactionPage
        ? parseWahapediaSpearheadWarscrollsHtml(input)
        : isRulesPage
          ? { pages: [], diagnostics: rulesPage?.diagnostics ?? [] }
          : (() => {
              const single = parseWahapediaWarscrollHtml(input)
              return {
                pages: single.page ? [single.page] : [],
                diagnostics: single.diagnostics,
              }
            })()
    if (factionPage) parsed.diagnostics.push(...factionPage.diagnostics)
    wahapediaPages.push({
      artifact: result.artifact,
      pageCount: parsed.pages.length + (rulesPage?.page ? 1 : 0),
      warscrolls: parsed.pages.filter(page => page.recordKind === 'warscroll').length,
      contentGroups: parsed.pages.filter(page => page.recordKind === 'content-group').length,
      factionPage: Boolean(factionPage?.page),
      factionGroups: factionPage?.page?.groups.length ?? 0,
      factionAbilities: factionPage?.page?.abilities.length ?? 0,
      rulesPage: Boolean(rulesPage?.page),
      rulesGroups: rulesPage?.page?.groups.length ?? 0,
      rulesAbilities: rulesPage?.page?.abilities.length ?? 0,
      abilities: parsed.pages.reduce((sum, page) => sum + page.abilities.length, 0),
      weapons: parsed.pages.reduce((sum, page) => sum + page.weapons.length, 0),
      ...(parsed.pages.length === 1
        ? {
            name: parsed.pages[0].name,
            factionName: parsed.pages[0].factionName,
            context: parsed.pages[0].context,
          }
        : parsed.pages.length
          ? { factionName: parsed.pages[0].factionName }
          : rulesPage?.page
            ? { name: rulesPage.page.title, context: rulesPage.page.context }
            : factionPage?.page
              ? { factionName: factionPage.page.factionName }
              : {}),
      diagnostics: parsed.diagnostics,
    })
    if ((index + 1) % 25 === 0 || index + 1 === wahapediaPageUrls.length) {
      console.log(`Acquired Wahapedia warscroll pages: ${index + 1}/${wahapediaPageUrls.length}`)
    }
  }

  const retrievedAt = new Date().toISOString()
  const analysis = createCandidateAnalysis(inputs, manifest, retrievedAt, factionIds)
  const report = analysis.report
  const outputDirectory = path.resolve(options.outputDirectory)
  const manifestPath = path.join(outputDirectory, 'candidate-manifest.json')
  const reportPath = path.join(outputDirectory, 'candidate-report.json')
  const diagnosticsPath = path.join(outputDirectory, 'candidate-diagnostics.json')
  const officialDocumentReportPath = path.join(outputDirectory, 'official-document-report.json')
  const wahapediaHtmlReportPath = path.join(outputDirectory, 'wahapedia-html-report.json')
  const officialDocumentReport = createCandidateOfficialDocumentReport(officialDocuments, officialSearchTerms)
  const wahapediaHtmlReport: CandidateWahapediaHtmlReport = {
    schemaVersion: 1,
    status: wahapediaPages.some(
      document =>
        (!document.pageCount && !document.factionPage) ||
        document.diagnostics.some(diagnostic => diagnostic.severity === 'error')
    )
      ? 'blocked'
      : 'candidate-review-required',
    documents: wahapediaPages
      .map(document => ({
        url: document.artifact.finalUrl,
        artifactChecksum: document.artifact.checksum,
        byteLength: document.artifact.byteLength,
        retrievedAt: document.artifact.retrievedAt,
        parsing: {
          status: document.pageCount || document.factionPage ? ('parsed' as const) : ('blocked' as const),
          pages: document.pageCount,
          warscrolls: document.warscrolls,
          contentGroups: document.contentGroups,
          factionPage: document.factionPage,
          factionGroups: document.factionGroups,
          factionAbilities: document.factionAbilities,
          rulesPage: document.rulesPage,
          rulesGroups: document.rulesGroups,
          rulesAbilities: document.rulesAbilities,
          ...(document.name ? { name: document.name } : {}),
          ...(document.factionName ? { factionName: document.factionName } : {}),
          ...(document.context ? { context: document.context } : {}),
          abilities: document.abilities,
          weapons: document.weapons,
          diagnostics: document.diagnostics,
        },
      }))
      .sort((left, right) => left.url.localeCompare(right.url)),
  }
  const cohortReportPaths = factionIds.map(factionId =>
    path.join(outputDirectory, `cohort-${factionId}-report.json`)
  )

  await mkdir(path.dirname(outputDirectory), { recursive: true })
  await mkdir(outputDirectory)
  await Promise.all([
    writeFile(manifestPath, serializeArtifactManifest(manifest), {
      encoding: 'utf8',
      flag: 'wx',
    }),
    writeFile(reportPath, stableJson(report), {
      encoding: 'utf8',
      flag: 'wx',
    }),
    writeFile(diagnosticsPath, stableJson(analysis.diagnostics), {
      encoding: 'utf8',
      flag: 'wx',
    }),
    writeFile(officialDocumentReportPath, stableJson(officialDocumentReport), {
      encoding: 'utf8',
      flag: 'wx',
    }),
    writeFile(wahapediaHtmlReportPath, stableJson(wahapediaHtmlReport), {
      encoding: 'utf8',
      flag: 'wx',
    }),
    ...analysis.cohortReports.map((cohortReport, index) =>
      writeFile(cohortReportPaths[index], stableJson(cohortReport), {
        encoding: 'utf8',
        flag: 'wx',
      })
    ),
  ])

  return {
    manifest,
    report,
    manifestPath,
    reportPath,
    diagnosticsPath,
    cohortReportPaths,
    officialDocumentReportPath,
    wahapediaHtmlReportPath,
  }
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === 'object' && !Array.isArray(value)

const parseManifestEntry = (value: unknown): ArtifactManifestEntry => {
  if (!isRecord(value)) throw new Error('Manifest artifact must be an object')
  const requiredStrings = [
    'requestUrl',
    'finalUrl',
    'retrievedAt',
    'adapterVersion',
    'mediaType',
    'checksum',
  ] as const
  requiredStrings.forEach(field => {
    if (typeof value[field] !== 'string' || !value[field]) {
      throw new Error(`Manifest artifact is missing ${field}`)
    }
  })
  if (!Array.isArray(value.redirectChain) || value.redirectChain.some(item => typeof item !== 'string')) {
    throw new Error('Manifest artifact has an invalid redirectChain')
  }
  if (
    typeof value.byteLength !== 'number' ||
    !Number.isSafeInteger(value.byteLength) ||
    value.byteLength <= 0
  ) {
    throw new Error('Manifest artifact has an invalid byteLength')
  }
  if (!/^[0-9a-f]{64}$/.test(value.checksum as string)) {
    throw new Error('Manifest artifact has an invalid checksum')
  }

  return value as unknown as ArtifactManifestEntry
}

const loadAcceptedManifest = async (manifestPath: string): Promise<ArtifactManifest> => {
  const value: unknown = JSON.parse(await readFile(manifestPath, 'utf8'))
  if (!isRecord(value) || value.schemaVersion !== 1 || !Array.isArray(value.artifacts)) {
    throw new Error('Accepted manifest has an incompatible schema')
  }
  return createArtifactManifest(value.artifacts.map(parseManifestEntry))
}

export interface CandidateArguments {
  outputDirectory: string
  acceptedManifestPath?: string
  officialDocumentUrls: string[]
  officialDocumentListPaths: string[]
  wahapediaPageUrls: string[]
  wahapediaPageListPaths: string[]
  officialSearchTerms: string[]
  factionIds: string[]
  requestPauseMs: number
  offline: boolean
}

const nextValue = (arguments_: string[], index: number, flag: string): string => {
  const value = arguments_[index + 1]
  if (!value || value.startsWith('--')) {
    throw new Error(`${flag} requires a value`)
  }
  return value
}

const uniqueFactionIds = (factionIds: string[]): string[] => {
  factionIds.forEach(factionId => {
    if (!FACTION_ID_PATTERN.test(factionId)) {
      throw new Error(`Invalid faction ID: ${factionId}`)
    }
  })
  return Array.from(new Set(factionIds)).sort((left, right) => left.localeCompare(right))
}

const uniqueOfficialSearchTerms = (searchTerms: string[]): string[] => {
  if (searchTerms.length > MAX_OFFICIAL_SEARCH_TERMS) {
    throw new Error(`At most ${MAX_OFFICIAL_SEARCH_TERMS} official search terms are allowed`)
  }
  searchTerms.forEach(searchTerm => {
    if (
      searchTerm !== searchTerm.trim() ||
      searchTerm.length === 0 ||
      searchTerm.length > MAX_OFFICIAL_SEARCH_TERM_LENGTH ||
      Array.from(searchTerm).some(character => {
        const code = character.charCodeAt(0)
        return code < 32 || code === 127
      })
    ) {
      throw new Error(`Invalid official search term: ${JSON.stringify(searchTerm)}`)
    }
  })
  return Array.from(new Set(searchTerms)).sort((left, right) => left.localeCompare(right))
}

export const parseCandidateArguments = (arguments_: string[]): CandidateArguments => {
  const defaultLabel = new Date().toISOString().replace(/[:.]/g, '-')
  const parsed: CandidateArguments = {
    outputDirectory: path.join('.cache', 'aos4', 'candidates', defaultLabel),
    officialDocumentUrls: [],
    officialDocumentListPaths: [],
    wahapediaPageUrls: [],
    wahapediaPageListPaths: [],
    officialSearchTerms: [],
    factionIds: [],
    requestPauseMs: DEFAULT_REQUEST_PAUSE_MS,
    offline: false,
  }

  for (let index = 0; index < arguments_.length; index += 1) {
    const argument = arguments_[index]
    if (argument === '--output') {
      parsed.outputDirectory = nextValue(arguments_, index, argument)
      index += 1
    } else if (argument === '--accepted-manifest') {
      parsed.acceptedManifestPath = nextValue(arguments_, index, argument)
      index += 1
    } else if (argument === '--official-url') {
      parsed.officialDocumentUrls.push(nextValue(arguments_, index, argument))
      index += 1
    } else if (argument === '--official-urls-file') {
      parsed.officialDocumentListPaths.push(nextValue(arguments_, index, argument))
      index += 1
    } else if (argument === '--official-search') {
      parsed.officialSearchTerms.push(nextValue(arguments_, index, argument))
      index += 1
    } else if (argument === '--wahapedia-page') {
      parsed.wahapediaPageUrls.push(nextValue(arguments_, index, argument))
      index += 1
    } else if (argument === '--wahapedia-pages-file') {
      parsed.wahapediaPageListPaths.push(nextValue(arguments_, index, argument))
      index += 1
    } else if (argument === '--request-pause-ms') {
      const value = nextValue(arguments_, index, argument)
      if (!/^\d+$/.test(value) || Number.parseInt(value, 10) > 60_000) {
        throw new Error('--request-pause-ms must be an integer from 0 through 60000')
      }
      parsed.requestPauseMs = Number.parseInt(value, 10)
      index += 1
    } else if (argument === '--faction') {
      parsed.factionIds.push(nextValue(arguments_, index, argument))
      index += 1
    } else if (argument === '--offline') {
      parsed.offline = true
    } else {
      throw new Error(`Unknown argument: ${argument}`)
    }
  }

  if (parsed.offline && !parsed.acceptedManifestPath) {
    throw new Error('--offline requires --accepted-manifest')
  }
  parsed.officialSearchTerms = uniqueOfficialSearchTerms(parsed.officialSearchTerms)
  parsed.factionIds = uniqueFactionIds(parsed.factionIds)
  return parsed
}

const readUrlList = async (filePath: string, label: string): Promise<string[]> => {
  const value: unknown = JSON.parse(await readFile(filePath, 'utf8'))
  if (!Array.isArray(value) || value.some(item => typeof item !== 'string' || !item.trim())) {
    throw new Error(`${label} ${filePath} must be a JSON array of URLs`)
  }
  return value
}

export const uniqueWahapediaPageUrls = (values: string[]): string[] => {
  const unique = Array.from(new Set(values.map(value => value.trim()))).sort((left, right) =>
    left.localeCompare(right)
  )
  if (unique.length > MAX_WAHAPEDIA_PAGE_URLS) {
    throw new Error(`At most ${MAX_WAHAPEDIA_PAGE_URLS} Wahapedia page URLs may be requested`)
  }
  return unique
}

const run = async (): Promise<void> => {
  const arguments_ = parseCandidateArguments(process.argv.slice(2))
  const acceptedManifest = arguments_.acceptedManifestPath
    ? await loadAcceptedManifest(arguments_.acceptedManifestPath)
    : undefined
  const pageLists = await Promise.all(
    arguments_.wahapediaPageListPaths.map(filePath => readUrlList(filePath, 'Wahapedia page list'))
  )
  const officialLists = await Promise.all(
    arguments_.officialDocumentListPaths.map(filePath => readUrlList(filePath, 'Official document list'))
  )
  const result = await acquireCandidateData({
    outputDirectory: arguments_.outputDirectory,
    acceptedManifest,
    officialDocumentUrls: Array.from(
      new Set([...arguments_.officialDocumentUrls, ...officialLists.flat()])
    ).sort((left, right) => left.localeCompare(right)),
    wahapediaPageUrls: uniqueWahapediaPageUrls([...arguments_.wahapediaPageUrls, ...pageLists.flat()]),
    officialSearchTerms: arguments_.officialSearchTerms,
    factionIds: arguments_.factionIds,
    offline: arguments_.offline,
    requestPauseMs: arguments_.requestPauseMs,
  })

  console.log(`Candidate manifest: ${result.manifestPath}`)
  console.log(`Candidate report: ${result.reportPath}`)
  console.log(`Candidate diagnostics: ${result.diagnosticsPath}`)
  console.log(`Official document report: ${result.officialDocumentReportPath}`)
  console.log(`Wahapedia HTML report: ${result.wahapediaHtmlReportPath}`)
  result.cohortReportPaths.forEach(cohortReportPath => {
    console.log(`Faction cohort report: ${cohortReportPath}`)
  })
  console.log(
    `Review required: ${result.report.diagnostics.errors} errors, ${result.report.diagnostics.warnings} warnings`
  )
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  run().catch(error => {
    console.error(error)
    process.exitCode = 1
  })
}
