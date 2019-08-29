import { TTraits } from 'types/army'
import {
  BATTLESHOCK_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  HERO_PHASE,
  SHOOTING_PHASE,
  START_OF_HERO_PHASE,
  START_OF_SETUP,
} from 'types/phases'

const CommandTraits: TTraits = [
  {
    name: `Arch-sorcerer`,
    effects: [
      {
        name: `Arch-sorcerer`,
        desc: `Generate two additional spells for your general from the Lore of Fate.`,
        when: [START_OF_SETUP],
      },
    ],
  },
  {
    name: `Nexus of Fate`,
    effects: [
      {
        name: `Nexus of Fate`,
        desc: `If your general is on the battlefield at the start of your hero phase, roll a D6; on a 1 or 6, you can choose to replace one Destiny Dice from your pool with the number you rolled.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  {
    name: `Magical Supremacy`,
    effects: [
      {
        name: `Magical Supremacy`,
        desc: `Add 12" to the range at which your general can attempt to unbind spells.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Boundless Mutation`,
    effects: [
      {
        name: `Boundless Mutation`,
        desc: `At the start of each of your hero phases, roll a D6; on a 2 or more, your general heals D3 wounds. On a roll of 1, your general suffers 1 mortal wound; if this slays the general, before you remove the general's model, you can add a Tzeentch Chaos Spawn to your army and set it up within 1" of your general.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  {
    name: `Cult Demagogue`,
    effects: [
      {
        name: `Cult Demagogue`,
        desc: `Add 2 to the Bravery characteristic of friendly Tzeentch Arcanite units whilst they are within 9" of the general.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
  {
    name: `Arcane Sacrifice`,
    effects: [
      {
        name: `Arcane Sacrifice`,
        desc: `At the start of your hero phase, you can inflict D3 mortal wounds on a friendly unit within 3" of your general. If you do so, then you can re-roll any failed casting rolls for your general for the duration of that phase, and increase the range of any spells they cast by 9".`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  {
    name: `Daemonspark`,
    effects: [
      {
        name: `Daemonspark`,
        desc: `Once per battle, in your hero phase, you can unleash the Daemonspark. Add 1 to the Damage characteristic of all of your general's melee weapons for the rest of the turn.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Incorporeal Form`,
    effects: [
      {
        name: `Incorporeal Form`,
        desc: `Your opponent must subtract 1 from any hit rolls that target your general in the combat phase.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Aether Tether`,
    effects: [
      {
        name: `Aether Tether`,
        desc: `You can re-roll save rolls of 1 for your general.`,
        when: [COMBAT_PHASE, SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Blessing of Tzeentch`,
    effects: [
      {
        name: `Blessing of Tzeentch`,
        desc: `Each time your general suffers a wound or mortal wound, roll a D6; on a roll of 6, the wound is ignored.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Soul Burn`,
    effects: [
      {
        name: `Soul Burn`,
        desc: `Each time you make a wound roll of 6 or higher for any of your general's melee weapons, the target unit suffers 1 mortal wound in addition to any other damage it suffers.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Illusionist`,
    effects: [
      {
        name: `Illusionist`,
        desc: `Your opponent must subtract 1 from any hit rolls that target your general in the shooting phase.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
]

export default CommandTraits
