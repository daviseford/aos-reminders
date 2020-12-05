import { tagAs } from 'factions/metatagger'
import {
  COMBAT_PHASE,
  DURING_GAME,
  END_OF_COMBAT_PHASE,
  SHOOTING_PHASE,
  START_OF_HERO_PHASE,
  START_OF_ROUND,
} from 'types/phases'
const CommandTraits = {
  // Daughters Allegiance Command Traits
  'Bathed in Blood': {
    effects: [
      {
        name: `Bathed in Blood`,
        desc: `Increase this general's wounds characteristic by 1.`,
        when: [DURING_GAME],
      },
      {
        name: `Bathed in Blood`,
        desc: `You can heal 1 wound allocated to this general.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'Zealous Orator': {
    effects: [
      {
        name: `Zealous Orator`,
        desc: `Friendly Daughters of Khaine units within 14" of this general use this general's bravery characteristic instead of their own.`,
        when: [DURING_GAME],
      },
    ],
  },
  'Bloody Sacrificer': {
    effects: [
      {
        name: `Bloody Sacrificer`,
        desc: `Add 1 to hit rolls for this general's weapons.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },
  'Terrifying Beauty': {
    effects: [
      {
        name: `Terrifying Beauty`,
        desc: `Subtract 1 from the hit rolls of attacks that target this general.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },
  'Mistress of Poisons': {
    effects: [
      {
        name: `Mistress of Poisons`,
        desc: `Add 1 to the damage characteristic of melee weapons wielded by this general.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'True Believer': {
    effects: [
      {
        name: `True Believer`,
        desc: `This general counts the current battle round number as being 1 higher than it actually is when determining the effect of the Blood Rites table. This effect is cumulative with other, similar abilities.`,
        when: [START_OF_ROUND],
      },
    ],
  },
  // Hagg Nar Flavor
  'Devoted Disciples': {
    effects: [
      {
        name: `Devoted Disciples`,
        desc: `Whenever you make a Fanatical Faith roll for friendly Hagg Nar units within 7" of this general, the wound is negated on a 5+ instead of 6".`,
        when: [DURING_GAME],
      },
    ],
  },
  // Khailebron Flavor
  'Mistress of Illusion': {
    effects: [
      {
        name: `Mistress of Illusion`,
        desc: `You can pick one friendly Khailebron unit within 7" of this general. If that unit is more than 3" from any enemy models, remove it from the battlefield and then set it up anywhere on the battlefield more than 9" from any enemy models. This unit cannot move in your next movement phase.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  // Zainthar Kai Flavor
  'Curse of the Bloody-Handed': {
    effects: [
      {
        name: `Curse of the Bloody-Handed`,
        desc: `Roll a D6 for each enemy unit within 3" of the general. On a 5+ that unit suffers D3 mortal wounds.`,
        when: [END_OF_COMBAT_PHASE],
      },
    ],
  },
}

export default tagAs(CommandTraits, 'command_trait')
