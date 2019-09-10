import { uniq, difference, last } from 'lodash'
import { strip } from 'clean-text-utils'
import { getArmy } from 'utils/getArmy'
import { TSupportedFaction, SUPPORTED_FACTIONS } from 'meta/factions'
import { TRealms } from 'types/realmscapes'
import { TAllySelectionStore } from 'types/store'
import { ISelections } from 'types/selections'
import { IArmy } from 'types/army'
import { warscrollUnitOptionMap, warscrollTypoMap, warscrollFactionNameMap } from './options'

interface IWarscrollArmy {
  allyFactionNames: TSupportedFaction[]
  allySelections: TAllySelectionStore
  factionName: TSupportedFaction
  realmscape_feature: string | null
  realmscape: TRealms | null
  selections: ISelections
  unknownSelections: string[]
}

type TError = { text: string; severity: 'warn' | 'error' }

export interface IWarscrollArmyWithErrors extends IWarscrollArmy {
  errors: TError[]
}

export const getWarscrollArmyFromText = (fileTxt: string): IWarscrollArmyWithErrors => {
  const army = getInitialWarscrollArmyTxt(fileTxt)
  const errorChecked = warscrollPdfErrorChecker(army)

  return errorChecked
}

export const getWarscrollArmyFromPdf = (pdfText: string[]): IWarscrollArmyWithErrors => {
  const army = getInitialWarscrollArmyPdf(pdfText)
  const errorChecked = warscrollPdfErrorChecker(army)

  return errorChecked
}

