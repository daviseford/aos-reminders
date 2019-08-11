import { HERO_PHASE, COMBAT_PHASE, CHARGE_PHASE } from 'types/phases'
import { TAbilities } from 'types/army'

// General Allegiance Abilities (always active regardless of army composition)
const Abilities: TAbilities = [
  {
    name: `Mighty Destroyers`,
    desc: `You can use this command ability in your hero phase. If you do so, pick 1 friendly IRONJAWZ unit wholly within 12" of a friendly IRONJAWZ HERO, or wholly within 18" of a friendly IRONJAWZ HERO that is a general. That unit can make a normal move if it is more than 12" from any enemy units, pile in and attack with its melee weapons if it is within 3" of any enemy units, or attempt to charge in any other circumstance. You cannot pick the same unit to benefit from this command ability more than once per hero phase.`,
    when: [HERO_PHASE],
    command_ability: true,
  },
  {
    name: `Smashing and Bashing`,
    desc: `In the combat phase, after a friendly IRONJAWZ unit has made all of its attacks, if the attacks made by that unit resulted in any enemy units being destroyed, 1 friendly IRONJAWZ unit that has not yet fought in that combat phase can fight, instead of doing so later in the phase.`,
    when: [COMBAT_PHASE],
  },
  {
    name: `Eager for Battle`,
    desc: `Add 1 to charge rolls for friendly IRONJAWZ units.`,
    when: [CHARGE_PHASE],
  },
]

export default Abilities
