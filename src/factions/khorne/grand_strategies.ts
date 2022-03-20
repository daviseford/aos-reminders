import { tagAs } from 'factions/metatagger'
import { END_OF_GAME } from 'types/phases'
import rule_sources from './rule_sources'

const GrandStrategies = {
  'The Blood Legions March': {
    effects: [
      {
        name: `The Blood Legions March`,
        desc: `When the battle ends, you complete this grand strategy if in every battle round after the first, you summoned KHORNE DAEMON units to the battlefield by expending blood tithe points.`,
        when: [END_OF_GAME],
        rule_sources: [rule_sources.WHITE_DWARF_MARCH_2022],
      },
    ],
  },
}

export default tagAs(GrandStrategies, 'grand_strategy')
