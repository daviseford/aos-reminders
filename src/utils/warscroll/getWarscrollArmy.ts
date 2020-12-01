import GenericScenery from 'army/generic/scenery'
import { SeraphonConstellations } from 'army/seraphon/allegiances'
import CommonSonsOfBehematData from 'army/sons_of_behemat/common'
import { last, uniq } from 'lodash'
import { getArmyList } from 'meta/army_list'
import { TSupportedFaction } from 'meta/factions'
import { IImportedArmy, WARSCROLL_BUILDER } from 'types/import'
import { importErrorChecker } from 'utils/import'
import { importFactionNameMap, importUnitOptionMap } from 'utils/import/options'
import { cleanWarscrollText } from 'utils/warscroll/warscrollUtils'

export const getWarscrollArmyFromPdf = (pdfText: string[]): IImportedArmy => {
  const army = getInitialWarscrollArmyPdf(pdfText)
  const errorChecked = importErrorChecker(army, WARSCROLL_BUILDER)

  return errorChecked
}

const getAllegianceTypes = () => {
  return Object.values(getArmyList())
    .map(v => (v.Army?.FlavorType || '').replace(/s$/, '')) // Remove trailing s
    .filter(x => !!x)
}

const unitIndicatorsPdf = [
  'Artillery',
  'Leaders',
  'Units',
  'Behemoths',
  'War Machines',
  'Battleline',
  'Spearhead',
  'Main Body',
  'Rearguard',
].map(x => x.toUpperCase())

