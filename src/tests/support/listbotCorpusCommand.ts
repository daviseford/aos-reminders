import { randomUUID } from 'node:crypto'
import { lstat, mkdir, realpath, rename, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  FileArtifactCache,
  acquireArtifact,
  artifactChecksum,
  createArtifactManifest,
  createPinnedHttpsTransport,
  resolveDnsAddresses,
} from '../../aos4/data'
import type { RulesContextId } from '../../aos4/domain'
import { AOS4_CATALOG, AOS4_DEFAULT_RULES_CONTEXT_ID } from '../../aos4/generated'
import { stableJson } from '../../aos4/generate/serialization'
import { resolveParsedRoster } from '../../aos4/import'
import { decodeAos4TextRoster } from '../../importers/aos4'
import {
  LISTBOT_CURRENT_PAGE_URL,
  LISTBOT_ARMY_BINDINGS,
  LISTBOT_GAME_DATA_URL,
  LISTBOT_GAME_DATA_VERSION_URL,
  LISTBOT_UNSCOPED_UNIT_BINDINGS,
  createListbotCoverageCorpus,
  mergeListbotGameData,
  parseListbotCurrentPage,
  parseListbotGameData,
  parseListbotVersionMarker,
  type ListbotCoverageRoster,
} from './listbotCorpus'

const ADAPTER_VERSION = 'listbot-game-data/1'
const MAX_GAME_DATA_BYTES = 5 * 1024 * 1024
const MAX_CURRENT_PAGE_BYTES = 5 * 1024 * 1024
const MAX_VERSION_BYTES = 64 * 1024
const OUTPUT_ROOT = path.resolve('data', 'aos4', 'import-corpus')
const DEFAULT_OUTPUT = path.join(OUTPUT_ROOT, 'listbot')
const CACHE_ROOT = path.resolve('.cache', 'aos4', 'import', 'listbot')
const NON_ARMY_FACTION_IDS = new Set(['faction:e668f75e-fd2f-513d-8ebb-e24696ceacb6'])
const IMPORTABLE_CONTEXT_STATUSES = new Set(['current', 'seasonal', 'legends'])

interface CommandOptions {
  force: boolean
  output: string
}

interface ArmyContext {
  catalogFactionId: string
  listbotFactionId: string
  apiFactionId: string
  currentPageFactionId?: string
  name: string
  rulesContextId: RulesContextId
}

const usage = (): never => {
  console.error('Usage: yarn corpus:listbot [--output <path>] [--force]')
  console.error(`  output must be below ${OUTPUT_ROOT}`)
  process.exit(2)
}

export const validateOutputPath = (value: string): string => {
  const output = path.resolve(value)
  const relative = path.relative(OUTPUT_ROOT, output)
  if (!relative || relative === '..' || relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative)) {
    throw new Error(`Output must be below ${OUTPUT_ROOT}`)
  }
  return output
}

const parseArgs = (values: string[]): CommandOptions => {
  let force = false
  let output = DEFAULT_OUTPUT
  for (let index = 0; index < values.length; index += 1) {
    const value = values[index]
    if (value === '--force') {
      if (force) throw new Error('--force may only be supplied once')
      force = true
      continue
    }
    if (value !== '--output') usage()
    const next = values[index + 1]
    if (!next || next.startsWith('--')) usage()
    output = next
    index += 1
  }
  return { force, output: validateOutputPath(output) }
}

const decodeJson = (bytes: Uint8Array, source: string): unknown => {
  try {
    return JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(bytes)) as unknown
  } catch (error) {
    throw new Error(`${source} did not return valid UTF-8 JSON: ${String(error)}`)
  }
}

const decodeText = (bytes: Uint8Array, source: string): string => {
  try {
    return new TextDecoder('utf-8', { fatal: true }).decode(bytes)
  } catch (error) {
    throw new Error(`${source} did not return valid UTF-8: ${String(error)}`)
  }
}

