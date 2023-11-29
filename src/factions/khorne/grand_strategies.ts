import { TItemDescriptions } from 'factions/factionTypes'
import { tagAs } from 'factions/metatagger'
import { END_OF_GAME, TURN_ONE_START_OF_TURN } from 'types/phases'

const GrandStrategies = {
  'The Blood Legions March': {
    effects: [
      {
        name: `The Blood Legions March`,
        desc: `When the battle ends, you complete this grand strategy if in every battle round after the first you summoned any BLADES OF KHORNE DAEMON units to the battlefield by spending Blood Tithe points.`,
        when: [END_OF_GAME],
      },
    ],
  },
  "'Bring Me A Worthy Skull'": {
    effects: [
      {
        name: `'Bring Me A Worthy Skull'`,
        desc: `At the start of the first battle round, ask your opponent to pick 1 HERO from their army to be the worthy foe. When the battle ends, you complete this grand strategy if that HERO has been slain and the model picked to be your general has not been slain.`,
        when: [TURN_ONE_START_OF_TURN, END_OF_GAME],
      },
    ],
  },
  'Reap the Blood Tithe': {
    effects: [
      {
        name: `Reap the Blood Tithe`,
        desc: `When the battle ends, you complete this grand strategy if in every battle round after the first, you spent Blood Tithe points to use a Blood Tithe Reward and you did not use the same Blood Tithe Reward more than once.`,
        when: [END_OF_GAME],
      },
    ],
  },
  'Disciples of Carnage': {
    effects: [
      {
        name: `Disciples of Carnage`,
        desc: `When the battle ends, you complete this grand strategy if you completed at least 4 battle tactics and every battle tactic you completed was from the 'For the Skull Throne' list.`,
        when: [END_OF_GAME],
      },
    ],
  },
} satisfies TItemDescriptions

export default tagAs(GrandStrategies, 'grand_strategy')