const getInitialWarscrollArmyPdf = (pdfText: string[]): IImportedArmy => {
  const cleanedText = cleanWarscrollText(pdfText)
  const genericScenery = GenericScenery.map(x => x.name)

  const flavorTypes = getAllegianceTypes()

  let allyUnits: string[] = []
  let factionName = ''
  let origin_realm: string | null = null
  let selector = ''
  let unknownSelections: string[] = []

  const selections = cleanedText.reduce(
    (accum, txt) => {
      // Force certain values into a certain part of the selections
      if (manualLookup[txt]) {
        const slice = manualLookup[txt]
        accum[slice] = accum[slice].concat(txt)
        return accum
      }

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
        accum.flavors = accum.flavors.concat(skyport)
        return accum
      }

      // New format
      if (txt.startsWith('- Sky Port: ')) {
        const skyport = txt.replace('- Sky Port: ', '').trim().replace(' ', '-') // e.g. Barak Zilfin -> Barak-Zilfin
        if (skyport !== 'None') {
          accum.flavors = accum.flavors.concat(skyport)
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

        if (txt.startsWith('- Tribe: ')) {
          const { flavor, trait } = getTribe(txt)
          accum.flavors = accum.flavors.concat(flavor)
          if (trait) {
            accum.command_traits = accum.command_traits.concat(trait)
          }
          return accum
        }

        if (txt.startsWith('- Additional Footnote: ')) {
          const trait = txt.replace('- Additional Footnote: ', '').trim()
          if (trait) {
            accum.command_traits = accum.command_traits.concat(trait)
            return accum
          }
        }

        if (txt.startsWith('- Constellation: ')) {
          const name = txt.replace('- Constellation: ', '').trim()
          const allegiances = getSeraphonConstellations(name)
          accum.flavors = accum.flavors.concat(allegiances)
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
          const flavor = ['Gristlegore', 'Morgaunt', 'Blisterskin', 'Hollowmourne'].find(x => txt.includes(x))
          if (flavor) {
            accum.flavors = accum.flavors.concat(flavor)
            return accum
          }
        }

        if (txt.startsWith('- City: ')) {
          const { flavor, trait } = getCity(txt)
          accum.flavors = accum.flavors.concat(flavor)
          if (trait) {
            accum.command_traits = accum.command_traits.concat(trait)
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

        // Handle cases where two command traits are in the same entry
        if (txt.startsWith('- Command Trait : ') && txt.replace('- Command Trait : ', '').match(':')) {
          // e.g. "- Command Trait : Killer Reputation: Fateseeker"
          const traits = txt
            .replace('- Command Trait : ', '')
            .split(':')
            .map(x => x.trim())
          // results in ['Killer Reputation', 'Fateseeker']
          accum.command_traits = accum.command_traits.concat(...traits)
          return accum
        }

        // Handles Sons of Behemat issue with double command traits
        if (txt.startsWith('- Command Trait: Extremely Bitter')) {
          let traits = ['Extremely Bitter (Breaker Tribe)']
          const secondTrait = txt.replace('- Command Trait: Extremely Bitter - ', '').trim()
          if (secondTrait) traits.push(secondTrait)
          accum.command_traits = accum.command_traits.concat(...traits)
          return accum
        }

        // General handling of Command Traits, checks for attached spells
        if (txt.startsWith('- Command Trait : ')) {
          const { trait, spell } = getTraitWithSpell('Command Trait', txt)
          accum.command_traits = accum.command_traits.concat(trait)
          if (spell) accum.spells = accum.spells.concat(spell)
          return accum
        }
        if (txt.startsWith('- Mount Trait : ')) {
          const trait = getTrait('Mount Trait', txt)
          accum.command_traits = accum.command_traits.concat(trait)
          return accum
        }
        if (txt.startsWith('- Drakeblood Curse : ')) {
          const trait = getTrait('Drakeblood Curse', txt)
          accum.command_traits = accum.command_traits.concat(trait)
          return accum
        }
        if (txt.startsWith('- Grand Court: ')) {
          const trait = getTrait('Grand Court', txt, false)
          accum.command_traits = accum.command_traits.concat(trait)
          return accum
        }

        // Handle allegiances programmatically
        let stop = false
        flavorTypes.forEach(t => {
          if (!stop) return
          if (txt.startsWith(`- ${t}: `)) {
            const flavor = txt.replace(`- ${t}: `, '').trim()
            if (flavor && flavor !== 'None') {
              accum.flavors = accum.flavors.concat(flavor)
              stop = true
            }
          }
        })
        if (stop) return accum

        if (txt.startsWith('- Artefact : ')) {
          const { trait: artifact, spell } = getTraitWithSpell('Artefact', txt)
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
      artifacts: [] as string[],
      battalions: [] as string[],
      command_abilities: [] as string[],
      command_traits: [] as string[],
      endless_spells: [] as string[],
      flavors: [] as string[],
      scenery: [] as string[],
      spells: [] as string[],
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

/**
 * Value on the left, desired selection placement on the right
 */
const manualLookup = {
  'Celestar Ballista': 'units',
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
    'Extremely Bitter -',
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

const getTribe = (txt: string) => {
  const tribe = txt.split('- Tribe: ')[1].split('(')
  const flavor = tribe[0].trim()
  try {
    let trait = tribe[1] ? tribe[1].split('Fierce Loathing: ')[1].replace(')', '').trim() : null
    trait = trait ? `${trait} ${CommonSonsOfBehematData.TAGS.FierceLoathingTag}` : null //  e.g. "Shiny 'Uns (Fierce Loathing)"
    return { flavor, trait }
  } catch (err) {
    return { flavor, trait: null }
  }
}

const getCity = (txt: string) => {
  const city = txt.split('- City: ')[1].split('(')
  const flavor = city[0].trim()
  try {
    const trait = city[1] ? city[1].split('Illicit Dealings: ')[1].replace(')', '').trim() : null
    return { flavor, trait }
  } catch (err) {
    return { flavor, trait: null }
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
  'Loremaster -',
  'Midnight Tome -',
  'One with Fire and Ice -',
  'Rune of Ulgu -',
  'Secretive Warlock -',
  'Vast Intellect -',
  'Whitefire Tome -',
]

/**
 * Extracts a given trait, and optionally, a spell associated with it
 * @param txt
 */
const getTraitWithSpell = (type: TTraitType, txt: string, addSpace = true) => {
  const cleaned = getTrait(type, txt, addSpace)
  const hasSpell = traitToSpellMapper.some(x => cleaned.startsWith(x))

  if (!hasSpell) return { trait: cleaned, spell: null }

  const [trait, spell] = cleaned.split(' - ').map(x => x.trim())

  return { trait, spell: spell === 'All Spells' ? null : spell }
}

/**
 * If a Seraphon army has taken a constellation such as Koatl's Claw or Thunder Lizard,
 * this function adds the "Way of the Seraphon" that the constellation is associated with
 * @param value
 */
const getSeraphonConstellations = (value: string): string[] => {
  if (SeraphonConstellations.COALESCED_ALLEGIANCES.includes(value)) {
    return [value, SeraphonConstellations.COALESCED]
  }
  if (SeraphonConstellations.STARBORNE_ALLEGIANCES.includes(value)) {
    return [value, SeraphonConstellations.STARBORNE]
  }
  return [value]
}
