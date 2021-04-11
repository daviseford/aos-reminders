import { tagAs } from 'factions/metatagger'
import { CHARGE_PHASE, COMBAT_PHASE, DURING_GAME, HERO_PHASE, MOVEMENT_PHASE, SHOOTING_PHASE, START_OF_COMBAT_PHASE, START_OF_HERO_PHASE, WOUND_ALLOCATION_PHASE } from 'types/phases'

// Add individual artifacts here, and access them in other files!
const Artifacts = {
  'Syari Pommel': {
    effects: [
      {
        name: `Syari Pommel`,
        desc: `Bearer has 1 additional Aether Quartz reserve.`,
        when: [DURING_GAME],
      },
    ],
  },
  'Senlui Amulet': {
    effects: [
      {
        name: `Senlui Amulet`,
        desc: `Bearer can run and charge.`,
        when: [MOVEMENT_PHASE, CHARGE_PHASE],
      },
    ],
  },
  'Sun Stone': {
    effects: [
      {
        name: `Sun Stone`,
        desc: `Bearer can attempt to dispel 1 endless spell in the same manner as a WIZARD.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Sun Stone`,
        desc: `Bearer can attempt to dispel 1 spell in the same matter as a WIZARD.`,
        when: [HERO_PHASE],
      },
      {
        name: `Sun Stone`,
        desc: `If the bearer is a WIZARD, add one to the first dispelling or unbinding roll you make for them each phase.`,
        when: [HERO_PHASE, START_OF_HERO_PHASE],
      },
    ],
  },
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
  'Windblast Fan': {
    effects: [
      {
        name: `Windblast Fan`,
        desc: `One per battle, in the enemy movement phase, Pick 1 unit within 3'' of the bearer, the unit must have a normal move, and must retreat.`,
        when: [MOVEMENT_PHASE],
      },
    ],
  },
  'Windstone': {
    effects: [
      {
        name: `Windstone`,
        desc: `Once per battle, in your shooting phase, pick 1 enemy unit within 18'' and visible to the bearer. Roll a D6, 1 = nothing happens, 2-4 = unit suffers 3 mortal wounds, 6 = unit suffers D6 mortal wounds..`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  'Buffeting Aspiragillum': {
    effects: [
      {
        name: `Buffeting Aspiragillum`,
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
  'Waystone': {
    effects: [
      {
        name: `Waystone`,
        desc: `Once per battle, instead of making a normal move, pick a point on the battlefield within 12'' of the bearer. Remove the bearer and set them up within 1'' of the point, and more than 3'' away from enemy units.`,
        when: [MOVEMENT_PHASE],
      },
    ],
  },
  'Metalith Dust': {
      effects: [
        {
          name: `Metalith Dust`,
          desc: `Once per battle, pick 1 enemy unit within 3'' of the bearer. Subtract 1 from hit and wound rolls until the end of that phase.`,
          when: [START_OF_COMBAT_PHASE],
        },
      ],
  },
}

// Always export using tagAs
export default tagAs(Artifacts, 'artifact')
