import { TItemDescriptions } from 'factions/factionTypes'
import { tagAs } from 'factions/metatagger'
import { END_OF_CHARGE_PHASE } from 'types/phases'

const MonstrousRampages = {
  'Delectable Appetisers': {
    effects: [
      {
        name: `Delectable Appetisers`,
        desc: `Pick 1 enemy unit that has a Wounds characteristic of 2 or less and is within 3" of this unit and roll a dice. On a 3+, that enemy unit suffers D3 mortal wounds. Then, for each mortal wound that was caused to that enemy unit and not negated, this unit heals 1 wound.`,
        when: [END_OF_CHARGE_PHASE],
      },
    ],
  },
  'Bloodcurdling Shriek': {
    effects: [
      {
        name: `Bloodcurdling Shriek`,
        desc: `Pick 1 enemy unit within 3" of this unit and roll a dice. On a 3+, subtract 2 from the Bravery characteristic of that enemy unit until the end of the turn.`,
        when: [END_OF_CHARGE_PHASE],
      },
    ],
  },
} satisfies TItemDescriptions

export default tagAs(MonstrousRampages, 'monstrous_rampage')
