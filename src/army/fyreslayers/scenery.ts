import { TScenery } from 'types/army'
import { END_OF_SETUP } from 'types/phases'

const Scenery: TScenery = [
  {
    name: `Magmic Battleforge`,
    effects: [
      {
        name: `Magmic Battleforge`,
        desc: `After armies are set up, but before combat begins, you can set up the Magmic Battleforge within 6" of a friendly FYRESLAYERS PRIEST wholly within your territory and more than 3" from any other terrain features and 1" from any objectives.`,
        when: [END_OF_SETUP],
      },
    ],
  },
]

export default Scenery
