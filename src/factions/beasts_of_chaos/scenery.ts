import { tagAs } from 'factions/metatagger'
import { BATTLESHOCK_PHASE, DURING_GAME, SAVES_PHASE, START_OF_SETUP } from 'types/phases'
import rule_sources from './rule_sources'

const Scenery = {
  Herdstone: {
    effects: [
      {
        name: `Set up Herdstone`,
        desc: `After territories are determined, you can set up this faction terrain feature wholly within your territory and more than 3" from all objectives and other terrain features. If both players can set up faction terrain features at the same time, they must roll off and the winner chooses who sets up their faction terrain features first.`,
        when: [START_OF_SETUP],
        rule_sources: [
          rule_sources.BATTLETOME_BEASTS_OF_CHAOS,
          rule_sources.ERRATA_BEASTS_OF_CHAOS_JULY_2021,
        ],
      },
      {
        name: `Impassable`,
        desc: `You cannot move a model over this terrain feature unless it can fly, and you cannot move a model onto this terrain feature or set up a model on this terrain feature (even if it can fly).`,
        when: [DURING_GAME],
        rule_sources: [
          rule_sources.BATTLETOME_BEASTS_OF_CHAOS,
          rule_sources.ERRATA_BEASTS_OF_CHAOS_JULY_2021,
        ],
      },
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
