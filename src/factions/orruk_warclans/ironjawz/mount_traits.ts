import { tagAs } from 'factions/metatagger'
import {
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  HERO_PHASE,
  MOVEMENT_PHASE,
  START_OF_COMBAT_PHASE,
} from 'types/phases'

// Store Mount Traits here. You can add them to units, abilties, flavors, and subfactions later.
const MountTraits = {
  "Big 'Un": {
    effects: [
      {
        name: `Big 'Un`,
        desc: `+1 to the wound characteristic to this model.`,
        when: [DURING_GAME],
      },
    ],
  },
  "Fast 'Un": {
    effects: [
      {
        name: `Fast 'Un`,
        desc: `Add +2 to the movement characteristic of this model.`,
        when: [MOVEMENT_PHASE],
      },
    ],
  },
  "Mean 'Un": {
    effects: [
      {
        name: `Mean 'Un`,
        desc: `Add 1 to the damage characteristic of this model's Mighty Fists and Tail attacks.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  "Heavy 'Un": {
    effects: [
      {
        name: `Heavy 'Un`,
        desc: `Add 1 to the dice rolls for the Destructive Bulk ability.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  "Loud 'Un": {
    effects: [
      {
        name: `Loud 'Un`,
        desc: `Once per battle, give -1 to hit for enemies within 3".`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  "Weird 'Un": {
    effects: [
      {
        name: `Weird 'Un`,
        desc: `You may ignore spell and endless spell effects on this model with a dice roll of a 4+.`,
        when: [HERO_PHASE],
      },
    ],
  },
}

// Always export using tagAs
export default tagAs(MountTraits, 'mount_trait')
