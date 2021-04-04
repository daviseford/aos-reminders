import { tagAs } from 'factions/metatagger'
import { SceneryEffectLookup } from 'generic_rules/scenery'
import {
  COMBAT_PHASE,
  END_OF_MOVEMENT_PHASE,
  SHOOTING_PHASE,
  START_OF_HERO_PHASE,
  START_OF_SETUP,
} from 'types/phases'
import { OBSTACLE } from 'types/terrain'

const Scenery = {
  'Fane of Slaanesh': {
    effects: [
      ...SceneryEffectLookup[OBSTACLE],
      {
        name: `Fane of Slaanesh`,
        desc: `After territories have been chosen, but before armies are set up, you can set up the Fane of Slaanesh wholly within your territory and more than 3" from any other terrain features or objectives. If both players can set up a terrain feature before territory selection, they must roll off with the winner placing first.`,
        when: [START_OF_SETUP],
      },
      {
        name: `Power of Slaanesh`,
        desc: `If you spend depravity points to summon a unit to the battlefield, that unit can be set up wholly within 12" of this terrain feature more than 9" from enemy units.`,
        when: [END_OF_MOVEMENT_PHASE],
      },
      {
        name: `Damned Conduit`,
        desc: `You can pick 1 friendly Slaanesh hero within 6" of this terrain feature to make a sacrifice. If you do so, that hero suffers 1 mortal wound, and you must roll a D6. On a 2+ add 1 to hit rolls for attacks made by that hero until your next hero phase.

           If the hero has an artifact of power (depleted or otherwise), they can sacrifice that instead of suffering 1 mortal wound. The artifact may no longer be used (weapons revert to normal), and a successful 2+ roll on the D6 results in adding 1 to hit rolls for the rest of the battle.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Damned Conduit`,
        desc: `If active, the buffed hero adds 1 to its hit rolls.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },
}

export default tagAs(Scenery, 'scenery')
