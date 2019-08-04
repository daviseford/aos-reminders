import { flatten, sortBy, split, join } from 'lodash'
import produce from 'immer'
import { titleCase } from './titleCase'
import { RealmscapeFeatures } from 'army/malign_sorcery'
import { Game, TGameStructure } from 'meta/game_structure'
import { TSupportedFaction } from 'meta/factions'
import { IArmy } from 'types/army'
import { IEffects, IReminder, ITurnAction } from 'types/data'
import { ISelections, IAllySelections } from 'types/selections'

type TProcessReminders = (
  army: IArmy,
  factionName: TSupportedFaction,
  selections: ISelections,
  realmscape_feature: string | null,
  allyData: Array<{
    allyArmy: IArmy
    allySelections: IAllySelections
  }>
) => IReminder

export const processReminders: TProcessReminders = (army, factionName, selections, realmscape_feature, allyData) => {
  let reminders = processConditions(army.Game, selections, {})

  if (allyData.length) {
    reminders = allyData.reduce((accum, data) => {
      return processConditions(data.allyArmy.Game, data.allySelections, accum)
    }, reminders)
  }

  // Add Abilities
  if (army.Abilities.length) {
    army.Abilities.forEach((a: IEffects) => {
      const t: ITurnAction = {
        name: a.name,
        desc: a.desc,
        condition: `${titleCase(factionName)} Allegiance`,
        allegiance_ability: true,
        tag: a.tag || false,
        command_ability: a.command_ability || false,
      }
      a.when.forEach(when => {
        reminders[when] = reminders[when] ? reminders[when].concat(t) : [t]
      })
    })
  }

  // Add Realmscape features
  if (realmscape_feature) {
    const r = RealmscapeFeatures.find(x => x.name === realmscape_feature) as IEffects
    const t: ITurnAction = {
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

const processConditions = (game: TGameStructure, selections: ISelections | IAllySelections, startVal = {}) => {
  const conditions = flatten(Object.values(selections))

  const reminders = Object.keys(game).reduce((accum: { [key: string]: ITurnAction[] }, when) => {
    if (!game[when].length) return accum

    game[when].forEach((action: ITurnAction) => {
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
const processCondition = produce((phase: ITurnAction[], action: ITurnAction) => {
  // See if we can find a matching action already in the phase
  const idx = phase.findIndex(x => x.name === action.name)

  // If there's not a matching action, add this action to the existing phase
  if (idx === -1) {
    phase.push(action)
    return phase
  }

  // If there is a matching action, merge the entries!
  // Split the string in order to sort alphabetically in case of multiple matches :)
  const sep = `, `
  phase[idx].condition = join(sortBy(split(phase[idx].condition, sep).concat(action.condition)), sep)
  return phase
})
