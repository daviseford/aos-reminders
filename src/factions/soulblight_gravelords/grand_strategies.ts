import { tagAs } from 'factions/metatagger'
import { END_OF_GAME } from 'types/phases'
import rule_sources from './rule_sources'

const GrandStrategies = {
  'Vampiric Conquerors': {
    effects: [
      {
        name: `Vampiric Conquerors`,
        desc: `When the battle ends, you complete this grand strategy if you control more gravesites than your opponent. Control of gravesites is determined in the same way as control of objective markers.`,
        when: [END_OF_GAME],
        rule_sources: [rule_sources.WHITE_DWARF_DECEMBER_2021],
      },
    ],
  },
}

export default tagAs(GrandStrategies, 'grand_strategy')
