import { TItemDescriptions } from 'factions/factionTypes'
import { tagAs } from 'factions/metatagger'
import { END_OF_CHARGE_PHASE } from 'types/phases'
import rule_sources from '../rule_sources'
import meta_rule_sources from 'meta/rule_sources'

const MonstrousRampages = {
  'Flattened into the Mud': {
    effects: [
      {
        name: `Flattened into the Mud`,
        desc: `Only a model in a unit that has made a charge move this turn can carry out this monstrous rampage. Pick an enemy unit with a Wounds characteristic of 1 or 2 within 3" of this unit and roll a dice. If the roll is less than this unit's momentum score, the strike-last effect applies to that enemy unit until the end of the turn.`,
        when: [END_OF_CHARGE_PHASE],
      },
    ],
  },
  'Carve a Path': {
    effects: [
      {
        name: `Carve a Path`,
        desc: `Pick an enemy unit with a Wounds characteristic of 4 or less within 3" of this unit and roll a dice. If the roll is less than this unit's momentum score, that enemy unit suffers a number of mortal wounds equal to the roll and you can immediately attempt a charge with this unit even though it is within 3" of an enemy unit. When a unit charges in this manner, it can pass across enemy units with a Wounds characteristic of 4 or less in the same manner as a unit that can fly.`,
        when: [END_OF_CHARGE_PHASE],
        rule_sources: [
          rule_sources.BATTLETOME_SUPPLEMENT_IRONJAWZ,
          meta_rule_sources.ERRATA_DAWNBRINGERS_BOOK_2,
        ],
      },
    ],
  },
} satisfies TItemDescriptions

export default tagAs(MonstrousRampages, 'monstrous_rampage')
