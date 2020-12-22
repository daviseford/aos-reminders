import { tagAs } from 'factions/metatagger'
import {
  BATTLESHOCK_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  START_OF_COMBAT_PHASE,
  WOUND_ALLOCATION_PHASE,
} from 'types/phases'

const ChaosArtifacts = {
  'Daemon Weapon (Chaos)': {
    effects: [
      {
        name: `Daemon Weapon (Chaos)`,
        desc: `Pick one of the bearer's melee weapons. Each time you roll a wound roll of 6+ for that weapon, that attack inflicts 1 mortal wound in addition to its normal damage.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Chaos Runeblade (Chaos)': {
    effects: [
      {
        name: `Chaos Runeblade (Chaos)`,
        desc: `Pick one of the bearer's melee weapons. Increase the Attacks characteristic of that weapon by 1.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Beguiling Gem (Chaos)': {
    effects: [
      {
        name: `Beguiling Gem (Chaos)`,
        desc: `Once per battle, at the start of the combat phase, you can pick one enemy model within 3" of the bearer. Subtract 1 from hit rolls made for that model in that phase.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  'Chaos Talisman (Chaos)': {
    effects: [
      {
        name: `Chaos Talisman (Chaos)`,
        desc: `Roll a D6 each time you allocate a wound or mortal wound to the bearer. On a 6+, the wound is negated. Add 1 to the roll if the wound was inflicted by a model with the ORDER keyword.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
    ],
  },
  'Favour of the Gods (Chaos)': {
    effects: [
      {
        name: `Favour of the Gods (Chaos)`,
        desc: `Add 1 to the Wounds characteristic of the bearer.`,
        when: [DURING_GAME],
      },
    ],
  },
  'Crown of Conquest (Chaos)': {
    effects: [
      {
        name: `Crown of Conquest (Chaos)`,
        desc: `Friendly CHAOS units do not have to take battleshock tests while they are within 6" of the bearer.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
}

export default tagAs(ChaosArtifacts, 'artifact')
