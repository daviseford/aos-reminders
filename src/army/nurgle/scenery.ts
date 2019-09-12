import { TScenery } from 'types/army'
import { START_OF_SETUP, CHARGE_PHASE, START_OF_HERO_PHASE } from 'types/phases'

const Scenery: TScenery = [
  {
    name: `Feculent Gnarlmaw`,
    effects: [
      {
        name: `The Garden of Nurgle`,
        desc: `After all terrain features have been setup, but before you choose a territory or set up your army, you can set up one Feculent Gnarlmaw anywhere on the battlefield that is more than 3" away from other terrain features and 1" away from any objectives. If both players can set up a terrain feature before territory selection, they must roll off with the winner placing first.`,
        when: [START_OF_SETUP],
      },
      {
        name: `Feculent Gnarlmaw`,
        desc: `Nurgle units that are within 7" of any Feculent Gnarlmaws can attempt to charge even if they ran in the same turn.`,
        when: [CHARGE_PHASE],
      },
      {
        name: `Feculent Gnarlmaw`,
        desc: `Roll a D6 for each unit within 3" of any Feculent Gnarlmaws. On a 4+ the unit suffers 1 mortal wound. Units with the Nurgle keyword are are unaffected by this ability.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
]

export default Scenery
