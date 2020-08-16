import { TScenery } from 'types/army'
import { START_OF_SETUP, DURING_GAME, HERO_PHASE } from 'types/phases'

const Scenery: TScenery = [
  {
    name: `Realmshaper Engine`,
    effects: [
      {
        name: `Realmshaper Engine`,
        desc: `When you choose a Seraphon army, you can include 1 REAlMSHAPER ENGINE terrain feature. When terrain is set up for the battle, any REAlMSHAPER ENGINE terrain features must be set up by the player whose army they are a part of, before any other terrain features are set up, more than 6" from any objectives and more than 6" from the edge of the battlefield. Set up the rest of the terrain as described in the core rules. If both players can set up terrain features before other terrain features are set up, the players must roll off and the winner chooses who sets up their terrain first.`,
        when: [START_OF_SETUP],
      },
      {
        name: `Realmshaper Engine`,
        desc: `A Realmshaper Engine can be garrisoned. The models making up the garrison of a Realmshaper Engine must have a combined Wounds characteristic of 20 or less (if this would preclude all of the models in a unit from garrisoning the Realmshaper Engine, then the unit cannot garrison the Realmshaper Engine).`,
        when: [DURING_GAME],
      },
      {
        name: `Power Unleashed`,
        desc: `In your hero phase, if this model is garrisoned by a friendly SERAPHON WIZARD or friendly SERAPHON PRIEST, you can pick 1 terrain feature anywhere on the battlefield and roll a D6 for each enemy unit within 3" of that terrain feature. Add 2 to the roll if that terrain feature is within 18" of this model, and subtract 2 from the roll if that terrain feature is more than 36" from this model. On a 4+, that enemy unit suffers D3 mortal wounds.`,
        when: [HERO_PHASE],
      },
    ],
  },
]

export default Scenery
