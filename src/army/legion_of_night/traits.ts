import { TTraits } from 'types/army'
import { BATTLESHOCK_PHASE, COMBAT_PHASE, DURING_SETUP, MOVEMENT_PHASE } from 'types/phases'

const CommandTraits: TTraits = [
  {
    name: `Above Suspicion`,
    effects: [
      {
        name: `Above Suspicion`,
        desc: `This general may be set up in ambush in addition to the 3 units normally allowed by the Ageless Cunning battle trait.`,
        when: [DURING_SETUP],
      },
    ],
  },
  {
    name: `Swift Form`,
    effects: [
      {
        name: `Swift Form`,
        desc: `Add 2" to this general's Move characteristic. In addition, add 2" to the distance they can move when they run.`,
        when: [MOVEMENT_PHASE],
      },
    ],
  },
  {
    name: `Unbending Will`,
    effects: [
      {
        name: `Unbending Will`,
        desc: `Friendly LEGION OF NIGHT units within 12" of this general may re-roll failed battleshock tests.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
  {
    name: `Merciless Hunter`,
    effects: [
      {
        name: `Merciless Hunter`,
        desc: `Re-roll wound rolls of 1 for this general.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Unholy Impetus`,
    effects: [
      {
        name: `Unholy Impetus`,
        desc: `If this general slays any models in the combat phase, pick a friendly LEGION OF NIGHT unit within 3" of the general. Add 1 to the Attacks characteristic of that unit's melee weapons until the end of the phase.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Terrifying Visage`,
    effects: [
      {
        name: `Terrifying Visage`,
        desc: `Subtract 1 from the Bravery characteristic of enemy units within 6" of this general.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
]

export default CommandTraits
