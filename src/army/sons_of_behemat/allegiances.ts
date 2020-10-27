import { TAllegiances } from 'types/army'
import {
  COMBAT_PHASE,
  DURING_GAME,
  START_OF_BATTLESHOCK_PHASE,
  START_OF_CHARGE_PHASE,
  START_OF_COMBAT_PHASE,
  START_OF_MOVEMENT_PHASE,
  START_OF_SHOOTING_PHASE,
} from 'types/phases'
import CommonSonsOfBehematData from './common'

const { Breaker, Taker, Stomper } = CommonSonsOfBehematData.TRIBES

const Allegiances: TAllegiances = [
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
        name: `Get a Move On, You Slackers!`,
        desc: `You can use this command ability at the start of your movement phase. If you do so, until the end of that phase, if you make a run roll for a friendly MANCRUSHER GARGANT unit that is within 18" of your general, that roll is treated as being 6.`,
        when: [START_OF_MOVEMENT_PHASE],
        command_ability: true,
      },
      {
        name: `Grab Those Rocks and Chuck 'Em at Somethin'!`,
        desc: `You can use this command ability at the start of your shooting phase. If you do so, when you use the Chuck Rocks battle trait, you can pick all friendly MANCRUSHER GARGANT units within 18" of your general to make Chuck Rocks shooting attacks, instead of only 1 unit.`,
        when: [START_OF_SHOOTING_PHASE],
        command_ability: true,
      },
      {
        name: `Oi, You! Yes, You! Charge!`,
        desc: `You can use this command ability at the start of your charge phase. If you do so, until the end of that phase, you can reroll charge rolls for friendly MANCRUSHER GARGANT units that are within 18" of your general.`,
        when: [START_OF_CHARGE_PHASE],
        command_ability: true,
      },
      {
        name: `Stop Muckin' About and Hit 'Em!`,
        desc: `You can use this command ability at the start of the combat phase. If you do so, until the end of that phase, you can reroll hit rolls of 1 for attacks made by friendly MANCRUSHER GARGANT units that are within 18" of your general.`,
        when: [START_OF_COMBAT_PHASE],
        command_ability: true,
      },
      {
        name: `Watch Yer Backs, You Gormless Lot!`,
        desc: `You can use this command ability at the start of the combat phase. If you do so, until the end of that phase, you can reroll save rolls of for attacks that target friendly MANCRUSHER GARGANT units that are within 18" of your general.`,
        when: [START_OF_COMBAT_PHASE],
        command_ability: true,
      },
      {
        name: `Where Do You Think You're Going?`,
        desc: `You can use this command ability at the start of your battleshock phase. If you do so, until the end of that phase, do not take battleshock tests for friendly MANCRUSHER GARGANT units that are within 18" of your general.`,
        when: [START_OF_BATTLESHOCK_PHASE],
        command_ability: true,
      },
    ],
  },
  {
    name: `${Breaker} Tribe`,
    effects: [{ name: ``, desc: ``, when: [] }],
  },
]

export default Allegiances
