import { TArtifacts } from 'types/army'

import { COMBAT_PHASE, BATTLESHOCK_PHASE, DURING_GAME } from 'types/phases'

const Artifacts: TArtifacts = [
  {
    name: `Armour of Gork`,
    effects: [
      {
        name: `Armour of Gork`,
        desc: `If the unmodified save roll made for an attack made with a melee weapon that targets the bearer is 6, the attacking unit suffers 1 mortal wound after all of its attacks have been resolved.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Destroyer`,
    effects: [
      {
        name: `Destroyer`,
        desc: `Pick one of the bearer's melee weapons. Increase the weapon's Damage characteristic by 1.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Daubing of Mork`,
    effects: [
      {
        name: `Daubing of Mork`,
        desc: `Roll a D6 each time a wound or mortal wound is allocated to the bearer. On a 6+ the wound is negated.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `The Golden Toof`,
    effects: [
      {
        name: `The Golden Toof`,
        desc: `Do not take battleshock tests for friendly IRONJAWZ units while they are wholly within 12" of the bearer.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
  {
    name: `Metalrippa's Klaw`,
    effects: [
      {
        name: `Metalrippa's Klaw`,
        desc: `Pick one of the bearer's melee weapons. Change the Rend characteristic of that weapon to -3 before applying any other modifiers to that weapon's Rend characteristic.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `The Boss Skewer`,
    effects: [
      {
        name: `The Boss Skewer`,
        desc: `Add 1 to the Bravery characteristic of friendly IRONJAWZ units while they are wholly within 18" of the bearer, and subtract 1 from the Bravery characteristic of enemy units while they are within 12" of the bearer.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
]

export default Artifacts
