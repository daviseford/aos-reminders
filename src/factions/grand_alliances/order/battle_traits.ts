import { TItemDescriptions } from 'factions/factionTypes'
import { tagAs } from 'factions/metatagger'
import { BATTLESHOCK_PHASE } from 'types/phases'

const BattleTraits = {
  Order: {
    effects: [
      {
        name: `Defiant Avengers`,
        desc: `You can reroll battleshock tests for friendly ORDER units.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
} satisfies TItemDescriptions

export default tagAs(BattleTraits, 'battle_trait')
