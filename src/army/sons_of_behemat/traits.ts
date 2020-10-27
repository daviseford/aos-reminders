import { TTraits } from 'types/army'
import {
  CHARGE_PHASE,
  COMBAT_PHASE,
  HERO_PHASE,
  SAVES_PHASE,
  SHOOTING_PHASE,
  START_OF_SETUP,
  TURN_ONE_START_OF_ROUND,
  WOUND_ALLOCATION_PHASE,
} from 'types/phases'
import CommonSonsOfBehematData from './common'

const { Breaker, TakerTag, Taker, Stomper, StomperTag, BreakerTag } = CommonSonsOfBehematData.TRIBES

const getMonstrouslyToughEffect = (tribe: string) => ({
  name: `Monstrously Tough (${tribe} Tribe)`,
  effects: [
    {
      name: `Monstrously Tough (${tribe} Tribe)`,
      desc: `This general has a Wounds characteristic of 40 instead of 35.`,
      when: [WOUND_ALLOCATION_PHASE],
    },
  ],
})

const getOldAndGnarlyEffect = (tribe: string) => ({
  name: `Old and Gnarly (${tribe} Tribe)`,
  effects: [
    {
      name: `Old and Gnarly (${tribe} Tribe)`,
      desc: `You can reroll save rolls of 1 for attacks that target this general.`,
      when: [SAVES_PHASE],
    },
  ],
})

const getLouderThanWordsEffect = (tribe: string) => ({
  name: `Louder than Words (${tribe} Tribe)`,
  effects: [
    {
      name: `Louder than Words (${tribe} Tribe)`,
      desc: `Add 1 to the Attacks characteristic of this general's Shipwrecka Warclub.`,
      when: [COMBAT_PHASE],
    },
  ],
})

const CommandTraits: TTraits = [
  getMonstrouslyToughEffect(Taker),
  getOldAndGnarlyEffect(Taker),
  getLouderThanWordsEffect(Taker),
  {
    name: `Strong Right Foot ${TakerTag}`,
    effects: [
      {
        name: `Strong Right Foot ${TakerTag}`,
        desc: `When you use this general's Get Orf Me Land! ability to kick an objective marker away, you can roll 3D6 instead of 2D6 to determine how far it is kicked.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Very Acquisitive ${TakerTag}`,
    effects: [
      {
        name: `Very Acquisitive ${TakerTag}`,
        desc: `You can take 1 extra Trophies Taken By Force artefact of power for this general's army. In addition, this general can have up to 2 artefacts of power instead of 1.`,
        when: [START_OF_SETUP],
      },
    ],
  },
  {
    name: `Extremely Intimidating ${TakerTag}`,
    effects: [
      {
        name: `Extremely Intimidating ${TakerTag}`,
        desc: `Subtract 1 from hit rolls for enemy models that are within 3" of this general.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },

  getMonstrouslyToughEffect(Stomper),
  getOldAndGnarlyEffect(Stomper),
  getLouderThanWordsEffect(Stomper),

  {
    name: `Inescapable Grip ${StomperTag}`,
    effects: [
      {
        name: `Inescapable Grip ${StomperTag}`,
        desc: `When you use this general's Hurled Body ability, you can reroll the dice that determines if the target is slain and thrown.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Very Shouty ${StomperTag}`,
    effects: [
      {
        name: `Very Shouty ${StomperTag}`,
        desc: `If this general is on the battlefield at the start of the first battle round, you receive D3 extra command points.`,
        when: [TURN_ONE_START_OF_ROUND],
      },
    ],
  },
  {
    name: `Eager for the Fight ${StomperTag}`,
    effects: [
      {
        name: `Eager for the Fight ${StomperTag}`,
        desc: `You can attempt to charge with this general if it is within 18" of the enemy instead of 12". Roll 3D6 instead of 2D6 when making a charge roll for this general.`,
        when: [CHARGE_PHASE],
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
