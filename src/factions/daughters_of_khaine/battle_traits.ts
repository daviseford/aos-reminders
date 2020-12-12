import { tagAs } from 'factions/metatagger'
import {
  BATTLESHOCK_PHASE,
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  HERO_PHASE,
  MOVEMENT_PHASE,
  SAVES_PHASE,
  SHOOTING_PHASE,
  START_OF_ROUND,
  WOUND_ALLOCATION_PHASE,
} from 'types/phases'

const BattleTraits = {
  // Daughters of Khaine Allegiance
  'Daughters of Khaine': {
    effects: [
      {
        name: `Fanatical Faith`,
        desc: `Roll a D6 each time a wound or mortal wound is allocated to a friendly Daughter of Khaine model. On a 6+ the wound is negated.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
      {
        name: `Blood Rites`,
        desc: `Friendly Daughters of Khaine units gain an ability each battle round based on the current battle round number. The effects are cumulative.`,
        when: [START_OF_ROUND],
      },
      {
        name: `Blood Rites - Battle Round 1+: Quickening Bloodlust`,
        desc: `Reroll run rolls of 1 for friendly Daughters of Khaine units.`,
        when: [MOVEMENT_PHASE],
      },
      {
        name: `Blood Rites - Battle Round 2+: Headlong Fury`,
        desc: `Reroll dice rolls of 1 when making charge rolls for friendly Daughters of Khaine units.`,
        when: [CHARGE_PHASE],
      },
      {
        name: `Blood Rites - Battle Round 3+: Zealot's Rage`,
        desc: `Reroll hit rolls of 1 for friendly Daughters of Khaine units. In addition, if the unit is an Avatar of Khaine, it always counts as being Animated.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
      {
        name: `Blood Rites - Battle Round 4+: Slaughterer's Strength`,
        desc: `Reroll wound rolls of 1 for friendly Daughters of Khaine units.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
      {
        name: `Blood Rites - Battle Round 5+: Unquenchable Fervour`,
        desc: `Reroll save rolls of 1 for friendly Daughters of Khaine units.`,
        when: [SAVES_PHASE],
      },
      {
        name: `Blood Rites - Battle Round 5+: Unquenchable Fervour`,
        desc: `You do not need to take battleshock tests for friendly Daughters of Khaine units.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
  // Hagg Nar Flavor
  'Daughters of the First Temple': {
    effects: [
      {
        name: `Daughters of the First Temple`,
        desc: `Whilst a Hagg Nar unit is benefiting from Zealot's Rage (Blood Rite), you can reroll all failed hit rolls instead of hit rolls of 1.`,
        when: [HERO_PHASE],
      },
    ],
  },
  // Draichi Ganeth Flavor
  'Bladed Killers': {
    effects: [
      {
        name: `Bladed Killers`,
        desc: `Add 1 to the hit rolls for Draichi Ganeth units in the combat phase if they charged in the same turn.`,
        when: [CHARGE_PHASE, COMBAT_PHASE],
      },
    ],
  },
  // Kraith Flavor
  'Disciples of Slaughter': {
    effects: [
      {
        name: `Disciples of Slaughter`,
        desc: `Roll a D6 after a Kraith unit has fought if there are any enemy units within 3" of it. On a 6, you can pile in and attack with that unit for a second time.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  // Khailebron Flavor
  'Concealment and Stealth': {
    effects: [
      {
        name: `Concealment and Stealth`,
        desc: `Subtract 1 from hit rolls that target Khailebron units in this phase.`,
        when: [SHOOTING_PHASE],
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
