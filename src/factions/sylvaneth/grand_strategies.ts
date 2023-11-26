import { tagAs } from 'factions/metatagger'
import { END_OF_GAME } from 'types/phases'

const GrandStrategies = {
  'Chorus of the Woodlands': {
    effects: [
      {
        name: `Chorus of the Woodlands`,
        desc: `When the battle ends, you complete this grand strategy if you completed at least 4 battle tactics and every battle tactic you completed was from the 'Songs of War' list.`,
        when: [END_OF_GAME],
      },
    ],
  },
  'Vengeance and Spite': {
    effects: [
      {
        name: `Vengeance and Spite`,
        desc: `When the battle ends, you complete this grand strategy if the model picked to be your opponent's general was slain by an attack made by a friendly OUTCASTS unit.`,
        when: [END_OF_GAME],
      },
    ],
  },
  'The Roots of Victory': {
    effects: [
      {
        name: `The Roots of Victory`,
        desc: `When the battle ends, you complete this grand strategy if there is a friendly Awakened Wyldwood in each quarter of the battlefield and all enemy units are more than 6" from all friendly Awakened Wyldwoods on the battlefield.`,
        when: [END_OF_GAME],
      },
    ],
  },
  // Evergreen Hunt
  'The Grand Hunt': {
    effects: [
      {
        name: `The Grand Hunt`,
        desc: `When the battle ends, you complete this grand strategy if you have destroyed 4 or more quarries.`,
        when: [END_OF_GAME],
      },
    ],
  },
}

export default tagAs(GrandStrategies, 'grand_strategy')
