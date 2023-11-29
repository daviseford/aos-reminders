import { TItemDescriptions } from 'factions/factionTypes'
import { tagAs } from 'factions/metatagger'
import { END_OF_CHARGE_PHASE } from 'types/phases'

const MonstrousRampages = {
  'Mountain of Loathsome Flesh': {
    effects: [
      {
        name: `Mountain of Loathsome Flesh`,
        desc: `You can carry out this monstrous rampage with this unit instead of any other monstrous rampage you can carry out with this unit. If you do so, pick 1 enemy unit within 3" of this unit and roll a dice. On a 2+, that enemy unit suffers a number of mortal wounds equal to the Mountain of Loathsome Flesh value on this unit's damage table.`,
        when: [END_OF_CHARGE_PHASE],
      },
    ],
  },
} satisfies TItemDescriptions

export default tagAs(MonstrousRampages, 'monstrous_rampage')
