import { tagAs } from 'factions/metatagger'
import { END_OF_GAME } from 'types/phases'

const GrandStrategies = {
  'In and Out, Ladz': {
    effects: [
      {
        name: `In and Out, Ladz`,
        desc: `You can pick this grand strategy only if the model picked to be your general has the KRULEBOYZ keyword. When the battle ends, you complete this strategy if that general has not been slain and fewer than half of the units in your starting army have been destroyed.`,
        when: [END_OF_GAME],
      },
    ],
  },
  "Show 'Em Who's Boss!": {
    effects: [
      {
        name: `Show 'Em Who's Boss!`,
        desc: `You can pick this grand strategy only if the model picked to be your general has the IRONJAWZ keyword. When the battle ends, you complete this strategy if 2 or more enemy HEROES were slain by attacks made by that general, and your general has not been slain.`,
        when: [END_OF_GAME],
      },
    ],
  },
  'Get Dem Bones!': {
    effects: [
      {
        name: `Get Dem Bones!`,
        desc: `You can pick this grand strategy only if the model picked to be your general has the BONESPLITTERZ keyword. After deployment, pick 1 terrain feature wholly within enemy territory. When the battle ends, you complete this strategy if you control that terrain feature.`,
        when: [END_OF_GAME],
      },
    ],
  },
  'Waaagh!': {
    effects: [
      {
        name: `Waaagh!`,
        desc: `When the battle ends, you complete this strategy if the model picked to be your general or a friendly Battleline unit is wholly within enemy territory.`,
        when: [END_OF_GAME],
      },
    ],
  },
  "Krump 'Em All!": {
    effects: [
      {
        name: `Krump 'Em All!`,
        desc: `You can only pick this grand strategy if your army includes KRAGNOS, GOBSPRAKK or GORDRAKK. When the battle ends, you complete this strategy if there are fewer than 3 enemy units on the battlefield.`,
        when: [END_OF_GAME],
      },
    ],
  },
}

export default tagAs(GrandStrategies, 'grand_strategy')
