import { GenericEffects } from 'generic_rules'
import { MEGA_GARGANT_MERCENARIES } from 'meta/factions'
import Units from './units'

const subFactions = {
  [MEGA_GARGANT_MERCENARIES]: {
    effects: [GenericEffects.DisruptivePresence],
    available: {
      units: [Units],
    },
  },
}

export default subFactions
