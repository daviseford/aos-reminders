import { TBattleTraits } from 'types/army'
import { COMBAT_PHASE, DURING_SETUP, END_OF_MOVEMENT_PHASE } from 'types/phases'

// General Allegiance Abilities (always active regardless of army composition)
const Abilities: TBattleTraits = [
  {
    name: `Scions of the Storm`,
    desc: `Set up 1 unit in the Celestial Realm for every unit you set up on the battlefield. At the end of your movement phase you can set up one or more reserve units more than 9" from the enemy. Any units not set up before the 4th Battleround are slain.`,
    when: [DURING_SETUP, END_OF_MOVEMENT_PHASE],
  },
  {
    name: `Shock and Awe`,
    desc: `Subtract 1 from hit rolls for attacks that target any unit set up this turn.`,
    when: [COMBAT_PHASE],
  },
]

export default Abilities
