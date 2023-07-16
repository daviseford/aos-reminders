import { tagAs } from 'factions/metatagger'
import { END_OF_GAME } from 'types/phases'

const GrandStrategies = {
  'Lust for Domination': {
    effects: [
      {
        name: `Lust for Domination`,
        desc: `When the battle ends, you complete this grand strategy if you control more gravesites than your opponent. Control of gravesites is determined in the same way as control of objectives. However, unlike objectives, gravesites do not remain under your control if there are no longer any friendly models contesting them.`,
        when: [END_OF_GAME],
      },
    ],
  },
  'Empire of Corpses': {
    effects: [
      {
        name: `Empire of Corpses`,
        desc: `When the battle ends, you complete this grand strategy if you replaced 3 or more friendly SUMMONABLE units that were destroyed during the battle.`,
        when: [END_OF_GAME],
      },
    ],
  },
  'The Danse Macabre': {
    effects: [
      {
        name: `The Danse Macabre`,
        desc: `When the battle ends, you complete this grand strategy if there are more friendly SUMMONABLE units than enemy units wholly within enemy territory.`,
        when: [END_OF_GAME],
      },
    ],
  },
  'Crimson Larder': {
    effects: [
      {
        name: `Crimson Larder`,
        desc: `When the battle ends, you complete this grand strategy if there are no HEROES from your opponent's starting army on the battlefield and the only friendly HEROES on the battlefield are VAMPIRES.`,
        when: [END_OF_GAME],
      },
    ],
  },
}

export default tagAs(GrandStrategies, 'grand_strategy')
