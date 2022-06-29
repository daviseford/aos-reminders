import { tagAs } from 'factions/metatagger'
import {
  BATTLESHOCK_PHASE,
  COMBAT_PHASE,
  MOVEMENT_PHASE,
  START_OF_COMBAT_PHASE,
  WARDS_PHASE,
} from 'types/phases'

const IronjawzArtifacts = {
  'Armour of Gork': {
    effects: [
      {
        name: `Armour of Gork`,
        desc: `The bearer has a ward of 6+.`,
        when: [WARDS_PHASE],
      },
      {
        name: `Armour of Gork`,
        desc: `You can add 1 to hit rolls for attacks made with melee weapons by the bearer.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Armour of Gork`,
        desc: `You must subtract 2" from the bearer's Move characteristic and the bearer cannot run.`,
        when: [MOVEMENT_PHASE],
      },
    ],
  },
  Destroyer: {
    effects: [
      {
        name: `Destroyer`,
        desc: `Pick one of the bearer's melee weapons. Once per battle, at the start of the combat phase, you can add 3 to the Damage characteristic of that weapon until the end of that phase.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  'The Boss Skewer': {
    effects: [
      {
        name: `The Boss Skewer`,
        desc: `Add 1 to the Bravery characteristic of friendly IRONJAWZ units while they are wholly within 18" of the bearer, and subtract 1 from the Bravery characteristic of enemy units while they are within 12" of the bearer.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
}

export default tagAs(IronjawzArtifacts, 'artifact')
