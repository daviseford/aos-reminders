import { tagAs } from 'factions/metatagger'
import {
  START_OF_BATTLESHOCK_PHASE,
  START_OF_CHARGE_PHASE,
  START_OF_COMBAT_PHASE,
  START_OF_MOVEMENT_PHASE,
  START_OF_SHOOTING_PHASE,
} from 'types/phases'

const CommandAbilities = {
  'Get a Move On, You Slackers! (Big Shout)': {
    effects: [
      {
        name: `Get a Move On, You Slackers! (Big Shout)`,
        desc: `You can use this command ability at the start of your movement phase. If you do so, until the end of that phase, if you make a run roll for a friendly MANCRUSHER GARGANT unit that is within 18" of your general, that roll is treated as being 6.`,
        when: [START_OF_MOVEMENT_PHASE],
      },
    ],
  },
  "Grab Those Rocks and Chuck 'Em at Somethin'! (Big Shout)": {
    effects: [
      {
        name: `Grab Those Rocks and Chuck 'Em at Somethin'! (Big Shout)`,
        desc: `You can use this command ability at the start of your shooting phase. If you do so, when you use the Chuck Rocks battle trait, you can pick all friendly MANCRUSHER GARGANT units within 18" of your general to make Chuck Rocks shooting attacks, instead of only 1 unit.`,
        when: [START_OF_SHOOTING_PHASE],
      },
    ],
  },
  'Oi, You! Yes, You! Charge! (Big Shout)': {
    effects: [
      {
        name: `Oi, You! Yes, You! Charge! (Big Shout)`,
        desc: `You can use this command ability at the start of your charge phase. If you do so, until the end of that phase, you can reroll charge rolls for friendly MANCRUSHER GARGANT units that are within 18" of your general.`,
        when: [START_OF_CHARGE_PHASE],
      },
    ],
  },
  "Stop Muckin' About and Hit 'Em! (Big Shout)": {
    effects: [
      {
        name: `Stop Muckin' About and Hit 'Em! (Big Shout)`,
        desc: `You can use this command ability at the start of the combat phase. If you do so, until the end of that phase, you can reroll hit rolls of 1 for attacks made by friendly MANCRUSHER GARGANT units that are within 18" of your general.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  'Watch Yer Backs, You Gormless Lot! (Big Shout)': {
    effects: [
      {
        name: `Watch Yer Backs, You Gormless Lot! (Big Shout)`,
        desc: `You can use this command ability at the start of the combat phase. If you do so, until the end of that phase, you can reroll save rolls of for attacks that target friendly MANCRUSHER GARGANT units that are within 18" of your general.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  "Where Do You Think You're Going? (Big Shout)": {
    effects: [
      {
        name: `Where Do You Think You're Going? (Big Shout)`,
        desc: `You can use this command ability at the start of your battleshock phase. If you do so, until the end of that phase, do not take battleshock tests for friendly MANCRUSHER GARGANT units that are within 18" of your general.`,
        when: [START_OF_BATTLESHOCK_PHASE],
      },
    ],
  },
}

export default tagAs(CommandAbilities, 'command_ability')
