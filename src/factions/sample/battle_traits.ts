import { TItemDescriptions } from 'factions/factionTypes'
import { tagAs } from 'factions/metatagger'
import { END_OF_SETUP } from 'types/phases'

const BattleTraits = {
  SAMPLE: {
    effects: [
      {
        name: `Battle Traits`,
        desc: `An always-active rule.`,
        when: [END_OF_SETUP],
      },
    ],
  },
} satisfies TItemDescriptions

// Always export using tagAs
export default tagAs(BattleTraits, 'battle_trait')
