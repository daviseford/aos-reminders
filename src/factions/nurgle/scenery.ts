import { TItemDescriptions } from 'factions/factionTypes'
import { tagAs } from 'factions/metatagger'
import { GenericEffects } from 'generic_rules'
import { DURING_GAME, START_OF_HERO_PHASE } from 'types/phases'

const Scenery = {
  'Feculent Gnarlmaw': {
    effects: [
      GenericEffects.FactionTerrainSetup,
      GenericEffects.Impassable,
      {
        name: `Spreading Disease`,
        desc: `This faction terrain feature can never be set up within 7" of another Feculent Gnarlmaw or within 3" of an objective or other terrain feature.`,
        when: [DURING_GAME],
      },
      {
        name: `Uproot`,
        desc: `If this terrain feature is affected by a rule that says you cannot use the scenery rules on its warscroll for the rest of the battle, remove this terrain feature from play instead.`,
        when: [DURING_GAME],
      },
      {
        name: `Encroaching Corruption`,
        desc: `This terrain feature is treated as a friendly unit with the Maggotkin of Nurgle keyword for the purposes of the Diseased battle trait.`,
        when: [DURING_GAME],
      },
      {
        name: `Encroaching Corruption`,
        desc: `At the start of your hero phase, you receive 1 extra contagion point for each Feculent Gnarlmaw in your army that is on the battlefield and has no enemy models within 3" of it.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
} satisfies TItemDescriptions

export default tagAs(Scenery, 'scenery')
