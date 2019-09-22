import { TScenery } from 'types/army'
import { START_OF_SETUP, END_OF_MOVEMENT_PHASE, START_OF_HERO_PHASE } from 'types/phases'

const Scenery: TScenery = [
  {
    name: `Fane of Slaanesh`,
    effects: [
      {
        name: `Fane of Slaanesh`,
        desc: `After territories have been chosen, but before armies are set up, you can set up the Fane of Slaanesh wholly within your territory and more than 3" from any other terrain features and 1" away from any objectives. If both players can set up a terrain feature before territory selection, they must roll off with the winner placing first.`,
        when: [START_OF_SETUP],
      },
      {
        name: `Fane of Slaanesh`,
        desc: `If you spend depravity points to summon a unit to the battlefield, and that unit is set up wholly within 12" of this terrain feature, you receive D3 depravity points after that unit has been set up.`,
        when: [END_OF_MOVEMENT_PHASE],
      },
      {
        name: `Fane of Slaanesh`,
        desc: `You can pick 1 friendly Chaos Slaanesh Hero within 6" of this terrain feature to make a sacrifice. If you do so, that Hero suffers 1 mortal wound, and you must roll a D6. On a 1, nothing happens. On a 2+ you can re-roll hit rolls for attacks made by that Hero until your next hero phase.
           
           If the hero has an artifact of power, they can sacrifice that instead of suffering 1 mortal wound. If they do so, that artifact of power can no longer be used (if a weapon was picked when the artifact of power was selected, that weapon reverts to normal). However, on a roll of 2+, you can re-roll hit rolls for attacks made by that Hero for the rest of the battle instead of only until your next hero phase. A depleted artifact may be used for this purpose and is considered destroyed afterwards.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
]

export default Scenery
