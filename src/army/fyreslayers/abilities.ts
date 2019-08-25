import {
  BATTLESHOCK_PHASE,
  CHARGE_PHASE,
  COMBAT_PHASE,
  HERO_PHASE,
  MOVEMENT_PHASE,
  SHOOTING_PHASE,
  START_OF_HERO_PHASE,
} from 'types/phases'
import { TAbilities } from 'types/army'

// General Allegiance Abilities (always active regardless of army composition)
const Abilities: TAbilities = [
  {
    name: `Ur-Gold Runes`,
    desc: `Activate 1 of your 6 runes. When you choose, roll a D6. On a 1-5 the standard rune applies. On a 6 the enhanced effect applies. You can only activate a rune once per game unless something specifically allows you to do so.`,
    when: [START_OF_HERO_PHASE],
  },
  {
    name: `Rune of Fury`,
    desc: `Reroll hits of 1 for friendly FYRESLAYERS units.`,
    when: [COMBAT_PHASE, SHOOTING_PHASE],
  },
  {
    name: `Rune of Fury (Enhanced Effect)`,
    desc: `Add 1 to the Attacks of melee weapons for friendly FYRESLAYERS units.`,
    when: [COMBAT_PHASE],
  },
  {
    name: `Rune of Searing Heat`,
    desc: `Unmodified wound rolls of 6 made by friendly FYRESLAYERS units add 1 to the damage characteristic of that attack.`,
    when: [COMBAT_PHASE, SHOOTING_PHASE],
  },
  {
    name: `Rune of Searing Heat (Enhanced Effect)`,
    desc: `Roll a D6 for each enemy unit within 3" of any friendly FYRESLAYERS units when the rune is activated. On a 2+ that enemy unit takes 1 mortal wound.`,
    when: [HERO_PHASE],
  },
  {
    name: `Rune of Awakened Steel`,
    desc: `Improve rend by 1 for melee weapons on friendly FYRESLAYERS units. (Enhanced effect: Improve rend by an additional 1.)`,
    when: [COMBAT_PHASE],
  },
  {
    name: `Rune of Fiery Determination`,
    desc: `Add 1 to friendly FYRESLAYERS bravery. (Enhanced effect: Friendly FYRESLAYERS units do not need to take battleshock tests.)`,
    when: [BATTLESHOCK_PHASE],
  },
  {
    name: `Rune of Relentless Zeal`,
    desc: `Add 2" to the move of friendly FYRESLAYERS units.`,
    when: [MOVEMENT_PHASE],
  },
  {
    name: `Rune of Relentless Zeal (Enhanced Effect)`,
    desc: `Add 2" to the charge rolls of friendly FYRESLAYERS units.`,
    when: [CHARGE_PHASE],
  },
  {
    name: `Rune of Farsight`,
    desc: `+1 to hit for Fyreslayer throwing axes for friendly FYRESLAYERS units. (Enhanced effect: +1 to wound for Fyreslayer throwing axes for friendly FYRESLAYERS units.)`,
    when: [SHOOTING_PHASE],
  },
]

export default Abilities
