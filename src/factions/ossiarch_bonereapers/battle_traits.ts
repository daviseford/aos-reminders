import { tagAs } from 'factions/metatagger'
import {
  BATTLESHOCK_PHASE,
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  HERO_PHASE,
  MOVEMENT_PHASE,
  SAVES_PHASE,
  START_OF_COMBAT_PHASE,
  START_OF_ROUND,
  WOUND_ALLOCATION_PHASE,
} from 'types/phases'

const BattleTraits = {
  // Ossiarch Bonereapers allegiance
  'The Ossiarch Empire': {
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
        name: `Ranks Unbroken By Dissent`,
        desc: `If your army is an Ossiarch Bonereapers army, you cannot use command points. Instead, you use relentless discipline points. At the start of each battle round, before determining who has the first turn, you receive 1 relentless discipline point for each friendly OSSIARCH BONEREAPERS HERO that is on the battlefield. You receive 1 additional relentless discipline point for each warscroll battalion in your army and each friendly LIEGE that is on the battlefield, and 3 additional relentless discipline points if KATAKROS is your general and is on the battlefield. Then, roll a D6 for each friendly OSSIARCH BONEREAPERS unit on the battlefield (including the HEROES above). For each 6, you receive 1 additional relentless discipline point.

         Relentless discipline points are used in the same manner as command points, but can only be used for command abilities that appear on a warscroll that has the OSSIARCH BONEREAPERS keyword, for Ossiarch Bonereaper Legion command abilities and for the Unstoppable Advance command ability below.

         When you generate your relentless discipline points at the start of the battle round, any that you had left over from the previous battle round are lost.`,
        when: [START_OF_ROUND],
      },
      {
        name: `Unstoppable Advance`,
        desc: `You can use this command ability in your movement phase. If you do so, pick 1 friendly unit that has the HEKATOS keyword, or is wholly within 6" of a friendly Mortek Hekatos, or is wholly within 12" of a friendly OSSIARCH BONEREAPERS HERO. Add 3" to that unit's Move characteristic in that phase (it can still run, or charge if it does not run). You cannot pick the same unit to benefit from this command ability more than once per phase.`,
        when: [MOVEMENT_PHASE],
        command_ability: true,
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
        desc: `Reroll save rolls of 1 for attacks made with melee weapons that target PETRIFEX ELITE units.'`,
        when: [SAVES_PHASE],
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
}

export default tagAs(BattleTraits, 'battle_trait')
