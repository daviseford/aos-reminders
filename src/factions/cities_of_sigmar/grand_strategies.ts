import { TItemDescriptions } from 'factions/factionTypes'
import { tagAs } from 'factions/metatagger'
import { END_OF_GAME } from 'types/phases'

const GrandStrategies = {
  'Exemplar of the Acadamae Martial': {
    effects: [
      {
        name: `Exemplar of the Acadamae Martial`,
        desc: `When the battle ends, you complete this grand strategy if you completed at least 4 battle tactics and every battle tactic you completed this battle was from the 'For Honour and Glory' list below.`,
        when: [END_OF_GAME],
      },
    ],
  },
  'Reclaim for Sigmar!': {
    effects: [
      {
        name: `Reclaim for Sigmar!`,
        desc: `When the battle ends, you complete this grand strategy if there is at least 1 friendly CITIES OF SIGMAR unit wholly within each large quarter of the battlefield.`,
        when: [END_OF_GAME],
      },
    ],
  },
  'Hold the High Ground': {
    effects: [
      {
        name: `Hold the High Ground`,
        desc: `When the battle ends, you complete this grand strategy if there are any friendly units within 12" of the centre of the battlefield and no enemy units within 12" of the centre of the battlefield.`,
        when: [END_OF_GAME],
      },
    ],
  },
  'Banners Held High': {
    effects: [
      {
        name: `Banners Held High`,
        desc: `When the battle ends, each player totals the number of Standard Bearers and units with the TOTEM keyword in their army that are on the battlefield. If your total is higher, you complete this grand strategy.`,
        when: [END_OF_GAME],
      },
    ],
  },
} satisfies TItemDescriptions

export default tagAs(GrandStrategies, 'grand_strategy')
