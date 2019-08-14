import { TScenery } from 'types/army'
import { START_OF_SETUP } from 'types/phases'

const Scenery: TScenery = [
  {
    name: `Etheric Vortex`,
    effects: [
      {
        name: `Etheric Vortex`,
        desc: `After all other terrain features are set up, but before players choose territories or set up their armies, you can set up a maximum of two Etheric Vortex terrain features anywhere on the battlefield so that each is more than 1" from any other terrain features.`,
        when: [START_OF_SETUP],
      },
    ],
  },
]

export default Scenery
