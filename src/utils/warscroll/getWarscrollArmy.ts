import { uniq, difference, last } from 'lodash'
import { getArmy } from 'utils/getArmy/getArmy'
import { logFailedImport } from 'utils/analytics'
import { isValidFactionName } from 'utils/armyUtils'
import { getNameMap, checkSelection, createError, cleanWarscrollText } from './warscrollUtils'
import { getAllyData } from './allyData'
import { warscrollUnitOptionMap, warscrollTypoMap, warscrollFactionNameMap } from './options'
import { TSupportedFaction } from 'meta/factions'
import { ISelections } from 'types/selections'
import { IArmy } from 'types/army'
import { IWarscrollArmy, TError } from 'types/warscrollTypes'
import { isDev } from 'utils/env'

export const getWarscrollArmyFromText = (fileTxt: string): IWarscrollArmy => {
  const army = getInitialWarscrollArmyTxt(fileTxt)
  const errorChecked = warscrollPdfErrorChecker(army)

  return errorChecked
}

export const getWarscrollArmyFromPdf = (pdfText: string[]): IWarscrollArmy => {
  const army = getInitialWarscrollArmyPdf(pdfText)
  const errorChecked = warscrollPdfErrorChecker(army)

  return errorChecked
}

const unitIndicatorsTxt = [
  'Leaders',
  'Units',
  'Behemoths',
  'War Machines',
  'Battleline',
  'Spearhead',
  'Main Body',
  'Rearguard',
]
const unitIndicatorsPdf = unitIndicatorsTxt.map(x => x.toUpperCase())

