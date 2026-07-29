/**
 * Ingest a New Recruit export triple into the fixture corpus.
 *
 * Takes the three files New Recruit's Export dialog downloads (`<name>.ros`, `<name>.rosz`,
 * `<name>.json`), verifies the corpus invariants BEFORE anything is written, then creates
 * `lists/<id>/` with the files committed byte-for-byte, a scaffolded `meta.json` whose
 * composition counts are computed from the roster itself, and a regenerated manifest.
 *
 * Usage (see src/tests/fixtures/aos4/import/new-recruit/CAPTURE.md for the full procedure):
 *
 *   yarn fixtures:new-recruit:ingest <name> [options]
 *
 *   <name>            Base name of the downloaded files — name the list its fixture id in
 *                     New Recruit and this is also the fixture id.
 *   --id <id>         Fixture id when it differs from <name>.
 *   --from <dir>      Directory holding the downloads. Default: ~/Downloads
 *   --description "…" meta.json description. Default: a TODO placeholder.
 *   --shapes a,b,c    Coverage shapes this list exercises. Default: needs-classification —
 *                     replace it before committing.
 *   --illegal m1,m2   Marks the list as not legal for play, with New Recruit's marker strings
 *                     (e.g. "Illegal Units,Undersize Unit"). Markers must appear in the .ros.
 *   --share-url <url> New Recruit share link, when the list is synced to an account.
 *   --captured-by <n> Recorded in provenance. Default: the OS username.
 *   --force           Overwrite an existing fixture directory of the same id.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { homedir, userInfo } from 'node:os'
import path from 'node:path'
import {
  canonicalize,
  describeDifferences,
  parseRosterXml,
  readZipEntries,
  xmlToRosterJson,
} from './newRecruit'
import { FORMATS, LISTS_ROOT, writeManifest } from './newRecruitManifest'
import { createHash } from 'node:crypto'

interface Options {
  name: string
  id: string
  from: string
  description: string
  shapes: string[]
  illegalMarkers: string[] | null
  shareUrl: string | null
  capturedBy: string
  force: boolean
}

const usage = (): never => {
  console.error('Usage: yarn fixtures:new-recruit:ingest <name> [--id <id>] [--from <dir>]')
  console.error('  [--description "…"] [--shapes a,b,c] [--illegal m1,m2] [--share-url <url>]')
  console.error('  [--captured-by <name>] [--force]')
  process.exit(2)
}

const parseArgs = (argv: string[]): Options => {
  const positional: string[] = []
  const flags = new Map<string, string | true>()

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index]
    if (!arg.startsWith('--')) {
      positional.push(arg)
      continue
    }
    const key = arg.slice(2)
    if (key === 'force') flags.set(key, true)
    else {
      const value = argv[index + 1]
      if (value === undefined || value.startsWith('--')) usage()
      flags.set(key, value)
      index += 1
    }
  }

  if (positional.length !== 1) usage()
  const name = positional[0]
  const list = (value: string | true | undefined): string[] =>
    typeof value === 'string'
      ? value
          .split(',')
          .map(item => item.trim())
          .filter(Boolean)
      : []

  return {
    name,
    id: typeof flags.get('id') === 'string' ? (flags.get('id') as string) : name,
    from:
      typeof flags.get('from') === 'string'
        ? (flags.get('from') as string)
        : path.join(homedir(), 'Downloads'),
    description:
      typeof flags.get('description') === 'string'
        ? (flags.get('description') as string)
        : 'TODO: describe what this list is and which shapes it was built to exercise.',
    shapes: flags.has('shapes') ? list(flags.get('shapes')) : ['needs-classification'],
    illegalMarkers: flags.has('illegal') ? list(flags.get('illegal')) : null,
    shareUrl: typeof flags.get('share-url') === 'string' ? (flags.get('share-url') as string) : null,
    capturedBy:
      typeof flags.get('captured-by') === 'string'
        ? (flags.get('captured-by') as string)
        : userInfo().username,
    force: flags.get('force') === true,
  }
}

const sha256 = (data: Buffer): string => createHash('sha256').update(data).digest('hex')

/** Same traversal as importFixtures.test.ts — the counts it asserts must match what we write. */
const countComposition = (roster: Record<string, unknown>) => {
  let totalSelections = 0
  let unitSelections = 0
  let modelCount = 0
  let profiles = 0
  let characteristics = 0
  let nestedForces = 0

  const walk = (value: unknown): void => {
    if (Array.isArray(value)) return value.forEach(walk)
    if (!value || typeof value !== 'object') return
    for (const [key, item] of Object.entries(value as Record<string, unknown>)) {
      if (Array.isArray(item)) {
        if (key === 'profiles') profiles += item.length
        if (key === 'characteristics') characteristics += item.length
        if (key === 'forces') nestedForces += item.length
        if (key === 'selections') {
          for (const selection of item as Array<Record<string, unknown>>) {
            totalSelections += 1
            if (selection.type === 'unit') unitSelections += 1
            if (selection.type === 'model') modelCount += Number(selection.number ?? 1)
          }
        }
      }
      walk(item)
    }
  }
  walk(roster)

  const forces = Array.isArray(roster.forces) ? roster.forces.length : 0
  return {
    forces,
    nestedForces: nestedForces - forces,
    unitSelections,
    modelCount,
    totalSelections,
    profiles,
    characteristics,
  }
}

