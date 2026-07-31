import { parse, parseFragment } from 'parse5'

export const LISTBOT_GAME_DATA_URL = 'https://www.listbot.co.uk/api/gamedata/'
export const LISTBOT_GAME_DATA_VERSION_URL = 'https://www.listbot.co.uk/api/gamedata/version/'
export const LISTBOT_CURRENT_PAGE_URL = 'https://www.listbot.co.uk/listbot/'
export const LISTBOT_MISSING_FORMATION_LABEL = 'No Listbot battle formation available'

export interface ListbotArmyBinding {
  catalogFactionId: string
  apiFactionId: string
  currentPageFactionId?: string
  expectedName: string
}

export interface ListbotUnscopedUnitBinding {
  currentUnitId: string
  sourceFactionId: string
  apiUnitId: string
}

export const LISTBOT_ARMY_BINDINGS: readonly ListbotArmyBinding[] = [
  {
    catalogFactionId: 'faction:33167839-7fb5-5074-8e3e-d0d012a00398',
    apiFactionId: '5549-bece-2339-36e9',
    expectedName: 'Beasts of Chaos',
  },
  {
    catalogFactionId: 'faction:dfec0a1a-2f9c-5247-8755-a4a378b53cd6',
    apiFactionId: 'd545-cdca-9e60-ad27',
    currentPageFactionId: 'page-faction:3066',
    expectedName: 'Blades of Khorne',
  },
  {
    catalogFactionId: 'faction:a263f36c-1c76-5ded-b3af-f4c3fa9bf00b',
    apiFactionId: '9a23-9c43-868d-528e',
    expectedName: 'Bonesplitterz',
  },
  {
    catalogFactionId: 'faction:bd4c3ac6-6450-52a1-a82f-c987cfa361f0',
    apiFactionId: '42ad-8ca7-4b48-7df1',
    currentPageFactionId: 'page-faction:3057',
    expectedName: 'Cities of Sigmar',
  },
  {
    catalogFactionId: 'faction:a7ea09c4-af98-5c10-b517-cb1509879206',
    apiFactionId: '5232-3bab-5562-3172',
    currentPageFactionId: 'page-faction:3058',
    expectedName: 'Daughters of Khaine',
  },
  {
    catalogFactionId: 'faction:b6a863d4-7e16-5748-a7ab-d47627ef3e1e',
    apiFactionId: 'd731-9058-b0e5-6ff5',
    currentPageFactionId: 'page-faction:3067',
    expectedName: 'Disciples of Tzeentch',
  },
  {
    catalogFactionId: 'faction:151c54f6-a281-5cea-b5ff-3dacd3afec43',
    apiFactionId: 'b53b-1217-df2e-66d2',
    currentPageFactionId: 'page-faction:3078',
    expectedName: 'Flesh-eater Courts',
  },
  {
    catalogFactionId: 'faction:16248666-7b1f-549c-9d76-14ff340da6b8',
    apiFactionId: 'b3f9-6c96-b99a-1e71',
    currentPageFactionId: 'page-faction:3064',
    expectedName: 'Fyreslayers',
  },
  {
    catalogFactionId: 'faction:7ac1f55f-9fc1-5473-8514-ba8de2589cb0',
    apiFactionId: '9baf-c109-f621-e60',
    currentPageFactionId: 'page-faction:3076',
    expectedName: 'Gloomspite Gitz',
  },
  {
    catalogFactionId: 'faction:4df09a85-c7ef-5cba-89db-5ff0f4a0b8ed',
    apiFactionId: 'afdb-68a1-283e-3bf2',
    currentPageFactionId: 'page-faction:3068',
    expectedName: 'Hedonites of Slaanesh',
  },
  {
    catalogFactionId: 'faction:1ad30c95-35a2-5373-b003-b91d6c4e350c',
    apiFactionId: 'b7b7-cf58-4189-56ec',
    currentPageFactionId: 'page-faction:3169',
    expectedName: 'Helsmiths of Hashut',
  },
  {
    catalogFactionId: 'faction:336daaf4-fa12-57ff-9ddc-b99a6a0382f7',
    apiFactionId: '40a4-1c1c-8a00-bb65',
    currentPageFactionId: 'page-faction:3059',
    expectedName: 'Idoneth Deepkin',
  },
  {
    catalogFactionId: 'faction:a87fbd85-38ce-5199-97ad-ff8bf3262471',
    apiFactionId: '832c-fd6-a535-ffae',
    currentPageFactionId: 'page-faction:3072',
    expectedName: 'Ironjawz',
  },
  {
    catalogFactionId: 'faction:685674e4-5dc7-5a42-a92e-d0719ca2a58d',
    apiFactionId: '1100-a22f-15c6-bdea',
    currentPageFactionId: 'page-faction:3062',
    expectedName: 'Kharadron Overlords',
  },
  {
    catalogFactionId: 'faction:26c5ea0d-7e4c-5440-b7c5-ffb2bae39c42',
    apiFactionId: '8aef-b85d-b63a-ef05',
    currentPageFactionId: 'page-faction:3073',
    expectedName: 'Kruleboyz',
  },
  {
    catalogFactionId: 'faction:d9758824-d17d-5c67-b153-1efc58d7670c',
    apiFactionId: 'efc5-b8d-894c-67c6',
    currentPageFactionId: 'page-faction:3063',
    expectedName: 'Lumineth Realm-lords',
  },
  {
    catalogFactionId: 'faction:a5f0c597-152e-59a2-8505-22bae7656788',
    apiFactionId: '5079-92b5-4879-69f8',
    currentPageFactionId: 'page-faction:3069',
    expectedName: 'Maggotkin of Nurgle',
  },
  {
    catalogFactionId: 'faction:89f27eab-fd1d-5b80-9ac4-bd784f07b9e2',
    apiFactionId: '640e-6bc1-c83d-13c',
    currentPageFactionId: 'page-faction:3079',
    expectedName: 'Nighthaunt',
  },
  {
    catalogFactionId: 'faction:6e6eb059-7938-5cef-b6db-9b694bad9e15',
    apiFactionId: '6353-cb84-ac7f-9a15',
    currentPageFactionId: 'page-faction:3075',
    expectedName: 'Ogor Mawtribes',
  },
  {
    catalogFactionId: 'faction:1a7ec2eb-9a00-5589-963a-53a986197fb9',
    apiFactionId: '8e0e-5e8c-5824-89c9',
    currentPageFactionId: 'page-faction:3081',
    expectedName: 'Ossiarch Bonereapers',
  },
  {
    catalogFactionId: 'faction:2ed6da96-b5ea-5a74-a417-fe41ab0c49a8',
    apiFactionId: '4e3-e1a7-a8d4-8719',
    currentPageFactionId: 'page-faction:3060',
    expectedName: 'Seraphon',
  },
  {
    catalogFactionId: 'faction:898f1d47-6f98-59f2-b5b7-e6865b2dfb79',
    apiFactionId: '231a-2a83-26f0-a718',
    currentPageFactionId: 'page-faction:3070',
    expectedName: 'Skaven',
  },
  {
    catalogFactionId: 'faction:9d9f8a78-e619-5b8c-a4b9-51274734c50b',
    apiFactionId: '2c23-a678-196b-ad69',
    currentPageFactionId: 'page-faction:3071',
    expectedName: 'Slaves to Darkness',
  },
  {
    catalogFactionId: 'faction:c079fb1a-6436-5673-b96d-50d6eec79ac3',
    apiFactionId: 'de5f-588b-ea57-d6b5',
    currentPageFactionId: 'page-faction:3077',
    expectedName: 'Sons of Behemat',
  },
  {
    catalogFactionId: 'faction:8658a21b-51d6-5dca-b06c-b3796c00aee6',
    apiFactionId: '405e-c5f4-8579-b05c',
    currentPageFactionId: 'page-faction:3080',
    expectedName: 'Soulblight Gravelords',
  },
  {
    catalogFactionId: 'faction:5b9d7142-ce11-515b-a1bd-37bddfad592a',
    apiFactionId: '1bd9-ad7d-68ee-3b53',
    currentPageFactionId: 'page-faction:3056',
    expectedName: 'Stormcast Eternals',
  },
  {
    catalogFactionId: 'faction:1c32f94e-f417-567d-885f-e256c60a634d',
    apiFactionId: 'bb7e-b0da-5c2-a980',
    currentPageFactionId: 'page-faction:3061',
    expectedName: 'Sylvaneth',
  },
]

