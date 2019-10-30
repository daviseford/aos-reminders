import { TBattalions, TUnits } from 'types/army'
import { filterUnits } from 'utils/filterUtils'
import { Units as LegionsOfNagashUnits } from 'army/legions_of_nagash/units'
import {
  BATTLESHOCK_PHASE,
  CHARGE_PHASE,
  DURING_GAME,
  COMBAT_PHASE,
  START_OF_HERO_PHASE,
  SHOOTING_PHASE,
  HERO_PHASE,
  DURING_TURN,
} from 'types/phases'

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
        desc: `If the unmodified hit roll for an attack made with Soulcrusher Bludgeons is 6, that attack inflicts 2 mortal wounds on the target and the attack sequence ends (do not make a wound or save roll).`,
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
      {
        name: `Deadly Combination`,
        desc: `If the unmodified hit roll for an attack made with the Shield Immortis is 6, that attack inflicts 2 mortal wounds on the target in addition to any normal damage.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Mortarch of the Necropolis`,
        desc: `At the start of your hero phase, if this model is on the battlefield you can pick up to 3 different friendly OSSIARCH BONEREAPERS units wholly within 24" of this model. For each of those units, you can either heal up to 3 wounds allocated to that unit or, if no wounds are allocated to it, you can return a number of slain models to that unit with a combined Wounds characteristic of 3 or less.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Nadirite Weapons`,
        desc: `If the unmodified hit roll for an attack made with a Nadirite weapon is 6, that attack scores 2 hits on the target instead of 1. Make a wound and save roll for each hit.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Endless Duty`,
        desc: `You can use this command ability in your shooting phase or any combat phase. If you do so, pick 1 friendly OSSIARCH BONEREAPERS unit that is wholly within 12" of a model with this command ability. Add 1 to the Attacks characteristic of weapons used by that unit in that phase. You cannot pick the same unit to benefit from this command ability more than once per phase.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
        command_ability: true,
      },
      {
        name: `Supreme Lord of the Bonereaper Legions`,
        desc: `You can use this command ability in your hero phase if Katakros is your general. If you do so, until your next hero phase, add 1 to hit rolls for attacks made by friendly OSSIARCH BONEREAPERS units while they are wholly within 18" of this model, and add 1 to save rolls for attacks that target friendly Mortis Praetorian units while they are wholly within 18" of this model. You can only use this command ability once per hero phase.`,
        when: [HERO_PHASE],
        command_ability: true,
      },
      {
        name: `Aviarch Spymaster`,
        desc: `Once per turn you can roll a dice when your opponent receives a command point. If you do so, on a 4+ that command point is lost.`,
        when: [DURING_TURN],
        command_trait: true,
      },
      {
        name: `Gnosis Scrollbearer`,
        desc: `At the start of your hero phase, you can pick 1 enemy unit that is on the battlefield. Until your next hero phase, subtract 1 from hit rolls for attacks made by that unit that target friendly OSSIARCH BONEREAPERS units.`,
        when: [START_OF_HERO_PHASE],
        command_trait: true,
      },
      {
        name: `Prime Necrophoros`,
        desc: `When you use this model's Supreme Lord of the Bonereaper Legions command ability, it affects friendly OSSIARCH BONEREAPERS units while they are wholly within 36" of this model instead of wholly within 18" of this model.`,
        when: [HERO_PHASE],
        command_trait: true,
      },
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
