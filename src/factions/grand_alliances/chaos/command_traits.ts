import { tagAs } from 'factions/metatagger'
import {
  BATTLESHOCK_PHASE,
  CHARGE_PHASE,
  COMBAT_PHASE,
  END_OF_MOVEMENT_PHASE,
  HERO_PHASE,
  START_OF_HERO_PHASE,
  WOUND_ALLOCATION_PHASE,
} from 'types/phases'

// Store Command Traits here. You can add them to units, abilties, flavors, and subfactions later.
const ChaosCommandTraits = {
  'Dark Avenger (Chaos)': {
    effects: [
      {
        name: `Dark Avenger (Chaos)`,
        desc: `Add 1 to hit rolls for this general's melee weapons if the target unit has the ORDER keyword.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Spiteful Duellist (Chaos)': {
    effects: [
      {
        name: `Spiteful Duellist (Chaos)`,
        desc: `Each time this general is picked to fight, you can reroll one wound roll for one of their attacks in that fight.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Cunning Deceiver (Chaos)': {
    effects: [
      {
        name: `Cunning Deceiver (Chaos)`,
        desc: `Roll a D6 at the start of each of your hero phases as long as this general has not been slain. On a 5+ you receive 1 extra command point.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'Lord of War (Chaos)': {
    effects: [
      {
        name: `Lord of War (Chaos)`,
        desc: `In your hero phase, pick a friendly CHAOS unit within 3" of this general and roll a D6. On a 4+ you can add 1 to hit rolls for the unit you picked until your next hero phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Terrifying Presence (Chaos)': {
    effects: [
      {
        name: `Terrifying Presence (Chaos)`,
        desc: `Subtract 1 from the Bravery characteristic of enemy units while they are within 3" of this general.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
  'Malicious Conqueror (Chaos)': {
    effects: [
      {
        name: `Malicious Conqueror (Chaos)`,
        desc: `Add 1 to Unbridled Malice dice rolls for units while they are within 12" of this general.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  // Legion of Chaos Acendant
  'Primordial Commander': {
    effects: [
      {
        name: `Primordial Commander`,
        desc: `If you pick this general to summon via Unyielding Legions, add 1 to the roll.`,
        when: [END_OF_MOVEMENT_PHASE],
      },
    ],
  },
  'Ruinous Aura': {
    effects: [
      {
        name: `Ruinous Aura`,
        desc: `Add 1 to Infernal Realmwalkers rolls for Chaos Ascendant Daemon units wholly within 8" of this general.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
    ],
  },
  'Infernal Charge': {
    effects: [
      {
        name: `Infernal Charge`,
        desc: `You can reroll charge rolls made for any friendly Chaos Ascendant Daemon units wholly within 12" of this general.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
}

// Always export using tagAs
export default tagAs(ChaosCommandTraits, 'command_trait')
