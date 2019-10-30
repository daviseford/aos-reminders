import { TBattalions, TUnits } from 'types/army'
import { filterUnits } from 'utils/filterUtils'
import { Units as LegionsOfNagashUnits } from 'army/legions_of_nagash/units'
import { BATTLESHOCK_PHASE, CHARGE_PHASE, DURING_GAME, COMBAT_PHASE } from 'types/phases'

const getLegionsOfNagashUnits = () => {
  const listOfUnits = [`Nagash, Supreme Lord of the Undead`, `Arkhan the Black, Mortarch of Sacrament`]
  return filterUnits(LegionsOfNagashUnits, listOfUnits)
}

const HeraldsOfTheAccursedOneEffect = {
  name: `Heralds of the Accursed One`,
  desc: `Subtract 1 from the Bravery characteristic of enemy units while they are within 6" of any friendly MORGHASTS.`,
  when: [BATTLESHOCK_PHASE],
}

// Unit Names
export const Units: TUnits = [
  ...getLegionsOfNagashUnits(),
  {
    name: `Gothizzar Harvester`,
    effects: [
      {
        name: `Bone Harvest`,
        desc: `Roll a dice each time a model is slain within 3" of this model. On a 4+, you can pick 1 friendly OSSIARCH BONEREAPERS unit within 6" of this model. If you do so, and the slain model had a Wounds characteristic of:
             
        4 or less - you can heal 1 wound allocated to that unit
        5-9 - you can heal up to D3 wounds allocated to that unit
        10 or more - you can heal up to D6 wounds allocated to that unit. 
        
        If there are no wounds allocated to the unit you pick, you can return a number of slain models to that unit with a combined Wounds chacteristic that is equal to or less than the number of wounds you could have healed.`,
        when: [DURING_GAME],
      },
      {
        name: `Soulcrusher Bludgeons`,
        desc: `If the unmodified hit roll for an attack made with Soulcrusher Bludgeons is 6, that attack inflicts 2 mortal wounds on the target and the attack sequence ends (do not make a wound or save roll)`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Soulcleaver Sickles`,
        desc: `Add 1 to hit rolls for attacks made with Soulcleaver Sickles if the target unit has 5 or more models.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Immortis Guard`,
    effects: [
      //      {
      //       name: `TBD`,
      //        desc: `TBD.`,
      //        when: [HERO_PHASE],
      //      },
    ],
  },
  {
    name: `Mortek Guard`,
    effects: [
      //      {
      //       name: `TBD`,
      //        desc: `TBD.`,
      //        when: [HERO_PHASE],
      //      },
    ],
  },
  {
    name: `Kavalos Deathriders`,
    effects: [
      //      {
      //       name: `TBD`,
      //        desc: `TBD.`,
      //        when: [HERO_PHASE],
      //      },
    ],
  },
  {
    name: `Mortisian Priest`,
    effects: [
      //      {
      //       name: `TBD`,
      //        desc: `TBD.`,
      //        when: [HERO_PHASE],
      //      },
    ],
  },
  {
    name: `Necropolis Stalkers`,
    effects: [
      //      {
      //       name: `TBD`,
      //        desc: `TBD.`,
      //        when: [HERO_PHASE],
      //      },
    ],
  },
  {
    name: `Mortek Crawler`,
    effects: [
      //      {
      //       name: `TBD`,
      //        desc: `TBD.`,
      //        when: [HERO_PHASE],
      //      },
    ],
  },
  {
    name: `Orpheon Katakros`,
    effects: [
      //      {
      //       name: `TBD`,
      //        desc: `TBD.`,
      //        when: [HERO_PHASE],
      //      },
    ],
  },
  {
    name: `Morghast Archai`,
    effects: [
      HeraldsOfTheAccursedOneEffect,
      {
        name: `Ebon-wrought Armour`,
        desc: `Each time you allocate a mortal wound to this unit, roll a dice. On a 5+, that mortal wound is ignored.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Morghast Harbingers`,
    effects: [
      HeraldsOfTheAccursedOneEffect,
      {
        name: `Harbingers of Death`,
        desc: `You can attempt to charge with this unit if it is within 18" of the enemt instead of 12". Roll 3D6 instead of 2D6 when making a charge roll for this unit.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
]

// Battalions
export const Battalions: TBattalions = [
  //  {
  //    name: ``,
  //    effects: [
  //      {
  //        name: ``,
  //        desc: ``,
  //        when: [HERO_PHASE],
  //      },
  //    ],
  //  },
]
