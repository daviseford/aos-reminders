import { TSupportedFaction } from 'meta/factions'
import { TRealms } from 'types/realmscapes'
import { uniq } from 'lodash'
import { IImportedArmy } from 'types/import'
import { titleCase } from 'utils/textUtils'
import { azyrFactionNameMap } from './options'

// [
//   'FACTION: Seraphon',
//   'UNIT: Slann Starmaster',
//   'UNIT: Engine of the Gods',
//   'UNIT: Saurus Astrolith Bearer',
//   'UNIT: Skink Priest',
//   'UNIT: Saurus Warriors',
//   'BATTALION: Fangs of Sotek',
//   'BATTALION: Sunclaw Starhost',
// ]
const lookup = {
  ALLEGIANCE: 'allegiances',
  ARTEFACT: 'artifacts',
  BATTALION: 'battalions',
  'ENDLESS SPELL': 'endless_spells',
  SCENERY: 'scenery',
  SPELL: 'spells',
  'COMMAND TRAIT': 'traits',
  'MOUNT TRAIT': 'traits',
  UNIT: 'units',
}

const prefixTypes = [
  'ALLEGIANCE',
  // 'ALLY',
  'ARTEFACT',
  'BATTALION',
  'COMMAND TRAIT',
  'ENDLESS SPELL',
  // 'FACTION',
  // 'MERCENARY COMPANY',
  'MOUNT TRAIT',
  // 'REALMSCAPE',
  'SPELL',
  'UNIT',
  // 'UPGRADE',
  // 'WEAPON',
]

export const getAzyrArmy = (pages: string[]): IImportedArmy => {
  let factionName = ''
  let realmscape: TRealms | null = null
  let allyUnits: string[] = []
  let unknownSelections: string[] = []

  const selections = pages.reduce(
    (accum, name) => {
      if (name.startsWith('FACTION:')) {
        factionName = name.replace('FACTION: ', '')
        factionName = azyrFactionNameMap[factionName]
        if (!factionName) console.log('ALERT: Missing this faction: ' + name)
        return accum
      }

      if (name.startsWith('REALMSCAPE:')) {
        realmscape = titleCase(name.replace('REALMSCAPE: ', '')) as TRealms
        return accum
      }

      if (name.startsWith('ALLY:')) {
        name = name.replace('ALLY: ', '')
        allyUnits.push(name)
        return accum
      }

      if (name.startsWith('MERCENARY COMPANY:')) {
        name = name.replace('MERCENARY COMPANY: ', '')
        allyUnits.push(name)
        return accum
      }

      if (name.startsWith('WEAPON:')) {
        name = name.replace('WEAPON: ', '')
        unknownSelections.push(name)
        return accum
      }

      if (name.startsWith('UPGRADE:')) {
        name = name.replace('UPGRADE: ', '')
        unknownSelections.push(name)
        return accum
      }

      let found = false

      prefixTypes.forEach(pre => {
        if (found) return
        if (name.startsWith(`${pre}:`)) {
          name = name.replace(`${pre}: `, '')
          accum[lookup[pre]] = accum[lookup[pre]].concat(name)
          found = true
          return accum
        }
      })

      return accum
    },
    {
      allegiances: [] as string[],
      artifacts: [] as string[],
      battalions: [] as string[],
      commands: [] as string[],
      endless_spells: [] as string[],
      scenery: [] as string[],
      spells: [] as string[],
      traits: [] as string[],
      triumphs: [] as string[],
      units: [] as string[],
    }
  )

  return {
    allyFactionNames: [],
    allySelections: {},
    allyUnits: uniq(allyUnits),
    errors: [],
    factionName: factionName as TSupportedFaction,
    realmscape_feature: null,
    realmscape,
    selections,
    unknownSelections: [],
  }
}
