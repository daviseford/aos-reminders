import { tagAs } from 'factions/metatagger'
import { END_OF_SETUP } from 'types/phases'

const BattleTraits = {
  'Battle Traits': {
    effects: [
      {
        name: `Battle Traits`,
        desc: `Battle Traits Rule`,
        when: [END_OF_SETUP],
      },
    ],
  },
}

// Always export using tagAs
export default tagAs(BattleTraits, 'battle_trait')
