import { tagAs } from 'factions/metatagger'
import {
  BATTLESHOCK_PHASE,
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  END_OF_COMBAT_PHASE,
  MOVEMENT_PHASE,
  SAVES_PHASE,
  SHOOTING_PHASE,
  START_OF_ROUND,
  WOUND_ALLOCATION_PHASE,
} from 'types/phases'

const BattleTraits = {
  // Daughters of Khaine Allegiance
  'Apostles of the Murder God': {
    effects: [
      {
        name: `Fanatical Faith`,
        desc: `Roll a D6 each time a wound or mortal wound is allocated to a friendly Daughter of Khaine model. On a 6 the wound is negated.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
      {
        name: `Blood Rites`,
        desc: `Friendly Daughters of Khaine units gain an ability each battle round based on the current battle round number. The effects are cumulative.`,
        when: [START_OF_ROUND],
      },
      {
        name: `Blood Rites - Level 1: Quickening Bloodlust`,
        desc: `You can reroll run rolls of 1.`,
        when: [MOVEMENT_PHASE],
      },
      {
        name: `Blood Rites - Level 2: Headlong Fury`,
        desc: `You can reroll charge rolls of 1.`,
        when: [CHARGE_PHASE],
      },
      {
        name: `Blood Rites - Level 3: Zealot's Rage`,
        desc: `You can reroll hit rolls of 1. In addition, Avatar of Khaine units are automatically Animated.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
      {
        name: `Blood Rites - Level 4: Slaughterer's Strength`,
        desc: `You can reroll melee wound rolls of 1.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Blood Rites - Level 5: Unquenchable Fervour`,
        desc: `You can reroll save rolls of 1.`,
        when: [SAVES_PHASE],
      },
      {
        name: `Blood Rites - Level 5: Unquenchable Fervour`,
        desc: `Do not take battleshock tests.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
  // Hagg Nar Flavor
  'Daughters of the First Temple': {
    effects: [
      {
        name: `Daughters of the First Temple`,
        desc: `Add 1 to the current battle round when determining active Blood Rites. This effect is cumulative with other similar abilities.`,
        when: [START_OF_ROUND],
      },
    ],
  },
  // Draichi Ganeth Flavor
  'Bladed Killers': {
    effects: [
      {
        name: `Bladed Killers`,
        desc: `Improve the melee rend characteristic of friendly Draichi Ganeth Witch Aelves and Sisters of Slaughter units by 1 if they charged this turn.`,
        when: [CHARGE_PHASE, COMBAT_PHASE],
      },
    ],
  },
  // Kraith Flavor
  'Disciples of Slaughter': {
    effects: [
      {
        name: `Disciples of Slaughter`,
        desc: `Roll a D6 for each Kraith Sisters of Slaughter unit that fought in this phase. On a 5+ that unit can fight a second time.`,
        when: [END_OF_COMBAT_PHASE],
      },
    ],
  },
  // Khailebron Flavor
  'Concealment and Stealth': {
    effects: [
      {
        name: `Concealment and Stealth`,
        desc: `Subtract 1 from missle hit rolls that target friendly Khailebron units.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  // Khelt Nar Flavor
  'Strike and Fade': {
    effects: [
      {
        name: `Strike and Fade`,
        desc: `Friendly Khelt Nar units can retreat and charge in the same turn.`,
        when: [MOVEMENT_PHASE, CHARGE_PHASE],
      },
    ],
  },
  // Zainthar Kai Flavor
  "Khaine's Essence": {
    effects: [
      {
        name: `Khaine's Essence`,
        desc: `Add 1 to the bravery characteristic of Zainthar Kai Melusai and Khinerai Harpies units.`,
        when: [DURING_GAME, BATTLESHOCK_PHASE],
      },
    ],
  },
}

export default tagAs(BattleTraits, 'battle_trait')
