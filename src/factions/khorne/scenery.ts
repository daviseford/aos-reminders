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
        rule_sources: [rule_sources.BATTLETOME_KHORNE, rule_sources.ERRATA_JULY_2021],
      },
      {
        name: `Witchbane`,
        desc: `While any terrain feature with this scenery rule is on the battlefield, if a spell is miscast, the caster suffers D6 mortal wounds instead of D3.`,
        when: [HERO_PHASE],
        rule_sources: [
          rule_sources.BATTLETOME_KHORNE,
          rule_sources.ERRATA_JULY_2021,
          rule_sources.WHITE_DWARF_MARCH_2022,
        ],
      },
      {
        name: `Invoke Judgement`,
        desc: `While a KHORNE HERO garrisons this terrain feature, it can attempt to summon invocations in the same mannner as a KHORNE PRIEST and benefits from the 'Words of Hate' ability when it does so.`,
        when: [HERO_PHASE],
        rule_sources: [
          rule_sources.BATTLETOME_KHORNE,
          rule_sources.ERRATA_JULY_2021,
          rule_sources.WHITE_DWARF_MARCH_2022,
        ],
      },
    ],
  },
}

export default tagAs(Scenery, 'scenery')
