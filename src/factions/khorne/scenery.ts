import { tagAs } from 'factions/metatagger'
import { GenericEffects } from 'generic_rules'
import { HERO_PHASE } from 'types/phases'
import rule_sources from './rule_sources'

const Scenery = {
  'Skull Altar': {
    effects: [
      GenericEffects.FactionTerrainSetup,
      GenericEffects.Defensible,
      {
        name: `Words of Hate`,
        desc: `You can reroll chanting rolls for friendly KHORNE PRIESTS wholly within 8" of this terrain feature.`,
        when: [HERO_PHASE],
        rule_sources: [rule_sources.BATTLETOME_KHORNE, rule_sources.ERRATA_KHORNE_JULY_2021],
      },
      {
        name: `Witchbane`,
        desc: `Subtract 1 from casting rolls for WIZARDS within 16" of this terrain feature.`,
        when: [HERO_PHASE],
        rule_sources: [rule_sources.BATTLETOME_KHORNE, rule_sources.ERRATA_KHORNE_JULY_2021],
      },
    ],
  },
}

export default tagAs(Scenery, 'scenery')
