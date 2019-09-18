import { TSupportedFaction } from 'meta/factions'
import { TRealms } from 'types/realmscapes'
import { uniq, difference } from 'lodash'
import { IImportedArmy, TImportError } from 'types/import'
import { titleCase } from 'utils/textUtils'
import { azyrFactionNameMap } from './options'
import { isValidFactionName } from 'utils/armyUtils'
import { logFailedImport } from 'utils/analytics'
import { createError, getNameMap } from 'utils/warscroll/warscrollUtils'
import { getArmy } from 'utils/getArmy/getArmy'
import { IArmy } from 'types/army'
import { isDev } from 'utils/env'
import { getAllyData } from 'utils/warscroll/allyData'
import { ISelections } from 'types/selections'
import { warscrollTypoMap } from 'utils/warscroll/options'
import { checkAzyrSelection, isPoorlySpacedMatch } from './azyrUtils'

export const getAzyrArmyFromPdf = (pdfText: string[]): IImportedArmy => {
  const army = getInitialAzyrArmy(pdfText)
  const errorChecked = azyrPdfErrorChecker(army)

  return errorChecked
}

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

export const getInitialAzyrArmy = (pages: string[]): IImportedArmy => {
  let factionName = ''
  let realmscape: TRealms | null = null
  let allyUnits: string[] = []
  let unknownSelections: string[] = []

  const selections = pages.reduce(
    (accum, name) => {
      if (name.startsWith('FACTION:')) {
        // TODO handle Clans Skryre etc
        factionName = name.replace('FACTION: ', '')
        factionName = azyrFactionNameMap[factionName]
        if (!factionName) console.log('ALERT: Missing this faction: ' + name)
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
    unknownSelections,
  }
}

const azyrPdfErrorChecker = (army: IImportedArmy): IImportedArmy => {
  let { errors, factionName, selections, unknownSelections, allyUnits } = army

  // If we've already gotten an error, go ahead and bail out
  if (errors.some(({ severity }) => severity === 'error')) return army

  // If we're missing a faction name, we won't be able to do much with this
  if (!isValidFactionName(factionName)) {
    logFailedImport(`faction:${factionName || 'Unknown'}`, 'Azyr')
    const errorTxt = !!factionName
      ? `${factionName} are not supported.`
      : `There was a problem reading this file.`
    return {
      ...army,
      errors: [createError(errorTxt)],
    }
  }

  const foundSelections: string[] = []

  const Army = getArmy(factionName) as IArmy
  const lookup = selectionLookup(Army, selections, errors, unknownSelections, foundSelections)

  const errorFreeSelections = {
    allegiances: lookup('allegiances'),
    artifacts: lookup('artifacts'),
    battalions: lookup('battalions'),
    endless_spells: lookup('endless_spells'),
    spells: lookup('spells'),
    traits: lookup('traits'),
    units: lookup('units'),
  }

  const couldNotFind = difference(unknownSelections, foundSelections)
  if (couldNotFind.length > 0 && isDev) console.log('Could not find: ', couldNotFind)

  const allyData = getAllyData(allyUnits, factionName, errors)

  // Fire off any warnings to Google Analytics
  errors
    .filter(e => e.severity === 'warn' || e.severity === 'ally-warn')
    .forEach(e => logFailedImport(e.text, 'Azyr'))

  return {
    ...army,
    errors,
    unknownSelections: couldNotFind,
    selections: {
      ...selections,
      ...errorFreeSelections,
    },
    ...allyData,
  }
}

type TLookupType =
  | 'allegiances'
  | 'artifacts'
  | 'battalions'
  | 'endless_spells'
  | 'spells'
  | 'traits'
  | 'units'

const selectionLookup = (
  Army: IArmy,
  selections: ISelections,
  errors: TImportError[],
  unknownSelections: string[],
  foundSelections: string[]
) => (type: TLookupType): string[] => {
  const lookup = {
    allegiances: 'Allegiances',
    artifacts: 'Artifacts',
    battalions: 'Battalions',
    endless_spells: 'EndlessSpells',
    spells: 'Spells',
    traits: 'Traits',
    units: 'Units',
  }

  const Names: string[] = Army[lookup[type]].map(({ name }) => name)
  const NameMap = getNameMap(Names)
  const checkVal = checkAzyrSelection(Names, NameMap, errors, true)

  const errorFree = selections[type].map(checkVal).filter(x => !!x)

  const found = unknownSelections
    .map(val => {
      const orig = `${val}`

      // Check for typos
      if (warscrollTypoMap[val]) val = warscrollTypoMap[val]

      if (NameMap[val]) {
        foundSelections.push(orig)
        return val
      }

      // See if we have something like it...
      const valUpper = val.toUpperCase()
      const match = Names.find(x => x.toUpperCase().includes(valUpper))
      if (match) {
        foundSelections.push(orig)
        return match
      }

      // Sometimes parentheses get in our way
      const valNoParens = valUpper.replace(/\(.+\)/g, '').trim()
      const match2 = Names.find(x =>
        x
          .toUpperCase()
          .replace(/\(.+\)/g, '')
          .includes(valNoParens)
      )
      if (match2) {
        foundSelections.push(orig)
        return match2
      }

      // Last chance - check for bad spacing
      const match3 = Names.find(x => isPoorlySpacedMatch(val, x))
      if (match3) {
        foundSelections.push(orig)
        return match3
      }

      return ''
    })
    .filter(x => !!x)

  return uniq(errorFree.concat(found))
}
