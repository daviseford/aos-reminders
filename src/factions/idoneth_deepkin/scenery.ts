import { tagAs } from 'factions/metatagger'
import { DURING_GAME, START_OF_SETUP, WARDS_PHASE } from 'types/phases'
import rule_sources from './rule_sources'

const Scenery = {
  'Gloomtide Shipwreck': {
    effects: [
      {
        name: `Set-Up`,
        desc: `After territories are determined, you can set up this faction terrain feature wholly within your territory and more than 3" from all objectives and other terrain features. If both players can set up faction terrain features at the same time, they must roll off and the winner chooses who sets up their faction terrain features first.

        This faction terrain feature consists of 2 scenery pieces. When you set it up, you can set up the 2 scenery pieces touching, or you can set them up more than 3" from each other. If you set them up touching, they form 1 large Gloomtide Shipwreck. If you set them up more than 3" from each other, they form 2 small Gloomtide Shipwrecks that are separate faction terrain features.`,
        when: [START_OF_SETUP],
      },
      {
        name: `Defensible`,
        desc: `If this terrain feature was set up as a small Gloomtide Shipwreck, it is a defensible terrain feature that can be garrisoned by up to 5 Idoneth Deepkin models with a Wounds characteristic of 5 or less that do not have mounts (with the exception of companions).
        
        If this terrain feature was set up as a large Gloomtide Shipwreck, it is a defensible terrain feature that can be garrisoned by up to 10 Idoneth Deepkin models with a Wounds characteristic of 5 or less that do not have mounts (with the exception of companions).`,
        when: [DURING_GAME],
        rule_sources: [rule_sources.BATTLETOME_IDONETH_DEEPKIN, rule_sources.ERRATA_JANUARY_2023],
      },
      {
        name: `Guardians of the Deep`,
        desc: `IDONETH DEEPKIN units that do not have a mount have a ward of 5+ while they are wholly within 6" of this terrain feature. If a unit that does not have the IDONETH DEEPKIN keyword is within 3" of this terrain feature, this ability has no effect.`,
        when: [WARDS_PHASE],
      },
    ],
  },
}

export default tagAs(Scenery, 'scenery')