const PERSONAL_FIELDS = ['author', 'user', 'username', 'email', 'owner', 'player', 'notes', 'note']

const collectKeys = (value: unknown, into: Set<string>): void => {
  if (Array.isArray(value)) return value.forEach(item => collectKeys(item, into))
  if (!value || typeof value !== 'object') return
  for (const [key, item] of Object.entries(value as Record<string, unknown>)) {
    into.add(key)
    collectKeys(item, into)
  }
}

const main = (): void => {
  const options = parseArgs(process.argv.slice(2))

  const sources = Object.fromEntries(
    FORMATS.map(format => {
      const file = path.join(options.from, `${options.name}.${format}`)
      if (!existsSync(file)) {
        console.error(`Missing export: ${file}`)
        console.error('Export all three formats from the New Recruit Export dialog first.')
        process.exit(1)
      }
      return [format, readFileSync(file)]
    })
  ) as Record<(typeof FORMATS)[number], Buffer>

  // Invariant 1: .rosz is a single-entry, unencrypted zip byte-identical to .ros.
  const entries = readZipEntries(sources.rosz).filter(entry => entry.name.toLowerCase().endsWith('.ros'))
  if (entries.length !== 1)
    throw new Error(`.rosz must contain exactly one roster entry, found ${entries.length}`)
  if (entries[0].encrypted) throw new Error('.rosz roster entry is encrypted')
  if (sha256(entries[0].data) !== sha256(sources.ros)) {
    throw new Error('.rosz payload is not byte-identical to .ros — re-export both, do not edit files')
  }

  // Invariant 2: .json is an exact transliteration of .ros.
  const fromXml = { roster: xmlToRosterJson(parseRosterXml(sources.ros.toString('utf8'))) }
  const fromJson = JSON.parse(sources.json.toString('utf8'))
  const differences = describeDifferences(canonicalize(fromXml), canonicalize(fromJson))
  if (differences.length > 0) {
    throw new Error(`.json does not transliterate .ros:\n  ${differences.join('\n  ')}`)
  }

  const roster = fromJson.roster as Record<string, unknown>
  const forces = (roster.forces ?? []) as Array<Record<string, unknown>>
  if (forces.length === 0) throw new Error('Roster has no forces')
  const primaryForce = forces[0]

  if (roster.gameSystemName !== 'Age of Sigmar 4.0') {
    console.warn(
      `Warning: gameSystemName is "${roster.gameSystemName}" — wrong-game fixtures belong in adversarial/`
    )
  }

  const personal = new Set<string>()
  collectKeys(fromJson, personal)
  const personalHits = PERSONAL_FIELDS.filter(field => personal.has(field))
  if (personalHits.length > 0) {
    throw new Error(
      `Export contains personal fields: ${personalHits.join(', ')}. ` +
        'Redact per README.md ("Sanitisation") before ingesting.'
    )
  }

  const costLimit = ((roster.costLimits ?? []) as Array<Record<string, unknown>>)[0]
  const rulesContext = String(primaryForce.name ?? '').replace(/^[^\p{L}\p{N}]+\s*/u, '')

  const meta = {
    id: options.id,
    description: options.description,
    faction: primaryForce.catalogueName,
    rulesContext,
    pointsLimit: costLimit ? Number(costLimit.value) : 0,
    provenance: {
      source: 'own-account',
      ...(options.shareUrl ? { shareUrl: options.shareUrl } : {}),
      capturedOn: new Date().toISOString().slice(0, 10),
      capturedBy: options.capturedBy,
      formats: [...FORMATS],
    },
    generator: {
      generatedBy: roster.generatedBy,
      battleScribeVersion: String(roster.battleScribeVersion),
      gameSystemName: roster.gameSystemName,
      gameSystemId: roster.gameSystemId,
      gameSystemRevision: roster.gameSystemRevision,
      catalogueName: primaryForce.catalogueName,
      catalogueRevision: primaryForce.catalogueRevision,
    },
    composition: countComposition(roster),
    shapes: options.shapes,
    legality: options.illegalMarkers
      ? {
          legalForPlay: false,
          markers: options.illegalMarkers,
          expectation:
            'Imports cleanly and completely. Legality markers are discarded, never surfaced as diagnostics.',
        }
      : { legalForPlay: true },
    sanitisation: {
      audited: true,
      redactions: [],
      note:
        'Automated audit at ingest found no personal fields. Files are committed byte-for-byte ' +
        'as exported so the .rosz/.ros byte-identity invariant holds.',
    },
  }

  if (options.illegalMarkers) {
    const ros = sources.ros.toString('utf8')
    const missing = options.illegalMarkers.filter(marker => !ros.includes(marker))
    if (missing.length > 0) {
      throw new Error(`--illegal markers not present in the .ros: ${missing.join(', ')}`)
    }
  }

  const directory = path.join(LISTS_ROOT, options.id)
  if (existsSync(directory) && !options.force) {
    console.error(`${directory} already exists. Pass --force to overwrite.`)
    process.exit(1)
  }
  mkdirSync(directory, { recursive: true })
  for (const format of FORMATS) {
    writeFileSync(path.join(directory, `list.${format}`), sources[format])
  }
  writeFileSync(path.join(directory, 'meta.json'), `${JSON.stringify(meta, null, 2)}\n`, 'utf8')

  const manifest = writeManifest()
  const composition = meta.composition

  console.log(`Ingested ${options.id}`)
  console.log(`  faction:      ${meta.faction}`)
  console.log(`  context:      ${meta.rulesContext}`)
  console.log(`  points limit: ${meta.pointsLimit}`)
  console.log(
    `  composition:  ${composition.unitSelections} units, ${composition.modelCount} models, ` +
      `${composition.totalSelections} selections`
  )
  console.log(`  manifest:     ${manifest.totals.lists} list(s), ${manifest.totals.shapes} shape(s)`)
  if (options.shapes.includes('needs-classification')) {
    console.log('\nNOW: edit meta.json — replace shapes ["needs-classification"] with the real')
    console.log('coverage shapes and write a description. Check manifest.json → coverage for gaps.')
  }
  console.log('Then run: yarn vitest run src/tests/aos4/importFixtures.test.ts')
}

main()
