import { TArtifacts } from 'types/army'
import { COMBAT_PHASE, HERO_PHASE, WOUND_ALLOCATION_PHASE } from 'types/phases'

const Artifacts: TArtifacts = [
  {
    name: `Pheonix Stone`,
    effects: [
      {
        name: `Pheonix Stone`,
        desc: `If a friendly LUMINETH REALM-LORDS HERO is slain within 12" of the bearer, roll a D6. On a 6 the model is not slain, all wounds allocated to them are healed and any wounds that currently remain to be allocated to them are negated.`,
        when: [WOUND_ALLOCATION_PHASE],
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
    name: `Hearthstone Amulet`,
    effects: [
      {
        name: `Hearthstone Amulet`,
        desc: `Each time you allocate a wound or mortal wound to the bearer, roll a D6. On a 5+ the wound or mortal wound is negated.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
    ],
  },
  {
    name: `Ebony Stone`,
    effects: [
      {
        name: `Ebony Stone`,
        desc: `Each time the bearer is affected by a spell or endless spell, roll a D6. On a 4+ ignore the effects of that spell on the bearer.`,
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
