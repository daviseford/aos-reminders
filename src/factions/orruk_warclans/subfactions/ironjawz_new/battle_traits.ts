import { tagAs } from 'factions/metatagger'
import { SAMPLE } from 'meta/factions'
import { END_OF_SETUP } from 'types/phases'

const IronjawzBattleTraits = {
  [SAMPLE]: {
    effects: [
      {
        name: `Battle Traits`,
        desc: `An always-active rule.`,
        when: [END_OF_SETUP],
      },
    ],
  },
}

// Always export using tagAs
export default tagAs(IronjawzBattleTraits, 'battle_trait')
