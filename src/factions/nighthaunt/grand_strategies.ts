import { tagAs } from 'factions/metatagger'
import meta_rule_sources from 'meta/rule_sources'
import { END_OF_GAME, END_OF_SETUP } from 'types/phases'

const GrandStrategies = {
  'A Soul to Claim': {
    effects: [
      {
        name: `A Soul to Claim`,
        desc: `After deployment but before the first battle round begins, the enemy unit with the highest Wounds characteristic is marked as 'the target'. If more than 1 unit has the highest Wounds characteristic, you can choose which of those units will be 'the target'. When the battle ends, you complete this grand strategy if the target was destroyed by attacks made by a friendly SUMMONABLE unit.`,
        when: [END_OF_SETUP],
      },
      {
        name: `A Soul to Claim`,
        desc: `When the battle ends, you complete this grand strategy if the target was destroyed by attacks made by a friendly SUMMONABLE unit.`,
        when: [END_OF_GAME],
      },
    ],
  },
  'Fright or Flight': {
    effects: [
      {
        name: `Fright or Flight`,
        desc: `When the battle ends, you complete this grand strategy if 1 or more objectives are being contesting by friendly Nighthaunt units and there are no enemy units within 6" of any friendly Nighthaunt units that are contesting an objective.`,
        when: [END_OF_GAME],
        rule_sources: [meta_rule_sources.BATTLESCROLL_ANDTOR_SEPTEMBER_2023],
      },
    ],
  },
  'Feed on Terror': {
    effects: [
      {
        name: `Feed on Terror`,
        desc: `When the battle ends, you complete this grand strategy if 1 or more enemy units on the battlefield are terrified.

        Designer's Note: You cannot complete this grand strategy if all of the units in your opponent's army have been destroyed.`,
        when: [END_OF_GAME],
      },
    ],
  },
  'Dismantle the Brave': {
    effects: [
      {
        name: `Dismantle the Brave`,
        desc: `After deployment but before the first battle round begins, the enemy unit with the highest Bravery characteristic is marked as 'the target'. If more than 1 unit has the highest Bravery characteristic, you can choose which of those units will be 'the target'. When the battle ends, you complete this grand strategy if the target has slain and the model chosen to be your general not been slain.`,
        when: [END_OF_SETUP],
      },
      {
        name: `Dismantle the Brave`,
        desc: `When the battle ends, you complete this grand strategy if the target has slain and the model chosen to be your general not been slain.`,
        when: [END_OF_GAME],
      },
    ],
  },
}

export default tagAs(GrandStrategies, 'grand_strategy')
