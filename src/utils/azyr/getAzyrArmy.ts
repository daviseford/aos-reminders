import { uniq } from 'lodash'
import { titleCase } from 'utils/textUtils'
import { azyrFactionNameMap, factionToAllegianceMap } from './options'
import { importErrorChecker } from 'utils/import'
import { TSupportedFaction } from 'meta/factions'
import { TRealms } from 'types/realmscapes'
import { IImportedArmy } from 'types/import'

export const getAzyrArmyFromPdf = (pdfText: string[]): IImportedArmy => {
  const army = getInitialAzyrArmy(pdfText)
  const errorChecked = importErrorChecker(army, 'Azyr')

  return errorChecked
}

const selectorLookup = {
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
  'ARTEFACT',
  'BATTALION',
  'COMMAND TRAIT',
  'ENDLESS SPELL',
  'MOUNT TRAIT',
  'SPELL',
  'UNIT',
]

export const getInitialAzyrArmy = (pages: string[]): IImportedArmy => {
  let factionName = ''
  let realmscape: TRealms | null = null
  let allyUnits: string[] = []
  let unknownSelections: string[] = []

  const selections = pages.reduce(
    (accum, name) => {
      if (name.startsWith('FACTION:')) {
        const { faction, allegiance } = getFactionName(name)
        if (faction) {
          factionName = faction
        }
        if (allegiance) {
          accum.allegiances = accum.allegiances.concat(allegiance)
        }
        return accum
      }

      if (name.startsWith('REALMSCAPE:')) {
        realmscape = titleCase(name.replace('REALMSCAPE: ', '')) as TRealms
        return accum
      }

      if (name.startsWith('ALLY:') || name.startsWith('MERCENARY COMPANY:')) {
        name = name.replace(/(MERCENARY COMPANY|ALLY): /g, '')
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

      // Check all other types
      prefixTypes.forEach(pre => {
        if (found) return
        if (name.startsWith(`${pre}:`)) {
          name = name.replace(`${pre}: `, '')
          accum[selectorLookup[pre]] = accum[selectorLookup[pre]].concat(name)
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
    unknownSelections,
  }
}

const getFactionName = (val: string): { faction: string | null; allegiance: string | null } => {
  const name = val.replace('FACTION: ', '')
  const faction = azyrFactionNameMap[name] || null
  if (!faction) console.log('ALERT: Missing this faction: ' + name)
  const allegiance = faction ? factionToAllegianceMap[name] : null
  return { faction: faction || null, allegiance: allegiance || null }
}
