import LegionsOfNagash from 'army/legions_of_nagash'
// Battalions
import { TEntry } from 'types/data'
import { COMBAT_PHASE, START_OF_MOVEMENT_PHASE } from 'types/phases'
import { filterBattalions } from 'utils/filterUtils'

// Importing from LoN
const getLegionsOfNagashUnits = () => LegionsOfNagash.Units
const getLegionsOfNagashBattalions = () =>
  filterBattalions(LegionsOfNagash.Battalions, [`Deathmarch`, `Castellans of the Crimson Keep`])

export const Units: TEntry[] = [...getLegionsOfNagashUnits()]

export const Battalions: TEntry[] = [
  ...getLegionsOfNagashBattalions(),
  {
    name: `Court of Nulahmia`,
    effects: [
      {
        name: `The Adevore`,
        desc: `Whilst she is within 9" of this battalion's Bloodseeker Palanquin, you may reroll failed hit rolls for Neferata if the target is an enemy HERO.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Scent of Blood`,
        desc: `At the start of your movement phase, units from the Court of Nulahmia that are within 9" of the battalion's Bloodseeker Palanquin may add 4" to their Move characteristic until the end of the phase.`,
        when: [START_OF_MOVEMENT_PHASE],
      },
    ],
  },
]
