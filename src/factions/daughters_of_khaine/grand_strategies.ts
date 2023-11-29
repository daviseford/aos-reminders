import { TItemDescriptions } from 'factions/factionTypes'
import { tagAs } from 'factions/metatagger'
import { END_OF_GAME, END_OF_SETUP } from 'types/phases'

const GrandStrategies = {
  Bloodbath: {
    effects: [
      {
        name: `Bloodbath`,
        desc: `When the battle ends, you complete this grand strategy if all enemy HEROES and MONSTERS either have at least 1 wound allocated to them or have been slain and if all other enemy units on the battlefield have had at least 1 model slain.`,
        when: [END_OF_GAME],
      },
    ],
  },
  'Conquered in the Name of Khaine': {
    effects: [
      {
        name: `Conquered in the Name of Khaine`,
        desc: `When the battle ends, you complete this grand strategy if there is a friendly AVATAR OF KHAINE or CAULDRON OF BLOOD wholly within enemy territory.`,
        when: [END_OF_GAME],
      },
    ],
  },
  'Bloodthirsty Zealots': {
    effects: [
      {
        name: `Bloodthirsty Zealots`,
        desc: `When the battle ends, you complete this grand strategy if all friendly units either fought at least once during the battle or have been destroyed.`,
        when: [END_OF_GAME],
      },
    ],
  },
  'Naught But Destruction': {
    effects: [
      {
        name: `Naught But Destruction`,
        desc: `If you pick this grand strategy, after deployment, pick 1 defensible terrain feature wholly within enemy territory. If there are no defensible terrain features wholly within enemy territory, your opponent picks 1 defensible terrain feature anywhere on the battlefield. When the battle ends, you complete this grand strategy if that terrain feature has been demolished.`,
        when: [END_OF_SETUP],
      },
      {
        name: `Naught But Destruction`,
        desc: `When the battle ends, you complete this grand strategy if that terrain feature has been demolished.`,
        when: [END_OF_GAME],
      },
    ],
  },
} satisfies TItemDescriptions

export default tagAs(GrandStrategies, 'grand_strategy')
