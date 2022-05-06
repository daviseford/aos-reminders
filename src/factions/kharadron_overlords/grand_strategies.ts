import { tagAs } from 'factions/metatagger'
import { END_OF_GAME } from 'types/phases'
import rule_sources from './rule_sources'

const GrandStrategies = {
  'Spend Shares to Make Shares': {
    effects: [
      {
        name: `Spend Shares to Make Shares`,
        desc: `When the battle ends, you complete this grand strategy if no unit in your army has a share of aethergold that has not been spent, and at least 1 share of aethergold was spent by friendly units in every battle round.`,
        when: [END_OF_GAME],
        rule_sources: [rule_sources.WHITE_DWARF_MAY_2022],
      },
    ],
  },
}

export default tagAs(GrandStrategies, 'grand_strategy')
