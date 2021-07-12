import { tagAs } from 'factions/metatagger'
import { GenericEffects } from 'generic_rules'
import { BATTLESHOCK_PHASE, SAVES_PHASE } from 'types/phases'
import rule_sources from './rule_sources'

const Scenery = {
  Herdstone: {
    effects: [
      GenericEffects.FactionTerrainSetup,
      GenericEffects.Impassable,
      {
        name: `Entropic Lodestone`,
        desc: `After this terrain feature is set up, its range is 6". At the start of each battle round after the first, its range is increased by 6".

        Subtract 1 from save rolls for attacks that target units within range of this terrain feature. This scenery rule has no effect on save rolls for attacks that target BEASTS OF CHAOS units.`,
        when: [SAVES_PHASE],
        rule_sources: [
          rule_sources.BATTLETOME_BEASTS_OF_CHAOS,
          rule_sources.ERRATA_BEASTS_OF_CHAOS_JULY_2021,
        ],
      },
      {
        name: `Locus of Savagery`,
        desc: `Do not take battleshock tests for BEASTS OF CHAOS units wholly within range of this terrain feature (see the 'Entropic Lodestone' scenery rule).`,
        when: [BATTLESHOCK_PHASE],
        rule_sources: [
          rule_sources.BATTLETOME_BEASTS_OF_CHAOS,
          rule_sources.ERRATA_BEASTS_OF_CHAOS_JULY_2021,
        ],
      },
    ],
  },
}

export default tagAs(Scenery, 'scenery')
