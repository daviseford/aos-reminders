import {
  COMBAT_PHASE,
  END_OF_MOVEMENT_PHASE,
  END_OF_ROUND,
  SHOOTING_PHASE,
  START_OF_HERO_PHASE,
} from 'types/phases'
import { TAbilities } from 'types/army'

// General Allegiance Abilities (always active regardless of army composition)
const Abilities: TAbilities = [
  {
    name: `Blood for the Blood God!`,
    desc: `At the start of the hero phase, you can use 1 or more Blood Tithe points to receive 1 reward from the Blood Tithe Rewards table below. Immediately carry out that reward's effect. Each reward costs a number of points, as shown on the Blood Tithe Rewards table, and you can only receive a reward if you have enough Blood Tithe points to pay its cost. Note that Blood Tithe points can be spent to receive the Spelleater Curse reward at any point during the hero phase, instead of at the start of the hero phase. If you choose a reward, after resolving its effects your Blood Tithe points total is reset to zero.`,
    when: [START_OF_HERO_PHASE],
  },
  {
    name: `Summon Daemons of Khorne`,
    desc: `If you have 2 or more Blood Tithe points at the end of your movement phase, you can summon one more more units onto the battlefield. If you summon any units in this manner, your Blood Tithe points total is reset to zero immediately after the last unit has been set up (you cannot save any Blood Tithe points you did not use).
    
    Summoned units must be set up wholly within 12" of a friendly KHORNE HERO or SKULL ALTAR and more than 9" away from any enemy units.`,
    when: [END_OF_MOVEMENT_PHASE],
  },
  {
    name: `Blood Blessings of Khorne`,
    desc: `KHORNE PRIESTS can attempt to bestow their blood blessing at the start of each of your hero phases. If they do roll a D6. On a 1 they suffer D3 mortal wounds. Otherwise on a 4+ the prayer is successful and you may carry out the effect.`,
    when: [START_OF_HERO_PHASE],
  },
  {
    name: `Locus of Fury`,
    desc: `You can re-roll hit rolls of 1 for attacks made by friendly KHORNE DAEMON units while they are wholly within 12" of any friendly KHORNE DAEMON HEROES, or wholly within 16" of any friendly KHORNE GREATER DAEMONS.`,
    when: [COMBAT_PHASE, SHOOTING_PHASE],
  },
  {
    name: `Judgements of Khorne`,
    desc: `At the end of each battle round, roll a D6 for each judgement of Khorne on the battlefield that you set up. Add 1 to the roll if there are any KHORNE PRIESTS from your army wholly within 8" of that judgement of Khorne. On a 1-4, that judgement of Khorne is removed from the battlefield.`,
    when: [END_OF_ROUND],
  },
]

export default Abilities
