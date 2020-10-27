import { TAbilities } from 'types/army'
import {
  COMBAT_PHASE,
  END_OF_MOVEMENT_PHASE,
  END_OF_ROUND,
  HERO_PHASE,
  SHOOTING_PHASE,
  START_OF_HERO_PHASE,
  WOUND_ALLOCATION_PHASE,
} from 'types/phases'

// General Allegiance Abilities (always active regardless of army composition)
const Abilities: TAbilities = [
  {
    name: `Blood for the Blood God!`,
    desc: `At the start of the hero phase, you can use 1 or more Blood Tithe points to receive 1 reward from the Blood Tithe Rewards table below. Immediately carry out that reward's effect. Each reward costs a number of points, as shown on the Blood Tithe Rewards table, and you can only receive a reward if you have enough Blood Tithe points to pay its cost. Note that Blood Tithe points can be spent to receive the Spelleater Curse reward at any point during the hero phase, instead of at the start of the hero phase. If you choose a reward, after resolving its effects your Blood Tithe points total is reset to zero.`,
    when: [START_OF_HERO_PHASE],
  },
  {
    name: `Blood Tithe: Bloody Exemplar`,
    desc: `Cost: 1 BTP. You receive 1 command point.`,
    when: [START_OF_HERO_PHASE],
  },
  {
    name: `Blood Tithe: Spelleater Curse`,
    desc: `Cost: 2 BTP. Immediately unbind a spellcast before any unbind attempts are made.`,
    when: [HERO_PHASE],
  },
  {
    name: `Blood Tithe: Murderlust`,
    desc: `Cost: 3 BTP. Pick 1 friendly Khorne unit to make a normal move. You can choose to normal move or charge instead if it is within 12" of an enemy unit.`,
    when: [START_OF_HERO_PHASE],
  },
  {
    name: `Blood Tithe: Apoplectic Frenzy`,
    desc: `Cost: 4 BTP. Pick 1 friendly Khorne unit within 3" of an enemy unit can make a pile-in and attack with all its melee weapons.`,
    when: [START_OF_HERO_PHASE],
  },
  {
    name: `Blood Tithe: Brass Skull Meteor`,
    desc: `Cost: 5 BTP. Pick 1 unit anywhere on the battlefield to receive D3 mortal wounds. Roll a D6 for each unit within 8" of the target. On a 3+ the rolled for unit suffers 1 mortal wound (D3 mortal wounds instead if the roll was a 6).`,
    when: [START_OF_HERO_PHASE],
  },
  {
    name: `Blood Tithe: Relentless Fury`,
    desc: `Cost: 6 BTP. Until your next hero phase, each time a friendly Khorne model is slain, before the model is removed from play it may pile-in and attack with all of its melee weapons.`,
    when: [START_OF_HERO_PHASE],
  },
  {
    name: `Blood Tithe: Relentless Fury`,
    desc: `If active, before the buffed model is removed from play, it may pile-in and attack with all of its melee weapons.`,
    when: [WOUND_ALLOCATION_PHASE],
  },
  {
    name: `Blood Tithe: Crimson Rain`,
    desc: `Cost: 7 BTP. This may be used once per battle. Immeadiately and at the start of each subsequent hero phase you can heal up to D3 wounds allocated to each friendly Khorne unit on the battlefield.`,
    when: [START_OF_HERO_PHASE],
  },
  {
    name: `Blood Tithe: Slaughter Triumphant`,
    desc: `Cost: 8 BTP. This may be used once per battle. After you do so, if the unmodified hit roll for friendly Khorne melee weapon attacks is a 6, the attack counts for 2 hits instead of 1. Make wound/save rolls for each hit.`,
    when: [START_OF_HERO_PHASE],
  },
  {
    name: `Blood Blessings of Khorne`,
    desc: `KHORNE PRIESTS can attempt to bestow their blood blessing at the start of each of your hero phases. If they do roll a D6. On a 1 they suffer 1 mortal wounds and the prayer is not answered. On a 4+ the prayer is successful and you may carry out the effect.`,
    when: [START_OF_HERO_PHASE],
  },
  {
    name: `Locus of Fury`,
    desc: `You can reroll hit rolls of 1 for attacks made by friendly KHORNE DAEMON units while they are wholly within 12" of any friendly KHORNE DAEMON HEROES, or wholly within 16" of any friendly KHORNE GREATER DAEMONS.`,
    when: [COMBAT_PHASE, SHOOTING_PHASE],
  },
  {
    name: `Judgements of Khorne`,
    desc: `At the end of each battle round, roll a D6 for each judgement of Khorne on the battlefield that you set up. Add 1 to the roll if there are any KHORNE PRIESTS from your army wholly within 8" of that judgement of Khorne. On a 1-4, that judgement of Khorne is removed from the battlefield.`,
    when: [END_OF_ROUND],
  },
  {
    name: `Summon Daemons of Khorne`,
    desc: `If you have 2 or more Blood Tithe points at the end of your movement phase, you can summon one more more units onto the battlefield. If you summon any units in this manner, your Blood Tithe points total is reset to zero immediately after the last unit has been set up (you cannot save any Blood Tithe points you did not use).
    
    Summoned units must be set up wholly within 12" of a friendly KHORNE HERO or SKULL ALTAR and more than 9" away from any enemy units.`,
    when: [END_OF_MOVEMENT_PHASE],
  },
  {
    name: `Summon Daemons of Khorne`,
    desc: `Summoning Costs:
           1 Wrath of Khorne Bloodthirster -    8 BTP
           1 Bloodthirster of Unfettered Fury - 8 BTP
           1 Bloodthirster of Insensate Rage -  8 BTP
           20 Bloodletters -                    7 BTP
           15 Bloodletters -                    6 BTP
           10 Flesh Hounds -                    6 BTP
           1 Skull Cannon -                     5 BTP
           3 Bloodcrushers -                    5 BTP
           1 Herald of Khorne on Blood Throne - 4 BTP
           10 Bloodletters -                    4 BTP
           5 Flesh Hounds -                     3 BTP
           1 Skullmaster -                      3 BTP
           1 Bloodmaster -                      2 BTP
           5 Bloodletters -                     2 BTP`,
    when: [END_OF_MOVEMENT_PHASE],
  },
]

export default Abilities
