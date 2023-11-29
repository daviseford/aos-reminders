import { TItemDescriptions } from 'factions/factionTypes'
import { tagAs } from 'factions/metatagger'
import meta_rule_sources from 'meta/rule_sources'
import { END_OF_GAME } from 'types/phases'

const GrandStrategies = {
  'Head of Da Herd': {
    effects: [
      {
        name: `Head of Da Herd`,
        desc: `When the battle ends, you complete this grand strategy if your general had a momentum score of 6 at any point during the battle and has not been slain.`,
        when: [END_OF_GAME],
        rule_sources: [meta_rule_sources.BOOK_DAWNBRINGERS_BOOK_2],
      },
    ],
  },
} satisfies TItemDescriptions

export default tagAs(GrandStrategies, 'grand_strategy')
