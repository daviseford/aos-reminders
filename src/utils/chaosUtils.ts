import { without } from 'lodash'
import { getSlavesUnits } from 'army/slaves_to_darkness/units'
import { MARKS_OF_CHAOS, TMarksOfChaos } from 'meta/alliances'
import { TEffects } from 'types/data'
import { TUnits } from 'types/army'

/**
 * Returns true if an effect has any Mark of Chaos in its name
 * @param effect
 */
export const hasMarkOfChaos = (effect: TEffects) => MARKS_OF_CHAOS.some(mark => effect.name.includes(mark))

/**
 * Returns only effects where invalid Marks are not present
 * @param mark
 */
const filterEffectsByMark = (mark: TMarksOfChaos) => {
  const invalidMarks = without(MARKS_OF_CHAOS, mark)

  return (effects: TEffects[]): TEffects[] => {
    return effects.filter(({ name }) => invalidMarks.every(m => !name.includes(m)))
  }
}

/**
 * Gets the slave units for a specified Mark of Chaos
 * @param mark
 */
export const getChaosSlaves = (mark: TMarksOfChaos): TUnits => {
  const filter = filterEffectsByMark(mark)
  return [...getSlavesUnits()].map(({ name, effects }) => ({ name, effects: filter(effects) }))
}
