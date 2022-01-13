import { tagAs } from 'factions/metatagger'
import { END_OF_GAME } from 'types/phases'
import rule_sources from './rule_sources'

// SOB Specific grand strategy available from WD Aug 2021
const GrandStrategies = {
  'Unrelenting Efficiency': {
    effects: [
      {
        name: `Unrelenting Efficiency`,
        desc: `When the battle ends, you complete this grand strategy if any friendly MORTEK GUARD or KAVALKOS DEATHRIDERS units from your starting army have the same number of models in that unit as they had at the start of the battle.`,
        when: [END_OF_GAME],
        rule_sources: [rule_sources.WHTE_DWARF_JANUARY_2022],
      },
    ],
  },
}

export default tagAs(GrandStrategies, 'grand_strategy')
