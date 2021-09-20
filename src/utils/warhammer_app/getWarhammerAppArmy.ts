import { CoreBattalions } from 'generic_rules'
import { uniq } from 'lodash'
import { TSupportedFaction } from 'meta/factions'
import { getFactionFromList } from 'meta/faction_list'
import { IImportedArmy, WARHAMMER_APP } from 'types/import'
import { TSelections } from 'types/selections'
import { isValidFactionName } from 'utils/armyUtils'
import { importErrorChecker } from 'utils/import'
import { importFactionNameMap } from 'utils/import/options'
import { cleanWarscrollText } from 'utils/warscroll/warscrollUtils'
import { cleanWarhammerAppText, warhammerAppPlaceholders } from './warhammerAppUtils'

export const getWarhammerAppArmy = (text: string): IImportedArmy => {
  const cleanedText = cleanWarhammerAppText(text)
  const army = getInitialWarhammerAppArmy(cleanedText)
  const errorChecked = importErrorChecker(army, WARHAMMER_APP)
  return errorChecked
}

const {
  ALLY_SUFFIX,
  ARMY_NAME_PREFIX,
  ARMY_NOTES_PREFIX,
  ARTIFACTS_PREFIX,
  BATTALIONS,
  COMMAND_TRAITS_PREFIX,
  END_OF_ENTRY,
  END_OF_LIST,
  ENDLESS_SPELLS,
  ENHANCEMENTS,
  FACTION_NAME_PREFIX,
  FLAVOR_PREFIX,
  GRAND_STRATEGIES_PREFIX,
  INVALID_LIST,
  MOUNT_TRAITS_PREFIX,
  PRAYERS_PREFIX,
  SCENERY,
  SPELLS_PREFIX,
  SUBFACTION_PREFIX,
  TRIUMPHS_PREFIX,
  UNITS,
  VALID_LIST,
} = warhammerAppPlaceholders

const getInitialWarhammerAppArmy = (text: string[]): IImportedArmy => {
  const cleanedText = cleanWarscrollText(text)

  let allyUnits: string[] = []
  let factionName = ''
  let subFactionName = ''
  let origin_realm: string | null = null
  let selector = ''
  let battalionNames = CoreBattalions.map(x => x.name)

  const selections = cleanedText.reduce(
    (accum, txt) => {
      // Ignore these lines when processing
      if (
        [END_OF_LIST, ENHANCEMENTS, VALID_LIST, INVALID_LIST, END_OF_ENTRY].includes(txt) ||
        txt.startsWith(ARMY_NAME_PREFIX) ||
        txt.startsWith(ARMY_NOTES_PREFIX) ||
        txt.startsWith('Magnificent Bonus: ')
      ) {
        return accum
      }

      if (txt.startsWith(FACTION_NAME_PREFIX)) {
        const name = txt.replace(FACTION_NAME_PREFIX, '').trim()
        const factionLookup = importFactionNameMap[name]

        factionName = factionLookup?.factionName || name

        if (factionLookup?.subFactionName) {
          subFactionName = factionLookup.subFactionName
        }

        // Add faction-specific battalion names to look up later
        if (isValidFactionName(factionName)) {
          const additionalBattalions = getFactionFromList(factionName).AggregateArmy.Battalions.map(
            x => x.name
          )
          battalionNames = battalionNames.concat(additionalBattalions)
        }

        return accum
      }

      if (txt.startsWith(SUBFACTION_PREFIX)) {
        subFactionName = txt.replace(SUBFACTION_PREFIX, '').trim()
        return accum
      }

      if (txt.startsWith(FLAVOR_PREFIX)) {
        accum.flavors.push(txt.replace(FLAVOR_PREFIX, '').trim())
        return accum
      }

      if (txt === UNITS) {
        selector = 'units'
        return accum
      }

      if (txt === BATTALIONS) {
        selector = 'battalions'
        return accum
      }

      if (txt === ENDLESS_SPELLS) {
        selector = 'endless_spells'
        return accum
      }

      if (txt === SCENERY) {
        selector = 'scenery'
        return accum
      }

      if (txt.startsWith(TRIUMPHS_PREFIX)) {
        const triumphs = txt
          .replace(TRIUMPHS_PREFIX, '')
          .split(',')
          .map(x => x.trim())
        accum.triumphs = accum.triumphs.concat(triumphs)
        return accum
      }

      if (txt.startsWith(SPELLS_PREFIX)) {
        const spells = txt
          .replace(SPELLS_PREFIX, '')
          .split(',')
          .map(x => x.trim())
        accum.spells = accum.spells.concat(spells)
        return accum
      }

      if (txt.startsWith(ARTIFACTS_PREFIX)) {
        const artifacts = txt
          .replace(ARTIFACTS_PREFIX, '')
          .split(',')
          .map(x => x.trim())
        accum.artifacts = accum.artifacts.concat(artifacts)
        return accum
      }

      if (txt.startsWith(GRAND_STRATEGIES_PREFIX)) {
        const grand_strategy = txt.replace(GRAND_STRATEGIES_PREFIX, '').trim()
        accum.grand_strategies.push(grand_strategy)
        return accum
      }

      if (txt.startsWith(SPELLS_PREFIX)) {
        accum.spells = accum.spells.concat(
          txt
            .replace(SPELLS_PREFIX, '')
            .split(', ')
            .map(x => x.trim())
        )
        return accum
      }

      if (txt.startsWith(PRAYERS_PREFIX)) {
        accum.prayers.push(txt.replace(PRAYERS_PREFIX, '').trim())
        return accum
      }

      if (txt.endsWith(ALLY_SUFFIX)) {
        const alliedUnit = txt.replace(ALLY_SUFFIX, '').trim()
        allyUnits.push(alliedUnit)
        return accum
      }

      if (txt.startsWith(COMMAND_TRAITS_PREFIX)) {
        const trait = txt.replace(COMMAND_TRAITS_PREFIX, '').trim()
        accum.command_traits = accum.command_traits.concat(trait)
        return accum
      }

      if (txt.startsWith(MOUNT_TRAITS_PREFIX)) {
        const trait = txt.replace(MOUNT_TRAITS_PREFIX, '').trim()
        accum.mount_traits.push(trait)
        return accum
      }

      // Add item to accum
      if (selector) {
        if (selector === 'units' || selector === 'battalions') {
          const battalion = battalionNames.find(name => name === txt.trim())

          if (battalion) {
            accum.battalions = uniq(accum.battalions.concat(battalion))
            // TODO: Check for "Magnificent Bonus: blah blah" afterwards
            return accum
          } else {
            selector = 'units'
          }
        }

        accum[selector] = uniq(accum[selector].concat(txt.trim()))
      }

      return accum
    },
    {
      artifacts: [],
      battalions: [],
      command_abilities: [],
      command_traits: [],
      core_rules: [],
      endless_spells: [],
      flavors: [],
      grand_strategies: [],
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
    origin_realm,
    realmscape_feature: null,
    realmscape: null,
    selections,
    subFactionName,
    unknownSelections: [],
  }
}
