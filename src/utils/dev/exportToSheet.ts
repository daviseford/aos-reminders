import { SUPPORTED_FACTIONS, TSupportedFaction } from 'meta/factions'
import { getFactionFromList } from 'meta/faction_list'
import { getCollection } from 'utils/getArmy/getCollection'
import { titleCase } from 'utils/textUtils'
import XLSX from 'xlsx'

/**
 * Prints all rules to an xlsx file
 * Requested by Rufio Symes of Honest Wargamer for an event
 */
const generateHonestWargamerSheets = () => {
  const FILENAME = 'rules_export.xlsx'

  console.log(`Generating ${FILENAME}...`)

  const workbook = XLSX.utils.book_new()

  // Create a sheet for every faction
  SUPPORTED_FACTIONS.forEach(x => makeWorksheet(workbook, x))

  XLSX.writeFile(workbook, FILENAME)

  console.log(`Done. Saved to ${FILENAME}`)
}

const makeWorksheet = (workbook: XLSX.WorkBook, factionName: TSupportedFaction) => {
  const { AggregateArmy } = getFactionFromList(factionName)
  const Collection = getCollection(AggregateArmy)
  const { CommandAbilities = [] } = Collection

  const {
    Artifacts = [],
    Battalions = [],
    BattleTraits = [],
    CommandTraits = [],
    Flavors = [],
    FlavorType = 'Flavors',
    Spells = [],
  } = AggregateArmy

  const artifacts = [...Artifacts].map(x => [x.name, ...x.effects.map(y => y.desc)])
  const battalions = [...Battalions].map(x => [x.name, ...x.effects.map(y => y.desc)])
  const battle_traits = [...BattleTraits].map(x => [x.name, x.desc])
  const command_abilitiess = [...CommandAbilities].map(x => [x.name, ...x.effects.map(y => y.desc)])
  const command_traits = [...CommandTraits].map(x => [x.name, ...x.effects.map(y => y.desc)])
  const flavors = [...Flavors].map(x => [x.name, ...x.effects.map(y => y.desc)])
  const spells = [...Spells].map(x => [x.name, ...x.effects.map(y => y.desc)])

  /* make worksheet */
  const ws = XLSX.utils.aoa_to_sheet([
    ['Faction Battle Traits'],
    ...battle_traits,
    [FlavorType],
    ...flavors,
    ['Battalions'],
    ...battalions,
    ['Command Traits'],
    ...command_traits,
    ['Spells'],
    ...spells,
    ['Command Abilities'],
    ...command_abilitiess,
    ['Artifacts'],
    ...artifacts,
  ])

  /* Add the worksheet to the workbook */
  XLSX.utils.book_append_sheet(workbook, ws, titleCase(factionName))
}

/**
 * Prints all factions + allegiances to an XLSX sheet
 * Requested by Dan of AoS Shorts
 */
const generateAoSShortsAllegianceData = () => {
  const FILENAME = 'allegiance_export.xlsx'

  console.log(`Generating ${FILENAME}...`)

  const workbook = XLSX.utils.book_new()

  const ws = XLSX.utils.aoa_to_sheet([[]]) // Create a blank worksheet

  XLSX.utils.book_append_sheet(workbook, ws, 'AoS Shorts')

  // Create a sheet for every faction
  const data = SUPPORTED_FACTIONS.map(makeAllegianceWorksheet)

  XLSX.utils.sheet_add_aoa(ws, data)

  XLSX.writeFile(workbook, 'allegiance_export.xlsx')

  console.log(`Done. Saved to ${FILENAME}`)
}

const makeAllegianceWorksheet = (factionName: TSupportedFaction) => {
  const { AggregateArmy } = getFactionFromList(factionName)
  const { Flavors = [], FlavorType = 'Flavors' } = AggregateArmy
  const flavors = [...Flavors].map(x => [x.name])

  return [[titleCase(factionName)], [FlavorType], ...flavors]
}

/** Run the scripts */
generateHonestWargamerSheets()
generateAoSShortsAllegianceData()
