import { mergeParentEffectObjs } from 'factions/temporaryAdapter'
import { Realmscapes } from 'generic_rules'
import produce from 'immer'
import { flatten, sortBy, sortedUniq, uniq } from 'lodash'
import { TSupportedFaction } from 'meta/factions'
import { getFactionFromList } from 'meta/faction_list'
import { Game, TGameStructure } from 'meta/game_structure'
import { IArmy, TAllyArmies } from 'types/army'
import {
  entryKeyToSelectionsKey,
  IReminder,
  selectionsKeyToEntryKey,
  TEffects,
  TEntry,
  TEntryProperties,
  TTurnAction,
} from 'types/data'
import { TBattleRealms } from 'types/realmscapes'
import { IAllySelections, TSelections, TSelectionTypes } from 'types/selections'
import { TAllySelectionStore } from 'types/store'
import { hashReminder } from 'utils/reminderUtils'
import { getActionTitle, titleCase } from 'utils/textUtils'
import { getTagFromEntry } from './getTag'
import { mapListToDict } from './mapListToDict'

type TProcessReminders = (
  army: IArmy,
  factionName: TSupportedFaction,
  subFactionName: string,
  selections: TSelections,
  realmscape: TBattleRealms | null,
  allyFactionNames: TSupportedFaction[],
  allyArmies: TAllyArmies,
  allySelections: TAllySelectionStore
) => IReminder

export const processReminders: TProcessReminders = (
  army,
  factionName,
  subFactionName,
  selections,
  realmscape,
  allyFactionNames,
  allyArmies,
  allySelections
) => {
  const allyData = allyFactionNames.map(name => {
    return {
      allyArmy: allyArmies[name],
      allySelections: allySelections[name],
    }
  })

  let reminders = processConditions(army.Game, selections, {})

  if (allyData.length) {
    reminders = allyData.reduce((accum, data) => {
      if (!data.allySelections) return accum

      // Get mandatory items and assign them to selections
      const alliedMandatorySelections: TMandatorySelectionsAccum = data.allySelections.units.reduce(
        (a, _unit) => {
          const entry = data.allyArmy.Units.find(x => x.name === _unit)
          if (entry) getMandatorySelectionsForAllies(entry, a) // Modifies the accumulator
          return a
        },
        {}
      )

      // Merge the actual allied selections with their mandatory side effects
      const allAlliedSelections = Object.keys(selectionsKeyToEntryKey).reduce(
        (a, key) => {
          if (!a[key]) a[key] = []

          if (alliedMandatorySelections[key]) {
            a[key] = uniq(a[key].concat(alliedMandatorySelections[key]))
          }

          return a
        },
        { ...data.allySelections }
      )

      return processConditions(data.allyArmy.Game, allAlliedSelections, accum)
    }, reminders)
  }

  const faction = getFactionFromList(factionName)

  // Add faction battle traits
  if (faction?.factionBattleTraits?.length) {
    faction.factionBattleTraits.forEach(e => {
      e.when.forEach(when => {
        const t: TTurnAction = {
          ...e,
          id: hashReminder(when, e.name, e.desc),
          condition: [`${titleCase(factionName)} Allegiance`],
          when,
        }
        reminders[when] = reminders[when] ? reminders[when].concat(t) : [t]
      })
    })
  }

  // Add subfaction battle traits
  if (army.BattleTraits && army.BattleTraits.length) {
    army.BattleTraits.forEach((e: TEffects) => {
      e.when.forEach(when => {
        const t: TTurnAction = {
          ...e,
          id: hashReminder(when, e.name, e.desc),
          condition: [`${titleCase(subFactionName || factionName)} Allegiance`],
          when,
        }
        reminders[when] = reminders[when] ? reminders[when].concat(t) : [t]
      })
    })
  }

  // Add Realmscape effects
  if (realmscape) {
    const realm = Realmscapes.find(x => x.name === realmscape)
    if (realm) {
      realm.effects.forEach(e => {
        e.when.forEach(when => {
          const t: TTurnAction = {
            ...e,
            id: hashReminder(when, e.name, e.desc),
            condition: [`Realmscape (${realmscape})`],
            when,
          }
          reminders[when] = reminders[when] ? reminders[when].concat(t) : [t]
        })
      })
    }
  }

  // Last step, we need to sort by the original order
  const ordered = Object.keys(Game).reduce((accum, key) => {
    if (reminders[key]) {
      // Calculate ActionTitles
      const turnActions = reminders[key].map(action => ({ ...action, actionTitle: getActionTitle(action) }))
      accum[key] = sortBy(turnActions, ['actionTitle', 'name'])
    }
    return accum
  }, {})

  return ordered
}

/**
 * Exported for testing purposes
 *
 * @param game
 * @param selections
 * @param startVal
 */
export const processConditions = (
  game: TGameStructure,
  selections: TSelections | IAllySelections,
  startVal = {}
) => {
  const conditionNames = mapListToDict(flatten(Object.values(selections)))

  const conditionsWithMetadata = Object.entries(selections).reduce((a, [key, value]) => {
    value.forEach(name => {
      a.push({
        name,
        tag: selectionsKeyToEntryKey[key],
      })
    })
    return a
  }, [] as { tag: TEntryProperties; name: string }[])

  const reminders = Object.keys(game).reduce((accum: Record<string, TTurnAction[]>, when) => {
    if (!game[when].length) return accum

    game[when].forEach((action: TTurnAction) => {
      // Find a matching name/tag
      if (conditionNames[action.condition[0]]) {
        const tag = conditionsWithMetadata.find(
          x => x.name === action.name && x.tag === getTagFromEntry(action)
        )?.tag

        // Check for proper tag match (e.g spell, prayer, etc)
        if (!tag || action[tag] === true) {
          accum[when] = accum[when] ? processCondition(accum[when], action) : [action]
        }
      }
    })

    return accum
  }, startVal)

  return reminders
}

/**
 * Check to see if we've already added this rule for a different unit
 * If so, combine the entries
 * We use Immer to make sure we don't accidently mutate anything
 * @param phase
 * @param action
 */
const processCondition = produce((phase: TTurnAction[], action: TTurnAction) => {
  // See if we can find a matching action already in the phase
  const idx = phase.findIndex(x => x.name === action.name && x.desc === action.desc)

  // If there's not a matching action, add this action to the existing phase
  if (idx === -1) {
    phase.push(action)
    return phase
  }

  // If there is a matching action, merge the entries!
  phase[idx].condition = sortedUniq(sortBy(phase[idx].condition.concat(action.condition)))
  return phase
})

type TMandatorySelectionsAccum = {
  [key in TSelectionTypes]?: string[]
}

const getMandatorySelectionsForAllies = (item: TEntry, accum: TMandatorySelectionsAccum) => {
  if (!item.mandatory) return

  Object.keys(item.mandatory).forEach(sliceKey => {
    let key = sliceKey as TSelectionTypes

    const slice = item?.mandatory?.[key]
    if (!slice || !slice.length) return

    const mergedEntries = mergeParentEffectObjs(slice)

    mergedEntries.forEach(_entry => {
      const tag = getTagFromEntry(_entry)
      if (tag) {
        const _slice: string[] = accum[entryKeyToSelectionsKey[tag]]
        if (_slice) {
          accum[entryKeyToSelectionsKey[tag]] = accum[entryKeyToSelectionsKey[tag]].concat(_entry.name)
        } else {
          accum[entryKeyToSelectionsKey[tag]] = [_entry.name]
        }
      }
      if (_entry.mandatory) getMandatorySelectionsForAllies(_entry, accum)
    })
  })
}