export const LISTBOT_UNSCOPED_UNIT_BINDINGS: readonly ListbotUnscopedUnitBinding[] = [
  {
    currentUnitId: 'page-unit:5968',
    sourceFactionId: '3103',
    apiUnitId: 'b7be-ddee-783e-9048',
  },
]

export interface ListbotFaction {
  id: string
  name: string
}

export interface ListbotUnit {
  id: string
  name: string
  factionId: string
  pointsCost: number
  isHero: boolean
  isRor: boolean
  isTerrain: boolean
  minModels: number
  abilities?: unknown
}

export interface ListbotBattleFormation {
  id: string
  name: string
  factionId: string
  isAor: boolean
}

export interface ListbotGameData {
  version: string
  factions: ListbotFaction[]
  units: ListbotUnit[]
  battleFormations: ListbotBattleFormation[]
}

export interface ListbotCurrentPageData {
  factions: ListbotFaction[]
  units: ListbotUnit[]
  unscopedUnits: ListbotUnscopedUnit[]
}

export interface ListbotUnscopedUnit extends Omit<ListbotUnit, 'factionId'> {
  sourceFactionId: string
}

export interface ListbotReconciledUnscopedUnit {
  currentUnitId: string
  sourceFactionId: string
  factionName: string
  apiUnitId: string
}

