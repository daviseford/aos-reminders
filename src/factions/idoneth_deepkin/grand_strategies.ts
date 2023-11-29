import { TItemDescriptions } from 'factions/factionTypes'
import { tagAs } from 'factions/metatagger'
import { END_OF_GAME } from 'types/phases'

const GrandStrategies = {
  'Akhelian Pursuit': {
    effects: [
      {
        name: `Akhelian Pursuit`,
        desc: `When the battle ends, you complete this grand strategy if there are 3 or more friendly AKHELIAN units wholly within enemy territory.`,
        when: [END_OF_GAME],
      },
    ],
  },
  'The Creeping Gloomtide': {
    effects: [
      {
        name: `The Creeping Gloomtide`,
        desc: `When the battle ends, you complete this grand strategy if there are any Gloomtide Shipwrecks in your army on the battlefield and all of them are more than 3" from all enemy units.`,
        when: [END_OF_GAME],
      },
    ],
  },
  'Dominion of the Deep Ones': {
    effects: [
      {
        name: `Dominion of the Deep Ones`,
        desc: `When the battle ends, you complete this grand strategy if the only MONSTERS on the battlefield are friendly LEVIADONS.`,
        when: [END_OF_GAME],
      },
    ],
  },
  'Namarti Assault': {
    effects: [
      {
        name: `Namarti Assault`,
        desc: `When the battle ends, you complete this grand strategy if 2 or more friendly NAMARTI units are within 3" of any enemy units, or if the only Battleline units on the battlefield are friendly NAMARTI units.`,
        when: [END_OF_GAME],
      },
    ],
  },
} satisfies TItemDescriptions

export default tagAs(GrandStrategies, 'grand_strategy')
