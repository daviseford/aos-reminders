import { TAbilities } from 'types/army'
import {
  BATTLESHOCK_PHASE,
  CHARGE_PHASE,
  COMBAT_PHASE,
  MOVEMENT_PHASE,
  SHOOTING_PHASE,
  START_OF_ROUND,
  WOUND_ALLOCATION_PHASE,
} from 'types/phases'

// General Allegiance Abilities (always active regardless of army composition)
const Abilities: TAbilities = [
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
    when: [SHOOTING_PHASE, COMBAT_PHASE],
  },
  {
    name: `Blood Rites - Battle Round 5+: Unquenchable Fervour`,
    desc: `You do not need to take battleshock tests for friendly Daughters of Khaine units.`,
    when: [BATTLESHOCK_PHASE],
  },
]

export default Abilities
