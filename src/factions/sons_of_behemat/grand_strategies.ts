import { tagAs } from 'factions/metatagger'
import { END_OF_GAME } from 'types/phases'
import rule_sources from './rule_sources'

// SOB Specific grand strategy available from WD Aug 2021
const GrandStrategies = {
  'Make the Land Tremble': {
    effects: [
      {
        name: `Make the Land Tremble`,
        desc: `When the battle ends, you complete this grand strategy if any friendly units made a run or charge move in every battle round (it does not have to be the same unit that runs or makes a charge move in every battle round).`,
        when: [END_OF_GAME],
        rule_sources: [rule_sources.WHITE_DWARF_AUGUST_2021],
      },
    ],
  },
}

export default tagAs(GrandStrategies, 'grand_strategy')
