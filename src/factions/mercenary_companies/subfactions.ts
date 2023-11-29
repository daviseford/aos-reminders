import { GenericEffects } from 'generic_rules'
import { MERCENARY_COMPANIES } from 'meta/factions'
import Units from './units'
import { TItemDescriptions } from 'factions/factionTypes'

const subFactions = {
  [MERCENARY_COMPANIES]: {
    effects: [GenericEffects.DisruptivePresence],
    available: {
      units: [Units],
    },
  },
} satisfies TItemDescriptions

export default subFactions
