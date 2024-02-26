import { TItemDescriptions } from 'factions/factionTypes'
import { tagAs } from 'factions/metatagger'
import meta_rule_sources from 'meta/rule_sources'
import { CHARGE_PHASE, DURING_GAME, MOVEMENT_PHASE, WARDS_PHASE } from 'types/phases'

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
  "Veremord's Shamblers": {
    effects: [
      {
        name: `Legend Among Graverobbers`,
        desc: `The CORPSE CART in this regiment of renown has the HERO keyword.`,
        when: [DURING_GAME],
      },
      {
        name: `Repurposed Wards`,
        desc: `The DEADWALKER ZOMBIES unit in this regiment of renown has a ward of 6+ while it is wholly within 12" of the CORPSE CART in this regiment of renown.

        The CORPSE CART in this regiment of renown has a ward of 5+ while it is wholly within 12" of the DEADWALKER ZOMBIES unit in this regiment of renown.`,
        when: [WARDS_PHASE],
      },
      {
        name: `Vitiating Vapours`,
        desc: `Subtract 1 from ward rolls for enemy units within 12" of the CORPSE CART in this regiment of renown.`,
        when: [WARDS_PHASE],
      },
    ],
  },
} satisfies TItemDescriptions

export default tagAs(DeathUnits, 'unit')
