import { tagAs } from 'factions/metatagger'
import { END_OF_GAME } from 'types/phases'

const GrandStrategies = {
  'Vanari Assault': {
    effects: [
      {
        name: `Vanari Assault`,
        desc: `When the battle ends, you complete this grand strategy if there are 4 or more friendly Vanari units on the battlefield and the model picked to be your opponent's genearl has been slain.`,
        when: [END_OF_GAME],
      },
    ],
  },
  'Scinari Illumination': {
    effects: [
      {
        name: `Scinari Illumination`,
        desc: `When the battle ends, you complete this grand strategy if there is a friendly Scinari unit in each quarter of the battlefield.`,
        when: [END_OF_GAME],
      },
    ],
  },
  'Alarith Aftershock': {
    effects: [
      {
        name: `Alarith Aftershock`,
        desc: `When the battle ends, you complete this grand strategy if 2 or more friendly Alarith units are contesting 2 or more objectives on the battlefield.`,
        when: [END_OF_GAME],
      },
    ],
  },
  'Hurakan Cyclone': {
    effects: [
      {
        name: `Hurakan Cyclone`,
        desc: `When the battle ends, you complete this grand strategy if 3 or more friendly Hurakan units are within 6" of the same enemy unit on the battlefield.`,
        when: [END_OF_GAME],
      },
    ],
  },
}

export default tagAs(GrandStrategies, 'grand_strategy')
