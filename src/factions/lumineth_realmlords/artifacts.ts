import { tagAs } from 'factions/metatagger'
import { COMBAT_PHASE, HERO_PHASE, WOUND_ALLOCATION_PHASE } from 'types/phases'

// Add individual artifacts here, and access them in other files!
const Artifacts = {
  'Pheonix Stone': {
    effects: [
      {
        name: `Pheonix Stone`,
        desc: `If a friendly LUMINETH REALM-LORDS HERO is slain within 12" of the bearer, roll a D6. On a 6 the model is not slain, all wounds allocated to them are healed and any wounds that currently remain to be allocated to them are negated.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
    ],
  },
  'Silver Wand': {
    effects: [
      {
        name: `Silver Wand`,
        desc: `The bearer can attempt to cast 1 extra spell in your hero phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Blade of Leaping Gold': {
    effects: [
      {
        name: `Blade of Leaping Gold`,
        desc: `Pick 1 of the bearer's melee weapons, add 3 to the attacks characteristic of that weapon.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Hearthstone Amulet': {
    effects: [
      {
        name: `Hearthstone Amulet`,
        desc: `Each time you allocate a wound or mortal wound to the bearer, roll a D6. On a 5+ the wound or mortal wound is negated.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
    ],
  },
  'Ebony Stone': {
    effects: [
      {
        name: `Ebony Stone`,
        desc: `Each time the bearer is affected by a spell or endless spell, roll a D6. On a 4+ ignore the effects of that spell on the bearer.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Magmic Hammer': {
    effects: [
      {
        name: `Magmic Hammer`,
        desc: `If the bearer is a WIZARD, add 1 to the number of mortal wounds inflicted by Arcane Bolt spells cast by the bearer.`,
        when: [HERO_PHASE],
      },
    ],
  },
  "Mountain's Gift": {
    effects: [
      {
        name: `Mountain's Gift`,
        desc: `Pick 1 of the bearer's weapons, once per phase add 1 damage inflicted by 1 attack. Additionally, roll a D6 each time you allocate a wound or mortal wound to the bearer, on a 6+ it is negated. Additionally, roll a D6 each time the bearer is inflicted by a spell or endless spell, on a 5+ ignore the effects.`,
        when: [COMBAT_PHASE, WOUND_ALLOCATION_PHASE, HERO_PHASE],
      },
    ],
  },
  'Simulacra Amulet': {
    effects: [
      {
        name: `Simulacra Amulet`,
        desc: `The first time the bearer is slain, roll a D6. 1-3 the bearer is slain. 4-6 the bearer is not slain, all wounds allocated to them are healed and any wounds that currently remain to be allocated to them are negated.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
    ],
  },
  'Gift of Celennar': {
    effects: [
      {
        name: `Gift of Celennar`,
        desc: `Roll a D6 each time you allocate a wound or mortal wound (add 2 to the roll if TECLIS is part of your army and on the battlefield). On a 6+ the wound or mortal wound is negated.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
    ],
  },
  'The Perfect Blade': {
    effects: [
      {
        name: `The Perfect Blade`,
        desc: `Pick 1 of the bearer's weapons, an unmodified hit roll of 3+ always hits, an unmodified wound roll of 3+ always wounds and an unmodified save roll of 3 or less always fails.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
}

// Always export using tagAs
export default tagAs(Artifacts, 'artifact')
