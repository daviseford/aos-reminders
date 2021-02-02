import { RealmscapeFeatures } from 'generic_rules'
import produce from 'immer'
import { flatten, sortBy, sortedUniq } from 'lodash'
import { TSupportedFaction } from 'meta/factions'
import { Game, TGameStructure } from 'meta/game_structure'
import { IArmy, TAllyArmies } from 'types/army'
import { IReminder, selectionsKeyToEntryKey, TEffects, TTurnAction } from 'types/data'
import { IAllySelections, TSelections } from 'types/selections'
import { TAllySelectionStore } from 'types/store'
import { hashReminder } from 'utils/reminderUtils'
import { getActionTitle, titleCase } from 'utils/textUtils'

type TProcessReminders = (
  army: IArmy,
  factionName: TSupportedFaction,
  subFactionName: string,
  selections: TSelections,
  realmscape_feature: string | null,
  allyFactionNames: TSupportedFaction[],
  allyArmies: TAllyArmies,
  allySelections: TAllySelectionStore
) => IReminder

export const processReminders: TProcessReminders = (
  army,
  factionName,
  subFactionName,
  selections,
  realmscape_feature,
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
      return processConditions(data.allyArmy.Game, data.allySelections, accum)
    }, reminders)
  }

  // Add Abilities
  if (army.BattleTraits && army.BattleTraits.length) {
    army.BattleTraits.forEach((a: TEffects) => {
      const command_ability = a.command_ability || false
      a.when.forEach(when => {
        const t: TTurnAction = {
          id: hashReminder(when, a.name, a.desc),
          name: a.name,
          desc: a.desc,
          condition: [`${titleCase(subFactionName || factionName)} Allegiance`],
          command_ability,
          when,
        }
        reminders[when] = reminders[when] ? reminders[when].concat(t) : [t]
      })
    })
  }

  // Add Realmscape features
  if (realmscape_feature) {
    const r = RealmscapeFeatures.find(x => x.name === realmscape_feature)
    if (r && r.when) {
      r.when.forEach(when => {
        const t: TTurnAction = {
          id: hashReminder(when, r.name, r.desc),
          name: r.name,
          desc: r.desc,
          condition: [`Realmscape Feature`],
          when,
        }
        reminders[when] = reminders[when] ? reminders[when].concat(t) : [t]
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
  const conditions: string[] = flatten(Object.values(selections))

  const conditionsByTag = Object.entries(selections).reduce((a, [key, value]) => {
    value.forEach(v => {
      a[v] = selectionsKeyToEntryKey[key]
    })
    return a
  }, {})

  const reminders = Object.keys(game).reduce((accum: Record<string, TTurnAction[]>, when) => {
    if (!game[when].length) return accum

    game[when].forEach((action: TTurnAction) => {
      if (conditions.includes(action.condition[0])) {
        const tag = conditionsByTag[action.condition[0]]
        // Check for proper tag match (e.g spell, prayer, etc)
        if (!tag || action[tag] === true) {
          accum[when] = accum[when] ? processCondition(accum[when], action) : [action]
        }
      }
    })

    return accum
  }, startVal)

  console.log(reminders.DURING_SHOOTING_PHASE)

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
