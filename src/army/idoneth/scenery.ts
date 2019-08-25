import { TScenery } from 'types/army'
import { START_OF_SETUP, DURING_GAME, START_OF_HERO_PHASE } from 'types/phases'

// In anticipation of GW adding more Etheric Vortex scenery
// I've broken these rules out separately
const EthericVortexEffects = [
  {
    name: `Guardians of the Deep`,
    desc: `Roll a D6 each time a wound or mortal wound is allocated to an IDONETH DEEPKIN unit wholly within 6" of an Etheric Vortex. On a 6+ the wound is negated.`,
    when: [DURING_GAME],
  },
  {
    name: `Predators of the Ethersea`,
    desc: `At the start of your hero phase, roll a D6 for each unit within 3" of an Etheric Vortex. Do not roll for IDONETH DEEPKIN units. On a 4+ the unit suffers 1 mortal wound. On a 6+ the unit suffers D3 mortal wounds instead.`,
    when: [START_OF_HERO_PHASE],
  },
]

const Scenery: TScenery = [
  {
    name: `Gloomtide Shipwreck`,
    effects: [
      {
        name: `Gloomtide Shipwreck`,
        desc: `After all other terrain features are set up, but before players choose territories or set up their armies, you can set up a maximum of two Etheric Vortex terrain features anywhere on the battlefield so that each is more than 1" from any other terrain features.`,
        when: [START_OF_SETUP],
      },
      ...EthericVortexEffects,
    ],
  },
]

export default Scenery
