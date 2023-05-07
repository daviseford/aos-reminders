import { tagAs } from 'factions/metatagger'
import { END_OF_GAME } from 'types/phases'

const GrandStrategies = {
  'Coveted Riches': {
    effects: [
      {
        name: `Coveted Riches`,
        desc: `When the battle ends, you complete this grand strategy if there are no enemy units with artefacts of power on the battlefield and there are 1 or more friendly units with artefacts of power on the battlefield.`,
        when: [END_OF_GAME],
      },
    ],
  },
}

export default tagAs(GrandStrategies, 'grand_strategy')
