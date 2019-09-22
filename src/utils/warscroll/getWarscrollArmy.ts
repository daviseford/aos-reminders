import { uniq, last } from 'lodash'
import { cleanWarscrollText } from './warscrollUtils'
import { importUnitOptionMap, importFactionNameMap } from '../import/options'
import { TSupportedFaction } from 'meta/factions'
import { IImportedArmy, TImportError } from 'types/import'
import { importErrorChecker } from 'utils/import'
import { createFatalError } from 'utils/import/warnings'

export const getWarscrollArmyFromText = (fileTxt: string): IImportedArmy => {
  const army = getInitialWarscrollArmyTxt(fileTxt)
  const errorChecked = importErrorChecker(army, 'Warscroll Builder')

  return errorChecked
}

export const getWarscrollArmyFromPdf = (pdfText: string[]): IImportedArmy => {
  const army = getInitialWarscrollArmyPdf(pdfText)
  const errorChecked = importErrorChecker(army, 'Warscroll Builder')

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

const getInitialWarscrollArmyPdf = (pdfText: string[]): IImportedArmy => {
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

        factionName = importFactionNameMap[name] || name

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

          if (importUnitOptionMap[attr]) {
            const accumMock = [...accum[selector]]
            accumMock.pop()
            accumMock.push(importUnitOptionMap[attr])
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

const getInitialWarscrollArmyTxt = (fileText: string): IImportedArmy => {
  const cleanedText = cleanWarscrollText(fileText.split('\n'))

  let errors: TImportError[] = []
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
        factionName = importFactionNameMap[name] || name
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

          if (importUnitOptionMap[attr]) {
            const accumMock = [...accum[selector]]
            accumMock.pop()
            accumMock.push(importUnitOptionMap[attr])
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
      createFatalError(
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
