import { Game, TGameStructure } from 'meta/game_structure'
import { ENTRY_PROPERTIES, TEffects, TEntry, TTurnAction } from 'types/data'
import { TTurnWhen } from 'types/phases'
import { TSelectionTypes } from 'types/selections'
import { hashReminder } from 'utils/reminderUtils'

export const processGame = (allEntries: Record<TSelectionTypes, TEntry[]>): TGameStructure => {
  return Object.entries(allEntries).reduce(
    (game, [sliceKey, entries]) => {
      return entries.reduce((game, entry: TEntry) => {
        const withEntry = addProps(entry, sliceKey as TSelectionTypes)
        entry.effects.forEach(effect => {
          effect.when.forEach(phase => {
            const action = withEntry(effect, phase)
            game[phase] = game[phase] ? game[phase].concat(action) : [action]
          })
        })
        return game
      }, game as TGameStructure)
    },
    { ...Game } as TGameStructure
  )
}

/**
 * Using this function, we avoid attaching two or more Props to an action
 * @param entry
 * @param sliceKey
 */
const addProps = (entry: TEntry, sliceKey: TSelectionTypes) => {
  // Figure out if an entry key is true and store it for now
  const entryProp = ENTRY_PROPERTIES.find(k => entry[k] === true)

  return (effect: TEffects, when: TTurnWhen): TTurnAction => {
    const action: TTurnAction = {
      id: hashReminder(when, effect.name, effect.desc),
      condition: [{ type: sliceKey, value: entry.name }],
      name: effect.name,
      desc: effect.desc,
      tag: effect.tag || false,
      when,
    }

    // Figure out if an effects key is true
    const effectProp = ENTRY_PROPERTIES.find(k => effect[k] === true)
    if (effectProp) {
      return {
        ...action,
        [effectProp]: true,
      }
    }

    // It's probably a unit or battalion if there's no entryProp
    if (!entryProp) return action

    // Add the entryProp and return
    return {
      ...action,
      [entryProp]: true,
    }
  }
}
