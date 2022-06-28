import { tagAs } from 'factions/metatagger'
import { END_OF_GAME } from 'types/phases'

const GrandStrategies = {
  'Shapers of Beast-flesh': {
    effects: [
      {
        name: `Shapers of Beast-flesh`,
        desc: `When the battle ends, you complete this grand strategy if there are 3 or more friendly MASTERCLAN or ClANS MOULDER HEROES from your starting army on the battlefield.`,
        when: [END_OF_GAME],
      },
    ],
  },
  'Masters of Execution': {
    effects: [
      {
        name: `Masters of Execution`,
        desc: `When the battle ends, you complete this grand strategy if there are 3 or more friendly MASTERCLAN or ClANS ESHIN HEROES from your starting army on the battlefield.`,
        when: [END_OF_GAME],
      },
    ],
  },
  Clawmasters: {
    effects: [
      {
        name: `Clawmasters`,
        desc: `When the battle ends, you complete this grand strategy if there are 3 or more friendly MASTERCLAN or ClANS VERMINUS HEROES from your starting army on the battlefield.`,
        when: [END_OF_GAME],
      },
    ],
  },
  'Warpstone Weaponmasters': {
    effects: [
      {
        name: `Warpstone Weaponmasters`,
        desc: `When the battle ends, you complete this grand strategy if there are 3 or more friendly MASTERCLAN or ClANS SKRYRE HEROES from your starting army on the battlefield.`,
        when: [END_OF_GAME],
      },
    ],
  },
  'Arch-corruptors of the Mortal Realms': {
    effects: [
      {
        name: `Arch-corruptors of the Mortal Realms`,
        desc: `When the battle ends, you complete this grand strategy if there are 3 or more friendly MASTERCLAN or ClANS PESTILENS HEROES from your starting army on the battlefield.`,
        when: [END_OF_GAME],
      },
    ],
  },
}

export default tagAs(GrandStrategies, 'grand_strategy')
