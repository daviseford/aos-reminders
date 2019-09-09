import { uniq, difference, last } from 'lodash'
import { strip } from 'clean-text-utils'
import { getArmy } from 'utils/getArmy'

import {
  BEASTCLAW_RAIDERS,
  BEASTS_OF_CHAOS,
  BONESPLITTERZ,
  DAUGHTERS_OF_KHAINE,
  DISPOSSESSED,
  EVERCHOSEN,
  FLESH_EATER_COURTS,
  FYRESLAYERS,
  GLOOMSPITE_GITZ,
  GUTBUSTERS,
  IDONETH_DEEPKIN,
  IRONJAWZ,
  KHARADRON_OVERLORDS,
  KHORNE,
  LEGIONS_OF_AZGORH,
  LEGIONS_OF_GRIEF,
  LEGIONS_OF_NAGASH,
  LETHISIAN_DEFENDERS,
  MERCENARY_COMPANIES,
  NIGHTHAUNT,
  NURGLE,
  SERAPHON,
  SKAVEN,
  SLAANESH,
  SLAVES_TO_DARKNESS,
  STORMCAST_ETERNALS,
  SYLVANETH,
  TAMURKHANS_HORDE,
  TZEENTCH,
  WANDERERS,
  TSupportedFaction,
  SUPPORTED_FACTIONS,
} from 'meta/factions'
import { TRealms } from 'types/realmscapes'
import { TAllySelectionStore } from 'types/store'
import { ISelections } from 'types/selections'
import { IArmy } from 'types/army'

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

export const getWarscrollArmyFromPdf = (pdfText: string[]): IWarscrollArmyWithErrors => {
  const army = getInitialWarscrollArmy(pdfText)
  const errorChecked = warscrollPdfErrorChecker(army)

  return errorChecked
}

const getInitialWarscrollArmy = (pdfText: string[]): IWarscrollArmy => {
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

  console.log(cleanedText)

  const selections = cleanedText.reduce(
    (accum, txt) => {
      // Get Allegiance and Mortal Realm
      // e.g. 'Allegiance: Seraphon - Mortal Realm: Ghyran',
      // or 'Davis Ford - Allegiance: Seraphon - Mortal Realm: Ghyran',
      if (txt.includes('Allegiance:')) {
        const nameRemoved = txt.replace(/(.+)?Allegiance: /g, '')
        const parts = nameRemoved.split('-').map(t => t.trim())
        const name = parts[0].trim()

        console.log(name)
        factionName = warscrollFactionNameMap[name] || name
        console.log(factionName)
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
      const match3 = Names.find(x => x.toUpperCase().includes(valNoPunc))
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

const warscrollFactionNameMap = {
  'Beastclaw Raiders': BEASTCLAW_RAIDERS,
  'Beasts of Chaos': BEASTS_OF_CHAOS,
  'Blades of Khorne': KHORNE,
  'Daughters of Khaine': DAUGHTERS_OF_KHAINE,
  'Disciples of Tzeentch': TZEENTCH,
  'Flesh Eater Courts': FLESH_EATER_COURTS,
  'Gloomspite Gitz': GLOOMSPITE_GITZ,
  'Grand Host of Nagash': LEGIONS_OF_NAGASH,
  'Hedonites of Slaanesh': SLAANESH,
  'Idoneth Deepkin': IDONETH_DEEPKIN,
  'Kharadron Overlords': KHARADRON_OVERLORDS,
  'Legion of Azgorh': LEGIONS_OF_AZGORH,
  'Legion of Grief': LEGIONS_OF_GRIEF,
  'Legions of Nagash': LEGIONS_OF_NAGASH,
  'Lethisian Defenders': LETHISIAN_DEFENDERS,
  'Maggotkin of Nurgle': NURGLE,
  'Mercenaries: Greyfyrd Lodge': MERCENARY_COMPANIES,
  'Mercenaries: Grugg Brothers': MERCENARY_COMPANIES,
  'Mercenaries: Order of the Blood-Drenched Rose': MERCENARY_COMPANIES,
  'Mercenaries: Rampagers': MERCENARY_COMPANIES,
  'Mercenaries: Sons of the Lichemaster': MERCENARY_COMPANIES,
  'Mercenaries: Tenebrous Court': MERCENARY_COMPANIES,
  'Mercenaries: The Blacksmoke Battery': MERCENARY_COMPANIES,
  'Mercenaries: The Gutstuffers': MERCENARY_COMPANIES,
  'Slaves to Darkness': SLAVES_TO_DARKNESS,
  'Stormcast Eternals': STORMCAST_ETERNALS,
  "Mercenaries: Nimyard's Rough-Riders": MERCENARY_COMPANIES,
  "Mercenaries: Skroug's Menagerie": MERCENARY_COMPANIES,
  "Tamurkhan's Horde": TAMURKHANS_HORDE,
  Bonesplitterz: BONESPLITTERZ,
  Dispossessed: DISPOSSESSED,
  Everchosen: EVERCHOSEN,
  Fyreslayers: FYRESLAYERS,
  Gutbusters: GUTBUSTERS,
  Ironjawz: IRONJAWZ,
  Khorne: KHORNE,
  Nighthaunt: NIGHTHAUNT,
  Nurgle: NURGLE,
  Seraphon: SERAPHON,
  Skaventide: SKAVEN,
  Slaanesh: SLAANESH,
  Sylvaneth: SYLVANETH,
  Tzeentch: TZEENTCH,
  Wanderers: WANDERERS,
}

// TODO: Add common typos here
// Longer TODO: Share with Warscroll Builder author
const warscrollTypoMap = {
  'Chaos Chariots': 'Chaos Chariot',
  'Chaos Gorebeast Chariots': 'Gorebeast Chariot',
}

const warscrollUnitOptionMap = {
  'Ark of Sotek': 'Bastiladon w/ Ark of Sotek',
  'Solar Engine': 'Bastiladon w/ Solar Engine',
  'Cloak of Feathers': 'Skink Priest w/ Cloak of Feathers',
  'Priestly Trappings': 'Skink Priest w/ Priestly Trappings',
  'Skystreak Bow': 'Stegadon w/ Skystreak Bow',
  'Sunfire Throwers': 'Stegadon w/ Sunfire Throwers',
  'Ritual Knife': 'Keeper of Secrets w/ Ritual Knife',
  'Living Whip': 'Keeper of Secrets w/ Living Whip',
  'Shining Aegis': 'Keeper of Secrets w/ Shining Aegis',
  'Sinistrous Hand': 'Keeper of Secrets w/ Sinistrous Hand',
}
