import {
  BATTLESHOCK_PHASE,
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  HERO_PHASE,
  MOVEMENT_PHASE,
  SHOOTING_PHASE,
  START_OF_HERO_PHASE,
  START_OF_SHOOTING_PHASE,
} from 'types/phases'
import { TEndlessSpells } from 'types/army'

const EndlessSpells: TEndlessSpells = [
  {
    name: `Molten Infernoth`,
    effects: [
      {
        name: `Summon Molten Infernoth`,
        desc: `At the start of your hero phase, 1 friendly FYRESLAYERS Priest can attempt to perform this magmic invocation. If they do so, make an invocation roll by rolling a dice. On a 3+ the invocation roll is successful. If the invocation roll is successful, set up this model wholly within 12" of that FYRESLAYERS Priest.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Burning Tide`,
        desc: `When this magmic invocation is set up, the player who set it up can immediately make a move with it. In addition, at the start of each of their subsequent hero phases, the player who set this magmic invocation up can make a move with it if it is still on the battlefield. When you move this magmic invocation, it can move up to 2D6".`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Erupting Inferno`,
        desc: `After this model has moved, roll 12 dice for each unit that is within 3" of it at the end of its move. For each 6, that unit suffers 1 mortal wound. FYRESLAYERS units are not affected by this ability.`,
        when: [HERO_PHASE],
      },
      {
        name: `Fiery Wrath of Vulcatrix`,
        desc: `Add 1 to the Bravery characteristic of FYRESLAYERS units while they are wholly within 18" of this model.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
  {
    name: `Runic Fyrewall`,
    effects: [
      {
        name: `Summon Runic Fyrewall`,
        desc: `At the start of your hero phase, 1 friendly FYRESLAYERS Priest can attempt to perform this magmic invocation. If they do so, make an invocation roll by rolling a dice. On a 3+ the invocation roll is successful. If the invocation roll is successful, set up this model wholly within 18" of that FYRESLAYERS Priest.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Roaring Rune-fire`,
        desc: `A model cannot see another model if an imaginary straight line, 1mm wide, drawn from the centre of its base to the centre of the other model's base passes within 1" of this model.`,
        when: [DURING_GAME],
      },
      {
        name: `Awakened Runes`,
        desc: `Re-roll save rolls of 1 for attacks that target FYRESLAYERS units wholly within 12" of this model.`,
        when: [COMBAT_PHASE, SHOOTING_PHASE],
      },
      {
        name: `Impervious to Heat`,
        desc: `Magmadroths can pass across this model in the same manner as a model that can fly.`,
        when: [MOVEMENT_PHASE, CHARGE_PHASE],
      },
    ],
  },
  {
    name: `Zharrgron Flame-spitter`,
    effects: [
      {
        name: `Summon Zharrgron Flame-spitter`,
        desc: `At the start of your hero phase, 1 friendly FYRESLAYERS Priest can attempt to perform this magmic invocation. If they do so, make an invocation roll by rolling a dice. On a 3+ the invocation roll is successful. If the invocation roll is successful, set up this model wholly within 6" of that FYRESLAYERS Priest.`,
        when: [HERO_PHASE],
      },
      {
        name: `Magma Blast`,
        desc: `At the start of your shooting phase, if there is a friendly FYRESLAYERS Priestwithin 6" of this model, you can pick an enemy unit within 24" of this model and roll 12 dice. Add 1 to the roll if there are 10 or more models in the unit. Add 2 to the roll instead if there are 20 or more models in the unit. For each 6+, the unit suffers 1 mortal wound.`,
        when: [START_OF_SHOOTING_PHASE],
      },
    ],
  },
]

export default EndlessSpells
