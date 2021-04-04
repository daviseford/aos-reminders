import GenericBattleTraits from 'generic_rules/battle_traits'
import { MEGA_GARGANT_MERCENARIES } from 'meta/factions'
import Units from './units'

const subFactions = {
  [MEGA_GARGANT_MERCENARIES]: {
    effects: [GenericBattleTraits.DisruptivePresence],
    available: {
      units: [Units],
    },
  },
}

export default subFactions
