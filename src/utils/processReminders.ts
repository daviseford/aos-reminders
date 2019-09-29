import { flatten, sortBy, split, join } from 'lodash'
import produce from 'immer'
import { titleCase } from './textUtils'
import { RealmscapeFeatures } from 'army/generic'
import { Game, TGameStructure } from 'meta/game_structure'
import { TSupportedFaction } from 'meta/factions'
import { IArmy, TAllyArmies } from 'types/army'
import { TEffects, IReminder, TTurnAction } from 'types/data'
import { ISelections, IAllySelections } from 'types/selections'
import { TAllySelectionStore } from 'types/store'

type TProcessReminders = (
  army: IArmy,
  factionName: TSupportedFaction,
  selections: ISelections,
  realmscape_feature: string | null,
  allyFactionNames: TSupportedFaction[],
  allyArmies: TAllyArmies,
  allySelections: TAllySelectionStore
) => IReminder

export const processReminders: TProcessReminders = (
  army,
  factionName,
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
  if (army.Abilities && army.Abilities.length) {
    army.Abilities.forEach((a: TEffects) => {
      const command_ability = a.command_ability || false
      const t: TTurnAction = {
        name: a.name,
        desc: a.desc,
        condition: `${titleCase(factionName)} Allegiance`,
        tag: a.tag || false,
        allegiance_ability: !command_ability,
        command_ability,
      }
      a.when.forEach(when => {
        reminders[when] = reminders[when] ? reminders[when].concat(t) : [t]
      })
    })
  }

  // Add Realmscape features
  if (realmscape_feature) {
    const r = RealmscapeFeatures.find(x => x.name === realmscape_feature) as TEffects
    const t: TTurnAction = {
      name: r.name,
      desc: r.desc,
      condition: `Realmscape Feature`,
    }
    r.when.forEach(when => {
      reminders[when] = reminders[when] ? reminders[when].concat(t) : [t]
    })
  }

  // Last step, we need to sort by the original order
  const ordered = Object.keys(Game).reduce((accum, key) => {
    if (reminders[key]) {
      accum[key] = reminders[key]
    }
    return accum
  }, {})

  return ordered
}

const processConditions = (
  game: TGameStructure,
  selections: ISelections | IAllySelections,
  startVal = {}
) => {
  const conditions = flatten(Object.values(selections))

  const reminders = Object.keys(game).reduce((accum: { [key: string]: TTurnAction[] }, when) => {
    if (!game[when].length) return accum

    game[when].forEach((action: TTurnAction) => {
      if (conditions.includes(action.condition)) {
        accum[when] = accum[when] ? processCondition(accum[when], action) : [action]
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
  // Split the string in order to sort alphabetically in case of multiple matches :)
  phase[idx].condition = addToString(phase[idx].condition, action.condition)
  return phase
})

/**
 * Given a string, adds a new entry by
 * splitting on a seperator and alphabetizing the result
 * @param existingString
 * @param newString
 * @param sep
 */
export const addToString = (existingString: string, newString: string, sep: string = `, `) => {
  return join(sortBy(split(existingString, sep).concat(newString)), sep)
}
