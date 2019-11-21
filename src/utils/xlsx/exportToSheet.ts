//@ts-ignore
import XLSX from 'xlsx'
import { getArmy } from 'utils/getArmy/getArmy'
import { IArmy, IInitialArmy } from 'types/army'
import { getCollection } from 'utils/getArmy/getCollection'
import { getArmyFromList } from 'meta/army_list'
import { TSupportedFaction, SUPPORTED_FACTIONS, IDONETH_DEEPKIN } from 'meta/factions'
import { titleCase } from 'utils/textUtils'

export const generateHonestWargamerSheets = () => {
  const workbook = XLSX.utils.book_new()

  // Create a sheet for every faction
  SUPPORTED_FACTIONS.forEach(x => makeWorksheet(workbook, x))
  // makeWorksheet(workbook, IDONETH_DEEPKIN)

  XLSX.writeFile(workbook, 'out.xlsx')
}

const makeWorksheet = (workbook: XLSX.WorkBook, factionName: TSupportedFaction) => {
  const { Army } = getArmyFromList(factionName)
  const Collection = getCollection(Army)
  const { Commands = [] } = Collection

  const { Abilities = [], Allegiances = [], Artifacts = [], Battalions = [], Spells = [], Traits = [] } = Army

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
    ['Allegiances'],
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
