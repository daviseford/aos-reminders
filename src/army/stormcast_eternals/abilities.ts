import { DURING_SETUP, END_OF_MOVEMENT_PHASE, COMBAT_PHASE, SHOOTING_PHASE } from 'types/phases'
import { TAbilities } from 'types/army'

// General Allegiance Abilities (always active regardless of army composition)
const Abilities: TAbilities = [
  {
    name: `Scions of the Storm`,
    desc: `Setup 1 unit in the Celestial Realm for every unit you setup on the battlefield. At the end of your movement phase you can set up one or more reserve units more than 9" from the enemy. Any units not setup before the 4th Battleround are slain.`,
    when: [DURING_SETUP, END_OF_MOVEMENT_PHASE],
  },
  {
    name: `Shock and Awe`,
    desc: `Subtract 1 from hit rolls for attacks that target any unit setup this turn.`,
    when: [COMBAT_PHASE, SHOOTING_PHASE],
  },
]

export default Abilities
