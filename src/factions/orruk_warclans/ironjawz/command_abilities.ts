import { tagAs } from 'factions/metatagger'
import {
  COMBAT_PHASE,
  DURING_GAME,
  END_OF_CHARGE_PHASE,
  HERO_PHASE,
  START_OF_COMBAT_PHASE,
} from 'types/phases'

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
  'Voice of Gork': {
    effects: [
      {
        name: `Voice of Gork`,
        desc: `Pick up to 3 friendly DESTRUCTION units wholly within 24" of this model. Until the end of that phase, add 1 to hit rolls for attacks made by that unit. A unit cannot benefit from this command ability more than once per phase, and a unit cannot benefit from this ability and the Go on Ladz, Get Stuck In! ability in the same phase.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  'Mighty Destroyers': {
    effects: [
      {
        name: `Mighty Destroyers`,
        desc: `You can use this command ability in your hero phase. If you do so, pick 1 friendly IRONJAWZ unit wholly within 12" of a friendly IRONJAWZ HERO, or wholly within 18" of a friendly IRONJAWZ HERO that is a general. That unit can make a normal move if it is more than 12" from any enemy units, pile in and attack with its melee weapons if it is within 3" of any enemy units, or attempt to charge in any other circumstance. You cannot pick the same unit to benefit from this command ability more than once per hero phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Ironjawz Waaaagh!': {
    effects: [
      {
        name: `Ironjawz Waaaagh!`,
        desc: `You can use this command ability once per battle at the start of your combat phase if your army has a MEGABOSS' general, Roll a D6 and add all the units that are wholly within 18" of your general. On an 11 or lower, all friendly Ironjawz units wholly within range of the general get +1 to their attacks, if the roll is 12 or more then add +2 to their attacks instead.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  'Drawn to the Waaagh!': {
    effects: [
      {
        name: `Drawn to the Waaagh!`,
        desc: `You can use this command ability if the Orruk Warchanter from this battalion is on the battlefield when a unit from this battalion is destroyed. If you do so, roll a D6. On a 4+, a new unit identical to the one that was destroyed is added to your army. Set up the new unit wholly within 6" of the edge of the battlefield and more than 9" from any enemy units. You cannot use this command ability more than once per phase.`,
        when: [DURING_GAME],
      },
    ],
  },
  "Alright - Get 'Em": {
    effects: [
      {
        name: `Alright - Get 'Em`,
        desc: `Use at the end of the enemy charge phase, pick 1 friendly unit that is between 3" and 12" of an enemy unit and wholly within 18" of a friendly hero, that unit can charge.`,
        when: [END_OF_CHARGE_PHASE],
      },
    ],
  },
  'Break Through da Line': {
    effects: [
      {
        name: `Break Through da Line`,
        desc: `Pick a friendly unit that's already fought wholly within 24" of a hero, that unit can make a normal move but can't retreat or run.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Rabble Rouser': {
    effects: [
      {
        name: `Rabble Rouser`,
        desc: `Pick a warchanter, that warchanter can pick 3 Brutes or Ardboyz to benefit from its Violent fury ability instead of 1.`,
        when: [HERO_PHASE],
      },
    ],
  },
}

export default tagAs(IronjawzCommandAbilities, 'command_ability')
