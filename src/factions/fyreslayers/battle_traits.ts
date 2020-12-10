import { tagAs } from 'factions/metatagger'
import {
  BATTLESHOCK_PHASE,
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  END_OF_ROUND,
  HERO_PHASE,
  MOVEMENT_PHASE,
  SHOOTING_PHASE,
  START_OF_HERO_PHASE,
  TURN_ONE_MOVEMENT_PHASE,
} from 'types/phases'

const BattleTraits = {
  // Fyreslayers allegiance
  Fyreslayers: {
    effects: [
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
      {
        name: `Magmic Invocations`,
        desc: `At the end of every round roll a D6 for each Invocation on the table. The Invocation is removed unless the roll is a 4+. Add 1 to this roll if there is a Fyreslayers priest within 6" of the Invocation at the time of the roll.`,
        when: [END_OF_ROUND],
      },
    ],
  },
  // Vostarg
  'Vostarg (Lodge)': {
    effects: [
      {
        name: `Fearsome Surge`,
        desc: `If you declare a friendly VOSTARG unit will run in R1 movement phase, do not roll, instead add 6" automatically.`,
        when: [TURN_ONE_MOVEMENT_PHASE],
      },
      {
        name: `Fearsome Surge`,
        desc: `+1 to charge rolls for friendly VOSTARG units.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  // Greyfyrd
  'Greyfyrd (Lodge)': {
    effects: [
      {
        name: `Spoils of Victory`,
        desc: `2 additional artifacts of power for GREYFYRD HEROES in your army.`,
        when: [DURING_GAME],
      },
    ],
  },
  // Hermdar
  'Hermdar (Lodge)': {
    effects: [
      {
        name: `Seize by Force`,
        desc: `HERMDAR units wholly within enemy territory or wholly within 12" of an objective do not take battleshock tests.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
  // Lofnir
  'Lofnir (Lodge)': {
    effects: [
      {
        name: `Venerators of Vulcatrix`,
        desc: `Each MAGMADROTH in a LOFNIR army, instead of only 1, can be given a Magmadroth trait. In addition you can include 1 additional Behemoth as long as every Behemoth in your army is a MAGMADROTH.`,
        when: [DURING_GAME],
      },
    ],
  },
}

// Always export using tagAs
export default tagAs(BattleTraits, 'battle_trait')
