import { GenericEffects } from 'generic_rules'
import { MERCENARY_COMPANIES } from 'meta/factions'
import Units from './units'

const subFactions = {
  [MERCENARY_COMPANIES]: {
    effects: [GenericEffects.DisruptivePresence],
    available: {
      units: [Units],
    },
  },
}

export default subFactions
