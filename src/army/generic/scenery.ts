import { TScenery } from 'types/army'
import {
  DURING_GAME,
  START_OF_SETUP,
  START_OF_HERO_PHASE,
  START_OF_ROUND,
  TURN_ONE_START_OF_ROUND,
} from 'types/phases'

// Generic scenery available to all armies or potentially a part of each battle.
const Scenery: TScenery = [
  {
    name: `Penumbral Engine`,
    effects: [
      {
        name: `Penumbral Engine`,
        desc: `After territories have been chosen, but before armies have been set up, you can set up this model wholly within your territory.  It must be more than 12" from enemy territory, at least 3" away from other terrain features, and at least 1" away from any objectives.  If both players can place a terrain features at this time, roll off to see who places first.`,
        when: [START_OF_SETUP],
      },
      {
        name: `Repercussions of the Necroquake`,
        desc: `After determining who has the first turn, roll a dice to determine the function of this model for the duration of the battle:                 
               
               1-3: Orrery of Obfuscation.
               4-6: Orrery of Illumination`,
        when: [TURN_ONE_START_OF_ROUND],
      },
      {
        name: `Orrery of Obfuscation`,
        desc: `Re-roll save rolls of 1 for units wholly within 12" any Penumbral terrain features.`,
        when: [DURING_GAME],
      },
      {
        name: `Orrery of Illumination`,
        desc: `At the start of your hero phase, you receive 1 extra command point if any friendly Heroes are within 12" of any Penumbral terrain features.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Deteriorating State`,
        desc: `Applies from start of Round 2 onwards.  Roll a dice.  On a 1-4 nothing happens.  On a 5-6, the currently active Orrey function switches to the other option.`,
        when: [START_OF_ROUND],
      },
    ],
  },
]

export default Scenery
