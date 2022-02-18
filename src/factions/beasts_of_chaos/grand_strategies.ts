import { tagAs } from 'factions/metatagger'
import { END_OF_GAME } from 'types/phases'
import rule_sources from './rule_sources'

const GrandStrategies = {
  'Protect the Herdstone': {
    effects: [
      {
        name: `Protect the Herdstone`,
        desc: `When the battle ends, you complete this grand strategy if there are no enemy units within 9" of your Herdstone and it has not been picked by a successful Smash To Rubble monstrous rampage.`,
        when: [END_OF_GAME],
        rule_sources: [rule_sources.WHITE_DWARF_FEBRUARY_2022],
      },
    ],
  },
}

export default tagAs(GrandStrategies, 'grand_strategy')
