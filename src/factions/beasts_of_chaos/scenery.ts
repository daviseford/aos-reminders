import { TItemDescriptions } from 'factions/factionTypes'
import { tagAs } from 'factions/metatagger'
import { GenericEffects } from 'generic_rules'
import { COMBAT_PHASE } from 'types/phases'

const Scenery = {
  Herdstone: {
    effects: [
      GenericEffects.FactionTerrainSetup,
      GenericEffects.Impassable,
      {
        name: `Entropic Lodestone`,
        desc: `From the start of the 2nd battleround, improve the Rend characteristic of melee weapons used by all friendly BEASTS OF CHAOS units on the battlefield by 1. From the start of the 4th battle round, improve the Rend characteristic of melee weapons used by all friendly BEASTS OF CHAOS units on the battlefield by 2 instead of 1.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
} satisfies TItemDescriptions

export default tagAs(Scenery, 'scenery')
