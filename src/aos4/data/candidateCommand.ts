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
  WAHAPEDIA_EXPORT_FILES,
  assessWahapediaFreshness,
  createWahapediaFactionCohortReport,
  decodeWahapediaExports,
  normalizeWahapediaAbility,
  normalizeWahapediaWeapon,
  wahapediaExportRequest,
  type WahapediaDiagnostic,
  type WahapediaExportInputs,
  type WahapediaFactionCohortReport,
} from './wahapedia'

const GAMES_WORKSHOP_ADAPTER_VERSION = 'games-workshop-pdf/1'
const DEFAULT_CACHE_DIRECTORY = path.join('.cache', 'aos4', 'artifacts')
const DEFAULT_REQUEST_PAUSE_MS = 250

export interface CandidateAcquisitionOptions {
  outputDirectory: string
  acceptedManifest?: ArtifactManifest
  officialDocumentUrls?: string[]
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
    unresolvedTimings: number
    sourcePhaseFallbacks: number
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
}

const FACTION_ID_PATTERN = /^[A-Za-z0-9_-]+$/

const pause = async (milliseconds: number): Promise<void> => {
  if (milliseconds <= 0) return
  await new Promise(resolve => setTimeout(resolve, milliseconds))
}

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
      unresolvedTimings: abilities.filter(ability =>
        ability.timings.some(timing => timing.window.kind === 'unknown')
      ).length,
      sourcePhaseFallbacks: abilities.filter(ability =>
        ability.diagnostics.some(diagnostic => diagnostic.code === 'source-phase-fallback')
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

export const acquireCandidateData = async (
  options: CandidateAcquisitionOptions
): Promise<CandidateAcquisitionResult> => {
  const factionIds = uniqueFactionIds(options.factionIds ?? [])
  const acquisitionDependencies = dependencies()
  const pauseMs = options.requestPauseMs ?? DEFAULT_REQUEST_PAUSE_MS
  const inputs: WahapediaExportInputs = {}
  let manifest = createArtifactManifest()

  for (let index = 0; index < WAHAPEDIA_EXPORT_FILES.length; index += 1) {
    const file = WAHAPEDIA_EXPORT_FILES[index]
    const result = await acquireArtifact(
      wahapediaExportRequest(file, {
        acceptedManifest: options.acceptedManifest,
        candidateManifest: manifest,
        offline: options.offline,
      }),
      acquisitionDependencies
    )
    manifest = result.candidateManifest
    inputs[file] = { bytes: result.bytes, artifact: result.entry }
    if (!options.offline && index < WAHAPEDIA_EXPORT_FILES.length - 1) {
      await pause(pauseMs)
    }
  }

  for (const url of options.officialDocumentUrls ?? []) {
    const result = await acquireArtifact(
      {
        url,
        adapterVersion: GAMES_WORKSHOP_ADAPTER_VERSION,
        allowedMediaTypes: ['application/pdf'],
        maxBytes: 64 * 1024 * 1024,
        timeoutMs: 30_000,
        maxRedirects: 5,
        acceptedManifest: options.acceptedManifest,
        candidateManifest: manifest,
        offline: options.offline,
      },
      acquisitionDependencies
    )
    manifest = result.candidateManifest
    if (!options.offline) await pause(pauseMs)
  }

  const retrievedAt = new Date().toISOString()
  const analysis = createCandidateAnalysis(inputs, manifest, retrievedAt, factionIds)
  const report = analysis.report
  const outputDirectory = path.resolve(options.outputDirectory)
  const manifestPath = path.join(outputDirectory, 'candidate-manifest.json')
  const reportPath = path.join(outputDirectory, 'candidate-report.json')
  const diagnosticsPath = path.join(outputDirectory, 'candidate-diagnostics.json')
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
  factionIds: string[]
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

export const parseCandidateArguments = (arguments_: string[]): CandidateArguments => {
  const defaultLabel = new Date().toISOString().replace(/[:.]/g, '-')
  const parsed: CandidateArguments = {
    outputDirectory: path.join('.cache', 'aos4', 'candidates', defaultLabel),
    officialDocumentUrls: [],
    factionIds: [],
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
  parsed.factionIds = uniqueFactionIds(parsed.factionIds)
  return parsed
}

const run = async (): Promise<void> => {
  const arguments_ = parseCandidateArguments(process.argv.slice(2))
  const acceptedManifest = arguments_.acceptedManifestPath
    ? await loadAcceptedManifest(arguments_.acceptedManifestPath)
    : undefined
  const result = await acquireCandidateData({
    outputDirectory: arguments_.outputDirectory,
    acceptedManifest,
    officialDocumentUrls: arguments_.officialDocumentUrls,
    factionIds: arguments_.factionIds,
    offline: arguments_.offline,
  })

  console.log(`Candidate manifest: ${result.manifestPath}`)
  console.log(`Candidate report: ${result.reportPath}`)
  console.log(`Candidate diagnostics: ${result.diagnosticsPath}`)
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
