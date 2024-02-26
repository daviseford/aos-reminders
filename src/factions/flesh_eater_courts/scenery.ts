import { tagAs } from 'factions/metatagger'
import { GenericEffects } from 'generic_rules'
import { BATTLESHOCK_PHASE, DURING_GAME, START_OF_HERO_PHASE } from 'types/phases'
import { TItemDescriptions } from 'factions/factionTypes'

const Scenery = {
  'Charnel Throne': {
    effects: [
      GenericEffects.FactionTerrainSetup,
      {
        name: `Defensible`,
        desc: `This terrain feature is a defensible terrain feature that can be garrisoned by 1 FLESH-EATER COURTS HERO that has a Wounds characteristic of up to 7.`,
        when: [DURING_GAME],
      },
      {
        name: `Ruler of All He Surveys`,
        desc: `At the start of your hero phase, add D3 noble deeds points to any friendly FLESH-EATER COURTS HERO that is garrisoning this terrain feature.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Ghoulish Landmark`,
        desc: `While an enemy unit is within 12" of this terrain feature, it cannot be affected by any abilities that allow units to ignore battleshock tests.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
} satisfies TItemDescriptions

export default tagAs(Scenery, 'scenery')
