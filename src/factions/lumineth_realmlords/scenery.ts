import { tagAs } from 'factions/metatagger'
import { DURING_GAME, DURING_TURN, HERO_PHASE } from 'types/phases'
import rule_sources from './rule_sources'

const Scenery = {
  'Shrine Luminor': {
    effects: [
      {
        name: `Set Up`,
        desc: `After territories are determined, you can set up this faction terrain feature wholly within your territory and more than 3" from all objectives and other terrain features. If both players can set up faction terrain features at the same time, they must roll off and the winner chooses who sets up their faction terrain features first.`,
        when: [DURING_TURN],
        rule_sources: [rule_sources.BATTLETOME_LUMINETH, rule_sources.ERRATA_LUMINETH_JULY_2021],
      },
      {
        name: `Defensible`,
        desc: `This terrain feature is a defensible terrain feature that can be garrisoned by 1 LUMINETH REALM-LORDS HERO that is not a MONSTER and does not have a mount. The garrison is referred to as the terrain feature's 'Shrine Guardian' in the rules on this warscroll.`,
        when: [DURING_GAME],
        rule_sources: [rule_sources.ERRATA_LUMINETH_JULY_2021],
      },
      {
        name: `Cleansing Rituals`,
        desc: `Once per turn, you can reroll 1 casting, dispelling or unbinding roll for 1 friendly LUMINETH REALM-LORDS HERO that is within 12" of this terrain feature. If this terrain feature has a Shrine Guardian, the range of this ability is 24" instead.`,
        when: [HERO_PHASE],
        rule_sources: [rule_sources.BATTLETOME_LUMINETH, rule_sources.ERRATA_LUMINETH_JULY_2021],
      },
      {
        name: `Shrine Guardian`,
        desc: `Once per turn, this terrain feature's Shrine Guardian can issue a command without a command point being spent.`,
        when: [DURING_TURN],
        rule_sources: [rule_sources.BATTLETOME_LUMINETH, rule_sources.ERRATA_LUMINETH_JULY_2021],
      },
    ],
  },
}

export default tagAs(Scenery, 'scenery')
