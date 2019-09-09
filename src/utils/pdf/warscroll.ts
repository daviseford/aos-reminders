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
import { uniq } from 'lodash'
import { getArmy } from 'utils/getArmy'
import { IArmy } from 'types/army'

interface IWarscrollArmy {
  factionName: TSupportedFaction
  factionRealm: TRealms | string
  allyFactionNames: TSupportedFaction[]
  allySelections: TAllySelectionStore
  realmscape_feature: string | null
  realmscape: TRealms | null
  selections: ISelections
}

type TError = { text: string; severity: 'warn' | 'error' }

interface IErrorChecker extends IWarscrollArmy {
  errors: TError[] | null
}

export const getWarscrollArmyFromPdf = (pdfText: string[]): IErrorChecker => {
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

  let factionName = ''
  let factionRealm = ''
  let selector = ''

  console.log(cleanedText)

  const selections = cleanedText.reduce(
    (accum, txt) => {
      // Get Allegiance and Mortal Realm
      // e.g. 'Allegiance: Seraphon - Mortal Realm: Ghyran',
      // or 'Davis Ford - Allegiance: Seraphon - Mortal Realm: Ghyran',
      if (txt.includes('Allegiance:')) {
        const nameRemoved = txt.replace(/.+ - Allegiance: /g, '')
        const parts = nameRemoved.split('-').map(t => t.trim())
        const name = parts[0].trim()

        if (warscrollFactionNameMap[name]) {
          factionName = warscrollFactionNameMap[name] || ''
        }

        if (parts.length > 1 && txt.includes('Mortal Realm:')) {
          factionRealm = parts[1].substring(14).trim()
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
          }
        }

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
    factionName: factionName as TSupportedFaction,
    factionRealm,
    allyFactionNames: [],
    allySelections: {},
    realmscape_feature: null,
    realmscape: null,
  }
}

const warscrollPdfErrorChecker = (army: IWarscrollArmy): IErrorChecker => {
  let errors: { text: string; severity: 'warn' | 'error' }[] = []

  const { factionName, selections } = army

  if (!SUPPORTED_FACTIONS.includes(factionName)) {
    return {
      ...army,
      errors: [
        error(`${factionName} is not supported yet! If you think it should be, file an issue on Github.`),
      ],
    }
  }

  const Army = getArmy(factionName) as IArmy
  const units = getUnits(Army, selections, errors)
  const artifacts = getArtifacts(Army, selections, errors)

  return {
    ...army,
    selections: {
      ...selections,
      artifacts,
      units,
    },

    errors: errors.length ? errors : null,
  }
}

const getArtifacts = (Army: IArmy, selections: ISelections, errors: TError[]): string[] => {
  const Names = Army.Artifacts.map(({ name }) => name)
  const NamesUpper = Names.map(x => x.toUpperCase())
  const NameMap = Names.reduce((a, b) => {
    a[b] = b
    return a
  }, {})

  return selections.artifacts
    .map(val => {
      // Check for typos
      if (warscrollTypoMap[val]) val = warscrollTypoMap[val]

      if (NameMap[val]) return val

      // See if we have something like it...
      const valUpper = val.toUpperCase()
      const match = NamesUpper.find(x => x.includes(valUpper))
      if (match) return match

      errors.push(warn(`${val} is either a typo or an unsupported value.`))
      return ''
    })
    .filter(x => !!x)
}

const getUnits = (Army: IArmy, selections: ISelections, errors: TError[]): string[] => {
  const Names = Army.Units.map(({ name }) => name)
  const NamesUpper = Names.map(x => x.toUpperCase())
  const NameMap = Names.reduce((a, b) => {
    a[b] = b
    return a
  }, {})

  return selections.units
    .map(val => {
      // Check for typos
      if (warscrollTypoMap[val]) val = warscrollTypoMap[val]

      if (NameMap[val]) return val

      // See if we have something like it...
      const valUpper = val.toUpperCase()
      const match = NamesUpper.find(x => x.includes(valUpper))
      if (match) return match

      errors.push(warn(`${val} is either a typo or an unsupported value.`))
      return ''
    })
    .filter(x => !!x)
}

const error = (text: string): { text: string; severity: 'error' } => ({ text, severity: 'error' })
const warn = (text: string): { text: string; severity: 'warn' } => ({ text, severity: 'warn' })

const warscrollFactionNameMap = {
  'Beastclaw Raiders': BEASTCLAW_RAIDERS,
  'Beasts of Chaos': BEASTS_OF_CHAOS,
  'Blades of Khorne': KHORNE,
  Bonesplitterz: BONESPLITTERZ,
  'Daughters of Khaine': DAUGHTERS_OF_KHAINE,
  'Disciples of Tzeentch': TZEENTCH,
  Dispossessed: DISPOSSESSED,
  Everchosen: EVERCHOSEN,
  'Flesh Eater Courts': FLESH_EATER_COURTS,
  Fyreslayers: FYRESLAYERS,
  'Gloomspite Gitz': GLOOMSPITE_GITZ,
  Gutbusters: GUTBUSTERS,
  'Hedonites of Slaanesh': SLAANESH,
  'Idoneth Deepkin': IDONETH_DEEPKIN,
  Ironjawz: IRONJAWZ,
  'Kharadron Overlords': KHARADRON_OVERLORDS,
  'Legion of Azgorh': LEGIONS_OF_AZGORH,
  'Legion of Grief': LEGIONS_OF_GRIEF,
  'Legions of Nagash': LEGIONS_OF_NAGASH,
  'Lethisian Defenders': LETHISIAN_DEFENDERS,
  'Maggotkin of Nurgle': NURGLE,
  'Mercenaries: Greyfyrd Lodge': MERCENARY_COMPANIES,
  'Mercenaries: Grugg Brothers': MERCENARY_COMPANIES,
  "Mercenaries: Nimyard's Rough-Riders": MERCENARY_COMPANIES,
  'Mercenaries: Order of the Blood-Drenched Rose': MERCENARY_COMPANIES,
  'Mercenaries: Rampagers': MERCENARY_COMPANIES,
  "Mercenaries: Skroug's Menagerie": MERCENARY_COMPANIES,
  'Mercenaries: Sons of the Lichemaster': MERCENARY_COMPANIES,
  'Mercenaries: Tenebrous Court': MERCENARY_COMPANIES,
  'Mercenaries: The Blacksmoke Battery': MERCENARY_COMPANIES,
  'Mercenaries: The Gutstuffers': MERCENARY_COMPANIES,
  Nighthaunt: NIGHTHAUNT,
  Seraphon: SERAPHON,
  Skaventide: SKAVEN,
  'Slaves to Darkness': SLAVES_TO_DARKNESS,
  'Stormcast Eternals': STORMCAST_ETERNALS,
  Sylvaneth: SYLVANETH,
  "Tamurkhan's Horde": TAMURKHANS_HORDE,
  Wanderers: WANDERERS,
}

// TODO: Add common typos here
// Longer TODO: Share with Warscroll Builder author
const warscrollTypoMap = {}

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
