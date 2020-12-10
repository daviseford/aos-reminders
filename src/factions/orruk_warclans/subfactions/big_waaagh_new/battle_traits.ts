import { tagAs } from 'factions/metatagger'
import { SAMPLE } from 'meta/factions'
import { END_OF_SETUP } from 'types/phases'

const BigWaaaghBattleTraits = {
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
export default tagAs(BigWaaaghBattleTraits, 'battle_trait')
