import { TTraits } from 'types/army'
import { COMBAT_PHASE, DURING_GAME, SHOOTING_PHASE, START_OF_HERO_PHASE, START_OF_ROUND } from 'types/phases'

const CommandTraits: TTraits = [
  {
    name: `Bathed in Blood`,
    effects: [
      {
        name: `Bathed in Blood`,
        desc: `Increase this general's wounds characteristic by 1.`,
        when: [DURING_GAME],
        command_trait: true,
      },
      {
        name: `Bathed in Blood`,
        desc: `You can heal 1 wound allocated to this general.`,
        when: [START_OF_HERO_PHASE],
        command_trait: true,
      },
    ],
  },
  {
    name: `Zealous Orator`,
    effects: [
      {
        name: `Zealous Orator`,
        desc: `Friendly Daughters of Khaine units within 14" of this general use this general's bravery characteristic instead of their own.`,
        when: [DURING_GAME],
        command_trait: true,
      },
    ],
  },
  {
    name: `Bloody Sacrificer`,
    effects: [
      {
        name: `Bloody Sacrificer`,
        desc: `Add 1 to hit rolls for this general's weapons.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
        command_trait: true,
      },
    ],
  },
  {
    name: `Terrifying Beauty`,
    effects: [
      {
        name: `Terrifying Beauty`,
        desc: `Subtract 1 from the hit rolls of attacks that target this general.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
        command_trait: true,
      },
    ],
  },
  {
    name: `Mistress of Poisons`,
    effects: [
      {
        name: `Mistress of Poisons`,
        desc: `Add 1 to the damage characteristic of melee weapons wielded by this general.`,
        when: [COMBAT_PHASE],
        command_trait: true,
      },
    ],
  },
  {
    name: `True Believer`,
    effects: [
      {
        name: `True Believer`,
        desc: `This general counts the current battle round number as being 1 higher than it actually is when determining the effect of the Blood Rites table. This effect is cumulative with other, similar abilities.`,
        when: [START_OF_ROUND],
        command_trait: true,
      },
    ],
  },
]

export default CommandTraits