export interface ListbotSourceDrift {
  factionName: string
  apiUnitEntries: number
  currentUnitEntries: number
  onlyInApi: string[]
  onlyInCurrent: string[]
}

export interface ListbotVersionMarker {
  version: string
  factionCount: number
  unitCount: number
}

export interface ListbotCoverageRoster {
  category: 'army' | 'supplemental'
  factionId: string
  factionName: string
  formation: { id: string; name: string } | null
  file: string
  unitCount: number
  totalPoints: number
  heroCount: number
  regimentOfRenownCount: number
  terrainCount: number
  text: string
}

export interface ListbotCoverageCorpus {
  version: string
  coverage: {
    sourceFactions: number
    emptySourceFactions: number
    sourceUnitEntries: number
    armyFactions: number
    armyUnitEntries: number
    supplementalFactions: number
    supplementalUnitEntries: number
    uncoveredUnitEntries: number
  }
  emptyFactions: Array<{ id: string; name: string }>
  missingArmyFactionIds: string[]
  emptyArmyFactionIds: string[]
  rosters: ListbotCoverageRoster[]
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const requiredString = (record: Record<string, unknown>, field: string, owner: string): string => {
  const value = record[field]
  if (typeof value !== 'string' || !value.trim()) {
    throw new Error(`${owner}.${field} must be a non-empty string`)
  }
  if (/[\r\n]/.test(value)) throw new Error(`${owner}.${field} must fit on one line`)
  return value.trim()
}

const requiredBoolean = (record: Record<string, unknown>, field: string, owner: string): boolean => {
  const value = record[field]
  if (typeof value !== 'boolean') throw new Error(`${owner}.${field} must be a boolean`)
  return value
}

const requiredInteger = (
  record: Record<string, unknown>,
  field: string,
  owner: string,
  minimum: number
): number => {
  const value = record[field]
  if (typeof value !== 'number' || !Number.isInteger(value) || value < minimum) {
    throw new Error(`${owner}.${field} must be an integer greater than or equal to ${minimum}`)
  }
  return value
}

const requiredArray = (record: Record<string, unknown>, field: string): unknown[] => {
  const value = record[field]
  if (!Array.isArray(value)) throw new Error(`Listbot game data ${field} must be an array`)
  return value
}

export const parseListbotVersionMarker = (value: unknown): ListbotVersionMarker => {
  if (!isRecord(value)) throw new Error('Listbot game-data version marker must be an object')
  return {
    version: requiredString(value, 'version', 'versionMarker'),
    factionCount: requiredInteger(value, 'factionCount', 'versionMarker', 0),
    unitCount: requiredInteger(value, 'unitCount', 'versionMarker', 0),
  }
}

const parseFaction = (value: unknown, index: number): ListbotFaction => {
  if (!isRecord(value)) throw new Error(`Listbot faction ${index} must be an object`)
  return {
    id: requiredString(value, 'id', `factions[${index}]`),
    name: requiredString(value, 'name', `factions[${index}]`),
  }
}

const parseUnit = (value: unknown, index: number): ListbotUnit => {
  if (!isRecord(value)) throw new Error(`Listbot unit ${index} must be an object`)
  return {
    id: requiredString(value, 'id', `units[${index}]`),
    name: requiredString(value, 'name', `units[${index}]`),
    factionId: requiredString(value, 'factionId', `units[${index}]`),
    pointsCost: requiredInteger(value, 'pointsCost', `units[${index}]`, 0),
    isHero: requiredBoolean(value, 'isHero', `units[${index}]`),
    isRor: requiredBoolean(value, 'isRor', `units[${index}]`),
    isTerrain: requiredBoolean(value, 'isTerrain', `units[${index}]`),
    minModels: requiredInteger(value, 'minModels', `units[${index}]`, 1),
  }
}

const parseBattleFormation = (value: unknown, index: number): ListbotBattleFormation => {
  if (!isRecord(value)) throw new Error(`Listbot battle formation ${index} must be an object`)
  return {
    id: requiredString(value, 'id', `battleFormations[${index}]`),
    name: requiredString(value, 'name', `battleFormations[${index}]`),
    factionId: requiredString(value, 'factionId', `battleFormations[${index}]`),
    isAor: requiredBoolean(value, 'isAor', `battleFormations[${index}]`),
  }
}

const assertUnique = <T>(values: readonly T[], identity: (value: T) => string, label: string): void => {
  const seen = new Set<string>()
  values.forEach(value => {
    const id = identity(value)
    if (seen.has(id)) throw new Error(`Duplicate Listbot ${label}: ${id}`)
    seen.add(id)
  })
}

const assertSnapshotIntegrity = (snapshot: ListbotGameData): void => {
  assertUnique(snapshot.factions, faction => faction.id, 'faction identity')
  assertUnique(snapshot.factions, faction => faction.name, 'faction name')
  assertUnique(snapshot.battleFormations, formation => formation.id, 'battle formation identity')

  const factionIds = new Set(snapshot.factions.map(faction => faction.id))
  const unitIdentities = new Set<string>()
  snapshot.units.forEach(unit => {
    const identity = `${unit.factionId}\u0000${unit.id}`
    if (unitIdentities.has(identity)) {
      throw new Error(`Duplicate Listbot unit identity in faction ${unit.factionId}: ${unit.id}`)
    }
    unitIdentities.add(identity)
    if (!factionIds.has(unit.factionId)) {
      throw new Error(`Listbot unit ${unit.id} refers to unknown faction ${unit.factionId}`)
    }
  })
  snapshot.battleFormations.forEach(formation => {
    if (!factionIds.has(formation.factionId)) {
      throw new Error(
        `Listbot battle formation ${formation.id} refers to unknown faction ${formation.factionId}`
      )
    }
  })
}

export const parseListbotGameData = (value: unknown): ListbotGameData => {
  if (!isRecord(value)) throw new Error('Listbot game data must be an object')
  const snapshot = {
    version: requiredString(value, 'version', 'gameData'),
    factions: requiredArray(value, 'factions').map(parseFaction),
    units: requiredArray(value, 'units').map(parseUnit),
    battleFormations: requiredArray(value, 'battleFormations').map(parseBattleFormation),
  }
  assertSnapshotIntegrity(snapshot)
  return snapshot
}

interface HtmlNode {
  nodeName?: string
  attrs?: Array<{ name: string; value: string }>
  childNodes?: HtmlNode[]
  value?: string
}

const descendants = (node: HtmlNode): HtmlNode[] => [node, ...(node.childNodes ?? []).flatMap(descendants)]

const attribute = (node: HtmlNode, name: string): string | undefined =>
  node.attrs?.find(item => item.name === name)?.value

const htmlText = (node: HtmlNode): string => node.value ?? (node.childNodes ?? []).map(htmlText).join('')

const decodeHtmlText = (value: string): string => htmlText(parseFragment(value) as unknown as HtmlNode).trim()

const requiredScriptString = (block: string, property: string, owner: string): string => {
  const value = block.match(new RegExp(`^\\s*'${property}':\\s*'([^']*)',?\\s*$`, 'm'))?.[1]
  if (value === undefined) throw new Error(`${owner}.${property} must be a quoted string`)
  const decoded = decodeHtmlText(value)
  if (!decoded || /[\r\n]/.test(decoded)) {
    throw new Error(`${owner}.${property} must be a non-empty single-line string`)
  }
  return decoded
}

const requiredScriptInteger = (block: string, property: string, owner: string, minimum: number): number => {
  const value = block.match(new RegExp(`^\\s*'${property}':\\s*(\\d+),?\\s*$`, 'm'))?.[1]
  const parsed = value === undefined ? Number.NaN : Number(value)
  if (!Number.isInteger(parsed) || parsed < minimum) {
    throw new Error(`${owner}.${property} must be an integer greater than or equal to ${minimum}`)
  }
  return parsed
}

const optionalScriptBoolean = (
  block: string,
  property: string,
  owner: string,
  fallback: boolean
): boolean => {
  const value = block.match(new RegExp(`^\\s*'${property}':\\s*([^,\\r\\n]+),?\\s*$`, 'm'))?.[1]
  if (value === undefined) return fallback
  if (value !== 'true' && value !== 'false') {
    throw new Error(`${owner}.${property} must be a boolean when present`)
  }
  return value === 'true'
}

export const parseListbotCurrentPage = (html: string): ListbotCurrentPageData => {
  const document = parse(html) as unknown as HtmlNode
  const nodes = descendants(document)
  const factionSelect = nodes.find(
    node =>
      node.nodeName === 'select' &&
      (attribute(node, 'class') ?? '').split(/\s+/).filter(Boolean).includes('faction-select')
  )
  if (!factionSelect) throw new Error('Listbot current page is missing its faction selector')

  const factions = descendants(factionSelect)
    .filter(node => node.nodeName === 'option' && Boolean(attribute(node, 'value')))
    .map(node => {
      const rawId = attribute(node, 'value') as string
      if (!/^\d+$/.test(rawId)) throw new Error(`Listbot current faction id is not numeric: ${rawId}`)
      const name = htmlText(node).trim()
      if (!name || /[\r\n]/.test(name)) {
        throw new Error(`Listbot current faction ${rawId} must have a single-line name`)
      }
      return { id: `page-faction:${rawId}`, name }
    })
  assertUnique(factions, faction => faction.id, 'current faction identity')
  assertUnique(factions, faction => faction.name, 'current faction name')

  const factionIds = new Map(factions.map(faction => [faction.id.slice('page-faction:'.length), faction.id]))
  const script = nodes
    .filter(node => node.nodeName === 'script')
    .map(htmlText)
    .join('\n')
  const assignmentPattern = /global(Hero|Unit)Data\[(\d+)\]\s*=\s*\{([\s\S]*?)^\s*\}/gm
  const assignmentKeys = new Set<string>()
  const units: ListbotUnit[] = []
  const unscopedUnits: ListbotUnscopedUnit[] = []
  for (const match of Array.from(script.matchAll(assignmentPattern))) {
    const kind = match[1]
    const rawId = match[2]
    const assignmentKey = `${kind}:${rawId}`
    if (assignmentKeys.has(assignmentKey)) {
      throw new Error(`Duplicate Listbot current data assignment: global${kind}Data[${rawId}]`)
    }
    assignmentKeys.add(assignmentKey)
    const block = match[3]
    const owner = `global${kind}Data[${rawId}]`
    const declaredId = requiredScriptInteger(block, 'id', owner, 1)
    if (String(declaredId) !== rawId) {
      throw new Error(`${owner}.id does not match its assignment key`)
    }
    const rawFactionId = String(requiredScriptInteger(block, 'factionId', owner, 1))
    const factionId = factionIds.get(rawFactionId)
    const isHero = optionalScriptBoolean(block, 'isHero', owner, kind === 'Hero')
    if (isHero !== (kind === 'Hero')) {
      throw new Error(`${owner}.isHero conflicts with its Listbot data collection`)
    }
    const unit = {
      id: `page-unit:${rawId}`,
      name: requiredScriptString(block, 'name', owner),
      pointsCost: requiredScriptInteger(block, 'pointsCost', owner, 0),
      isHero,
      isRor: optionalScriptBoolean(block, 'isRor', owner, false),
      isTerrain: false,
      minModels: kind === 'Hero' ? 1 : requiredScriptInteger(block, 'numberOfModels', owner, 1),
    }
    if (factionId) {
      units.push({ ...unit, factionId })
    } else {
      unscopedUnits.push({ ...unit, sourceFactionId: rawFactionId })
    }
  }
  if (!units.length && !unscopedUnits.length) {
    throw new Error('Listbot current page did not contain any unit data')
  }
  assertSnapshotIntegrity({
    version: 'current-page',
    factions,
    units,
    battleFormations: [],
  })
  assertUnique(unscopedUnits, unit => unit.id, 'unscoped current unit identity')
  return { factions, units, unscopedUnits }
}

const sortedNames = (values: readonly ListbotUnit[]): string[] =>
  Array.from(new Set(values.map(value => value.name))).sort(compareText)

const scopeUnit = (unit: ListbotUnscopedUnit, factionId: string): ListbotUnit => ({
  id: unit.id,
  name: unit.name,
  factionId,
  pointsCost: unit.pointsCost,
  isHero: unit.isHero,
  isRor: unit.isRor,
  isTerrain: unit.isTerrain,
  minModels: unit.minModels,
})

export const mergeListbotGameData = (
  api: ListbotGameData,
  current: ListbotCurrentPageData,
  armyBindings: readonly ListbotArmyBinding[],
  unscopedUnitBindings: readonly ListbotUnscopedUnitBinding[] = []
): {
  gameData: ListbotGameData
  drift: ListbotSourceDrift[]
  reconciledUnscopedUnits: ListbotReconciledUnscopedUnit[]
} => {
  assertSnapshotIntegrity(api)
  const apiFactionById = new Map(api.factions.map(faction => [faction.id, faction]))
  const currentFactionById = new Map(current.factions.map(faction => [faction.id, faction]))
  assertUnique(armyBindings, binding => binding.catalogFactionId, 'catalog faction binding')
  assertUnique(armyBindings, binding => binding.apiFactionId, 'API faction binding')
  assertUnique(
    armyBindings.filter(binding => binding.currentPageFactionId),
    binding => binding.currentPageFactionId as string,
    'current-page faction binding'
  )
  assertUnique(unscopedUnitBindings, binding => binding.currentUnitId, 'unscoped current unit binding')
  assertUnique(unscopedUnitBindings, binding => binding.apiUnitId, 'unscoped API unit binding')

  const bindingByApiFactionId = new Map(armyBindings.map(binding => [binding.apiFactionId, binding]))
  const bindingByCurrentFactionId = new Map(
    armyBindings.flatMap(binding =>
      binding.currentPageFactionId ? [[binding.currentPageFactionId, binding] as const] : []
    )
  )
  armyBindings.forEach(binding => {
    const apiFaction = apiFactionById.get(binding.apiFactionId)
    if (!apiFaction) {
      throw new Error(`Listbot API is missing bound faction ${binding.apiFactionId}`)
    }
    if (apiFaction.name !== binding.expectedName) {
      throw new Error(
        `Listbot API faction ${binding.apiFactionId} name changed: ` +
          `${apiFaction.name} != ${binding.expectedName}`
      )
    }
    if (!binding.currentPageFactionId) return
    const currentFaction = currentFactionById.get(binding.currentPageFactionId)
    if (!currentFaction) {
      throw new Error(`Listbot current page is missing bound faction ${binding.currentPageFactionId}`)
    }
    if (currentFaction.name !== binding.expectedName) {
      throw new Error(
        `Listbot current faction ${binding.currentPageFactionId} name changed: ` +
          `${currentFaction.name} != ${binding.expectedName}`
      )
    }
  })
  current.factions.forEach(faction => {
    if (!bindingByCurrentFactionId.has(faction.id)) {
      throw new Error(`Listbot current faction ${faction.id} has no stable binding`)
    }
  })

  const apiUnitById = new Map(api.units.map(unit => [unit.id, unit]))
  const unscopedUnitById = new Map(current.unscopedUnits.map(unit => [unit.id, unit]))
  const reconciledUnscopedUnits: ListbotReconciledUnscopedUnit[] = []
  current.unscopedUnits.forEach(unit => {
    if (!unscopedUnitBindings.some(binding => binding.currentUnitId === unit.id)) {
      throw new Error(
        `Listbot current unit ${unit.id} from unselectable faction ${unit.sourceFactionId} ` +
          'has no stable binding'
      )
    }
  })
  const reconciledUnits = unscopedUnitBindings.map(binding => {
    const unit = unscopedUnitById.get(binding.currentUnitId)
    if (!unit || unit.sourceFactionId !== binding.sourceFactionId) {
      throw new Error(`Listbot unscoped unit binding ${binding.currentUnitId} no longer matches the page`)
    }
    const apiUnit = apiUnitById.get(binding.apiUnitId)
    if (!apiUnit) throw new Error(`Listbot API is missing bound unit ${binding.apiUnitId}`)
    const factionBinding = bindingByApiFactionId.get(apiUnit.factionId)
    if (!factionBinding?.currentPageFactionId) {
      throw new Error(`Listbot API unit ${apiUnit.id} does not map to a current-page army`)
    }
    const compositionMatches =
      apiUnit.name === unit.name &&
      apiUnit.pointsCost === unit.pointsCost &&
      apiUnit.minModels === unit.minModels &&
      apiUnit.isHero === unit.isHero &&
      apiUnit.isRor === unit.isRor &&
      apiUnit.isTerrain === unit.isTerrain
    if (!compositionMatches) {
      throw new Error(`Listbot unscoped unit binding ${binding.currentUnitId} changed composition`)
    }
    reconciledUnscopedUnits.push({
      currentUnitId: unit.id,
      sourceFactionId: unit.sourceFactionId,
      factionName: factionBinding.expectedName,
      apiUnitId: apiUnit.id,
    })
    return scopeUnit(unit, factionBinding.currentPageFactionId)
  })
  const currentUnits = [...current.units, ...reconciledUnits]
  const mergedFactions = api.factions.map(
    faction =>
      currentFactionById.get(bindingByApiFactionId.get(faction.id)?.currentPageFactionId ?? '') ?? faction
  )

  const apiFallbackUnits = api.units.filter(
    unit => !bindingByApiFactionId.get(unit.factionId)?.currentPageFactionId
  )
  const mergedFormations = api.battleFormations.map(formation => {
    const currentFactionId = bindingByApiFactionId.get(formation.factionId)?.currentPageFactionId
    return currentFactionId
      ? {
          ...formation,
          id: `api-formation:${formation.id}`,
          factionId: currentFactionId,
        }
      : formation
  })
  const gameData = {
    version: api.version,
    factions: mergedFactions,
    units: [...apiFallbackUnits, ...currentUnits],
    battleFormations: mergedFormations,
  }
  assertSnapshotIntegrity(gameData)

  const drift = armyBindings.flatMap(binding => {
    if (!binding.currentPageFactionId) return []
    const faction = currentFactionById.get(binding.currentPageFactionId) as ListbotFaction
    const apiUnits = api.units.filter(unit => unit.factionId === binding.apiFactionId)
    const factionCurrentUnits = currentUnits.filter(unit => unit.factionId === faction.id)
    const apiNames = sortedNames(apiUnits)
    const currentUnitNames = sortedNames(factionCurrentUnits)
    const apiNameSet = new Set(apiNames)
    const currentNameSet = new Set(currentUnitNames)
    return [
      {
        factionName: faction.name,
        apiUnitEntries: apiUnits.length,
        currentUnitEntries: factionCurrentUnits.length,
        onlyInApi: apiNames.filter(name => !currentNameSet.has(name)),
        onlyInCurrent: currentUnitNames.filter(name => !apiNameSet.has(name)),
      },
    ]
  })

  return { gameData, drift, reconciledUnscopedUnits }
}

const compareText = (left: string, right: string): number =>
  left.localeCompare(right, 'en', { sensitivity: 'base' }) || left.localeCompare(right, 'en')

const slugify = (value: string): string => {
  const slug = value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
  if (!slug) throw new Error(`Cannot create a file name for Listbot faction: ${value}`)
  return slug
}

const rosterText = (
  faction: ListbotFaction,
  formation: ListbotBattleFormation | undefined,
  units: ListbotUnit[]
): string => {
  const totalPoints = units.reduce((total, unit) => total + unit.pointsCost, 0)
  const dropSuffix = units.length === 1 ? 'drop' : 'drops'
  return [
    faction.name,
    formation?.name ?? LISTBOT_MISSING_FORMATION_LABEL,
    '',
    ...units.map(unit => `- ${unit.minModels} x ${unit.name} (${unit.pointsCost})`),
    '',
    `${totalPoints}/2000pts`,
    `${units.length} ${dropSuffix}`,
    '',
    'Generated by Listbot 4.0',
    '',
  ].join('\n')
}

export const createListbotCoverageCorpus = (
  snapshot: ListbotGameData,
  armyFactionIds: readonly string[]
): ListbotCoverageCorpus => {
  assertSnapshotIntegrity(snapshot)
  const acceptedArmies = new Set(armyFactionIds)
  if (acceptedArmies.size !== armyFactionIds.length) {
    throw new Error('The accepted Listbot army-faction ID list contains duplicates')
  }

  const unitsByFaction = new Map<string, ListbotUnit[]>()
  const formationsByFaction = new Map<string, ListbotBattleFormation[]>()
  const rosters: ListbotCoverageRoster[] = []
  const emptyFactions: Array<{ id: string; name: string }> = []
  const usedFiles = new Set<string>()

  snapshot.units.forEach(unit => {
    unitsByFaction.set(unit.factionId, [...(unitsByFaction.get(unit.factionId) ?? []), unit])
  })
  snapshot.battleFormations.forEach(formation => {
    formationsByFaction.set(formation.factionId, [
      ...(formationsByFaction.get(formation.factionId) ?? []),
      formation,
    ])
  })

  snapshot.factions
    .slice()
    .sort((left, right) => compareText(left.name, right.name) || compareText(left.id, right.id))
    .forEach(faction => {
      const units = (unitsByFaction.get(faction.id) ?? [])
        .slice()
        .sort((left, right) => compareText(left.name, right.name) || compareText(left.id, right.id))
      if (!units.length) {
        emptyFactions.push({ id: faction.id, name: faction.name })
        return
      }

      const category = acceptedArmies.has(faction.id) ? 'army' : 'supplemental'
      const file = `${category === 'army' ? 'armies' : 'supplemental'}/${slugify(faction.name)}.txt`
      if (usedFiles.has(file)) throw new Error(`Duplicate Listbot corpus file name: ${file}`)
      usedFiles.add(file)

      const formation = (formationsByFaction.get(faction.id) ?? [])
        .slice()
        .sort(
          (left, right) =>
            Number(left.isAor) - Number(right.isAor) ||
            compareText(left.name, right.name) ||
            compareText(left.id, right.id)
        )[0]
      rosters.push({
        category,
        factionId: faction.id,
        factionName: faction.name,
        formation: formation ? { id: formation.id, name: formation.name } : null,
        file,
        unitCount: units.length,
        totalPoints: units.reduce((total, unit) => total + unit.pointsCost, 0),
        heroCount: units.filter(unit => unit.isHero).length,
        regimentOfRenownCount: units.filter(unit => unit.isRor).length,
        terrainCount: units.filter(unit => unit.isTerrain).length,
        text: rosterText(faction, formation, units),
      })
    })

  const sourceFactionIds = new Set(snapshot.factions.map(faction => faction.id))
  const missingArmyFactionIds = Array.from(acceptedArmies)
    .filter(id => !sourceFactionIds.has(id))
    .sort(compareText)
  const emptyFactionIds = new Set(emptyFactions.map(faction => faction.id))
  const emptyArmyFactionIds = Array.from(acceptedArmies)
    .filter(id => emptyFactionIds.has(id))
    .sort(compareText)
  const armyRosters = rosters.filter(roster => roster.category === 'army')
  const supplementalRosters = rosters.filter(roster => roster.category === 'supplemental')
  const armyUnitEntries = armyRosters.reduce((total, roster) => total + roster.unitCount, 0)
  const supplementalUnitEntries = supplementalRosters.reduce((total, roster) => total + roster.unitCount, 0)
  const coveredUnitEntries = armyUnitEntries + supplementalUnitEntries

  return {
    version: snapshot.version,
    coverage: {
      sourceFactions: snapshot.factions.length,
      emptySourceFactions: emptyFactions.length,
      sourceUnitEntries: snapshot.units.length,
      armyFactions: armyRosters.length,
      armyUnitEntries,
      supplementalFactions: supplementalRosters.length,
      supplementalUnitEntries,
      uncoveredUnitEntries: snapshot.units.length - coveredUnitEntries,
    },
    emptyFactions,
    missingArmyFactionIds,
    emptyArmyFactionIds,
    rosters,
  }
}
