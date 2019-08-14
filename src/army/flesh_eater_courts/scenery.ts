import { TScenery } from 'types/army'
import { START_OF_SETUP, HERO_PHASE, BATTLESHOCK_PHASE } from 'types/phases'

const Scenery: TScenery = [
  {
    name: `Charnel Throne`,
    effects: [
      {
        name: `Charnel Throne`,
        desc: `After territories have been chosen but before armies are set up, you can set up the CHARNEL THRONE wholly within your territory, wholly within 12" of the edge of the battlefield, and more than 1" from any objectives or other terrain features.`,
        when: [START_OF_SETUP],
      },
      {
        name: `Ruler of All He Surveys`,
        desc: `An ABHORRANT ARCHREGENT that is within 1" of this terrain feature can use the Summon Imperial Guard command ability without a command point being spent. In addition, an ABHORRANT GHOUL KING that is within 1" of this terrain feature can use the Summon Men-at-arms command ability without a command point being spent.`,
        when: [HERO_PHASE],
      },
      {
        name: `Ghoulish Landmark`,
        desc: `FLESH-EATER COURTS units treat this terrain feature as having the Inspiring scenery rule. All other units treat this terrain feature as having the Sinister scenery rule.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
]

export default Scenery
