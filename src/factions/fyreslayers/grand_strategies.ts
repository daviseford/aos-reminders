import { tagAs } from 'factions/metatagger'
import { END_OF_GAME } from 'types/phases'

const GrandStrategies = {
  'Guarded Lineage': {
    effects: [
      {
        name: `Guarded Lineage`,
        desc: `When the battle ends, you complete this grand strategy if there is 1 friendly AURIC RUNEFATHER and 1 or more friendly AURIC RUNESONS on the battlefield.`,
        when: [END_OF_GAME],
      },
    ],
  },
  'Defend the Lodge': {
    effects: [
      {
        name: `Defend the Lodge`,
        desc: `When the battle ends, you complete this grand strategy if there are no enemy units wholly within your territory.`,
        when: [END_OF_GAME],
      },
    ],
  },
  'Oath-takers and Skull-breakers': {
    effects: [
      {
        name: `Oath-takers and Skull-breakers`,
        desc: `When the battle ends, you complete this grand strategy if you completed at least 4 battle tactics and every battle tactic you completed this battle was from the 'Oaths of Battle' list on page 75.`,
        when: [END_OF_GAME],
      },
    ],
  },
  'Masters of the Forge': {
    effects: [
      {
        name: `Masters of the Forge`,
        desc: `When the battle ends, you complete this grand strategy if there are any invocations under your command on the battlefield.`,
        when: [END_OF_GAME],
      },
    ],
  },
}

export default tagAs(GrandStrategies, 'grand_strategy')
