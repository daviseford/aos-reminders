import { tagAs } from 'factions/metatagger'
import { HERO_PHASE, START_OF_SETUP } from 'types/phases'
import rule_sources from './rule_sources'

const Scenery = {
  'Bone-tithe Nexus': {
    effects: [
      {
        name: 'Setup',
        desc: `After territories are determined, you can set up this faction terrain feature wholly within your territory and more than 3" from all objectives and other terrain features. If these restrictions mean you cannot set up this faction terrain feature, you can remove 1 terrain feature that is wholly or partially within your territory and attempt to set up this faction terrain feature again. If it is still impossible to set up this faction terrain feature, then it is not used. If both players can set up faction terrain features at the same time, they must roll off and the winner chooses who sets up their faction terrain features first.`,
        when: [START_OF_SETUP],
        rule_sources: [
          rule_sources.BATTLETOME_OSSIARCH_BONEREAPERS,
          rule_sources.ERRATA_OSSIARCH_BONEREAPERS_JULY_2021,
        ],
      },
      {
        name: `Deadly Gaze`,
        desc: `In your hero phase, you can choose for this terrain feature to unleash one of the following punishments:

        Punishment of Agony: Pick 1 enemy unit wholly within 18" of this terrain feature and visible to it, and roll a dice. On a 4+, subtract 1 from hit rolls for attacks made by that unit until your next hero phase.

        Punishment of Death: Pick 1 enemy unit within 36" of this terrain feature and visible to it, and roll a dice. On a 2+, that unit suffers 1 mortal wound.

        Punishment of Ignorance: Pick 1 enemy WIZARD within 36" of this terrain feature and visible to it, and roll a dice. On a 2+, subtract 1 from casting, dispelling and unbinding rolls for that unit until your next hero phase.

        Punishment of Lethargy: Pick 1 enemy unit wholly within 18" of this terrain feature and visible to it, and roll a dice. On a 4+, that unit cannot run until your next hero phase, and a D6 is used to make charge rolls for that unit instead of 2D6 until your next hero phase. `,
        when: [HERO_PHASE],
        rule_sources: [
          rule_sources.BATTLETOME_OSSIARCH_BONEREAPERS,
          rule_sources.ERRATA_OSSIARCH_BONEREAPERS_JULY_2021,
        ],
      },
    ],
  },
}

export default tagAs(Scenery, 'scenery')
