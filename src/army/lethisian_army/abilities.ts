import {
  BATTLESHOCK_PHASE,
  CHARGE_PHASE,
  COMBAT_PHASE,
  MOVEMENT_PHASE,
  START_OF_COMBAT_PHASE,
} from 'types/phases'
import { TAbilities } from 'types/army'

// General Allegiance Abilities (always active regardless of army composition)
const Abilities: TAbilities = [
  {
    name: `Warriors of the Grand Necropolis`,
    desc: `You can re-roll battleshock tests for friendly Lethisian Defender units.`,
    when: [BATTLESHOCK_PHASE],
  },
  {
    name: `Warriors of the Grand Necropolis`,
    desc: `Add 1 to hit rolls for melee weapons used by Human/Duradin Lethisian Defender units in this army that target enemy units who have made a charge move in this turn.`,
    when: [COMBAT_PHASE],
  },
  {
    name: `Akhelian Phalanx`,
    desc: `Add 1 to the move characterstic of Akhelian Lethisian Defender units.`,
    when: [MOVEMENT_PHASE],
  },
  {
    name: `Akhelian Phalanx`,
    desc: `Add 1 to the charge rolls of Akhelian Lethisian Defender units.`,
    when: [CHARGE_PHASE],
  },
  {
    name: `Onyx Shield Wall (Command Ability)`,
    desc: `Use this command ability during the enemy's turn. Pick 1 friendly Lethisian Defender Liberator unit wholly within 12" of a Lethisian Defender Stormcast Eternal hero. Until the end of the phase, add 1 to the save rolls of the Liberator unit.`,
    when: [START_OF_COMBAT_PHASE],
  },
  {
    name: `Onyx Shield Wall`,
    desc: `If active, the buffed Liberator unit cannot pile-in before attacking.`,
    when: [COMBAT_PHASE],
  },
]

export default Abilities
