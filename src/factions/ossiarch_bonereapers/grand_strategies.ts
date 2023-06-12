import { tagAs } from 'factions/metatagger'
import { END_OF_GAME } from 'types/phases'

const GrandStrategies = {
  'The Scales Balanced': {
    effects: [
      {
        name: `The Scales Balanced`,
        desc: `When the battle ends, you complete this grand strategy if any friendly MORTEK GUARD or KAVALOS DEATHRIDERS units from your starting army have the same number of models as they had at the start of the battle.`,
        when: [END_OF_GAME],
      },
    ],
  },
  'A Textbook Conquest': {
    effects: [
      {
        name: `A Textbook Conquest`,
        desc: `When the battle ends, you complete this grand strategy if you control all of the objectives on the battlefield.`,
        when: [END_OF_GAME],
      },
    ],
  },
  'Creation and Termination': {
    effects: [
      {
        name: `Creation and Termination`,
        desc: `When the battle ends, you complete this grand strategy if there are more friendly MORTISANS than enemy HEROES on the battlefield.`,
        when: [END_OF_GAME],
      },
    ],
  },
  'The Pride of Ossia': {
    effects: [
      {
        name: `The Pride of Ossia`,
        desc: `When the battle ends, you complete this grand strategy if you completed at least 4 battle tactics and every battle tactic you completed this battle was from the 'Flawless Executions' list below.`,
        when: [END_OF_GAME],
      },
    ],
  },
}

export default tagAs(GrandStrategies, 'grand_strategy')
