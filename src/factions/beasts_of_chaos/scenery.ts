import { tagAs } from 'factions/metatagger'
import { GenericEffects } from 'generic_rules'
import { COMBAT_PHASE, DURING_GAME } from 'types/phases'
import rule_sources from './rule_sources'

const Scenery = {
  Herdstone: {
    effects: [
      GenericEffects.FactionTerrainSetup,
      GenericEffects.Impassable,
      {
        name: `Entropic Lodestone`,
        desc: `Fron the start of the 2nd battleround, improve the Rend characteristic of melee weapons used by all friendly BEASTS OF CHAOS units on the battlefield by 1. From the start of the 4th battle round, improve the Rend characteristic of melee weapons used by all friendly BEASTS OF CHAOS units on the battlefield by 2 instead of 1.`,
        when: [COMBAT_PHASE, DURING_GAME],
        rule_sources: [rule_sources.BATTLETOME_BEASTS_OF_CHAOS],
      },
    ],
  },
}

export default tagAs(Scenery, 'scenery')
