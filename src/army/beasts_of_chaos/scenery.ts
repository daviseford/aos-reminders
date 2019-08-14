import { START_OF_SETUP, DURING_GAME, BATTLESHOCK_PHASE } from 'types/phases'
import { TScenery } from 'types/army'

const Scenery: TScenery = [
  {
    name: `Herdstone`,
    effects: [
      {
        name: `Herdstone`,
        desc: `After territories have been chosen but before players begin to set up their armies, you can set up one HERDSTONE wholly within your territory, more than 12" from enemy territory and more than 1" from any other terrain features. If both players can set up a terrain feature in this manner, each player rolls a dice, rolling again in the case of a tie, and whoever rolls higher can choose the order in which the terrain features are set up.`,
        when: [START_OF_SETUP],
      },
      {
        name: `Entropic Lodestone`,
        desc: `Subtract 1 from save rolls for attacks that target units within 6" of this terrain feature. At the start of each battle round after the first, add 6" to the range of this ability. BEASTS OF CHAOS units are not affected by this ability.`,
        when: [DURING_GAME],
      },
      {
        name: `Locus of Savagery`,
        desc: `BEASTS OF CHAOS units wholly within 6" of this terrain feature do not take battleshock tests. At the start of each battle round after the first, add 6" to the range of this ability.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
]

export default Scenery
