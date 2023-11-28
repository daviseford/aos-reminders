import { tagAs } from 'factions/metatagger'
import meta_rule_sources from 'meta/rule_sources'
import { END_OF_GAME } from 'types/phases'

const GrandStrategies = {
  'Rule the Skies': {
    effects: [
      {
        name: `Rule the Skies`,
        desc: `When the battle ends, you complete this grand strategy if there are 1 or more friendly SKYVESSELS on the battlefield and there are no enemy Behemoths that can fly on the battlefield.`,
        when: [END_OF_GAME],
      },
    ],
  },
  'Defend the Flagship': {
    effects: [
      {
        name: `Defend the Flagship`,
        desc: `You can pick this grand strategy only if the model picked to be your general is an ARKANAUT ADMIRAL. When the battle ends, you complete this grand strategy if that general has not been slain and the SKYVESSEL picked to be their flagship has not been destroyed.`,
        when: [END_OF_GAME],
      },
    ],
  },
  'Prospector Fleet': {
    effects: [
      {
        name: `Prospector Fleet`,
        desc: `After deployment, your opponent must pick 1 terrain feature to hold a bounty of mineral wealth. When the battle ends, you complete this grand strategy if you control that terrain feature.`,
        when: [END_OF_GAME],
      },
    ],
  },
  'Guided by the Code': {
    effects: [
      {
        name: `Guided by the Code`,
        desc: `When the battle ends, you complete this grand strategy if you completed at least 4 battle tactics and every battle tactic you completed this battle was a Kharadron Overlords specific battle tactic.`,
        when: [END_OF_GAME],
      },
    ],
  },
  'Acceptable Profit Margin': {
    effects: [
      {
        name: `Acceptable Profit Margin`,
        desc: `When the battle ends, you complete this grand strategy if there is at least 1 friendly GRUNDSTOK THUNDERERS unit and at least 1 friendly GRUNDSTOK GUNHAULER on the battlefield.`,
        when: [END_OF_GAME],
        rule_sources: [meta_rule_sources.BOOK_DAWNBRINGERS_BOOK_2],
      },
    ],
  },
}

export default tagAs(GrandStrategies, 'grand_strategy')