const catalogArmyContexts = (): ArmyContext[] => {
  const contextById = new Map(AOS4_CATALOG.rulesContexts.map(context => [context.id, context]))
  const bindingsByCatalogFactionId = new Map(
    LISTBOT_ARMY_BINDINGS.map(binding => [binding.catalogFactionId, binding])
  )
  const factions = AOS4_CATALOG.entities.flatMap(entity =>
    entity.kind === 'faction' && !NON_ARMY_FACTION_IDS.has(entity.id) ? [entity] : []
  )
  const factionIds = new Set(factions.map(faction => faction.id))
  LISTBOT_ARMY_BINDINGS.forEach(binding => {
    if (!factionIds.has(binding.catalogFactionId as (typeof factions)[number]['id'])) {
      throw new Error(`Listbot binding refers to missing catalog faction ${binding.catalogFactionId}`)
    }
  })
  return factions
    .map(faction => {
      const binding = bindingsByCatalogFactionId.get(faction.id)
      if (!binding) throw new Error(`No stable Listbot binding exists for army ${faction.id}`)
      if (binding.expectedName !== faction.name) {
        throw new Error(
          `AoS 4 catalog faction ${faction.id} name changed: ${faction.name} != ${binding.expectedName}`
        )
      }
      const preferredContext = faction.rulesContextIds.includes(AOS4_DEFAULT_RULES_CONTEXT_ID)
        ? AOS4_DEFAULT_RULES_CONTEXT_ID
        : faction.rulesContextIds.find(contextId => {
            const context = contextById.get(contextId)
            return context && IMPORTABLE_CONTEXT_STATUSES.has(context.status)
          })
      if (!preferredContext) {
        throw new Error(`No importable AoS 4 rules context exists for army ${faction.name}`)
      }
      return {
        catalogFactionId: faction.id,
        listbotFactionId: binding.currentPageFactionId ?? binding.apiFactionId,
        apiFactionId: binding.apiFactionId,
        currentPageFactionId: binding.currentPageFactionId,
        name: faction.name,
        rulesContextId: preferredContext,
      }
    })
    .sort((left, right) => left.name.localeCompare(right.name))
}

const verifyRoster = (roster: ListbotCoverageRoster, rulesContextId: RulesContextId | undefined) => {
  const decoded = decodeAos4TextRoster(roster.text)
  if (decoded.diagnostics.length || !decoded.parsedRoster) {
    throw new Error(`Generated Listbot roster did not decode: ${roster.file}`)
  }
  const unitSelections = decoded.parsedRoster.selections.filter(
    selection => selection.kindHint === 'warscroll'
  )
  if (
    decoded.parsedRoster.declaredFaction !== roster.factionName ||
    unitSelections.length !== roster.unitCount
  ) {
    throw new Error(`Generated Listbot roster did not round-trip all unit entries: ${roster.file}`)
  }
  if (!rulesContextId) return null

  const preview = resolveParsedRoster(AOS4_CATALOG, decoded.parsedRoster, {
    defaultRulesContextId: rulesContextId,
    createDocumentId: () => 'listbot-all-units-coverage',
  })
  const matchedLines = new Set(preview.matches.map(match => match.line))
  const diagnosticsByLine = new Map<number, Set<string>>()
  preview.diagnostics.forEach(diagnostic => {
    if (diagnostic.line === undefined) return
    const codes = diagnosticsByLine.get(diagnostic.line) ?? new Set<string>()
    codes.add(diagnostic.code)
    diagnosticsByLine.set(diagnostic.line, codes)
  })
  const unresolved = unitSelections
    .filter(selection => !matchedLines.has(selection.line))
    .map(selection => ({
      line: selection.line,
      label: selection.label,
      diagnosticCodes: Array.from(diagnosticsByLine.get(selection.line) ?? []).sort(),
    }))

  return {
    rulesContextId,
    resolvedUnitEntries: unitSelections.length - unresolved.length,
    unresolvedUnitEntries: unresolved.length,
    unresolved,
  }
}

const pathExists = async (target: string): Promise<boolean> => {
  try {
    await lstat(target)
    return true
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return false
    throw error
  }
}

const isContainedPath = (root: string, target: string): boolean => {
  const relative = path.relative(root, target)
  return (
    relative === '' ||
    (!path.isAbsolute(relative) && relative !== '..' && !relative.startsWith(`..${path.sep}`))
  )
}

