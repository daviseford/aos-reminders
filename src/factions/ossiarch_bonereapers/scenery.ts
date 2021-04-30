import { tagAs } from 'factions/metatagger'
import { HERO_PHASE, START_OF_SETUP } from 'types/phases'

const Scenery = {
  'Bone-tithe Nexus': {
    effects: [
      {
        name: 'Bone-tithe Nexus',
        desc: `When you choose an Ossiarch Bonereapers army, you can include 1 BONE-TITHE NEXUS. When terrain is set up for a battle, any BONE-TITHE NEXUSES must be set up by the player whose army they are a part of, before any other terrain features are set up, more than 3" from any objectives and more than 6" from the edge of the battlefield. Set up the rest of the terrain as described in the core rules. If both players can set up terrain features before any other terrain features are set up, the players must roll off, and the winner chooses who sets up their terrain features first.`,
        when: [START_OF_SETUP],
      },
      {
        name: `Deadly Gaze`,
        desc: `In your hero phase, you can choose for this terrain feature to unleash one of the following punishments:

        Punishment of Agony: Pick 1 enemy unit wholly within 18" of this terrain feature and visible to it, and roll a D6. On a 4+, subtract 1 from hit rolls for attacks made by that unit until your next hero phase.

        Punishment of Death: Pick 1 enemy unit within 36" of this terrain feature and visible to it, and roll a D6. On a 2+, that unit suffers 1 mortal wound.

        Punishment of Ignorance: Pick 1 enemy unit WIZARD within 36" of this terrain feature and visible to it, and roll a D6. On a 2+, subtract 1 from casting, dispelling, and unbinding rolls for trhat unit until your next hero phase.

        Punishment of Lethargy: Pick 1 enemy unit wholly within 18" of this terrain feature and visible to it, and roll a D6. On a 4+, that unit cannot run until your next hero phase, and a D6 is used to make charge rolls for that unit instead of 2D6 until your next hero phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
}

export default tagAs(Scenery, 'scenery')
