import { TItemDescriptions } from 'factions/factionTypes'
import { tagAs } from 'factions/metatagger'
import { END_OF_CHARGE_PHASE } from 'types/phases'

const MonstrousRampages = {
  'Merciful Strike': {
    effects: [
      {
        name: `Merciful Strike`,
        desc: `If the quarry has any wounds allocated to it and is within 3" of this unit, roll a dice and add the number of wounds allocated to the quarry to the roll. If the result is greater than the quarry's Wounds characteristic, 1 model in that unit is slain.`,
        when: [END_OF_CHARGE_PHASE],
      },
    ],
  },
  Groundshaker: {
    effects: [
      {
        name: `Groundshaker`,
        desc: `You can carry out this monstrous rampage instead of any others with this unit. Pick 1 enemy unit within 3" of this unit and roll a dice. On a 3+, the strike-last effect applies to that enemy unit in the following combat phase.`,
        when: [END_OF_CHARGE_PHASE],
      },
    ],
  },
} satisfies TItemDescriptions

export default tagAs(MonstrousRampages, 'monstrous_rampage')
