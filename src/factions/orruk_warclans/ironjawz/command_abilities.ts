import { tagAs } from 'factions/metatagger'
import { END_OF_CHARGE_PHASE, HERO_PHASE, START_OF_COMBAT_PHASE } from 'types/phases'

const IronjawzCommandAbilities = {
  'Go on Ladz, Get Stuck In!': {
    effects: [
      {
        name: `Go on Ladz, Get Stuck In!`,
        desc: `Pick 1 friendly IRONJAWZ unit wholly within 12" of a friendly model with this command ability, or wholly within 18" of a friendly model with this command ability that is a MONSTER. Until the end of that phase, add 1 to hit rolls for attacks made by that unit. A unit cannot benefit from this command ability more than once per phase.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  'Mighty Destroyers': {
    effects: [
      {
        name: `Mighty Destroyers`,
        desc: `You can use this command ability in your hero phase. The model that issues the command must be an IRONJAWZ model and the unit that receives the command must be an IRONJAWZ unit.

        - If the unit that received the command is more than 12" from all enemy units, you must make a normal move with the unit.

        - If the unit that received the command is within 3" of an enemy unit, you must make a pile-in move with each model in the unit.

        - If the unit is within 12" of an enemy unit and more than 3" from all enemy units, you must attempt a charge with the unit.`,
        when: [HERO_PHASE],
      },
    ],
  },

  "Alright, Get 'Em!": {
    effects: [
      {
        name: `Alright, Get 'Em!`,
        desc: `You can use this command ability at the end of the enemy charge phase. The unit that receives the command must be a friendly IRONSUNZ unit that is within 12" of an enemy unit and more than 3" from all enemy units. That IRONSUNZ unit can attempt a charge.`,
        when: [END_OF_CHARGE_PHASE],
      },
    ],
  },

  // Removed in 2021
  // 'Voice of Gork': {
  //   effects: [
  //     {
  //       name: `Voice of Gork`,
  //       desc: `Pick up to 3 friendly DESTRUCTION units wholly within 24" of this model. Until the end of that phase, add 1 to hit rolls for attacks made by that unit. A unit cannot benefit from this command ability more than once per phase, and a unit cannot benefit from this ability and the Go on Ladz, Get Stuck In! ability in the same phase.`,
  //       when: [START_OF_COMBAT_PHASE],
  //     },
  //   ],
  // },
  // 'Drawn to the Waaagh!': {
  //   effects: [
  //     {
  //       name: `Drawn to the Waaagh!`,
  //       desc: `You can use this command ability if the ORRUK WARCHANTER from this battalion is on the battlefield when a unit from this battalion is destroyed. If you do so, roll a dice. On a 4+, a new unit identical to the one that was destroyed is added to your army. Set up the new unit wholly within 6" of the edge of the battlefield and more than 9" from all enemy units.`,
  //       when: [WOUND_ALLOCATION_PHASE],
  //       rule_sources: [rule_sources.BATTLETOME_ORRUK_WARCLANS, rule_sources.ERRATA_ORRUK_WARCLANS_JULY_2021],
  //     },
  //   ],
  // },
  // 'Break Through da Line': {
  //   effects: [
  //     {
  //       name: `Break Through da Line`,
  //       desc: `Pick a friendly unit that's already fought wholly within 24" of a hero, that unit can make a normal move but can't retreat or run.`,
  //       when: [COMBAT_PHASE],
  //     },
  //   ],
  // },
  // 'Rabble Rouser': {
  //   effects: [
  //     {
  //       name: `Rabble Rouser`,
  //       desc: `Pick a Warchanter, that Warchanter can pick 3 Brutes or Ardboyz to benefit from its Violent Fury ability instead of 1.`,
  //       when: [HERO_PHASE],
  //     },
  //   ],
  // },
}

export default tagAs(IronjawzCommandAbilities, 'command_ability')
