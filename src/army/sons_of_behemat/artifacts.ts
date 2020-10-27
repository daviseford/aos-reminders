import { TArtifacts } from 'types/army'
import { COMBAT_PHASE, HERO_PHASE, SHOOTING_PHASE, START_OF_COMBAT_PHASE } from 'types/phases'
import CommonSonsOfBehematData from './common'

const { Breaker, Taker, Stomper } = CommonSonsOfBehematData.TRIBES

const Artifacts: TArtifacts = [
  {
    name: `Jaws of the Mogalodon (${Taker} Tribe)`,
    effects: [
      {
        name: `Jaws of the Mogalodon (${Taker} Tribe)`,
        desc: `Once per phase, you can reroll 1 hit roll or 1 wound roll for an attack made by the bearer, or 1 save roll for an attack that targets the bearer. You cannot use this ability to reroll more than one dice for the bearer in the same phase.`,
        when: [HERO_PHASE, COMBAT_PHASE, SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Wallopin' Tentacle (${Taker} Tribe)`,
    effects: [
      {
        name: `Wallopin' Tentacle (${Taker} Tribe)`,
        desc: `At the start of the combat phase, you can pick 1 enemy HERO within 3" of the bearer and roll a dice, On a 4+, that HERO suffers 1 mortal wound, and you can reroll hit rolls of 1 for attacks that target that HERO until the end of that phase,`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Jar of Burny Grog (${Taker} Tribe)`,
    effects: [
      {
        name: `Jar of Burny Grog (${Taker} Tribe)`,
        desc: `Once per battle, at the start of the combat phase, you can pick 1 enemy unit within 3" of the bearer and roll a dice. On a 2+, that unit suffers D3 mortal wounds and, until the end of that phase, you can reroll wounds rolls for attacks made by friendly GARGANTS that target that unit. On a 1, the bearer suffers mortal wounds.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Net of the Beast-reaver (${Taker} Tribe)`,
    effects: [
      {
        name: `Net of the Beast-reaver (${Taker} Tribe)`,
        desc: `At the start of the combat phase, you can pick 1 enemy MONSTER within 3" of the bearer and roll a dice. On a 4+, until the end of that phase, subtract 1 from hit rolls for attacks made by that MONSTER, and you can add 1 to hit rolls for attacks that target that MONSTER.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Glowy Lantern (${Taker} Tribe)`,
    effects: [
      {
        name: `Glowy Lantern (${Taker} Tribe)`,
        desc: `The bearer can attempt to cast 1 spell in your hero phase and unbind 1 spell in the enemy hero phase, in the same manner as a WIZARD. The bearer knows the Arcane Bolt and Mystic Shield spells.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Krakenskin Sandals (${Taker} Tribe)`,
    effects: [
      {
        name: `Krakenskin Sandals (${Taker} Tribe)`,
        desc: `The bearer's Almighty Stomp has an Attacks characteristic of 3 instead of 2, a Rend characteristic of -3 instead of -2, and a Damage characteristic of 3 instead of D3,`,
        when: [COMBAT_PHASE],
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

export default Artifacts
