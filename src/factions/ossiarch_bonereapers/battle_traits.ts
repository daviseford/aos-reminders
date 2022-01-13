import { tagAs } from 'factions/metatagger'
import { OSSIARCH_BONEREAPERS } from 'meta/factions'
import {
  BATTLESHOCK_PHASE,
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  END_OF_ROUND,
  HERO_PHASE,
  MOVEMENT_PHASE,
  SAVES_PHASE,
  START_OF_COMBAT_PHASE,
  START_OF_HERO_PHASE,
  START_OF_ROUND,
  WOUND_ALLOCATION_PHASE,
} from 'types/phases'
import rule_sources from './rule_sources'

const BattleTraits = {
  // OSSIARCH BONEREAPERS allegiance
  [OSSIARCH_BONEREAPERS]: {
    effects: [
      {
        name: `Deathless Warriors`,
        desc: `Roll a D6 each time you allocate a wound or mortal wound to a friendly unit that has the HEKATOS keyword, or is wholly within 6" of a friendly Mortek Hekatos, or is wholly within 12" of a friendly OSSIARCH BONEREAPERS HERO. On a 6, that wound or mortal wound is negated.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
      {
        name: `Ranks Unbroken By Dissent`,
        desc: `Do not take battleshock tests for friendly OSSIARCH BONEREAPERS units.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Relentless Discipline`,
        desc: `If your army is an Ossiarch Bonereapers army, you do not receive command points. Instead, you receive relentless discipline points.`,
        when: [DURING_GAME],
        rule_sources: [
          rule_sources.BATTLETOME_OSSIARCH_BONEREAPERS,
          rule_sources.ERRATA_JULY_2021,
          rule_sources.WHTE_DWARF_JANUARY_2022,
        ],
      },
      {
        name: `Generating Relentless Discipline Points`,
        desc: `At the start of each battle round, after determining who will take which turn, you receive 1 relentless discipline point for each friendly OSSIARCH BONEREAPERS HERO that is on the battlefield, 1 relentless discipline point for each friendly LIEGE that is on the battlefield, and 3 relentless discipline points if KATAKROS is your general and is on the battlefield.
        
        If you will take the first turn, you receive 1 relentless discipline point. If you will take the second turn, you receive 2 relentless discipline points.`,
        when: [START_OF_ROUND],
        rule_sources: [
          rule_sources.BATTLETOME_OSSIARCH_BONEREAPERS,
          rule_sources.ERRATA_JULY_2021,
          rule_sources.WHTE_DWARF_JANUARY_2022,
        ],
      },
      {
        name: `Generating Relentless Discipline Points`,
        desc: `At the start of each hero phase, roll a dice for each friendly OSSIARCH BONEREAPERS unit on the battlefield (including any HEROES). For each 6, you receive 1 extra relentless discipline point.`,
        when: [START_OF_HERO_PHASE],
        rule_sources: [
          rule_sources.BATTLETOME_OSSIARCH_BONEREAPERS,
          rule_sources.ERRATA_JULY_2021,
          rule_sources.WHTE_DWARF_JANUARY_2022,
        ],
      },
      {
        name: `Generating Relentless Discipline Points`,
        desc: `All relentless discipline points that you have remaining are lost at the end of each battle round.`,
        when: [END_OF_ROUND],
        rule_sources: [
          rule_sources.BATTLETOME_OSSIARCH_BONEREAPERS,
          rule_sources.ERRATA_JULY_2021,
          rule_sources.WHTE_DWARF_JANUARY_2022,
        ],
      },
      {
        name: `Using Relentless Discipline Points`,
        desc: `Relentless discipline points are used to issue a command in the same manner as command points, but they can only be spent to use an Ossiarch command ability. Ossiarch command abilities are command abilities that appear on a warscroll that has the OSSIARCH BONEREAPER keyword, or are an Ossiarch Bonereaper Legion command ability, or are included in the list of Ossiarch command abilities below.

        The restriction that you cannot use the same command ability more than once in the same phase does not apply to Ossiarch command abilities. For example, you can use the Shieldwall command ability on the Mortek Guard warscroll more than once in the same phase, as long as that command is issued by a model that has not already issued a command in that phase and it is received by unit that has not already received a command in that phase.
        
        In addition, you cannot use the Expert, Slayers, Strategists or Swift battalion abilities (core rules, 26.3). Instead, for each battalion in your army that has any of these battalion abilities, once per battle at the start of any battle round, you can choose to receive 1 relentless discipline point.`,
        when: [DURING_GAME],
        rule_sources: [
          rule_sources.BATTLETOME_OSSIARCH_BONEREAPERS,
          rule_sources.ERRATA_JULY_2021,
          rule_sources.ERRATA_AUGUST_2021,
          rule_sources.WHTE_DWARF_JANUARY_2022,
        ],
      },

      {
        name: `Relentless Leadership`,
        desc: `At the start of your hero phase, you can carry out this heroic action with a friendly OSSIARCH BONEREAPERS HERO instead of any other heroic action you can carry out with that HERO. Pick 1 friendly OSSIARCH BONEREAPERS HERO. Until the end of this turn, you can use an Ossiarch command ability to issue a command with that HERO without a relentless discipline point being spent.`,
        when: [START_OF_HERO_PHASE],
        rule_sources: [rule_sources.WHTE_DWARF_JANUARY_2022],
      },
      {
        name: `Necromantic Mastery`,
        desc: `At the start of your hero phase, you can carry out this heroic action with a friendly MORTISAN instead of any other heroic action you can carry out with that MORTISAN. Pick 1 friendly MORTISAN. If the first spell that MORTISAN attempts to cast in this turn is successfully cast, that spell cannot be unbound.`,
        when: [START_OF_HERO_PHASE],
        rule_sources: [rule_sources.WHTE_DWARF_JANUARY_2022],
      },
    ],
  },
  // Mortis Praetorians
  'Mortis Praetorians': {
    effects: [
      {
        name: `The Dread Legion`,
        desc: `Subtract 1 from the Bravery characteristic of enemy untis while they are within 12" of any friendly MORTIS PRAETORIANS units.`,
        when: [DURING_GAME],
      },
    ],
  },
  // Petrifex Elite
  'Petrifex Elite': {
    effects: [
      {
        name: `Unstoppable Juggernauts`,
        desc: `Worsen the Rend characteristic of weapons that target PETRIFEX ELITE units by 1, to a minimum of '-'.`,
        when: [SAVES_PHASE],
        rule_sources: [rule_sources.BATTLETOME_OSSIARCH_BONEREAPERS, rule_sources.ERRATA_JULY_2021],
      },
    ],
  },
  // Stalliarch Lords
  'Stalliarch Lords': {
    effects: [
      {
        name: `Equumortoi`,
        desc: `STALLIARCH LORDS units can run and still charge later in the same turn.`,
        when: [MOVEMENT_PHASE, CHARGE_PHASE],
      },
    ],
  },
  // Ivory host
  'Ivory Host': {
    effects: [
      {
        name: `Simmering Rage`,
        desc: `At the start of the combat phase, each friendly IVORY HOST unit within 6" of a friendly IVORY HOST model that currently has any wounds allocated to it becomes subject to rage until the end of that phase. Add 1 to hit rolls for attacks made by a unit that is subject to rage, but subtract 1 from save rolls for attacks that target a unit that is subject to rage.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  // Null Myriad
  'Null Myriad': {
    effects: [
      {
        name: `Eldritch Nulls`,
        desc: `Each time a friendly NULL MYRIAD unit is affected by a spell or endless spell, you can roll a D6. If you do so, on a 5+, ignore the effects of that spell or endless spell on that unit.`,
        when: [HERO_PHASE],
      },
    ],
  },
  // Crematorians
  Crematorians: {
    effects: [
      {
        name: `Immolation`,
        desc: `Roll a D6 each time a friendly CREMATORIANS model is slain by an attack made with a melee weapon, before the slain model is removed from play. Add 1 to the roll if the slain model is a HERO or MONSTER. On a 5+, pick 1 enemy unit within 3" of the slain model. That unit suffers 1 mortal wound.`,
        when: [COMBAT_PHASE],
      },
    ],
  },

  'Battle Tactics': {
    effects: [
      {
        name: `Trample the Defiant`,
        desc: `Pick 1 friendly KAVALOS DEATHRIDERS unit that is more than 3" from all enemy units. You complete this battle tactic if that unit makes a charge move this turn and is within 3" of any enemy units at the end of this turn.`,
        when: [START_OF_HERO_PHASE],
        rule_sources: [rule_sources.WHTE_DWARF_JANUARY_2022],
      },
      {
        name: `Unfeeling Recursion`,
        desc: `You complete this battle tactic if two or more friendly OSSIARCH BONEREAPERS units had slain models returned to them with the Reknit Constructs Ossiarch command ability in this turn.`,
        when: [START_OF_HERO_PHASE],
        rule_sources: [rule_sources.WHTE_DWARF_JANUARY_2022],
      },
      {
        name: `The Tithe Demands`,
        desc: `Pick 1 enemy HERO or MONSTER on the battlefield. You complete this battle tactic if that unit is destroyed this turn. If that enemy HERO or MONSTER was destroyed by an attack made by a friendly GOTHIZZAR HARVESTER, score 1 additional victory point.`,
        when: [START_OF_HERO_PHASE],
        rule_sources: [rule_sources.WHTE_DWARF_JANUARY_2022],
      },
    ],
  },
}

export default tagAs(BattleTraits, 'battle_trait')
