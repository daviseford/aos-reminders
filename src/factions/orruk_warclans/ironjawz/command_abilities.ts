import { tagAs } from 'factions/metatagger'
import { DURING_GAME, HERO_PHASE, START_OF_COMBAT_PHASE } from 'types/phases'

// Store Command Abilities here. You can add them to units, abilties, flavors, and subfactions later.
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
}

// Always export using tagAs
export default tagAs(IronjawzCommandAbilities, 'command_ability')
