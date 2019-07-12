import { HERO_PHASE, START_OF_HERO_PHASE, END_OF_MOVEMENT_PHASE, COMBAT_PHASE, SHOOTING_PHASE } from 'types/phases'
import { IEffects } from 'types/data'

// General Allegiance Abilities (always active regardless of army composition)
const Abilities: IEffects[] = [
  {
    name: `Blood for the Blood God!`,
    desc: `At the start of the hero phase, you can use 1 or more Blood Tithe points to receive 1 reward from the Blood Tithe Rewards table below. Immediately carry out that reward’s effect. Each reward costs a number of points, as shown on the Blood Tithe Rewards table, and you can only receive a reward if you have enough Blood Tithe points to pay its cost. Note that Blood Tithe points can be spent to receive the Spelleater Curse reward at any point during the hero phase, instead of at the start of the hero phase. If you choose a reward, after resolving its effects your Blood Tithe points total is reset to zero.`,
    when: [START_OF_HERO_PHASE],
  },
  {
    name: `Summon Daemons of Khorne`,
    desc: `If you have 2 or more Blood Tithe points at the end of your movement phase, you can summon one more more units onto the battlefield. If you summon any units in this manner, your Blood Tithe points total is reset to zero immediately after the last unit has been set up (you cannot save any Blood Tithe points you did not use).
    
    Summoned units must be set up wholly within 12" of a friendly KHORNE HERO and more than 9" away from any enemy units.`,
    when: [END_OF_MOVEMENT_PHASE],
  },
  {
    name: `Blood Blessings of Khorne`,
    desc: `KHORNE PRIESTS can attempt to bestow their blood blessing in each of your hero phases in addition to any prayers they may know. To do so, roll a dice, adding 1 to the result if the priest slew any enemy models in the previous turn. If the result is 4+, the effect takes place. If the result is 1, the priest suffers D3 mortal wounds.`,
    when: [HERO_PHASE],
  },
  {
    name: `Locus of Fury`,
    desc: `You can re-roll hit rolls of 1 for attacks made by friendly KHORNE DAEMON units while they are wholly within 12" of any friendly KHORNE DAEMON HEROES, or wholly within 16" of any friendly KHORNE GREATER DAEMONS.`,
    when: [COMBAT_PHASE, SHOOTING_PHASE],
  },
]

export default Abilities
