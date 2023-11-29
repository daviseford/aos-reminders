import { TItemDescriptions } from 'factions/factionTypes'
import { tagAs } from 'factions/metatagger'
import { END_OF_GAME } from 'types/phases'

const GrandStrategies = {
  'Corrupt Arcane Nexus': {
    effects: [
      {
        name: `Corrupt Arcane Nexus`,
        desc: `You complete this grand strategy if a MAGGOTKIN OF NURGLE WIZARD is within 3" of the centre of the battlefield and no enemy units are within 6" of the centre of the battlefield.`,
        when: [END_OF_GAME],
      },
    ],
  },
  'Tend the Garden': {
    effects: [
      {
        name: `Tend the Garden`,
        desc: `When the battle ends, you complete this grand strategy if there are no enemy units within 3" of any Feculent Gnarlmaws in your army and there is a Feculent Gnarlmaw in your army wholly within your opponent's territory.`,
        when: [END_OF_GAME],
      },
    ],
  },
  'Spread Rampant Disease': {
    effects: [
      {
        name: `Spread Rampant Disease`,
        desc: `When the battle ends, you complete this grand strategy if every enemy unit on the battlefield has at least 1 disease point.`,
        when: [END_OF_GAME],
      },
    ],
  },
  'Blessed Desecration': {
    effects: [
      {
        name: `Blessed Desecration`,
        desc: `You can pick this grand strategy only if the model picked to be your general has the MORTAL keyword. If you do so, after deployment, pick 1 terrain feature that is wholly within enemy territory. If no terrain features are wholly within enemy territory, you can pick any terrain feature. When the battle ends, you complete this grand strategy if you control that terrain feature.`,
        when: [END_OF_GAME],
      },
    ],
  },
} satisfies TItemDescriptions

export default tagAs(GrandStrategies, 'grand_strategy')
