import { tagAs } from 'factions/metatagger'
import { END_OF_GAME } from 'types/phases'

const GrandStrategies = {
  'Dominate Arcane Nexus': {
    effects: [
      {
        name: `Dominate Arcane Nexus`,
        desc: `When the battle ends, you complete this grand strategy if there is at least 1 friendly Disciples of Tzeentch Wizard, Horrors of Tzeentch unit or Kairic Acolyte unit wholly within each large quarter of the battlefield.`,
        when: [END_OF_GAME],
      },
    ],
  },
  'Master of Destiny': {
    effects: [
      {
        name: `Master of Destiny`,
        desc: `When the battle ends, add the rolls of any Destiny Dice that you have not used. You complete this grand strategy if the total is 9 or more.`,
        when: [END_OF_GAME],
      },
    ],
  },
  'Preponderance of Fate': {
    effects: [
      {
        name: `Preponderance of Fate`,
        desc: `When the battle ends, you complete this grand strategy if you have more than 27 unspent Fate Points.`,
        when: [END_OF_GAME],
      },
    ],
  },
  'Realm of Magic': {
    effects: [
      {
        name: `Realm of Magic`,
        desc: `When the battle ends, you complete this grand strategy if there are two or more endless spells on the battlefield that are under your control.`,
        when: [END_OF_GAME],
      },
    ],
  },
}

export default tagAs(GrandStrategies, 'grand_strategy')
