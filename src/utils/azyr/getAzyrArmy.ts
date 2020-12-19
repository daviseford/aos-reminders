import { KharadronOverlordsFaction } from 'factions/kharadron_overlords'
import { uniq } from 'lodash'
import { SLAANESH, SLAVES_TO_DARKNESS, TSupportedFaction } from 'meta/factions'
import { getFactionFromList } from 'meta/faction_list'
import { AZYR, IImportedArmy } from 'types/import'
import { TBattleRealms } from 'types/realmscapes'
import { TSelections, TSelectionTypes } from 'types/selections'
import { isValidFactionName } from 'utils/armyUtils'
import { importErrorChecker } from 'utils/import'
import { isPoorlySpacedMatch } from 'utils/import/isPoorlySpacedMatch'
import { factionToFlavorMap, importFactionNameMap } from 'utils/import/options'
import { titleCase } from 'utils/textUtils'

export const getAzyrArmyFromPdf = (pdfText: string[]): IImportedArmy => {
  const army = getInitialAzyrArmy(pdfText)
  // console.log(army)
  const errorChecked = importErrorChecker(army, AZYR)
  return errorChecked
}

const selectorLookup: Record<string, TSelectionTypes> = {
  'COMMAND TRAIT': 'command_traits',
  'ENDLESS SPELL': 'endless_spells',
  'MOUNT TRAIT': 'mount_traits',
  ALLEGIANCE: 'flavors',
  ARTEFACT: 'artifacts',
  BATTALION: 'battalions',
  PRAYER: 'prayers',
  SCENERY: 'scenery',
  SPELL: 'spells',
  UNIT: 'units',
}

const getInitialAzyrArmy = (pages: string[]): IImportedArmy => {
  let factionName = ''
  let subFactionName = ''
  let realmscape: TBattleRealms | null = null
  let allyUnits: string[] = []
  let unknownSelections: string[] = []

  const selections = pages.reduce(
    (accum, name) => {
      if (name.startsWith('FACTION:')) {
        const lookup = getFactionName(name)
        if (lookup.factionName) factionName = lookup.factionName
        if (lookup.subFactionName) subFactionName = lookup.subFactionName
        if (lookup.flavor) accum.flavors = accum.flavors.concat(lookup.flavor)
        return accum
      }

      if (name.startsWith('REALMSCAPE:')) {
        realmscape = titleCase(name.replace('REALMSCAPE: ', '')) as TBattleRealms
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

      // Special KO case for footnotes
      if (name.startsWith('Kharadron Code:')) {
        const footnotes = handleKOTraits(name)
        accum.command_traits = accum.command_traits.concat(footnotes)
        return accum
      }

      // Flavor/Subfaction checker
      if (name.startsWith('ALLEGIANCE:') && isValidFactionName(factionName)) {
        let txt = name.replace('ALLEGIANCE:', '').trim()

        console.log('potential', txt)

        // Need to do something faction-specific to the value? Do it here.
        if (factionName === SLAVES_TO_DARKNESS && txt === 'Knights of the Empty Throne') {
          txt = `The ${txt}` // Fix for Knights
        }
        if (factionName === SLAANESH) txt = txt.replace(/ Host$/, '').trim() // Change Pretenders Host -> Pretenders

        const _Faction = getFactionFromList(factionName)
        if (_Faction.subFactionKeyMap[txt]) {
          subFactionName = txt
          console.log('Found something', txt)
          return accum
        }
      }

      let found = false

      // Check all other types
      Object.entries(selectorLookup).forEach(([_prefix, _slice]) => {
        if (found) return
        if (name.startsWith(`${_prefix}:`)) {
          name = name.replace(`${_prefix}: `, '')
          accum[_slice] = accum[_slice].concat(name)
          found = true
          return accum
        }
      })

      return accum
    },
    {
      artifacts: [],
      battalions: [],
      command_abilities: [],
      command_traits: [],
      endless_spells: [],
      flavors: [],
      mount_traits: [],
      prayers: [],
      scenery: [],
      spells: [],
      triumphs: [],
      units: [],
    } as TSelections
  )

  return {
    allyFactionNames: [],
    allySelections: {},
    allyUnits: uniq(allyUnits),
    errors: [],
    factionName: factionName as TSupportedFaction,
    subFactionName,
    origin_realm: null,
    realmscape_feature: null,
    realmscape,
    selections,
    unknownSelections,
  }
}

const getFactionName = (
  val: string
): { factionName: string | null; subFactionName: string | null; flavor: string | null } => {
  const name = val.replace('FACTION: ', '').trim()
  const lookup = importFactionNameMap[name]
  const factionName = lookup?.factionName || null
  const subFactionName = lookup?.subFactionName || null
  if (!factionName) console.error('ALERT: Missing this faction: ' + name)
  const flavor = factionName ? factionToFlavorMap[name] : null
  return { factionName, subFactionName, flavor }
}

const handleKOTraits = (name: string): string[] => {
  const traits = getKOTraits()
  const possiblePrefix = ['ARTYCLE', 'FOOTNOTE', 'AMENDMENT']
  const footnotes = name
    .replace('Kharadron Code: ', '')
    .split(';')
    .map(x => x.trim())

  if (footnotes.length === 1) {
    // Handle a dumb case where Azyr has just split the codes by commas, not colons
    // Why are they inconsistent, and only for some codes? God only knows
    const footnotesUpper = footnotes[0].toUpperCase()
    const regEx = new RegExp(`(${possiblePrefix.join('|')}): `, 'gi')
    const trimmedTraits = traits.map(x => x.replace(regEx, '').toUpperCase())
    return trimmedTraits.reduce((a, trait, i) => {
      if (footnotesUpper.includes(trait)) {
        a.push(traits[i])
      }
      return a
    }, [] as string[])
  }

  return footnotes.map(note => {
    let result = ''
    const valUpper = note.toUpperCase()
    traits.forEach(trait => {
      if (!!result) return
      possiblePrefix.forEach(pre => {
        if (!!result) return
        if (isPoorlySpacedMatch(`${pre}: ${valUpper}`, trait.toUpperCase())) {
          result = trait
        }
      })
    })

    return result || note
  })
}

const getKOTraits = (): string[] => {
  const prefix = ['ARTYCLE', 'FOOTNOTE', 'AMENDMENT']

  const command_traits = KharadronOverlordsFaction.AggregateArmy.CommandTraits.filter(x =>
    prefix.some(pre => x.name.startsWith(pre))
  ).map(x => x.name)

  const flavorTraits = KharadronOverlordsFaction.AggregateArmy.Flavors.map(a => {
    return a.effects.filter(e => prefix.some(pre => e.name.startsWith(pre))).map(e => e.name)
  }).flat()
  return uniq(command_traits.concat(flavorTraits))
}
