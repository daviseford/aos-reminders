import {
  COMBAT_PHASE,
  END_OF_MOVEMENT_PHASE,
  END_OF_ROUND,
  HERO_PHASE,
  SHOOTING_PHASE,
  START_OF_HERO_PHASE,
  START_OF_SETUP,
} from 'types/phases'
import { IEffects } from 'types/data'

// General Allegiance Abilities (always active regardless of army composition)
const Abilities: IEffects[] = [
  {
    name: `Skull Altar`,
    desc: `After territories have been chosen but before armies have been set up, you can set up the SKULL ALTAR for your army. The SKULL ALTAR must be set up wholly within your territory and more than 1" from any other terrain features. If both players can set up any terrain features before armies are set up, they must roll off, and the winner chooses who sets up their terrain features first.`,
    when: [START_OF_SETUP],
  },
  {
    name: `Skull Altar`,
    desc: `You can re-roll prayer and judgement rolls for friendly KHORNE PRIESTS wholly within 8" of this model.`,
    when: [HERO_PHASE],
    tag: `Words of Hate`,
  },
  {
    name: `Skull Altar`,
    desc: `Subtract 1 from casting rolls for WIZARDS while they are within 16" of this model.`,
    when: [HERO_PHASE],
    tag: `Witchbane`,
  },
  {
    name: `Blood for the Blood God!`,
    desc: `At the start of the hero phase, you can use 1 or more Blood Tithe points to receive 1 reward from the Blood Tithe Rewards table below. Immediately carry out that reward's effect. Each reward costs a number of points, as shown on the Blood Tithe Rewards table, and you can only receive a reward if you have enough Blood Tithe points to pay its cost. Note that Blood Tithe points can be spent to receive the Spelleater Curse reward at any point during the hero phase, instead of at the start of the hero phase. If you choose a reward, after resolving its effects your Blood Tithe points total is reset to zero.`,
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
    desc: `KHORNE PRIESTS can attempt to bestow their blood blessing at the start of each of your hero phases.`,
    when: [START_OF_HERO_PHASE],
  },
  {
    name: `Locus of Fury`,
    desc: `You can re-roll hit rolls of 1 for attacks made by friendly KHORNE DAEMON units while they are wholly within 12" of any friendly KHORNE DAEMON HEROES, or wholly within 16" of any friendly KHORNE GREATER DAEMONS.`,
    when: [COMBAT_PHASE, SHOOTING_PHASE],
  },
  {
    name: `Judgements of Khorne`,
    desc: `At the end of each battle round, roll a dice for each judgement of Khorne on the battlefield that you set up. Add 1 to the roll if there are any KHORNE PRIESTS from your army wholly within 8" of that judgement of Khorne. On a 1-4, that judgement of Khorne is removed from the battlefield.`,
    when: [END_OF_ROUND],
  },
  {
    name: `Judgements of Khorne`,
    desc: `At the start of your hero phase, friendly KHORNE PRIESTS can attempt to perform judgements.`,
    when: [START_OF_HERO_PHASE],
  },
]

export default Abilities
