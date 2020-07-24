import { TArtifacts } from 'types/army'
import { COMBAT_PHASE, WOUND_ALLOCATION, HERO_PHASE } from 'types/phases'

const Artifacts: TArtifacts = [
  {
    name: `Mountains Gift`,
    effects: [
      {
        name: `Mountains Gift`,
        desc: `Pick 1 of the bearer's weapons, once per phase add 1 damage inflicted by 1 attack.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Mountains Gift`,
        desc: `Roll a dice each time you allocate a wound or mortal wound to the bearer, on a 6+ it is negated.`,
        when: [WOUND_ALLOCATION],
      },
      {
        name: `Mountains Gift`,
        desc: `Roll a dice each time the bearer is inflicted by a spell or endless spell, on a 5+ ignore the effects.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `The Perfect Blade`,
    effects: [
      {
        name: `The Perfect Blade`,
        desc: `Pick 1 of the bearer's weapons, an unmodified hit roll of 3+ always hits, an unmodified wound roll of 3+ always wounds and an unmodified save roll of 3 or less always fails.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Simulacra Amulet`,
    effects: [
      {
        name: `Simulacra Amulet`,
        desc: `The first time the bearer is slain, roll a dice. 1-3 the bearer is slain. 4-6 the bearer is not slain, all wounds allocated to them are healed and any wounds that currently remain to be allocated to them are negated.`,
        when: [WOUND_ALLOCATION],
      },
    ],
  },
  {
    name: `Gift of Celennar`,
    effects: [
      {
        name: `Gift of Celennar`,
        desc: `Roll a dice each time you allocate a wound or mortal wound (add 2 to the roll if TECLIS is part of your army and on the battlefield). On a 6+ the wound or mortal wound is negated`,
        when: [WOUND_ALLOCATION],
      },
    ],
  },
  {
    name: `Pheonix Stone`,
    effects: [
      {
        name: `Pheonix Stone`,
        desc: `If a friendly LUMINETH REALM-LORDS HERO is slain within 12" of the bearer, roll a dice. On a 6 the model is not slain, all wounds allocated to them are healed and any wounds that currently remain to be allocated to them are negated.`,
        when: [WOUND_ALLOCATION],
      },
    ],
  },
  {
    name: `Silver Wand`,
    effects: [
      {
        name: `Silver Wand`,
        desc: `The bearer can attempt to cast 1 extra spell in your hero phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Blade of Leaping Gold`,
    effects: [
      {
        name: `Blade of Leaping Gold`,
        desc: `Pick 1 of the bearer's melee weapons, add 3 to the attacks characteristic of that weapon.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Heartstone Amulet`,
    effects: [
      {
        name: `Heartstone Amulet`,
        desc: `Each time you allocate a wound or mortal wound to the bearer, roll a dice. On a 5+ the wound or mortal wound is negated.`,
        when: [WOUND_ALLOCATION],
      },
    ],
  },
  {
    name: `Ebony Stone`,
    effects: [
      {
        name: `Ebony Stone`,
        desc: `Each time the bearer is affected by a spell or endless spell, roll a dice. On a 4+ ignore the effects of that spell on the bearer.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Magmic Hammer`,
    effects: [
      {
        name: `Magmic Hammer`,
        desc: `If the bearer is a WIZARD, add 1 to the number of mortal wounds inflicted by Arcane Bolt spells cast by the bearer.`,
        when: [HERO_PHASE],
      },
    ],
  },
]

export default Artifacts
