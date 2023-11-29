import { TItemDescriptions } from 'factions/factionTypes'
import { tagAs } from 'factions/metatagger'
import { END_OF_GAME } from 'types/phases'

const GrandStrategies = {
  'Coveted Riches': {
    effects: [
      {
        name: `Coveted Riches`,
        desc: `When the battle ends, you complete this grand strategy if there are no enemy units with artefacts of power on the battlefield and there are 1 or more friendly units with artefacts of power on the battlefield.`,
        when: [END_OF_GAME],
      },
    ],
  },
  'Arch-tempter': {
    effects: [
      {
        name: `Arch-tempter`,
        desc: `When the battle ends, you complete this grand strategy if you offered a Temptation Dice to your opponent for the same enemy unit 6 or more times during the battle.`,
        when: [END_OF_GAME],
      },
    ],
  },
  'Selfish Desire': {
    effects: [
      {
        name: `Selfish Desire`,
        desc: `When the battle ends, you complete this grand strategy if you did not summon any units using the Summon Slaaneshi Daemons battle trait (pg 79) during the battle.`,
        when: [END_OF_GAME],
      },
    ],
  },
  'Glutton for Depravity': {
    effects: [
      {
        name: `Glutton for Depravity`,
        desc: `When the battle ends, you complete this grand strategy if you have 36 or more unspent depravity points.`,
        when: [END_OF_GAME],
      },
    ],
  },
} satisfies TItemDescriptions

export default tagAs(GrandStrategies, 'grand_strategy')
