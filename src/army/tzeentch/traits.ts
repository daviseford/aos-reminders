import { TTraits } from 'types/army'
import {
  BATTLESHOCK_PHASE,
  COMBAT_PHASE,
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
        desc: `This general knows 2 extra spells from their Lore.`,
        when: [START_OF_SETUP],
      },
    ],
  },
  {
    name: `Nexus of Fate`,
    effects: [
      {
        name: `Nexus of Fate`,
        desc: `At the start of your hero phase, if this general is on the field, you can roll a die. If you do so, you can replace one of your Destiny Dice with that roll.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  {
    name: `Magical Supremacy`,
    effects: [
      {
        name: `Magical Supremacy`,
        desc: `Add 12" to the range at which your general can attempt to unbind spells and dispel endless spells.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Boundless Mutation`,
    effects: [
      {
        name: `Boundless Mutation`,
        desc: `At the start of your hero phases, roll a D6; on a 2+, your general heals D3 wounds.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  {
    name: `Cult Demagogue`,
    effects: [
      {
        name: `Cult Demagogue`,
        desc: `If a casting roll for this general is a double, the casting attempt is automatically successful(regardless of result). In addition, if the spell is not unbound, you receive 2 fate points instead of 1.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
  {
    name: `Arcane Sacrifice`,
    effects: [
      {
        name: `Arcane Sacrifice`,
        desc: `At the start of your hero phase, you can inflict 1 mortal wounds on a friendly Tzeentch unit within 3" of your general. If you do so, until the end of that phase, add 9" to the range of any spell successfully cast by this general.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  {
    name: `Daemonspark`,
    effects: [
      {
        name: `Daemonspark`,
        desc: `Once per battle, in your hero phase, you can unleash the Daemonspark. If you do so, you immediately gain 3 Fate Points.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Incorporeal Form`,
    effects: [
      {
        name: `Incorporeal Form`,
        desc: `Each time this general is affected by a spell or endless spell, you can roll a D6. On a 5+, ignore the effects of that spell or endless spell on this general.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Aether Tether`,
    effects: [
      {
        name: `Aether Tether`,
        desc: `Add 1 to save rolls for attacks that target this general.`,
        when: [COMBAT_PHASE, SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Soul Burn`,
    effects: [
      {
        name: `Soul Burn`,
        desc: `If the unmodified hit roll for an attack made with a melee weapon by this gerenal is a 6, that attack inflicts 1 mortal wound on the target in addition to any normal damage.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Illusionist`,
    effects: [
      {
        name: `Illusionist`,
        desc: `Subtract 1 from hit rolls for attacks that target this general.`,
        when: [COMBAT_PHASE, SHOOTING_PHASE],
      },
    ],
  },
]

export default CommandTraits
