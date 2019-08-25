import {
  BATTLESHOCK_PHASE,
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_SETUP,
  START_OF_MOVEMENT_PHASE,
} from 'types/phases'
import { TAbilities } from 'types/army'

// General Allegiance Abilities (always active regardless of army composition)
const Abilities: TAbilities = [
  {
    name: `Aura of Dread`,
    desc: `Subtract 1 from the Bravery characteristic of enemy units while they are within 6" of any friendly NIGHTHAUNT units.`,
    when: [BATTLESHOCK_PHASE],
  },
  {
    name: `Deathless Spirit`,
    desc: `Roll a D6 each time you allocate a wound or mortal wound to a friendly NIGHTHAUNT model from a unit wholly within 12" of your general or a friendly NIGHTHAUNT HERO. On a 6+, that wound or mortal wound is negated.`,
    when: [COMBAT_PHASE],
  },
  {
    name: `From the Underworlds They Come`,
    desc: `Instead of setting up a NIGHTHAUNT unit on the battlefield, you can place it to one side and say that it is set up in the underworlds as a reserve unit. You can set up one unit in the underworlds for each unit you set up on the battlefield. At the end of your movement phase you can set up any of these units more than 9" from any enemy models. This counts as their move for that turn. Any units which are not set up on the battlefield before the start of the fourth battle round are slain.`,
    when: [DURING_SETUP],
  },
  {
    name: `Feed On Terror`,
    desc: `Each time an enemy unit fails a battleshock test, pick one friendly NIGHTHAUNT HERO within 6" of that enemy unit. Heal 1 wound that has been allocated to that HERO.`,
    when: [BATTLESHOCK_PHASE],
  },
  {
    name: `Wave of Terror`,
    desc: `If you make an unmodified charge roll of 10+ for a friendly NIGHTHAUNT unit, it can fight immediately after you complete the charge move. This does not stop the unit from being picked to fight in the combat phase of the same turn.`,
    when: [CHARGE_PHASE],
  },
  {
    name: `Spectral Summons`,
    desc: `You can use this command ability at the start of your movement phase. If you do so, pick a friendly NIGHTHAUNT unit that is on the battlefield. Remove that unit from the battlefield, and then set it up wholly within 12" of your general and more than 9" from any enemy models. This counts as their move for that movement phase.`,
    when: [START_OF_MOVEMENT_PHASE],
    command_ability: true,
  },
]

export default Abilities
