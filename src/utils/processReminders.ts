import { flatten } from 'lodash'
import { Game, TGameStructure } from 'meta/game_structure'
import { ISelections, IAllySelections } from 'types/selections'
import { TSupportedFaction } from 'meta/factions'
import { IEffects, IReminder, ITurnAction } from 'types/data'
import { IArmy } from 'types/army'
import { titleCase } from './titleCase'
import { RealmscapeFeatures } from 'army/malign_sorcery'

type TProcessReminders = (
  army: IArmy,
  factionName: TSupportedFaction,
  selections: ISelections,
  realmscape_feature: string,
  allyArmy: IArmy,
  allySelections: IAllySelections
) => IReminder

export const processReminders: TProcessReminders = (
  army,
  factionName,
  selections,
  realmscape_feature,
  allyArmy,
  allySelections
) => {
  let reminders = processConditions(army.Game, selections, {})

  if (allyArmy) {
    reminders = processConditions(allyArmy.Game, allySelections, reminders)
  }

  // Add Abilities
  if (army.Abilities && army.Abilities.length) {
    army.Abilities.forEach((a: IEffects) => {
      const t: ITurnAction = {
        name: a.name,
        desc: a.desc,
        condition: `${titleCase(factionName)} Allegiance`,
        allegiance_ability: true,
        tag: a.tag || ``,
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
  const reminders = Object.keys(game).reduce((accum, key) => {
    const phase = game[key]
    const addToAccum = (actions: ITurnAction[], when: string) => {
      actions.forEach((y: ITurnAction) => {
        if (conditions.includes(y.condition)) {
          accum[when] = accum[when] ? accum[when].concat(y) : [y]
        }
      })
    }
    if (phase.length) {
      addToAccum(phase, key)
    }
    return accum
  }, startVal)
  return reminders
}
