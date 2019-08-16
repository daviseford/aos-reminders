import { without } from 'lodash'
import { MARKS_OF_CHAOS, TMarksOfChaos } from 'meta/alliances'
import { TEffects } from 'types/data'

/**
 * Returns true if an effect has any Mark of Chaos in its name
 * @param effect
 */
export const hasMarkOfChaos = (effect: TEffects) => MARKS_OF_CHAOS.some(mark => effect.name.includes(mark))

/**
 * Returns only effects where invalid Marks are not present
 * @param mark
 */
export const filterEffectsByMark = (mark: TMarksOfChaos) => (effects: TEffects[]): TEffects[] => {
  const invalidMarks = without(MARKS_OF_CHAOS, mark)
  return effects.filter(({ name }) => invalidMarks.every(m => !name.includes(m)))
}
