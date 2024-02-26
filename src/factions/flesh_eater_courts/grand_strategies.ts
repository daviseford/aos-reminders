import { TItemDescriptions } from 'factions/factionTypes'
import { tagAs } from 'factions/metatagger'
import { END_OF_GAME } from 'types/phases'

const GrandStrategies = {
  'Legendary Exploits': {
    effects: [
      {
        name: `Legendary Exploits`,
        desc: `When the battle ends, you complete this grand strategy if there are at least 3 friendly FLESH-EATER COURTS HEROES on the battlefield that each have 6 noble deeds points.`,
        when: [END_OF_GAME],
      },
    ],
  },
  'Expand the Kingdom': {
    effects: [
      {
        name: `Expand the Kingdom`,
        desc: `When the battle ends, you complete this grand strategy if a friendly ABHORRANT is wholly within enemy territory and the enemy general is not wholly within enemy territory.`,
        when: [END_OF_GAME],
      },
    ],
  },
  'Defend the Throne': {
    effects: [
      {
        name: `Defend the Throne`,
        desc: `When the battle ends, you complete this grand strategy if a friendly Charnel Throne is on the battlefield, it is garrisoned by a friendly FLESH-EATER COURTS HERO, and there are no enemy units within 6" of it.`,
        when: [END_OF_GAME],
      },
    ],
  },
} satisfies TItemDescriptions

export default tagAs(GrandStrategies, 'grand_strategy')
