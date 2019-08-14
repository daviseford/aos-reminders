import { TScenery } from 'types/army'
import { START_OF_SETUP } from 'types/phases'

const Scenery: TScenery = [
  {
    name: `Wyldwood Groves`,
    effects: [
      {
        name: `Wyldwood Groves`,
        desc: `After all other pieces of scenery are set up, but before the battle begins and players choose territory or set up their armies, you can place one Sylvaneth Wyldwood anywhere on the battlefield that is more than 1" from any other piece of scenery.`,
        when: [START_OF_SETUP],
      },
    ],
  },
]

export default Scenery
