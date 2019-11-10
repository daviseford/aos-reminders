import { COMBAT_PHASE, CHARGE_PHASE, DURING_GAME, HERO_PHASE, START_OF_COMBAT_PHASE } from 'types/phases'
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
  {
    name: `Mad as Hell`,
    desc: `At the end of any phase, if any wounds or mortal wounds have been inflicted in that phase on an IRONJAWZ unit that is more than 9" from any enemy units, that IRONJAWZ unit can move D6".`,
    when: [DURING_GAME],
  },
  {
    name: `Ironjawz Waaaagh!`,
    desc: `You can use this command ability once per battle at the start of your combat phase if your army has a MEGABOSS' general, Roll a D6 and add all the units that are wholly within 18" of your general. On an 11 or lower, all friendly Ironjawz units wholly within range of the general get +1 to their attacks, if the roll is 12 or more then add +2 to their attacks instead.`,
    when: [START_OF_COMBAT_PHASE],
    command_ability: true,
  },
]

export default Abilities
