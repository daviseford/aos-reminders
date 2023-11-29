import { TItemDescriptions } from 'factions/factionTypes'
import { tagAs } from 'factions/metatagger'
import { END_OF_CHARGE_PHASE } from 'types/phases'

const MonstrousRampages = {
  'Gargantuan Jaws': {
    effects: [
      {
        name: `Gargantuan Jaws`,
        desc: `Only a CARNOSAUR can carry out this monstrous rampage. Pick 1 enemy model within 3" of this unit and roll a dice. If the roll is greater than that model's Wounds characteristic, it is slain.`,
        when: [END_OF_CHARGE_PHASE],
      },
    ],
  },
  'Earthshaking Charge': {
    effects: [
      {
        name: `Earthshaking Charge`,
        desc: `Only a STEGADON that has made a charge move in the same phase can carry out this monstrous rampage. Pick 1 enemy unit within 1" of this unit and roll a dice. On a 4+, the strike-last effect applies to that unit until the end of the following combat phase.`,
        when: [END_OF_CHARGE_PHASE],
      },
    ],
  },
  'Odious Roar': {
    effects: [
      {
        name: `Odious Roar`,
        desc: `Only a TROGLODON can carry out this monstrous rampage. Roll a dice. On a 2+, until the end of the following combat phase, the range of this unit's Stench of Death ability is 12" instead of 9".`,
        when: [END_OF_CHARGE_PHASE],
      },
    ],
  },
  'Bludgeoning Sweep': {
    effects: [
      {
        name: `Bludgeoning Sweep`,
        desc: `Only a BASTILADON can carry out this monstrous rampage. Pick 1 enemy unit within 3" of this unit that is not a MONSTER and roll a dice. If the roll is less than the number of models in that enemy unit, that enemy unit suffers a number of mortal wounds equal to the roll.`,
        when: [END_OF_CHARGE_PHASE],
      },
    ],
  },
} satisfies TItemDescriptions

export default tagAs(MonstrousRampages, 'monstrous_rampage')
