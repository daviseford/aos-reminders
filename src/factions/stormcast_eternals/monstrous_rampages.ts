import { TItemDescriptions } from 'factions/factionTypes'
import { tagAs } from 'factions/metatagger'
import { END_OF_CHARGE_PHASE } from 'types/phases'

const MonstrousRampages = {
  Stun: {
    effects: [
      {
        name: `Stun`,
        desc: `Pick 1 enemy unit within 3" of this unit and roll a dice. On a 3+, subtract 1 from wound rolls for attacks made by that unit in the following combat phase.`,
        when: [END_OF_CHARGE_PHASE],
      },
    ],
  },
  'Impact Tremors': {
    effects: [
      {
        name: `Impact Tremors`,
        desc: `Pick 1 enemy unit within 3" of this unit and roll a dice. On a 3+, in the following combat phase, models in that unit can only move up to 1" when they make a pile-in move instead of up to 3"`,
        when: [END_OF_CHARGE_PHASE],
      },
    ],
  },
} satisfies TItemDescriptions

export default tagAs(MonstrousRampages, 'monstrous_rampage')