const getInitialWarscrollArmyPdf = (pdfText: string[]): IWarscrollArmy => {
  const cleanedText = cleanWarscrollText(pdfText)

  let allyUnits: string[] = []
  let unknownSelections: string[] = []
  let factionName = ''
  let selector = ''

  const selections = cleanedText.reduce(
    (accum, txt) => {
      // Get Allegiance
      // e.g. 'Allegiance: Seraphon - Mortal Realm: Ghyran',
      // or 'Davis Ford - Allegiance: Seraphon - Mortal Realm: Ghyran',
      if (txt.includes('Allegiance:')) {
        const nameRemoved = txt.replace(/(.+)?Allegiance: /g, '')
        const parts = nameRemoved.split('-').map(t => t.trim())
        const name = parts[0].trim()

        factionName = warscrollFactionNameMap[name] || name

        return accum
      }

      if (unitIndicatorsPdf.includes(txt)) {
        selector = 'units'
        return accum
      }

      if (txt === 'BATTALIONS') {
        selector = 'battalions'
        return accum
      }

      if (txt === 'ENDLESS SPELLS / TERRAIN') {
        selector = 'endless_spells'
        return accum
      }

      if (txt.startsWith('- ')) {
        if (txt.startsWith('- General')) return accum
        if (txt.startsWith('- Allies')) {
          const alliedUnit = last(accum.units)
          if (alliedUnit) {
            const accumMock = [...accum.units]
            accumMock.pop()
            accum[selector] = accumMock
            allyUnits.push(alliedUnit)
          }
          return accum
        }
        if (txt.includes('Command Trait : ')) {
          const trait = txt.split(' Command Trait : ')[1].trim()
          accum.traits = accum.traits.concat(trait)
          return accum
        }
        if (txt.includes('Artefact : ')) {
          const artifact = txt.split(' Artefact : ')[1].trim()
          accum.artifacts = accum.artifacts.concat(artifact)
          return accum
        }
        if (txt.includes('Spell : ')) {
          const spell = txt.split(' Spell : ')[1].trim()
          accum.spells = accum.spells.concat(spell)
          return accum
        }

        // Add weapon options and other configuration
        if (selector === 'units' && accum[selector].length > 0) {
          const attr = txt
            .split('-')[1]
            .replace('Weapon : ', '')
            .trim()

          if (warscrollUnitOptionMap[attr]) {
            const accumMock = [...accum[selector]]
            accumMock.pop()
            accumMock.push(warscrollUnitOptionMap[attr])
            accum[selector] = accumMock
            return accum
          }
        }

        // If we've gotten this far, we don't really know what this thing is
        // So for now, let's add this to the unknownSelections
        const sep = txt.includes(' : ') ? ' : ' : ':'
        const splitAttr = txt.split(sep).map(x => x.trim())
        const attr = (last(splitAttr) as string).replace(/^- /g, '').trim()

        unknownSelections.push(attr)

        return accum
      }

      // Check for end of file stuff
      if (['TOTAL: ', 'LEADERS: ', 'ARTEFACTS: '].some(e => txt.startsWith(e))) {
        selector = ''
        return accum
      }

      // Add item to accum
      if (selector) {
        accum[selector] = uniq(accum[selector].concat(txt))
      }

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
    realmscape: null,
    selections,
    unknownSelections: uniq(unknownSelections),
  }
}

const getInitialWarscrollArmyTxt = (fileText: string): IWarscrollArmy => {
  const cleanedText = cleanWarscrollText(fileText.split('\n'))

  let errors: TError[] = []
  let usingShortVersion = false
  let allyUnits: string[] = []
  let unknownSelections: string[] = []
  let factionName = ''
  let selector = ''

  const selections = cleanedText.reduce(
    (accum, txt) => {
      // If they are using the short txt version, don't bother trying to process it
      if (usingShortVersion) return accum

      if (txt.includes('Allegiance: ')) {
        const name = txt.replace('Allegiance: ', '').trim()
        factionName = warscrollFactionNameMap[name] || name
        return accum
      }

      if (txt.includes('Mortal Realm: ')) return accum

      if (unitIndicatorsTxt.includes(txt)) {
        selector = 'units'
        return accum
      }

      if (txt === 'Battalions') {
        selector = 'battalions'
        return accum
      }

      if (txt === 'Endless Spells / Terrain') {
        selector = 'endless_spells'
        return accum
      }

      if (txt.startsWith('- ')) {
        if (!selector) {
          // If a selector hasn't been set at this point, they are using the short list summary
          // Which we don't support
          usingShortVersion = true
          return accum
        }
        if (txt.startsWith('- General')) return accum
        if (txt.startsWith('- Allies')) {
          const alliedUnit = last(accum.units)
          if (alliedUnit) {
            const accumMock = [...accum.units]
            accumMock.pop()
            accum[selector] = accumMock
            allyUnits.push(alliedUnit)
          }
          return accum
        }
        if (txt.includes('Command Trait: ')) {
          const trait = txt.split(' Command Trait: ')[1].trim()
          accum.traits = accum.traits.concat(trait)
          return accum
        }
        if (txt.includes('Mount Trait: ')) {
          const trait = txt.split(' Mount Trait: ')[1].trim()
          accum.traits = accum.traits.concat(trait)
          return accum
        }
        if (txt.includes('Artefact: ')) {
          const artifact = txt.split(' Artefact: ')[1].trim()
          accum.artifacts = accum.artifacts.concat(artifact)
          return accum
        }
        if (txt.includes('Spell: ')) {
          const spell = txt.split(' Spell: ')[1].trim()
          accum.spells = accum.spells.concat(spell)
          return accum
        }

        // Add weapon options and other configuration
        if (selector === 'units' && accum[selector].length > 0) {
          const attr = txt
            .split('-')[1]
            .replace('Weapon : ', '')
            .trim()

          if (warscrollUnitOptionMap[attr]) {
            const accumMock = [...accum[selector]]
            accumMock.pop()
            accumMock.push(warscrollUnitOptionMap[attr])
            accum[selector] = accumMock
            return accum
          }
        }

        // If we've gotten this far, we don't really know what this thing is
        // So for now, let's add this to the unknownSelections
        const splitAttr = txt.split(': ').map(x => x.trim())
        const attr = (last(splitAttr) as string).replace(/^- /g, '').trim()

        unknownSelections.push(attr)

        return accum
      }

      // Check for end of file stuff
      if (['Total: ', 'Allies: ', 'Extra Command Points: ', 'Wounds: '].some(e => txt.startsWith(e))) {
        selector = ''
        return accum
      }

      // Add item to accum
      if (selector) {
        accum[selector] = uniq(accum[selector].concat(txt))
      }

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

  if (usingShortVersion) {
    errors.push(
      createError(
        'Are you using the "Short" summary from Warscroll Builder? Please use the "Full" summary and try again.'
      )
    )
  }

  return {
    allyFactionNames: [],
    allySelections: {},
    allyUnits: uniq(allyUnits),
    errors,
    factionName: factionName as TSupportedFaction,
    realmscape_feature: null,
    realmscape: null,
    selections,
    unknownSelections: uniq(unknownSelections),
  }
}

const warscrollPdfErrorChecker = (army: IWarscrollArmy): IWarscrollArmy => {
  let { errors, factionName, selections, unknownSelections, allyUnits } = army

  // If we've already gotten an error, go ahead and bail out
  if (errors.some(({ severity }) => severity === 'error')) return army

  // If we're missing a faction name, we won't be able to do much with this
  if (!isValidFactionName(factionName)) {
    logFailedImport(`faction:${factionName || 'Unknown'}`)
    return {
      ...army,
      errors: [createError(`${factionName || 'Unknown Faction'} are not supported!`)],
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

  return {
    ...army,
    errors,
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
  errors: TError[],
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
  const checkVal = checkSelection(Names, NameMap, errors, true)

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

      return ''
    })
    .filter(x => !!x)

  return uniq(errorFree.concat(found))
}
