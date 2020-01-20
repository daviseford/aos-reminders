import XLSX from 'xlsx'
import { SUPPORTED_FACTIONS, TSupportedFaction } from 'meta/factions'
import { getArmyFromList } from 'meta/army_list'
import { getCollection } from 'utils/getArmy/getCollection'
import { titleCase } from 'utils/textUtils'

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
  const { Army } = getArmyFromList(factionName)
  const Collection = getCollection(Army)
  const { Commands = [] } = Collection

  const {
    Abilities = [],
    Allegiances = [],
    AllegianceType = 'Allegiances',
    Artifacts = [],
    Battalions = [],
    Spells = [],
    Traits = [],
  } = Army

  const abilities = [...Abilities].map(x => [x.name, x.desc])
  const allegiances = [...Allegiances].map(x => [x.name, ...x.effects.map(y => y.desc)])
  const artifacts = [...Artifacts].map(x => [x.name, ...x.effects.map(y => y.desc)])
  const battalions = [...Battalions].map(x => [x.name, ...x.effects.map(y => y.desc)])
  const traits = [...Traits].map(x => [x.name, ...x.effects.map(y => y.desc)])
  const commands = [...Commands].map(x => [x.name, ...x.effects.map(y => y.desc)])
  const spells = [...Spells].map(x => [x.name, ...x.effects.map(y => y.desc)])

  /* make worksheet */
  const ws = XLSX.utils.aoa_to_sheet([
    ['Faction Abilities'],
    ...abilities,
    [AllegianceType],
    ...allegiances,
    ['Battalions'],
    ...battalions,
    ['Traits'],
    ...traits,
    ['Spells'],
    ...spells,
    ['Commands'],
    ...commands,
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
  const { Army } = getArmyFromList(factionName)
  const { Allegiances = [], AllegianceType = 'Allegiances' } = Army
  const allegiances = [...Allegiances].map(x => [x.name])

  return [[titleCase(factionName)], [AllegianceType], ...allegiances]
}

/** Run the scripts */
generateHonestWargamerSheets()
generateAoSShortsAllegianceData()
