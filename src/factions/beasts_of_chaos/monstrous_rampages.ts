import { TItemDescriptions } from 'factions/factionTypes'
import { tagAs } from 'factions/metatagger'
import { END_OF_CHARGE_PHASE } from 'types/phases'

const MonstrousRampages = {
  'Feast on Flesh': {
    effects: [
      {
        name: `Feast on Flesh`,
        desc: `You can carry out this monstrous rampage instead of any others with this unit. Improve the Rend characteristic of this unit's melee weapons by 1 until the end of the following combat phase. In addition, until the end of the following combat phase, if any enemy models are slain by attacks made by this unit, you can heal up to 3 wounds allocated to this unit after all of its attacks have been resolved.`,
        when: [END_OF_CHARGE_PHASE],
      },
    ],
  },
  'Consume Endless Spell': {
    effects: [
      {
        name: `Consume Endless Spell`,
        desc: `You can carry out this monstrous rampage instead of any others with this unit. Pick 1 endless spell within 6" of this unit and roll 2D6. If the roll is greater than the casting value of the endless spell, that endiess spell is dispelled and you can heal a number of wounds allocated to this unit equal to the 2D6 roll.`,
        when: [END_OF_CHARGE_PHASE],
      },
    ],
  },
  'Aura of Madness': {
    effects: [
      {
        name: `Aura of Madness`,
        desc: `You can carry out this monstrous rampage instead of any others with this unit. Pick 1 enemy HERO within 3" of this unit and roll a dice. On a 2-5, worsen the Save characteristic of that HERO by 1 (to a minimum of 6+) until the end of the following combat phase. On a 6, worsen the Save characteristic of that HERO by 2 (to a minimum of 6t) until the end of the following combat phase.`,
        when: [END_OF_CHARGE_PHASE],
      },
    ],
  },
  'Thricefold Savagery': {
    effects: [
      {
        name: `Thricefold Savagery`,
        desc: `You can carry out this monstrous rampage instead of any others with this unit. Until the end of the following combat phase, add 1 to the Attacks characteristic of this unit's melee weapons, but all of the attacks made with this unit's melee weapons must target the same enemy unit.`,
        when: [END_OF_CHARGE_PHASE],
      },
    ],
  },
} satisfies TItemDescriptions

export default tagAs(MonstrousRampages, 'monstrous_rampage')
