import { tagAs } from 'factions/metatagger'
import { DURING_GAME, HERO_PHASE, START_OF_SETUP } from 'types/phases'
import rule_sources from './rule_sources'

const Scenery = {
  'Realmshaper Engine': {
    effects: [
      {
        name: `Setup`,
        desc: `After territories are determined, you can set up this faction terrain feature wholly within your territory and more than 3" from all objectives and other terrain features. If these restrictions mean you cannot set up this faction terrain feature, you can remove 1 terrain feature that is wholly or partially within your territory and attempt to set up this faction terrain feature again. If it is still impossible to set up this faction terrain feature, then it is not used. If both players can set up faction terrain features at the same time, they must roll off and the winner chooses who sets up their faction terrain features first.`,
        when: [START_OF_SETUP],
        rule_sources: [rule_sources.BATTLETOME_SERAPHON, rule_sources.ERRATA_SERAPHON_JULY_2021],
      },
      {
        name: `Defensible`,
        desc: `This terrain feature is a defensible terrain feature that can be garrisoned by up to 15 models.`,
        when: [DURING_GAME],
        rule_sources: [rule_sources.BATTLETOME_SERAPHON, rule_sources.ERRATA_SERAPHON_JULY_2021],
      },
      {
        name: `Power Unleashed`,
        desc: `In your hero phase, if this terrain feature is garrisoned by a friendly SERAPHON WIZARD or friendly SERAPHON PRIEST, you can pick 1 other terrain feature on the battlefield and roll a dice for each enemy unit within 3" of that terrain feature. Add 2 to the roll if that terrain feature is within 18" of this terrain feature, and subtract 2 from the roll if that terrain feature is more than 36" from this terrain feature. On a 4+, that enemy unit suffers D3 mortal wounds.`,
        when: [HERO_PHASE],
        rule_sources: [rule_sources.BATTLETOME_SERAPHON, rule_sources.ERRATA_SERAPHON_JULY_2021],
      },
    ],
  },
}

export default tagAs(Scenery, 'scenery')