const ensureDirectoryInside = async (root: string, target: string): Promise<string> => {
  const absoluteRoot = path.resolve(root)
  const absoluteTarget = path.resolve(target)
  if (!isContainedPath(absoluteRoot, absoluteTarget)) {
    throw new Error(`${absoluteTarget} must stay below ${absoluteRoot}`)
  }
  const canonicalRoot = await realpath(absoluteRoot)
  const relative = path.relative(absoluteRoot, absoluteTarget)
  let cursor = absoluteRoot
  for (const segment of relative.split(path.sep).filter(Boolean)) {
    cursor = path.join(cursor, segment)
    if (!(await pathExists(cursor))) await mkdir(cursor)
    const stats = await lstat(cursor)
    if (stats.isSymbolicLink()) {
      throw new Error(`Refusing to traverse symbolic link or junction: ${cursor}`)
    }
    if (!stats.isDirectory()) throw new Error(`Expected a directory: ${cursor}`)
    const canonicalCursor = await realpath(cursor)
    if (!isContainedPath(canonicalRoot, canonicalCursor)) {
      throw new Error(`Resolved output path escapes ${canonicalRoot}: ${cursor}`)
    }
  }
  return realpath(absoluteTarget)
}

interface WriteListbotCorpusOptions {
  workspaceRoot: string
  outputRoot: string
  output: string
  force: boolean
  files: Array<{ file: string; text: string }>
  manifest: unknown
  renamePath?: typeof rename
}

export const writeListbotCorpus = async (options: WriteListbotCorpusOptions): Promise<void> => {
  const { files, force, manifest } = options
  const outputRoot = path.resolve(options.outputRoot)
  const output = path.resolve(options.output)
  const renamePath = options.renamePath ?? rename
  const lexicalRelative = path.relative(outputRoot, output)
  if (
    !lexicalRelative ||
    path.isAbsolute(lexicalRelative) ||
    lexicalRelative === '..' ||
    lexicalRelative.startsWith(`..${path.sep}`)
  ) {
    throw new Error(`Output must be below ${outputRoot}`)
  }

  const canonicalOutputRoot = await ensureDirectoryInside(options.workspaceRoot, outputRoot)
  const outputParent = await ensureDirectoryInside(canonicalOutputRoot, path.dirname(output))
  const safeOutput = path.join(outputParent, path.basename(output))
  const outputExists = await pathExists(safeOutput)
  if (outputExists) {
    const stats = await lstat(safeOutput)
    if (stats.isSymbolicLink()) {
      throw new Error(`Refusing to replace symbolic link or junction: ${safeOutput}`)
    }
    const canonicalOutput = await realpath(safeOutput)
    if (!isContainedPath(canonicalOutputRoot, canonicalOutput)) {
      throw new Error(`Resolved output path escapes ${canonicalOutputRoot}: ${safeOutput}`)
    }
  }
  if (outputExists && !force) {
    throw new Error(`${safeOutput} already exists; pass --force to replace this generated corpus`)
  }

  const operationId = randomUUID()
  const temporary = path.join(canonicalOutputRoot, `.listbot-${operationId}.tmp`)
  const backup = path.join(canonicalOutputRoot, `.listbot-${operationId}.backup`)
  let backupCreated = false
  await mkdir(temporary, { recursive: false })
  try {
    for (const file of files) {
      const relative = path.normalize(file.file)
      if (
        !relative ||
        path.isAbsolute(relative) ||
        relative === '..' ||
        relative.startsWith(`..${path.sep}`)
      ) {
        throw new Error(`Generated Listbot file escapes its corpus: ${file.file}`)
      }
      const target = path.join(temporary, file.file)
      await mkdir(path.dirname(target), { recursive: true })
      await writeFile(target, file.text, { encoding: 'utf8', flag: 'wx' })
    }
    await writeFile(path.join(temporary, 'manifest.json'), stableJson(manifest), {
      encoding: 'utf8',
      flag: 'wx',
    })
    if (outputExists) {
      await renamePath(safeOutput, backup)
      backupCreated = true
    }
    try {
      await renamePath(temporary, safeOutput)
    } catch (publicationError) {
      if (backupCreated) {
        try {
          await renamePath(backup, safeOutput)
          backupCreated = false
        } catch (restorationError) {
          throw new AggregateError(
            [publicationError, restorationError],
            `Failed to publish and restore Listbot corpus at ${safeOutput}`
          )
        }
      }
      throw publicationError
    }
    if (backupCreated) {
      await rm(backup, { recursive: true })
      backupCreated = false
    }
  } catch (error) {
    await rm(temporary, { recursive: true, force: true })
    throw error
  }
}

