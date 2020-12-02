import { TEntry } from 'types/data'
import {
  COMBAT_PHASE,
  DURING_GAME,
  END_OF_COMBAT_PHASE,
  START_OF_BATTLESHOCK_PHASE,
  START_OF_CHARGE_PHASE,
  START_OF_COMBAT_PHASE,
  START_OF_MOVEMENT_PHASE,
  START_OF_SETUP,
  START_OF_SHOOTING_PHASE,
} from 'types/phases'
import CommonSonsOfBehematData from './common'

const { Breaker, Taker, Stomper } = CommonSonsOfBehematData.TRIBES
const { BigShoutTag } = CommonSonsOfBehematData.TAGS

const Allegiances: TEntry[] = [
  {
    name: `${Taker} Tribe`,
    effects: [
      {
        name: `Get Rid Of 'Em!`,
        desc: `When using the Mightier Makes Rightier rule to determining control of an objective, each friendly MANCRUSHER GARGANT model counts as 15 models instead of 10, and each friendly MEGA-GARGANT counts as 30 models instead of 20.`,
        when: [DURING_GAME],
      },
      {
        name: `More Stuff For Me Collection`,
        desc: `Each time an enemy model with an artefact of power is slain, you can roll for a triumph on the Triumph table. You can use that triumph during the current battle, even if you have already used it. If you do not use it during the current battle, it is lost (you cannot use it in your next battle).`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `${Stomper} Tribe`,
    effects: [
      {
        name: `Getting Stuck In`,
        desc: `Add 1 to the damage inflicted by each successful attack made by a friendly MANCRUSHER GARGANT unit that targets a unit with 10 or more models. Add 2 instead of 1 to the damage inflicted by each successful attack made by a friendly MANCRUSHER GARGANT unit that targets a unit with 20 or more models.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Big Shouts`,
        desc: `If your army is a ${Stomper} Tribe, your general must use the Big Shout command abilities (they cannot use any other command abilities)`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Get a Move On, You Slackers! ${BigShoutTag}`,
        desc: `You can use this command ability at the start of your movement phase. If you do so, until the end of that phase, if you make a run roll for a friendly MANCRUSHER GARGANT unit that is within 18" of your general, that roll is treated as being 6.`,
        when: [START_OF_MOVEMENT_PHASE],
        command_ability: true,
      },
      {
        name: `Grab Those Rocks and Chuck 'Em at Somethin'! ${BigShoutTag}`,
        desc: `You can use this command ability at the start of your shooting phase. If you do so, when you use the Chuck Rocks battle trait, you can pick all friendly MANCRUSHER GARGANT units within 18" of your general to make Chuck Rocks shooting attacks, instead of only 1 unit.`,
        when: [START_OF_SHOOTING_PHASE],
        command_ability: true,
      },
      {
        name: `Oi, You! Yes, You! Charge! ${BigShoutTag}`,
        desc: `You can use this command ability at the start of your charge phase. If you do so, until the end of that phase, you can reroll charge rolls for friendly MANCRUSHER GARGANT units that are within 18" of your general.`,
        when: [START_OF_CHARGE_PHASE],
        command_ability: true,
      },
      {
        name: `Stop Muckin' About and Hit 'Em! ${BigShoutTag}`,
        desc: `You can use this command ability at the start of the combat phase. If you do so, until the end of that phase, you can reroll hit rolls of 1 for attacks made by friendly MANCRUSHER GARGANT units that are within 18" of your general.`,
        when: [START_OF_COMBAT_PHASE],
        command_ability: true,
      },
      {
        name: `Watch Yer Backs, You Gormless Lot! ${BigShoutTag}`,
        desc: `You can use this command ability at the start of the combat phase. If you do so, until the end of that phase, you can reroll save rolls of for attacks that target friendly MANCRUSHER GARGANT units that are within 18" of your general.`,
        when: [START_OF_COMBAT_PHASE],
        command_ability: true,
      },
      {
        name: `Where Do You Think You're Going? ${BigShoutTag}`,
        desc: `You can use this command ability at the start of your battleshock phase. If you do so, until the end of that phase, do not take battleshock tests for friendly MANCRUSHER GARGANT units that are within 18" of your general.`,
        when: [START_OF_BATTLESHOCK_PHASE],
        command_ability: true,
      },
    ],
  },
  {
    name: `${Breaker} Tribe`,
    effects: [
      {
        name: `Breaking Down The Houses`,
        desc: `Add 1 to the damage inflicted by each successful attack made by a friendly MANCRUSHER GARGANT unit that targets a unit that is part of a garrison or is wholly on or within a terrain feature.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Breaking Down The Houses`,
        desc: `At the end of the combat phase, you can pick 1 terrain feature within 3" of a friendly MANCRUSHER GARGANT unit and roll a dice. Add the number of models in that unit to the roll. On a 7+, that terrain feature is reduced to rubble: all of its scenery rules are replaced with the Deadly scenery rule, and its keywords are changed to SCENERY, RUBBLE.`,
        when: [END_OF_COMBAT_PHASE],
      },
      {
        name: `Fierce Loathings`,
        desc: `When you pick a ${Breaker} Tribe army, you can choose or roll for 1 ability from the Fierce Loathings table. The ability applies to friendly GATEBREAKER MEGA-GARGANTS and friendly MANCRUSHER GARGANT units.`,
        when: [START_OF_SETUP],
      },
    ],
  },
]

export default Allegiances
