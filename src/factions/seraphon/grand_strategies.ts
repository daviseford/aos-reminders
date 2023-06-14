import { tagAs } from 'factions/metatagger'
import { END_OF_GAME } from 'types/phases'

const GrandStrategies = {
  'Continuous Expansion': {
    effects: [
      {
        name: `Continuous Expansion`,
        desc: `When the battle ends, you complete this grand strategy if there is at least 1 friendly SERAPHON unit wholly within each large quarter of the battlefield (core rules, 28.2.8).`,
        when: [END_OF_GAME],
      },
    ],
  },
  'Realmshaper Guardians': {
    effects: [
      {
        name: `Realmshaper Guardians`,
        desc: `When the battle ends, you complete this grand strategy if you have a Coalesced Realmshaper Engine or Starborne Realmshaper Engine on the battlefield, there are no enemy models within 12" of it and it was not affected by a successful Smash To Rubble monstrous rampage.`,
        when: [END_OF_GAME],
      },
    ],
    'Repel Corruption': {
      effects: [
        {
          name: `Repel Corruption`,
          desc: `When the battle ends, you complete this grand strategy if there are no enemy units wholly within your territory.`,
          when: [END_OF_GAME],
        },
      ],
    },
    'Further the Great Plan': {
      effects: [
        {
          name: `Further the Great Plan`,
          desc: `When the battle ends, you complete this grand strategy if you completed 4 or more battle tactics and each of those battle tactics was from the March of the Seraphon Host table below.`,
          when: [END_OF_GAME],
        },
      ],
    },
  },
}

export default tagAs(GrandStrategies, 'grand_strategy')
