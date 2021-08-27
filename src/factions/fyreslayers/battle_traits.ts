import { tagAs } from 'factions/metatagger'
import { FYRESLAYERS } from 'meta/factions'
import {
  BATTLESHOCK_PHASE,
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  HERO_PHASE,
  MOVEMENT_PHASE,
  SHOOTING_PHASE,
  START_OF_HERO_PHASE,
  TURN_ONE_MOVEMENT_PHASE,
} from 'types/phases'
import rule_sources from './rule_sources'

const BattleTraits = {
  // Fyreslayers allegiance
  [FYRESLAYERS]: {
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
        desc: `Magmic Invocations use the rules for invocations (core rules, 20.3).`,
        when: [DURING_GAME],
        rule_sources: [
          rule_sources.BATTLETOME_FYRESLAYERS,
          rule_sources.ERRATA_FYRESLAYERS_JULY_2021,
          rule_sources.ERRATA_FYRESLAYERS_AUGUST_2021,
        ],
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
        desc: `Each MAGMADROTH in a LOFNIR army, instead of only 1, can be given a Magmadroth trait. In addition, if you are using the Contest of Generals battlepack or a Pitched Battles battlepack, you can include 1 additional BEHEMOTH in your army, as long as every BEHEMOTH in your army is a MAGMADROTH.`,
        when: [DURING_GAME],
        rule_sources: [rule_sources.BATTLETOME_FYRESLAYERS, rule_sources.ERRATA_FYRESLAYERS_JULY_2021],
      },
    ],
  },
}

export default tagAs(BattleTraits, 'battle_trait')
