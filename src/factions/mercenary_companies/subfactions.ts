import GenericBattleTraits from 'generic_rules/battle_traits'
import { MERCENARY_COMPANIES } from 'meta/factions'
import Units from './units'

const subFactions = {
  [MERCENARY_COMPANIES]: {
    effects: [GenericBattleTraits.DisruptivePresence],
    available: {
      units: [Units],
    },
  },
}

export default subFactions
