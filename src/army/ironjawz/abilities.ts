import { HERO_PHASE, COMBAT_PHASE, CHARGE_PHASE } from 'types/phases'
import { IEffects } from 'types/data'

// General Allegiance Abilities (always active regardless of army composition)
const Abilities: IEffects[] = [
  {
    name: `Mighty Destroyers`,
    desc: `Roll a dice in your hero phase for your general and each friendly IRONJAWZ HERO. Add 2 to the roll for your general if they are a MEGABOSS. On a 6+ pick a friendly IRONJAWZ unit wholly within 12" of the model being rolled for. That unit can immediately make a normal move if it is more than 12" from the enemy, can immediately pile in if it is within 3" of the enemy (but not attack), and can attempt a charge in any other circumstances.`,
    when: [HERO_PHASE],
  },
  {
    name: `Smashing and Bashing`,
    desc: `In the combat phase, after a friendly IRONJAWZ unit has made all of its attacks, if the attacks made by that unit resulted in any enemy units being destroyed, one friendly IRONJAWZ unit that has not yet fought in that combat phase can fight, instead of doing so later in the phase.`,
    when: [COMBAT_PHASE],
  },
  {
    name: `Eager for Battle`,
    desc: `Add 1 to charge rolls for friendly IRONJAWZ units.`,
    when: [CHARGE_PHASE],
  },
]

export default Abilities
