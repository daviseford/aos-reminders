import { tagAs } from 'factions/metatagger'
import { GenericEffects } from 'generic_rules'
import { BATTLESHOCK_PHASE, COMBAT_PHASE } from 'types/phases'
import rule_sources from './rule_sources'

const Scenery = {
  Herdstone: {
    effects: [
      GenericEffects.FactionTerrainSetup,
      GenericEffects.Impassable,
      {
        name: `Entropic Lodestone`,
        desc: `Improve the Rend characteristic of melee weapons used by all friendly BEASTS OF CHAOS units on the battlefield by 1. From the start of the third battle round, improve the Rend characteristic of melee weapons used by all friendly BEASTS OF CHAOS units on the battlefield by 2 instead of 1.`,
        when: [COMBAT_PHASE],
        rule_sources: [
          rule_sources.BATTLETOME_BEASTS_OF_CHAOS,
          rule_sources.ERRATA_JULY_2021,
          rule_sources.WHITE_DWARF_FEBRUARY_2022,
        ],
      },
      {
        name: `Locus of Savagery`,
        desc: `After this terrain feature is set up, its range is 12". At the start of each battle round after the first, its range is increased by 6".

        If a friendly BEASTS OF CHAOS unit wholly within range of this terrain feature fails a battleshock test, halve the number of models that flee from that unit (rounding down). In addition. a friendly BEASTS OF CHAOS unit wholly within range of this terrain feature receives the Rally command, vou can return 1 slain model to that unit for each 4+ instead of each 6.`,
        when: [BATTLESHOCK_PHASE],
        rule_sources: [
          rule_sources.BATTLETOME_BEASTS_OF_CHAOS,
          rule_sources.ERRATA_JULY_2021,
          rule_sources.WHITE_DWARF_FEBRUARY_2022,
        ],
      },
    ],
  },
}

export default tagAs(Scenery, 'scenery')
