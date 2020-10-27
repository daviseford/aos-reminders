import { TTraits } from 'types/army'
import {
  COMBAT_PHASE,
  HERO_PHASE,
  SAVES_PHASE,
  SHOOTING_PHASE,
  START_OF_SETUP,
  WOUND_ALLOCATION_PHASE,
} from 'types/phases'
import CommonSonsOfBehematData from './common'

const { Breaker, Taker, Stomper } = CommonSonsOfBehematData.TRIBES

const CommandTraits: TTraits = [
  {
    name: `Monstrously Tough (${Taker} Tribe)`,
    effects: [
      {
        name: `Monstrously Tough (${Taker} Tribe)`,
        desc: `This general has a Wounds characteristic of 40 instead of 35.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
    ],
  },
  {
    name: `Old and Gnarly (${Taker} Tribe)`,
    effects: [
      {
        name: `Old and Gnarly (${Taker} Tribe)`,
        desc: `You can reroll save rolls of 1 for attacks that target this general.`,
        when: [SAVES_PHASE],
      },
    ],
  },
  {
    name: `Louder than Words (${Taker} Tribe)`,
    effects: [
      {
        name: `Louder than Words (${Taker} Tribe)`,
        desc: `Add 1 to the Attacks characteristic of this general's Shipwrecka Warclub.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Strong Right Foot (${Taker} Tribe)`,
    effects: [
      {
        name: `Strong Right Foot (${Taker} Tribe)`,
        desc: `When you use this general's Get Orf Me Land! ability to kick an objective marker away, you can roll 3D6 instead of 2D6 to determine how far it is kicked.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Very Acquisitive (${Taker} Tribe)`,
    effects: [
      {
        name: `Very Acquisitive (${Taker} Tribe)`,
        desc: `You can take 1 extra Trophies Taken By Force artefact of power for this general's army. In addition, this general can have up to 2 artefacts of power instead of 1.`,
        when: [START_OF_SETUP],
      },
    ],
  },
  {
    name: `Extremely Intimidating (${Taker} Tribe)`,
    effects: [
      {
        name: `Extremely Intimidating (${Taker} Tribe)`,
        desc: `Subtract 1 from hit rolls for enemy models that are within 3" of this general.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },

  {
    name: ``,
    effects: [
      {
        name: ``,
        desc: ``,
        when: [HERO_PHASE],
      },
    ],
  },
]

export default CommandTraits
