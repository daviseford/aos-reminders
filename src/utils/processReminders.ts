import { ITurnAction, Game, TGameStructure } from 'meta/turn_structure'
import { ISelections } from 'types/selections'
import { TSupportedFaction } from 'meta/factions'
import { IEffects, IReminder } from 'types/data'
import { IArmy } from 'types/army'
import { titleCase } from './titleCase'
import { RealmscapeFeatures } from 'army/malign_sorcery/realmscape_features'

type TProcessReminders = (
  army: IArmy,
  factionName: TSupportedFaction,
  selections: ISelections,
  realmscape: string
) => IReminder

export const processReminders: TProcessReminders = (army, factionName, selections, realmscape) => {
  const game: TGameStructure = army.Game
  const conds = Object.values(selections).reduce((a, b) => a.concat(b), [])

  const reminders = Object.keys(game).reduce((accum, key) => {
    const phase = game[key]
    const addToAccum = (actions: ITurnAction[], when: string) => {
      actions.forEach((y: ITurnAction) => {
        if (conds.includes(y.condition)) {
          accum[when] = accum[when] ? accum[when].concat(y) : [y]
        }
      })
    }
    if (phase.length) {
      addToAccum(phase, key)
    }
    return accum
  }, {})

  // Add Abilities
  if (army.Abilities && army.Abilities.length) {
    army.Abilities.forEach((a: IEffects) => {
      const t: ITurnAction = {
        name: a.name,
        action: a.desc,
        condition: `${titleCase(factionName)} Allegiance`,
      }
      a.when.forEach(when => {
        reminders[when] = reminders[when] ? reminders[when].concat(t) : [t]
      })
    })
  }

  // Add Realmscape features
  if (realmscape !== 'None') {
    const r = RealmscapeFeatures.find(x => x.name === realmscape) as IEffects
    const t: ITurnAction = {
      name: r.name,
      action: r.desc,
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
