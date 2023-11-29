import { TItemDescriptions } from 'factions/factionTypes'
import { tagAs } from 'factions/metatagger'
import meta_rule_sources from 'meta/rule_sources'
import { CHARGE_PHASE, MOVEMENT_PHASE, WARDS_PHASE } from 'types/phases'

const DeathUnits = {
  "Jerrion's Delegation": {
    effects: [
      {
        name: `Urgent Missive`,
        desc: `Units in this regiment of renown can run and still charge later in the turn.`,
        when: [MOVEMENT_PHASE, CHARGE_PHASE],
        rule_sources: [meta_rule_sources.BOOK_DAWNBRINGERS_BOOK_1],
      },
      {
        name: `Deathless Courtiers`,
        desc: `Units in this regiment of renown have a ward of 6+.`,
        when: [WARDS_PHASE],
        rule_sources: [meta_rule_sources.BOOK_DAWNBRINGERS_BOOK_1],
      },
    ],
  },
} satisfies TItemDescriptions

export default tagAs(DeathUnits, 'unit')
