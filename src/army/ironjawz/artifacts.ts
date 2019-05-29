import { sortBy } from 'lodash'
import { TArtifacts } from 'types/army'

import {
  HERO_PHASE,
  COMBAT_PHASE,
  CHARGE_PHASE,
  BATTLESHOCK_PHASE,
  START_OF_COMBAT_PHASE,
  SHOOTING_PHASE,
  DURING_GAME,
} from 'types/phases'
import RealmArtifacts from 'army/malign_sorcery/realm_artifacts'
import DestructionArtifacts from 'army/destruction/destruction_artifacts'

let Artifacts: TArtifacts = [
  {
    name: `Armour of Gork`,
    effects: [
      {
        name: `Armour of Gork`,
        desc: `If the save roll made for the bearer against an attack made with a melee weapon is 6+, the attacking unit suffers 1 mortal wound after all of its attacks are complete.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Destroyer`,
    effects: [
      {
        name: `Destroyer`,
        desc: `Pick one of the bearer’s melee weapons. Increase the weapon’s Damage characteristic by 1.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Daubing of Mork`,
    effects: [
      {
        name: `Daubing of Mork`,
        desc: `Roll a dice each time a wound or mortal wound is allocated to the bearer. On a 6+ the wound is negated.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `The Golden Toof`,
    effects: [
      {
        name: `The Golden Toof`,
        desc: `Friendly IRONJAWZ units that are wholly within 12" of the bearer do not have to take battleshock tests.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
  {
    name: `Metalrippa's Klaw`,
    effects: [
      {
        name: `Metalrippa's Klaw`,
        desc: `Pick one of the bearer’s melee weapons. Improve the Rend characteristic of that weapon by 1.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `The Boss Skewer`,
    effects: [
      {
        name: `The Boss Skewer`,
        desc: `Add 1 to the Bravery characteristic of friendly IRONJAWZ units while they are wholly within 18" of the bearer, and subtract 1 from the Bravery characteristic of enemy units while they are wholly within 18" of the bearer.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
]

Artifacts = sortBy(Artifacts, 'name')
  .concat(DestructionArtifacts)
  .concat(RealmArtifacts)

export default Artifacts
