import { TItemDescriptions } from 'factions/factionTypes'
import { tagAs } from 'factions/metatagger'
import { END_OF_GAME } from 'types/phases'

const GrandStrategies = {
  'Dominating Presence': {
    effects: [
      {
        name: `Dominating Presence`,
        desc: `When the battle ends, you complete this grand strategy if there is at least 1 friendly SLAVES TO DARKNESS unit wholly within each large quarter of the battlefield.`,
        when: [END_OF_GAME],
      },
    ],
  },
  'Follow the Path to Glory': {
    effects: [
      {
        name: `Follow the Path to Glory`,
        desc: `When the battle ends, you complete this grand strategy if you rolled the Dark Apotheosis (11+) result on the Eye of the Gods table one or more times during the battle.`,
        when: [END_OF_GAME],
      },
    ],
  },
  'Bring Ruin to the Realms': {
    effects: [
      {
        name: `Bring Ruin to the Realms`,
        desc: `When the battle ends, you complete this grand strategy if you completed at least 4 battle tactics and every battle tactic you completed this battle was from the Glory of Chaos battle tactics.`,
        when: [END_OF_GAME],
      },
    ],
  },
  'Masters of Dark Ritual': {
    effects: [
      {
        name: `Masters of Dark Ritual`,
        desc: `When the battle ends, you complete this grand strategy if there are any SLAVES TO DARKNESS endless spells on the battlefield that you set up.`,
        when: [END_OF_GAME],
      },
    ],
  },
} satisfies TItemDescriptions

export default tagAs(GrandStrategies, 'grand_strategy')
