import { tagAs } from 'factions/metatagger'
import { START_OF_HERO_PHASE, START_OF_SETUP, WOUND_ALLOCATION_PHASE } from 'types/phases'

const Scenery = {
  'Gloomtide Shipwreck': {
    effects: [
      {
        name: `Gloomtide Shipwreck`,
        desc: `After territories have been chosen but before armies are set up, you can set up the Gloomtide Shipwrecks anywhere on the battlefield, more than 1" from any other terrain features, more than 6" from any other Gloomtide Shipwrecks, and more than 6" from where any objectives will be located at the start of the first battle round. If both players can set up a terrain feature before armies are set up, they must roll off, and the winner can choose the order in which the terrain features are set up.`,
        when: [START_OF_SETUP],
      },
      {
        name: `Guardians of the Deep`,
        desc: `Roll a D6 each time a wound or mortal wound is allocated to an IDONETH DEEPKIN unit wholly within 6" of an Etheric Vortex. On a 6+ the wound is negated.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
      {
        name: `Predators of the Ethersea`,
        desc: `At the start of your hero phase, roll a D6 for each unit within 3" of an Etheric Vortex. Do not roll for IDONETH DEEPKIN units. On a 4+ the unit suffers 1 mortal wound. On a 6+ the unit suffers D3 mortal wounds instead.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
}

export default tagAs(Scenery, 'scenery')
