import { tagAs } from 'factions/metatagger'
import { END_OF_COMBAT_PHASE, HERO_PHASE, START_OF_COMBAT_PHASE } from 'types/phases'

// Store Command Abilities here. You can add them to units, abilties, flavors, and subfactions later.
const BonesplitterzCommandAbilities = {
  'Bonesplitterz Waaagh!': {
    effects: [
      {
        name: `Bonesplitterz Waaagh!`,
        desc: `You can use this command ability once per battle at the start of your combat phase if your general is still alive. Roll a D6 and add the number of friendly Bonesplitterz units wholly within 18" of your general to the roll. On an 11 or lower all friendly Bonesplitterz units wholly within range of the general get +1 to their attacks, if the roll is 12 or more then add +2 to their attacks instead.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },

  'Feel da Spirit': {
    effects: [
      {
        name: `Feel da Spirit`,
        desc: `At the start of the combat phase, pick 1 friendly unit wholly within 18" of a Savage Big Boss, if that unit makes unmodified hit rolls of 6, they score 2 hits.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  'Freeze and Run': {
    effects: [
      {
        name: `Freeze and Run`,
        desc: `At the end of the combat phase, pick 1 friendly Icebone Boarboys unit that is within 3" of an enemy unit and wholly within 18" of a friendly hero. That friendly unit can retreat and the enemy units that were within 3" get -2 on their charge roll.`,
        when: [END_OF_COMBAT_PHASE],
      },
    ],
  },
  'Shout Down da Magic!': {
    effects: [
      {
        name: `Shout Down da Magic!`,
        desc: `If an enemy wizard casts a spell you may pick a unit with 10+ models and wholly within 18" of a friendly Wurrgog prophet or Wardokk, that unit can attempt to unbind that spell. +1 to unbind if the unit has 20 or more models.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Savage Attack': {
    effects: [
      {
        name: `Savage Attack`,
        desc: `Pick 1 friendly BONESPLITTERZ unit wholly within 12" of a friendly model with this command ability. Until the end of that phase, if the unmodified hit roll for an attack made by that unit is 6, that attack scores 2 hits on the target instead of 1. A unit cannot benefit from this command ability more than once per phase.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
}

// Always export using tagAs
export default tagAs(BonesplitterzCommandAbilities, 'command_ability')
