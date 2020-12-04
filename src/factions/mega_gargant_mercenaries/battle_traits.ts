import GenericBattleTraits from 'army/generic/battle_traits'
import { tagAs } from 'factions/metatagger'

const BattleTraits = {
  'Disruptive Presence': {
    effects: [GenericBattleTraits.DisruptivePresence],
  },
}

export default tagAs(BattleTraits, 'battle_trait')
