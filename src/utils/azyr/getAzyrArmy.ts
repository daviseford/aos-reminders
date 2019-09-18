import { TSupportedFaction } from 'meta/factions'
import { TRealms } from 'types/realmscapes'
import { uniq } from 'lodash'

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
  'ENDLESS SPELLS': 'endless_spells',
  SCENERY: 'scenery',
  SPELLS: 'spells',
  'COMMAND TRAIT': 'traits',
  'MOUNT TRAIT': 'traits',
  UNIT: 'units',
}

const prefixTypes = [
  'ALLEGIANCE',
  // 'ALLY',
  'ARTIFACT',
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
  'WEAPON',
]

export const getAzyrArmy = (pages: string[]) => {
  let factionName = ''
  let realmscape = ''
  let allyUnits: string[] = []

  const selections = pages.reduce(
    (accum, name) => {
      if (name.startsWith('FACTION:')) {
        factionName = name.replace('FACTION: ', '')
        return accum
      }

      if (name.startsWith('REALMSCAPE:')) {
        realmscape = name.replace('REALMSCAPE: ', '')
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
