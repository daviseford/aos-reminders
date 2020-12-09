import { tagAs } from 'factions/metatagger'
import {
  BATTLESHOCK_PHASE,
  COMBAT_PHASE,
  HERO_PHASE,
  SHOOTING_PHASE,
  START_OF_HERO_PHASE,
} from 'types/phases'

const Prayers = {
  'Divine Light': {
    effects: [
      {
        name: `Divine Light`,
        desc: `Pick a unit wholly within 18" of this PRIEST and roll dice. 3+. Enemy units reroll hit rolls of 1 that target that unit. Friendly units reroll unmodified hit rolls of 6 for attacks that target that unit.`,
        when: [HERO_PHASE, SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },
  'Bless Weapons': {
    effects: [
      {
        name: `Bless Weapons`,
        desc: `Pick a friendly unit wholly within 18" of this PRIEST and roll dice. 4+. Until next hero phase each unmodified hit roll of 6 for that unit inflicts 1 extra hit on the target. Make a wound and save roll for each.`,
        when: [HERO_PHASE, SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },
  'Bolster Faith': {
    effects: [
      {
        name: `Bolster Faith`,
        desc: `Pick a friendly STORMCAST ETERNAL unit wholly within 9" of this PRIEST and roll dice. 3+. Until your next hero phase this unit does not take battleshock tests.`,
        when: [HERO_PHASE, BATTLESHOCK_PHASE],
      },
    ],
  },
  Abjuration: {
    effects: [
      {
        name: `Abjuration`,
        desc: `At the start of the ENEMY hero phase pick an enemy WIZARD within 12" of this PRIEST and roll a D6. 3+. This PRIEST can attempt to unbind 1 spell cast by that enemy WIZARD in that hero phase in the same manner as a WIZARD.`,
        when: [START_OF_HERO_PHASE, HERO_PHASE],
      },
    ],
  },
  "God King's Aspect": {
    effects: [
      {
        name: `God King's Aspect`,
        desc: `3+. Until your next hero phase subtract 1 from bravery of enemy units within 6" of this PRIEST.`,
        when: [HERO_PHASE, BATTLESHOCK_PHASE],
      },
    ],
  },
  Translocation: {
    effects: [
      {
        name: `Translocation`,
        desc: `Pick a friendly STORMCAST ETERNAL unit wholly within 9" of this PRIEST and roll dice. 3+. Remove that unit from the battlefield and set it up again anywhere more than 9" from any enemy units. Cannot move in subsequent movement phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
}

export default tagAs(Prayers, 'prayer')
