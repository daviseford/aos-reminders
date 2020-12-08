import { tagAs } from 'factions/metatagger'
import {
  CHARGE_PHASE,
  COMBAT_PHASE,
  END_OF_CHARGE_PHASE,
  HERO_PHASE,
  MOVEMENT_PHASE,
  SAVES_PHASE,
  SHOOTING_PHASE,
  START_OF_COMBAT_PHASE,
} from 'types/phases'

// Store Command Abilities here. You can add them to units, abilties, flavors, and subfactions later.
const CommandAbilities = {
  'Endless Duty': {
    effects: [
      {
        name: `Endless Duty`,
        desc: `You can use this command ability in your shooting phase or any combat phase. If you do so, pick 1 friendly OSSIARCH BONEREAPERS unit that is wholly within 12" of a model with this command ability. Add 1 to the Attacks characteristic of weapons used by that unit in that phase. You cannot pick the same unit to benefit from this command ability more than once per phase.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },
  'Still Their Breath!': {
    effects: [
      {
        name: `Still Their Breath!`,
        desc: `You can use this command ability in your shooting phase or any combat phase. If you do so, pick 1 friendly MORTIS PRAETORIANS unit that is wholly within 24" of this model. Reroll wound rolls of 1 for attacks made by that unit that target ORDER and DESTRUCTION units until the end of that phase. You can reroll any wound rolls for attacks made by that unit that target CHAOS units until the end of that phase.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },
  Shieldwall: {
    effects: [
      {
        name: `Shieldwall`,
        desc: `You can use this command ability at the start of the combat phase. If you do so, pick 1 friendly MORTEK GUARD unit that includes a Mortek Hekatos. You can reroll save rolls for attacks that target that unit until the end of that combat phase.`,
        when: [START_OF_COMBAT_PHASE, SAVES_PHASE],
      },
    ],
  },
  'Deathrider Wedge': {
    effects: [
      {
        name: `Deathrider Wedge`,
        desc: `You can use this command ability when a friendly Kavalos Deathriders unit that includes a Mortek Hekatos finishes a charge move. You can pick 1 enemy unit within 1" of that Kavalos Deathriders unit and roll a number of dice equal to the number of models in that Kavalos Deathriders unit. For each 5+, the enemy unit suffers 1 mortal wound.

        In addition, in the following combat phase, that Kavalos Deathriders unit can move an extra 3" when it piles in. The same unit cannot benefit from this command ability more than once per turn.`,
        when: [CHARGE_PHASE],
      },
      {
        name: `Deathrider Wedge`,
        desc: `If this ability is active, this Kavalos Deathriders unit can move an extra 3" when it piles in.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Hunt and Kill': {
    effects: [
      {
        name: `Hunt and Kill`,
        desc: `You can use this command ability at the start of your hero phase. If you do so, pick 1 friendly NECROPOLIS STALKERS unit. You can reroll run and charge rolls for that unit until your next hero phase. In addition, until your next hero phase, when that unit makes a move, it can pass across terrain features in the same manner as a model that can fly.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Supreme Lord of the Bonereaper Legions': {
    effects: [
      {
        name: `Supreme Lord of the Bonereaper Legions`,
        desc: `You can use this command ability in your hero phase if Katakros is your general. If you do so, until your next hero phase, add 1 to hit rolls for attacks made by friendly OSSIARCH BONEREAPERS units while they are wholly within 18" of this model, and add 1 to save rolls for attacks that target friendly Mortis Praetorian units while they are wholly within 18" of this model. You can only use this command ability once per hero phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  //Mortis Praetorians
  'Counter-strike': {
    effects: [
      {
        name: `Counter-strike`,
        desc: `You can use this command ability at the end of the enemy charge phase. If you do so, pick 1 friendly MORTIS PRAETORIANS unit that either has the HEKATOS keyword, or is wholly within 6" of a friendly Mortis Hekatos, or is wholly within 12" of a friendly MORTIS PRAETORIANS HERO. Until the end of that turn, you can reroll hit rolls for attacks made by that unit that target an enemy unit that made a charge move in the same turn.`,
        when: [END_OF_CHARGE_PHASE],
      },
    ],
  },
  //Petrifex Elite
  Bludgeon: {
    effects: [
      {
        name: `Bludgeon`,
        desc: `You can use this command ability in a combat phase. If you do so, pick 1 friendly PETRIFEX ELITE unit that either has the HEKATOS keyword, or is wholly within 6" of a friendly Mortis Hekatos, or is wholly within 12" of a friendly PETRIFEX ELITE HERO. In that combat phase, improve the Rend characteristic of melee weapons used by that unit by 1. You cannot pick the same unit to benefit from this command ability more than once per phase.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  //Stalliarch Lords
  'Rally Back': {
    effects: [
      {
        name: `Rally Back`,
        desc: `You can use this command ability in your movement phase. If you do so, pick 1 friendly STALLIARCH LORDS unit that either has the HEKATOS keyword, or is wholly within 6" of a friendly Mortis Hekatos, or is wholly within 12" of a friendly STALLIARCH LORDS HERO. That unit can retreat and still charge later in the same turn, as long as it did not run.`,
        when: [MOVEMENT_PHASE],
      },
    ],
  },
  //Ivory Host
  'Temper Fury': {
    effects: [
      {
        name: `Temper Fury`,
        desc: `You can use this command ability in the combat phase. If you do so, pick 1 friendly IVORY HOST unit that either has the HEKATOS keyword, or is wholly within 6" of a friendly Mortis Hekatos, or is wholly within 12" of a friendly IVORY HOST HERO. In that phase, do not subtract 1 from save rolls for attacks that target that unit because of their rage, but still add 1 to the hit rolls for attacks made by that unit.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  //Null Myriad
  Holdfast: {
    effects: [
      {
        name: `Holdfast`,
        desc: `You can use this command ability before you use the Eldritch Nulls ability for a unit that either has the HEKATOS keyword, or is wholly within 6" of a friendly Mortis Hekatos, or is wholly within 12" of a friendly NULL MYRIAD HERO; that unit is not affected by the spell or endless spell on a roll of 2+ instead of 5+.`,
        when: [HERO_PHASE],
      },
    ],
  },
  //Crematorians
  'Levellers of Cities': {
    effects: [
      {
        name: `Levellers of Cities`,
        desc: `You can use this command ability in the combat phase. If you do so, pick 1 friendly CREMATORIANS unit that either has the HEKATOS keyword, or is wholly within 6" of a friendly Mortis Hekatos, or is wholly within 12" of a friendly CREMATORIANS HERO. Do not apply the cover modifier to save rolls for attacks made with melee weapons by that CREMATORIANS unit in that phase.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Crushing Assault': {
    effects: [
      {
        name: `Crushing Assault`,
        desc: `You can use this command ability in your combat phase after a friendly IMMORTIS GUARD unit has fought in that phase for the first time. If you do so, if that unit is within 3" of an enemy unit, it can make a pile-in move and then attack with its Nadirite Battle-shields for a second time.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
}

// Always export using tagAs
export default tagAs(CommandAbilities, 'command_ability')
