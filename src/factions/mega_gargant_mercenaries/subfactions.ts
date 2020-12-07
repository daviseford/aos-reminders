import GenericBattleTraits from 'army/generic/battle_traits'
import { TItemDescriptions } from 'factions/factionTypes'
import { MEGA_GARGANT_MERCENARIES } from 'meta/factions'
import Units from './units'

const subFactions: TItemDescriptions = {
  [MEGA_GARGANT_MERCENARIES]: {
    effects: [GenericBattleTraits.DisruptivePresence],
    available: {
      units: [Units],
    },
  },
}

export default subFactions
