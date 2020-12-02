import KOArmy from 'army/kharadron_overlords'
import { uniq } from 'lodash'
import { TSupportedFaction } from 'meta/factions'
import { AZYR, IImportedArmy } from 'types/import'
import { TBattleRealms } from 'types/realmscapes'
import { TSelections, TSelectionTypes } from 'types/selections'
import { importErrorChecker } from 'utils/import'
import { isPoorlySpacedMatch } from 'utils/import/isPoorlySpacedMatch'
import { factionToFlavorMap, importFactionNameMap } from 'utils/import/options'
import { titleCase } from 'utils/textUtils'

export const getAzyrArmyFromPdf = (pdfText: string[]): IImportedArmy => {
  const army = getInitialAzyrArmy(pdfText)
  const errorChecked = importErrorChecker(army, AZYR)
  return errorChecked
}

const selectorLookup: Record<string, TSelectionTypes> = {
  'COMMAND TRAIT': 'command_traits',
  'ENDLESS SPELL': 'endless_spells',
  'MOUNT TRAIT': 'command_traits',
  ALLEGIANCE: 'flavors',
  ARTEFACT: 'artifacts',
  BATTALION: 'battalions',
  SCENERY: 'scenery',
  SPELL: 'spells',
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

const getInitialAzyrArmy = (pages: string[]): IImportedArmy => {
  let factionName = ''
  let realmscape: TBattleRealms | null = null
  let allyUnits: string[] = []
  let unknownSelections: string[] = []

  const selections = pages.reduce(
    (accum, name) => {
      if (name.startsWith('FACTION:')) {
        const { faction, flavor } = getFactionName(name)
        if (faction) {
          factionName = faction
        }
        if (flavor) {
          accum.flavors = accum.flavors.concat(flavor)
        }
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
      artifacts: [],
      battalions: [],
      command_abilities: [],
      command_traits: [],
      endless_spells: [],
      flavors: [],
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
    subFactionName: '', // TODO
    origin_realm: null,
    realmscape_feature: null,
    realmscape,
    selections,
    unknownSelections,
  }
}

const getFactionName = (val: string): { faction: string | null; flavor: string | null } => {
  const name = val.replace('FACTION: ', '')
  const faction = importFactionNameMap[name] || null
  if (!faction) console.error('ALERT: Missing this faction: ' + name)
  const flavor = faction ? factionToFlavorMap[name] : null
  return { faction, flavor }
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
  const command_traits = KOArmy.Traits.filter(x => prefix.some(pre => x.name.startsWith(pre))).map(
    x => x.name
  )
  const flavorTraits = KOArmy.Allegiances.map(a => {
    return a.effects.filter(e => prefix.some(pre => e.name.startsWith(pre))).map(e => e.name)
  }).flat()
  return uniq(command_traits.concat(flavorTraits))
}
