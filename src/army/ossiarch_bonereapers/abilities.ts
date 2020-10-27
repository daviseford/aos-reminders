import { TAbilities } from 'types/army'
import { BATTLESHOCK_PHASE, MOVEMENT_PHASE, START_OF_ROUND, WOUND_ALLOCATION_PHASE } from 'types/phases'

// General Allegiance Abilities
const Abilities: TAbilities = [
  {
    name: `Deathless Warriors`,
    desc: `Roll a D6 each time you allocate a wound or mortal wound to a friendly unit that has the HEKATOS keyword, or is wholly within 6" of a friendly Mortek Hekatos, or is wholly within 12" of a friendly OSSIARCH BONEREAPERS HERO. On a 6, that wound or mortal wound is negated.`,
    when: [WOUND_ALLOCATION_PHASE],
  },
  {
    name: `Ranks Unbroken By Dissent`,
    desc: `Do not take battleshock tests for friendly OSSIARCH BONEREAPERS units.`,
    when: [BATTLESHOCK_PHASE],
  },
  {
    name: `Ranks Unbroken By Dissent`,
    desc: `If your army is an Ossiarch Bonereapers army, you cannot use command points. Instead, you use relentless discipline points. At the start of each battle round, before determining who has the first turn, you receive 1 relentless discipline point for each friendly OSSIARCH BONEREAPERS HERO that is on the battlefield. You receive 1 additional relentless discipline point for each warscroll battalion in your army and each friendly LIEGE that is on the battlefield, and 3 additional relentless discipline points if KATAKROS is your general and is on the battlefield. Then, roll a D6 for each friendly OSSIARCH BONEREAPERS unit on the battlefield (including the HEROES above). For each 6, you receive 1 additional relentless discipline point.

     Relentless discipline points are used in the same manner as command points, but can only be used for command abilities that appear on a warscroll that has the OSSIARCH BONEREAPERS keyword, for Ossiarch Bonereaper Legion command abilities and for the Unstoppable Advance command ability below.
     
     When you generate your relentless discipline points at the start of the battle round, any that you had left over from the previous battle round are lost.`,
    when: [START_OF_ROUND],
  },
  {
    name: `Unstoppable Advance`,
    desc: `You can use this command ability in your movement phase. If you do so, pick 1 friendly unit that has the HEKATOS keyword, or is wholly within 6" of a friendly Mortek Hekatos, or is wholly within 12" of a friendly OSSIARCH BONEREAPERS HERO. Add 3" to that unit's Move characteristic in that phase (it can still run, or charge if it does not run). You cannot pick the same unit to benefit from this command ability more than once per phase.`,
    when: [MOVEMENT_PHASE],
    command_ability: true,
  },
]

export default Abilities
