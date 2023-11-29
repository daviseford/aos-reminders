import { tagAs } from 'factions/metatagger'

import { TItemDescriptions } from 'factions/factionTypes'

const BattleTactics = {} satisfies TItemDescriptions

export default tagAs(BattleTactics, 'battle_tactic')
