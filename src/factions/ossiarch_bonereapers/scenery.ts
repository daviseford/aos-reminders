import { tagAs } from 'factions/metatagger'
import { GenericEffects } from 'generic_rules'
import { HERO_PHASE } from 'types/phases'
import rule_sources from './rule_sources'

const Scenery = {
  'Bone-tithe Nexus': {
    effects: [
      GenericEffects.FactionTerrainSetup_Removable,
      {
        name: `Deadly Gaze`,
        desc: `In your hero phase, you can choose for this terrain feature to unleash one of the following punishments:

        Punishment of Agony: Pick 1 enemy unit wholly within 18" of this terrain feature and visible to it, and roll a dice. On a 4+, subtract 1 from hit rolls for attacks made by that unit until your next hero phase.

        Punishment of Death: Pick 1 enemy unit within 36" of this terrain feature and visible to it, and roll a dice. On a 2+, that unit suffers 1 mortal wound.

        Punishment of Ignorance: Pick 1 enemy WIZARD within 36" of this terrain feature and visible to it, and roll a dice. On a 2+, subtract 1 from casting, dispelling and unbinding rolls for that unit until your next hero phase.

        Punishment of Lethargy: Pick 1 enemy unit wholly within 18" of this terrain feature and visible to it, and roll a dice. On a 4+, that unit cannot run until your next hero phase, and a D6 is used to make charge rolls for that unit instead of 2D6 until your next hero phase. `,
        when: [HERO_PHASE],
        rule_sources: [rule_sources.BATTLETOME_OSSIARCH_BONEREAPERS, rule_sources.ERRATA_JULY_2021],
      },
    ],
  },
}

export default tagAs(Scenery, 'scenery')