const getInitialWarscrollArmyPdf = (pdfText: string[]): IWarscrollArmy => {
  const cleanedText = pdfText
    .map(txt =>
      txt
        .replace(/^[0-9]{1,2}"$/g, '') // Remove '12"' entries
        .replace(/^[0-9]{1,2}"\*$/g, '') // Remove '10"*' entries
        .replace(/^[0-9]{1,2}D6"/g, '') // Remove '2D6"' entries
        .replace(/\\\([0-9]+\\\)/g, '') // Remove point values e.g. "Slann Starmaster \(360\)"
        .replace(/[0-9]+ x /g, '') // Remove quantity from units e.g. "3 x Razordons"
        .trim()
    )
    .filter(
      txt =>
        !!txt &&
        txt.length > 2 &&
        txt !== 'Warscroll Builder on www.warhammer-community.com' &&
        txt !== '* See Warscroll'
    )

  let unknownSelections: string[] = []
  let factionName = ''
  let realmscape: TRealms | null = null
  let selector = ''

  const selections = cleanedText.reduce(
    (accum, txt) => {
      // Get Allegiance and Mortal Realm
      // e.g. 'Allegiance: Seraphon - Mortal Realm: Ghyran',
      // or 'Davis Ford - Allegiance: Seraphon - Mortal Realm: Ghyran',
      if (txt.includes('Allegiance:')) {
        const nameRemoved = txt.replace(/(.+)?Allegiance: /g, '')
        const parts = nameRemoved.split('-').map(t => t.trim())
        const name = parts[0].trim()

        factionName = warscrollFactionNameMap[name] || name

        if (parts.length > 1 && txt.includes('Mortal Realm:')) {
          realmscape = parts[1].substring(14).trim() as TRealms
        }

        return accum
      }

      if (['LEADERS', 'UNITS', 'BEHEMOTHS', 'WAR MACHINES'].includes(txt)) {
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
        const splitAttr = txt.split(' : ').map(x => x.trim())
        const attr = (last(splitAttr) as string).replace(/^- /g, '')

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
    selections,
    unknownSelections: uniq(unknownSelections),
    factionName: factionName as TSupportedFaction,
    realmscape,
    allyFactionNames: [],
    allySelections: {},
    realmscape_feature: null,
  }
}

const getInitialWarscrollArmyTxt = (fileText: string): IWarscrollArmy => {
  const cleanedText = fileText
    .split('\n')
    .map(txt =>
      txt
        .replace(/^[0-9]{1,2}"$/g, '') // Remove '12"' entries
        .replace(/^[0-9]{1,2}"\*$/g, '') // Remove '10"*' entries
        .replace(/^[0-9]{1,2}D6"/g, '') // Remove '2D6"' entries
        .replace(/ \([0-9]+\)/g, '') // Remove point values e.g. "Slann Starmaster (360)"
        .replace(/[0-9]+ x /g, '') // Remove quantity from units e.g. "3 x Razordons"
        .trim()
    )
    .filter(
      txt =>
        !!txt &&
        txt.length > 2 &&
        txt !== 'Warscroll Builder on www.warhammer-community.com' &&
        txt !== '* See Warscroll'
    )

  let unknownSelections: string[] = []
  let factionName = ''
  let realmscape: TRealms | null = null
  let selector = ''

  const selections = cleanedText.reduce(
    (accum, txt) => {
      // Get Allegiance and Mortal Realm
      // e.g. 'Allegiance: Seraphon - Mortal Realm: Ghyran',
      // or 'Davis Ford - Allegiance: Seraphon - Mortal Realm: Ghyran',
      if (txt.includes('Allegiance:')) {
        const nameRemoved = txt.replace(/(.+)?Allegiance: /g, '')
        const parts = nameRemoved.split('-').map(t => t.trim())
        const name = parts[0].trim()

        factionName = warscrollFactionNameMap[name] || name

        return accum
      }

      if (txt.includes('Mortal Realm:')) {
        realmscape = txt.substring(14).trim() as TRealms
        return accum
      }

      if (['Leaders', 'Units', 'Behemoths', 'War Machines', 'Battleline'].includes(txt)) {
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
        if (txt.startsWith('- General')) return accum
        if (txt.includes('Command Trait: ')) {
          const trait = txt.split(' Command Trait: ')[1].trim()
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
        const attr = (last(splitAttr) as string).replace(/^- /g, '')

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

  return {
    selections,
    unknownSelections: uniq(unknownSelections),
    factionName: factionName as TSupportedFaction,
    realmscape,
    allyFactionNames: [],
    allySelections: {},
    realmscape_feature: null,
  }
}

const warscrollPdfErrorChecker = (army: IWarscrollArmy): IWarscrollArmyWithErrors => {
  let errors: { text: string; severity: 'warn' | 'error' }[] = []

  const { factionName, selections, unknownSelections } = army

  if (!SUPPORTED_FACTIONS.includes(factionName)) {
    return {
      ...army,
      errors: [error(`${factionName} are not supported!`)],
    }
  }

  const foundSelections: string[] = []

  const Army = getArmy(factionName) as IArmy
  const lookup = selectionLookup(Army, selections, errors, unknownSelections, foundSelections)

  const errorFreeSelections = {
    artifacts: lookup('artifacts'),
    battalions: lookup('battalions'),
    endless_spells: lookup('endless_spells'),
    spells: lookup('spells'),
    traits: lookup('traits'),
    units: lookup('units'),
  }

  console.log('Could not find: ', difference(unknownSelections, foundSelections))

  return {
    ...army,
    errors,
    selections: {
      ...selections,
      ...errorFreeSelections,
    },
  }
}

type TLookupType = 'artifacts' | 'battalions' | 'endless_spells' | 'spells' | 'traits' | 'units'

const selectionLookup = (
  Army: IArmy,
  selections: ISelections,
  errors: TError[],
  unknownSelections: string[],
  foundSelections: string[]
) => (type: TLookupType): string[] => {
  const lookup = {
    artifacts: 'Artifacts',
    battalions: 'Battalions',
    endless_spells: 'EndlessSpells',
    spells: 'Spells',
    traits: 'Traits',
    units: 'Units',
  }

  const Names: string[] = Army[lookup[type]].map(({ name }) => name)
  const NameMap = Names.reduce((a, b) => {
    a[b] = b
    return a
  }, {})

  const errorFree = selections[type]
    .map((val: string) => {
      // Check for typos
      if (warscrollTypoMap[val]) val = warscrollTypoMap[val]

      if (NameMap[val]) return val

      // See if we have something like it...
      const valUpper = val.toUpperCase()
      const match = Names.find(x => x.toUpperCase().includes(valUpper))
      if (match) return match

      // Maybe we have a trailing '... of Slaanesh'?
      const valShortened = valUpper.replace(/ OF .+/g, '')
      const match2 = Names.find(x => x.toUpperCase().includes(valShortened))
      if (match2) return match2

      // Maybe punctuation is in our way?
      const valNoPunc = strip.punctuation(valShortened)
      const match3 = Names.find(x => strip.punctuation(x.toUpperCase()).includes(valNoPunc))
      if (match3) return match3

      errors.push(warn(`${val} is either a typo or an unsupported value.`))
      return ''
    })
    .filter(x => !!x)

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

const error = (text: string): { text: string; severity: 'error' } => ({ text, severity: 'error' })
const warn = (text: string): { text: string; severity: 'warn' } => ({ text, severity: 'warn' })
