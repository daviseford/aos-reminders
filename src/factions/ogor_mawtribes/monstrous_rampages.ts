import { TItemDescriptions } from 'factions/factionTypes'
import { tagAs } from 'factions/metatagger'
import { END_OF_CHARGE_PHASE } from 'types/phases'

const MonstrousRampages = {
  'Chill of the Everwinter': {
    effects: [
      {
        name: `Chill of the Everwinter`,
        desc: `Only a THUNDERTUSK unit that has made a charge move in the same phase can carry out this monstrous rampage. Roll a dice for each enemy unit within 1" of this unit. On a 3+, the strike-last effect applies to that unit until the end of the following combat phase.`,
        when: [END_OF_CHARGE_PHASE],
      },
    ],
  },
  'Unstoppable Charge': {
    effects: [
      {
        name: `Unstoppable Charge`,
        desc: `Only a STONEHORN unit that has made a charge move in the same phase can carry out this monstrous rampage. This unit makes a 3D6" move and can pass across enemy units in the same manner as a unit that can fly. It must finish the move within 3" of any enemy units. At the end of the move, roll a dice for each unit it passed across. On a 2+, that unit suffers D3 mortal wounds.`,
        when: [END_OF_CHARGE_PHASE],
      },
    ],
  },
} satisfies TItemDescriptions

export default tagAs(MonstrousRampages, 'monstrous_rampage')