const run = async (): Promise<void> => {
  const options = parseArgs(process.argv.slice(2))
  const retrievedAt = new Date().toISOString()
  const dependencies = {
    transport: createPinnedHttpsTransport(),
    cache: new FileArtifactCache(CACHE_ROOT),
    now: () => retrievedAt,
    policy: {
      allowedHosts: ['www.listbot.co.uk'],
      resolveAddresses: resolveDnsAddresses,
    },
  }

  const versionBeforeResult = await acquireArtifact(
    {
      url: LISTBOT_GAME_DATA_VERSION_URL,
      adapterVersion: ADAPTER_VERSION,
      allowedMediaTypes: ['application/json'],
      maxBytes: MAX_VERSION_BYTES,
      timeoutMs: 30_000,
      maxRedirects: 0,
      candidateManifest: createArtifactManifest(),
    },
    dependencies
  )
  const gameDataResult = await acquireArtifact(
    {
      url: LISTBOT_GAME_DATA_URL,
      adapterVersion: ADAPTER_VERSION,
      allowedMediaTypes: ['application/json'],
      maxBytes: MAX_GAME_DATA_BYTES,
      timeoutMs: 30_000,
      maxRedirects: 0,
      candidateManifest: versionBeforeResult.candidateManifest,
    },
    dependencies
  )
  const currentPageResult = await acquireArtifact(
    {
      url: LISTBOT_CURRENT_PAGE_URL,
      adapterVersion: ADAPTER_VERSION,
      allowedMediaTypes: ['text/html'],
      maxBytes: MAX_CURRENT_PAGE_BYTES,
      timeoutMs: 30_000,
      maxRedirects: 0,
      candidateManifest: gameDataResult.candidateManifest,
    },
    dependencies
  )
  const versionAfterResult = await acquireArtifact(
    {
      url: LISTBOT_GAME_DATA_VERSION_URL,
      adapterVersion: ADAPTER_VERSION,
      allowedMediaTypes: ['application/json'],
      maxBytes: MAX_VERSION_BYTES,
      timeoutMs: 30_000,
      maxRedirects: 0,
      candidateManifest: currentPageResult.candidateManifest,
    },
    dependencies
  )

  const versionBefore = parseListbotVersionMarker(
    decodeJson(versionBeforeResult.bytes, LISTBOT_GAME_DATA_VERSION_URL)
  )
  const versionAfter = parseListbotVersionMarker(
    decodeJson(versionAfterResult.bytes, LISTBOT_GAME_DATA_VERSION_URL)
  )
  const apiGameData = parseListbotGameData(decodeJson(gameDataResult.bytes, LISTBOT_GAME_DATA_URL))
  if (JSON.stringify(versionBefore) !== JSON.stringify(versionAfter)) {
    throw new Error('Listbot game-data version marker changed during retrieval')
  }
  if (versionAfter.version !== apiGameData.version) {
    throw new Error(
      `Listbot version changed during retrieval: ${versionAfter.version} != ${apiGameData.version}`
    )
  }
  if (
    versionAfter.factionCount !== apiGameData.factions.length ||
    versionAfter.unitCount !== apiGameData.units.length
  ) {
    throw new Error('Listbot version counts do not match the downloaded game-data snapshot')
  }
  const currentPage = parseListbotCurrentPage(decodeText(currentPageResult.bytes, LISTBOT_CURRENT_PAGE_URL))
  const { gameData, drift, reconciledUnscopedUnits } = mergeListbotGameData(
    apiGameData,
    currentPage,
    LISTBOT_ARMY_BINDINGS,
    LISTBOT_UNSCOPED_UNIT_BINDINGS
  )
  const currentFactionIds = new Set<string>(
    LISTBOT_ARMY_BINDINGS.flatMap(binding => (binding.currentPageFactionId ? [binding.apiFactionId] : []))
  )
  const apiOnlyFactionCount = apiGameData.factions.filter(
    faction => !currentFactionIds.has(faction.id)
  ).length

  const armyContexts = catalogArmyContexts()
  const armyContextByListbotId = new Map(armyContexts.map(army => [army.listbotFactionId, army]))
  const corpus = createListbotCoverageCorpus(
    gameData,
    armyContexts.map(army => army.listbotFactionId)
  )
  if (corpus.missingArmyFactionIds.length) {
    throw new Error(`Listbot game data is missing AoS 4 army IDs: ${corpus.missingArmyFactionIds.join(', ')}`)
  }
  if (corpus.emptyArmyFactionIds.length) {
    throw new Error(
      `Listbot game data contains empty AoS 4 army IDs: ${corpus.emptyArmyFactionIds.join(', ')}`
    )
  }
  if (corpus.coverage.uncoveredUnitEntries !== 0) {
    throw new Error(`${corpus.coverage.uncoveredUnitEntries} Listbot unit entries were not collected`)
  }

  const rosterResults = corpus.rosters.map(roster => ({
    roster,
    resolution: verifyRoster(roster, armyContextByListbotId.get(roster.factionId)?.rulesContextId),
  }))
  const resolvedUnitEntries = rosterResults.reduce(
    (total, result) => total + (result.resolution?.resolvedUnitEntries ?? 0),
    0
  )
  const unresolvedUnitEntries = rosterResults.reduce(
    (total, result) => total + (result.resolution?.unresolvedUnitEntries ?? 0),
    0
  )
  const gameDataEntry = gameDataResult.entry
  const currentPageEntry = currentPageResult.entry
  const versionEntry = versionAfterResult.entry
  const manifest = {
    schemaVersion: 1,
    kind: 'listbot-all-units-coverage',
    generatedAt: retrievedAt,
    source: {
      adapterVersion: ADAPTER_VERSION,
      version: gameData.version,
      currentPage: {
        url: currentPageEntry.finalUrl,
        byteLength: currentPageEntry.byteLength,
        sha256: currentPageEntry.checksum,
        mediaType: currentPageEntry.mediaType,
        factionCount: currentPage.factions.length,
        unitCount: currentPage.units.length + currentPage.unscopedUnits.length,
        unscopedUnitCount: currentPage.unscopedUnits.length,
        reconciledUnscopedUnits,
      },
      gameData: {
        url: gameDataEntry.finalUrl,
        byteLength: gameDataEntry.byteLength,
        sha256: gameDataEntry.checksum,
        mediaType: gameDataEntry.mediaType,
        factionCount: apiGameData.factions.length,
        unitCount: apiGameData.units.length,
      },
      versionMarker: {
        url: versionEntry.finalUrl,
        byteLength: versionEntry.byteLength,
        sha256: versionEntry.checksum,
        mediaType: versionEntry.mediaType,
      },
    },
    contract: {
      purpose: 'Importer label coverage; these exhaustive, over-points rosters are not legal lists.',
      ruleTextRetained: false,
      remoteWritesPerformed: false,
      currentPagePreferred: true,
      catalogArmyCount: armyContexts.length,
      matchedCatalogArmies: armyContexts.map(army => ({
        catalogFactionId: army.catalogFactionId,
        listbotFactionId: army.listbotFactionId,
        name: army.name,
      })),
      missingCatalogArmies: corpus.missingArmyFactionIds,
      emptyCatalogArmies: corpus.emptyArmyFactionIds,
    },
    coverage: corpus.coverage,
    sourceDrift: drift,
    resolution: {
      attemptedArmyUnitEntries: resolvedUnitEntries + unresolvedUnitEntries,
      resolvedUnitEntries,
      unresolvedUnitEntries,
    },
    emptySourceFactions: corpus.emptyFactions,
    rosters: rosterResults.map(({ roster, resolution }) => {
      const { text, ...metadata } = roster
      return {
        ...metadata,
        sourceKind: currentPage.factions.some(faction => faction.id === roster.factionId)
          ? 'current-page'
          : 'game-data-api',
        sha256: artifactChecksum(new TextEncoder().encode(text)),
        resolution,
      }
    }),
  }

  await writeListbotCorpus({
    workspaceRoot: path.resolve('.'),
    outputRoot: OUTPUT_ROOT,
    output: options.output,
    force: options.force,
    files: corpus.rosters.map(roster => ({ file: roster.file, text: roster.text })),
    manifest,
  })
  console.log(
    `Collected ${currentPage.factions.length} current Listbot factions and ` +
      `${apiOnlyFactionCount} API-only catalogs`
  )
  console.log(`Listbot game-data fallback version ${gameData.version}`)
  console.log(`Wrote ${corpus.coverage.armyFactions} army rosters (${corpus.coverage.armyUnitEntries} units)`)
  console.log(
    `Wrote ${corpus.coverage.supplementalFactions} supplemental rosters ` +
      `(${corpus.coverage.supplementalUnitEntries} units)`
  )
  console.log(
    `Resolved ${resolvedUnitEntries}/${resolvedUnitEntries + unresolvedUnitEntries} AoS 4 army unit entries`
  )
  console.log(`Manifest: ${path.join(options.output, 'manifest.json')}`)
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  run().catch(error => {
    console.error(error)
    process.exitCode = 1
  })
}
