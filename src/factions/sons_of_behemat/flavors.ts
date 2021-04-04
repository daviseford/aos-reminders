import { TItemDescriptions } from 'factions/factionTypes'
import { keyPicker, pickEffects } from 'factions/metatagger'
import { COMBAT_PHASE, DURING_GAME, END_OF_COMBAT_PHASE, START_OF_SETUP } from 'types/phases'
import battle_traits from './battle_traits'
import command_abilities from './command_abilities'
import command_traits from './command_traits'

const Flavors: TItemDescriptions = {
  'Taker Tribe': {
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
      ...pickEffects(battle_traits, ['KrakenEater']),
    ],
  },
  'Stomper Tribe': {
    mandatory: {
      command_abilities: [
        keyPicker(command_abilities, [
          'Get a Move On, You Slackers! (Big Shout)',
          "Grab Those Rocks and Chuck 'Em at Somethin'! (Big Shout)",
          'Oi, You! Yes, You! Charge! (Big Shout)',
          "Stop Muckin' About and Hit 'Em! (Big Shout)",
          'Watch Yer Backs, You Gormless Lot! (Big Shout)',
          "Where Do You Think You're Going? (Big Shout)",
        ]),
      ],

      command_traits: [
        keyPicker(command_traits, [
          'Eager for the Fight (Stomper Tribe)',
          'Inescapable Grip (Stomper Tribe)',
          'Very Shouty (Stomper Tribe)',
          'Louder Than Words (Stomper Tribe)',
        ]),
      ],
    },

    effects: [
      {
        name: `Getting Stuck In`,
        desc: `Add 1 to the damage inflicted by each successful attack made by a friendly MANCRUSHER GARGANT unit that targets a unit with 10 or more models. Add 2 instead of 1 to the damage inflicted by each successful attack made by a friendly MANCRUSHER GARGANT unit that targets a unit with 20 or more models.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Big Shouts`,
        desc: `If your army is a Stomper Tribe, your general must use the Big Shout command abilities (they cannot use any other command abilities)`,
        when: [COMBAT_PHASE],
      },
      ...pickEffects(battle_traits, ['Warstomper']),
    ],
  },
  'Breaker Tribe': {
    effects: [
      {
        name: `Breaking Down The Houses`,
        desc: `Add 1 to the damage inflicted by each successful attack made by a friendly MANCRUSHER GARGANT unit that targets a unit that is part of a garrison or is wholly on or within a terrain feature.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Breaking Down The Houses`,
        desc: `At the end of the combat phase, you can pick 1 terrain feature within 3" of a friendly MANCRUSHER GARGANT unit and roll a D6. Add the number of models in that unit to the roll. On a 7+, that terrain feature is reduced to rubble: all of its scenery rules are replaced with the Deadly scenery rule, and its keywords are changed to SCENERY, RUBBLE.`,
        when: [END_OF_COMBAT_PHASE],
      },
      {
        name: `Fierce Loathings`,
        desc: `When you pick a Breaker Tribe army, you can choose or roll for 1 ability from the Fierce Loathings table. The ability applies to friendly GATEBREAKER MEGA-GARGANTS and friendly MANCRUSHER GARGANT units.`,
        when: [START_OF_SETUP],
      },
      ...pickEffects(battle_traits, ['Gatebreaker']),
    ],
  },
}

export default Flavors
