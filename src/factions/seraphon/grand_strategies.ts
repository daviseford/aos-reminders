import { tagAs } from 'factions/metatagger'
import { END_OF_GAME } from 'types/phases'
import rule_sources from './rule_sources'

const GrandStrategies = {
  'Continuous Expansion': {
    effects: [
      {
        name: `Continuous Expansion`,
        desc: `Coalesced army only. When the battle ends, you complete this objective if you have a least 1 friendly unit wholly within each large quarter of the battlefield.`,
        when: [END_OF_GAME],
        rule_sources: [rule_sources.WHITE_DWARF_OCTOBER_2021],
      },
    ],
  },
  Astromatrix: {
    effects: [
      {
        name: `Astromatrix`,
        desc: `Starborne army only. An imaginary key line 1mm wide runs from the each corner of the battlefield to the diagonally opposite corner of the battlefield. When the battle ends, you complete this objective if a ley line does not pass over any enemy models with the WIZARD keyword, and at least 1 ley line passes over a friendly model with the WIZARD keyword.`,
        when: [END_OF_GAME],
        rule_sources: [rule_sources.WHITE_DWARF_OCTOBER_2021],
      },
    ],
  },
}

export default tagAs(GrandStrategies, 'grand_strategy')
