import { uniq, last } from 'lodash'
import { cleanWarscrollText } from 'utils/warscroll/warscrollUtils'
import { importUnitOptionMap, importFactionNameMap } from 'utils/import/options'
import { importErrorChecker } from 'utils/import'
import GenericScenery from 'army/generic/scenery'
import { SeraphonConstellations } from 'army/seraphon/allegiances'
import { TSupportedFaction } from 'meta/factions'
import { IImportedArmy, WARSCROLL_BUILDER } from 'types/import'

export const getWarscrollArmyFromPdf = (pdfText: string[]): IImportedArmy => {
  const army = getInitialWarscrollArmyPdf(pdfText)
  const errorChecked = importErrorChecker(army, WARSCROLL_BUILDER)

  return errorChecked
}

const unitIndicatorsTxt = [
  'Artillery',
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
  const genericScenery = GenericScenery.map(x => x.name)

  let allyUnits: string[] = []
  let factionName = ''
  let origin_realm: string | null = null
  let selector = ''
  let unknownSelections: string[] = []

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

      // 2/10/20 hotfix
      if (txt.startsWith('undefined x ')) {
        txt = txt.replace('undefined x ', '')
      }

      // Deprecated format
      if (txt.startsWith('Skyport: ')) {
        const skyport = txt.replace(/^Skyport: /g, '').trim()
        accum.allegiances = accum.allegiances.concat(skyport)
        return accum
      }

      // New format
      if (txt.startsWith('- Sky Port: ')) {
        const skyport = txt.replace('- Sky Port: ', '').trim().replace(' ', '-') // e.g. Barak Zilfin -> Barak-Zilfin
        if (skyport !== 'None') {
          accum.allegiances = accum.allegiances.concat(skyport)
        }
        return accum
      }

      if (txt.startsWith('- Mortal Realm: ')) {
        origin_realm = txt.replace('- Mortal Realm: ', '').trim()
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

      if (txt === 'ENDLESS SPELLS / TERRAIN' || txt === 'ENDLESS SPELLS / TERRAIN / COMMAND POINTS') {
        selector = 'endless_spells'
        return accum
      }

      if (txt === 'Extra Command Point') return accum

      if (txt.startsWith('- ')) {
        if (txt.startsWith('- General')) return accum
        if (txt.startsWith('- City Role')) return accum
        if (txt.startsWith('- Mark of Chaos : ')) return accum

        if (txt.startsWith('- Lodge: ')) {
          const allegiance = txt.replace('- Lodge: ', '').trim()
          if (allegiance) {
            accum.allegiances = accum.allegiances.concat(allegiance)
            return accum
          }
        }

        if (txt.startsWith('- Additional Footnote: ')) {
          const trait = txt.replace('- Additional Footnote: ', '').trim()
          if (trait) {
            accum.traits = accum.traits.concat(trait)
            return accum
          }
        }

        if (txt.startsWith('- Constellation: ')) {
          const name = txt.replace('- Constellation: ', '').trim()
          const allegiances = getSeraphonConstellations(name)
          accum.allegiances = accum.allegiances.concat(allegiances)
          return accum
        }

        if (txt.startsWith('- Great Endrinworks : ')) {
          const name = txt.replace('- Great Endrinworks : ', '').trim()
          const artifact = name.replace(/\(.+\)/g, '').trim()
          if (artifact) {
            accum.artifacts = accum.artifacts.concat(artifact)
            return accum
          }
        }

        if (txt.startsWith('- Grand Court: ')) {
          const allegiance = ['Gristlegore', 'Morgaunt', 'Blisterskin', 'Hollowmourne'].find(x =>
            txt.includes(x)
          )
          if (allegiance) {
            accum.allegiances = accum.allegiances.concat(allegiance)
            return accum
          }
        }

        if (txt.startsWith('- City: ')) {
          const { allegiance, trait } = getCity(txt)
          accum.allegiances = accum.allegiances.concat(allegiance)
          if (trait) {
            accum.traits = accum.traits.concat(trait)
          }
          return accum
        }

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
        if (txt.startsWith('- Command Trait : ')) {
          const [trait, spell] = getTraitWithSpell('Command Trait', txt)
          accum.traits = accum.traits.concat(trait)
          if (spell) accum.spells = accum.spells.concat(spell)
          return accum
        }
        if (txt.startsWith('- Mount Trait : ')) {
          const trait = getTrait('Mount Trait', txt)
          accum.traits = accum.traits.concat(trait)
          return accum
        }
        if (txt.startsWith('- Drakeblood Curse : ')) {
          const trait = getTrait('Drakeblood Curse', txt)
          accum.traits = accum.traits.concat(trait)
          return accum
        }
        if (txt.startsWith('- Grand Court: ')) {
          const trait = getTrait('Grand Court', txt, false)
          accum.traits = accum.traits.concat(trait)
          return accum
        }
        if (txt.startsWith('- Artefact : ')) {
          const [artifact, spell] = getTraitWithSpell('Artefact', txt)
          accum.artifacts = accum.artifacts.concat(artifact)
          if (spell) accum.spells = accum.spells.concat(spell)
          return accum
        }
        if (txt.startsWith('- Spell : ')) {
          const spell = getTrait('Spell', txt)
          accum.spells = accum.spells.concat(spell)
          return accum
        }
        if (txt.startsWith('- Mortal Realm : ') && last(accum.units) === 'Battlemage') {
          const battlemage_realm = txt.replace('- Mortal Realm : ', '').trim()
          accum.units.pop()
          accum.units.push(`Battlemage (${battlemage_realm})`)
          return accum
        }

        // Add weapon options and other configuration
        if (selector === 'units' && accum[selector].length > 0) {
          const attr = txt.split('-')[1].replace('Weapon : ', '').trim()

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
        // Endless spells and terrain are grouped together, so we have to do this check manually
        if (selector === 'endless_spells' && genericScenery.includes(txt)) {
          accum['scenery'] = uniq(accum['scenery'].concat(txt))
        } else {
          accum[selector] = uniq(accum[selector].concat(txt))
        }
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
    origin_realm,
    realmscape_feature: null,
    realmscape: null,
    selections,
    unknownSelections: uniq(unknownSelections),
  }
}

type TTraitType = 'Command Trait' | 'Artefact' | 'Spell' | 'Mount Trait' | 'Drakeblood Curse' | 'Grand Court'

const getTrait = (type: TTraitType, txt: string, addSpace = true) => {
  const sep = addSpace ? `${type} : ` : `${type}: `
  return removePrefix(txt.split(sep)[1].trim())
}

/**
 * Removes unnecessary prefixes
 * @param txt
 */
const removePrefix = (txt: string) => {
  const prefixes = [
    'Court of Delusion -',
    'Lore of Cinder -',
    'Lore of Dark Sorcerey -',
    'Lore of Eagles -',
    'Lore of Leaves -',
    'Lore of Smog -',
    'Lore of the Phoenix -',
    'Lore of Whitefire -',
  ]
  const regexp = new RegExp(`${prefixes.join('|')}`, 'g')
  return txt.replace(regexp, '').trim()
}

const getCity = (txt: string) => {
  const city = txt.split('- City: ')[1].split('(')
  const allegiance = city[0].trim()
  try {
    const trait = city[1] ? city[1].split('Illicit Dealings: ')[1].replace(')', '').trim() : null
    return { allegiance, trait }
  } catch (err) {
    return { allegiance, trait: null }
  }
}

/**
 * Warscroll Builder sometimes (confusingly) will mingle Command Traits (that grant a spell) with the spell itself
 * A typical entry might look like:
 * "- Command Trait : Secretive Warlock - Shadow Daggers"
 *                       ^ trait ^          ^ spell ^
 *
 * We will want to extract the trait AND the spell, if possible
 */
const traitToSpellMapper = [
  'Amethyst Glow -',
  'Blood Sigil -',
  'Dark Acolyte -',
  'Druid of the Everspring -',
  'Fuelled by the Spirits -',
  'Midnight Tome -',
  'One with Fire and Ice -',
  'Rune of Ulgu -',
  'Secretive Warlock -',
  'Whitefire Tome -',
]

/**
 * Extracts a given trait, and optionally, a spell associated with it
 * @param txt
 */
const getTraitWithSpell = (type: TTraitType, txt: string, addSpace = true): [string, string | null] => {
  const cleaned = getTrait(type, txt, addSpace)
  const hasSpell = traitToSpellMapper.some(x => cleaned.startsWith(x))

  if (!hasSpell) return [cleaned, null]

  const [trait, spell] = cleaned.split(' - ').map(x => x.trim())

  return [trait, spell === 'All Spells' ? null : spell]
}

const getSeraphonConstellations = (value: string): string[] => {
  if (SeraphonConstellations.COALESCED_ALLEGIANCES.includes(value))
    return [value, SeraphonConstellations.COALESCED]
  if (SeraphonConstellations.STARBORNE_ALLEGIANCES.includes(value))
    return [value, SeraphonConstellations.STARBORNE]
  return [value]
}
