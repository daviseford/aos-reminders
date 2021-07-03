import { tagAs } from 'factions/metatagger'
import { DURING_GAME, HERO_PHASE, START_OF_SETUP } from 'types/phases'
import rule_sources from './rule_sources'

const Scenery = {
  'Skull Altar': {
    effects: [
      {
        name: `Set Up`,
        desc: `After territories are determined, you can set up this faction terrain feature wholly within your territory and more than 3" from all objectives and other terrain features. If both players can set up faction terrain features at the same time, they must roll off and the winner chooses who sets up their faction terrain features first.`,
        when: [START_OF_SETUP],
        rule_sources: [rule_sources.BATTLETOME_KHORNE, rule_sources.ERRATA_KHORNE_JULY_2021],
      },
      {
        name: `Defensible`,
        desc: `This terrain feature is a defensible terrain feature that can be garrisoned by 1 HERO with a Wounds characteristic of 8 or less`,
        when: [DURING_GAME],
        rule_sources: [rule_sources.BATTLETOME_KHORNE, rule_sources.ERRATA_KHORNE_JULY_2021],
      },
      {
        name: `Words of Hate`,
        desc: `You can re-roll chanting rolls for friendly Khorne Priests wholly within 8" of this terrain feature.`,
        when: [HERO_PHASE],
        rule_sources: [rule_sources.BATTLETOME_KHORNE, rule_sources.ERRATA_KHORNE_JULY_2021],
      },
      {
        name: `Witchbane`,
        desc: `Subtract 1 from casting rolls for Wizards within 16" of this terrain feature.`,
        when: [HERO_PHASE],
        rule_sources: [rule_sources.BATTLETOME_KHORNE, rule_sources.ERRATA_KHORNE_JULY_2021],
      },
    ],
  },
}

export default tagAs(Scenery, 'scenery')
