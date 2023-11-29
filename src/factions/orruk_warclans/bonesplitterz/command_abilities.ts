import { TItemDescriptions } from 'factions/factionTypes'
import { tagAs } from 'factions/metatagger'
import { END_OF_COMBAT_PHASE, HERO_PHASE, START_OF_COMBAT_PHASE } from 'types/phases'

const BonesplitterzCommandAbilities = {
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
        desc: `If an enemy wizard casts a spell you may pick a unit with 10+ models and wholly within 18" of a friendly Wurrgog Prophet or Wardokk, that unit can attempt to unbind that spell. +1 to unbind if the unit has 20 or more models.`,
        when: [HERO_PHASE],
      },
    ],
  },
} satisfies TItemDescriptions

export default tagAs(BonesplitterzCommandAbilities, 'command_ability')
