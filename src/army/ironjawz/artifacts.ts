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
    name: `Hulking Muscle-bound Brute`,
    effects: [
      {
        name: `Hulking Muscle-bound Brute`,
        desc: `You can re-roll wound rolls of 1 for attacks made with this general’s melee weapons.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Live to Fight`,
    effects: [
      {
        name: `Live to Fight`,
        desc: `You can re-roll failed hit rolls for attacks made by this general if they charged in the same turn.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Brutish Cunning`,
    effects: [
      {
        name: `Brutish Cunning`,
        desc: `Roll a dice at the start of your opponent’s charge phase. On a 5+ one friendly IRONJAWZ unit wholly within 12" of this general can attempt to charge. This charge takes place before any enemy charges.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  {
    name: `Bestial Charisma`,
    effects: [
      {
        name: `Bestial Charisma`,
        desc: `If this general is chosen as the model from which the Inspiring Presence command ability is measured, you can pick D3 units rather than 1 to be affected by the command ability.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
  {
    name: `Prophet of the Waaagh!`,
    effects: [
      {
        name: `Prophet of the Waaagh!`,
        desc: `If this general has the Waaagh! or Mighty Waaagh! command ability, you can re-roll the dice to see if the relevant units can make an extra attack. If this general does not have one of these abilities, they can use the Waaagh! command ability from the Orruk Megaboss warscroll.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Ironclad`,
    effects: [
      {
        name: `Ironclad`,
        desc: `Worsen the Rend characteristic of enemy weapons by 1, to a minimum of ‘-’, if they target this general.`,
        when: [COMBAT_PHASE, SHOOTING_PHASE],
      },
    ],
  },
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
