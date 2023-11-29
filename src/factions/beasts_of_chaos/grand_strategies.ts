import { TItemDescriptions } from 'factions/factionTypes'
import { tagAs } from 'factions/metatagger'
import { END_OF_GAME } from 'types/phases'

const GrandStrategies = {
  'Protect the Herdstone': {
    effects: [
      {
        name: `Protect the Herdstone`,
        desc: `You complete this grand strategy if there are no enemy units within 9" of your Herdstone and vour Herdstone was not affected by a rule that said you could not use the scenery rules on its warscroll during the battle.`,
        when: [END_OF_GAME],
      },
    ],
  },
  'Desecrating Brayherd': {
    effects: [
      {
        name: `Desecrating Brayherd`,
        desc: `You complete this grand strategy if you control 2 or more objectives and those objectives are contested by any friendly BRAYHERD units.`,
        when: [END_OF_GAME],
      },
    ],
  },
  'Flanking Warherd': {
    effects: [
      {
        name: `Flanking Warherd`,
        desc: `You complete this grand strategy if there are 2 or more friendly WARHERD units on the battlefield wholly within 9" of the battlefield edge.`,
        when: [END_OF_GAME],
      },
    ],
  },
  'Age of the Beast': {
    effects: [
      {
        name: `Age of the Beast`,
        desc: `You complete this grand strategy if 2 or more friendly CYGORS or GHORGONS are on the battlefield and none of those units have a number of wounds allocated to them that exceeds half of their Wounds characteristic.`,
        when: [END_OF_GAME],
      },
    ],
  },
} satisfies TItemDescriptions

export default tagAs(GrandStrategies, 'grand_strategy')
