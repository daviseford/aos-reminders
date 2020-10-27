import { Units as LegionsOfNagashUnits } from 'army/legions_of_nagash/units'
import { TBattalions, TUnits } from 'types/army'
import {
  BATTLESHOCK_PHASE,
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  DURING_TURN,
  END_OF_HERO_PHASE,
  END_OF_SETUP,
  HERO_PHASE,
  MOVEMENT_PHASE,
  SHOOTING_PHASE,
  START_OF_COMBAT_PHASE,
  START_OF_HERO_PHASE,
  WOUND_ALLOCATION_PHASE,
} from 'types/phases'
import { filterUnits } from 'utils/filterUtils'

const getLegionsOfNagashUnits = () => {
  const listOfUnits = [`Nagash, Supreme Lord of the Undead`, `Arkhan the Black, Mortarch of Sacrament`]
  return filterUnits(LegionsOfNagashUnits, listOfUnits)
}

const NecrophorosEffect = {
  name: `Necrophoros`,
  desc: `Add 1 to run rolls and charge rolls for a unit that includes any Necrophoroi.`,
  when: [MOVEMENT_PHASE, CHARGE_PHASE],
}
const NadariteWeaponsEffect = {
  name: `Nadirite Weapons`,
  desc: `If the unmodified hit roll for an attack made with this unit's Nadirite Blades or Nadirite Spears is 6, that attack scores 2 hits on the target instead of 1. Make a wound and save roll for each hit. For attacks made with Nadirite Spears, 2 hits are scored on a 5+ instead of 6 if this unit made a charge move in the same turn.`,
  when: [COMBAT_PHASE],
}
const HeraldsOfTheAccursedOneEffect = {
  name: `Heralds of the Accursed One`,
  desc: `Subtract 1 from the Bravery characteristic of enemy units while they are within 6" of any friendly MORGHASTS.`,
  when: [BATTLESHOCK_PHASE],
}
const EndlessDutyEffect = {
  name: `Endless Duty`,
  desc: `You can use this command ability in your shooting phase or any combat phase. If you do so, pick 1 friendly OSSIARCH BONEREAPERS unit that is wholly within 12" of a model with this command ability. Add 1 to the Attacks characteristic of weapons used by that unit in that phase. You cannot pick the same unit to benefit from this command ability more than once per phase.`,
  when: [SHOOTING_PHASE, COMBAT_PHASE],
  command_ability: true,
}

export const AlliedUnits: TUnits = [...getLegionsOfNagashUnits()]

// Unit Names
export const Units: TUnits = [
  {
    name: `Gothizzar Harvester`,
    effects: [
      {
        name: `Bone Harvest`,
        desc: `Roll a D6 each time a model is slain within 3" of any model with this ability. On a 4+, you can pick 1 friendly OSSIARCH BONEREAPERS unit within 6" of this model. If you do so, and the slain model had a Wounds characteristic of:

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
    name: `Arch-Kavalos Zandtos`,
    effects: [
      {
        name: `The Dark Lance`,
        desc: `The Dark Lance has a Damage characteristic of 3 instead of 2 if this model made a charge move in the same turn.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Hatred of the Living`,
        desc: `Reroll wound rolls of 1 for attacks made by this model that target ORDER and DESTRUCTION units. You can reroll any wound rolls for attacks made by this model that target CHAOS units.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Unstoppable Charge`,
        desc: `After this model makes a charge move, you can pick 1 enemy unit within 1" of this model and roll a number of dice equal to the charge roll for that charge move. For each 6, that enemy unit suffers 1 mortal wound.`,
        when: [CHARGE_PHASE],
      },
      {
        name: `Unstoppable Charge`,
        desc: `This model can move an extra 3" when it piles in if it made a charge move in the same turn.`,
        when: [COMBAT_PHASE],
      },
      EndlessDutyEffect,
      {
        name: `Still Their Breath!`,
        desc: `You can use this command ability in your shooting phase or any combat phase. If you do so, pick 1 friendly MORTIS PRAETORIANS unit that is wholly within 24" of this model. Reroll wound rolls of 1 for attacks made by that unit that target ORDER and DESTRUCTION units until the end of that phase. You can reroll any wound rolls for attacks made by that unit that target CHAOS units until the end of that phase.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
        command_ability: true,
      },
    ],
  },
  {
    name: `Immortis Guard`,
    effects: [
      {
        name: `Deadly Combination`,
        desc: `If the unmodified hit roll for an attack made with a Nadirite Battle-shield is 6, that attack inflicts 1 mortal wound on the target in addition to any normal damage.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Soulbound Protectors`,
        desc: `Roll a D6 before you allocate a wound or mortal wound to a friendly OSSIARCH BONEREAPERS HERO while it is within 3" of any friendly units with this ability. On a 2+, you must allocate that wound or mortal wound to a friendly unit with this ability that is within 3" of that OSSIARCH BONEREAPERS HERO instead of allocating it to that OSSIARCH BONEREAPERS HERO.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
      {
        name: `Crushing Assault`,
        desc: `You can use this command ability in your combat phase after a friendly IMMORTIS GUARD unit has fought in that phase for the first time. If you do so, if that unit is within 3" of an enemy unit, it can make a pile-in move and then attack with its Nadirite Battle-shields for a second time.`,
        when: [COMBAT_PHASE],
        command_ability: true,
      },
    ],
  },
  {
    name: `Liege-Kavalos`,
    effects: [
      {
        name: `Unstoppable Charge`,
        desc: `After this model makes a charge move, you can pick 1 enemy unit within 1" of this model and roll a number of dice equal to the charge roll for that charge move. For each 6, that enemy unit suffers 1 mortal wound.`,
        when: [CHARGE_PHASE],
      },
      {
        name: `Unstoppable Charge`,
        desc: `This model can move an extra 3" when it piles in if it made a charge move in the same turn.`,
        when: [COMBAT_PHASE],
      },
      EndlessDutyEffect,
    ],
  },
  {
    name: `Vokmortian`,
    effects: [
      {
        name: `Contract of Nagash`,
        desc: `At the start of the combat phase, roll a D6. On a 5+, you can pick 1 enemy model within 3" of Vokmortian. That enemy model cannot attack Vokmortian in that combat phase.`,
        when: [START_OF_COMBAT_PHASE],
      },
      {
        name: `Grim Warnings`,
        desc: `Subtract 1 from the Bravery characteristic of enemy units while they are within 12" of this model. If an enemy general is slain within 3" of this model, for the rest of the battle subtract 2 from the Bravery of enemy units within 12" of this model instead of 1.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Grim Warnings`,
        desc: `Subtract 1 from unbinding rolls for WIZARDS attempting to unbind a spell cast by this model. If an enemy general is slain within 3" of this model, for the rest of the battle subtract 2 from unbinding rolls for WIZARDS attempting to unbind a spell cast by this model instead of 1.`,
        when: [HERO_PHASE],
      },
      {
        name: `Mortal Touch`,
        desc: `Casting value of 8. Pick 1 enemy model within 1" of the caster that is visible to them and roll a D6. On a 5+, that model is slain. The range of this spell cannot be modified.`,
        when: [HERO_PHASE],
        spell: true,
      },
    ],
  },
  {
    name: `Mortek Guard`,
    effects: [
      NecrophorosEffect,
      {
        name: `Mortek Hekatos`,
        desc: `1 model in this unit can be a Mortek Hekatos. Add 1 to the Attacks characteristic of that model's melee weapon.`,
        when: [COMBAT_PHASE],
      },
      NadariteWeaponsEffect,
      {
        name: `Shieldwall`,
        desc: `You can use this command ability at the start of the combat phase. If you do so, pick 1 friendly MORTEK GUARD unit that includes a Mortek Hekatos. You can reroll save rolls for attacks that target that unit until the end of that combat phase.`,
        when: [START_OF_COMBAT_PHASE],
        command_ability: true,
      },
    ],
  },
  {
    name: `Kavalos Deathriders`,
    effects: [
      NecrophorosEffect,
      {
        name: `Mortek Hekatos`,
        desc: `1 model in this unit can be a Mortek Hekatos. Add 1 to the Attacks characteristic of that model's Nadirite Blade or Nadirite Spear.`,
        when: [COMBAT_PHASE],
      },
      NadariteWeaponsEffect,
      {
        name: `Deathrider Wedge`,
        desc: `You can use this command ability when a friendly Kavalos Deathriders unit that includes a Mortek Hekatos finishes a charge move. You can pick 1 enemy unit within 1" of that Kavalos Deathriders unit and roll a number of dice equal to the number of models in that Kavalos Deathriders unit. For each 5+, the enemy unit suffers 1 mortal wound.

        In addition, in the following combat phase, that Kavalos Deathriders unit can move an extra 3" when it piles in. The same unit cannot benefit from this command ability more than once per turn.`,
        when: [CHARGE_PHASE],
        command_ability: true,
      },
      {
        name: `Deathrider Wedge`,
        desc: `If this ability is active, this Kavalos Deathriders unit can move an extra 3" when it piles in.`,
        when: [COMBAT_PHASE],
        command_ability: true,
      },
    ],
  },
  {
    name: `Mortisan Boneshaper`,
    effects: [
      {
        name: `Boneshaper`,
        desc: `In your hero phase, you can pick 1 friendly OSSIARCH BONEREAPERS unit within 6" of this model. You can either heal up to 3 wounds that have been allocated to that unit or, if no wounds have been allocated to the unit, you can return a number of slain models to it that have a combined Wounds characteristic of 3 or less.`,
        when: [HERO_PHASE],
      },
      {
        name: `Shard-storm`,
        desc: `Casting value of 5. Pick 1 enemy unit and roll 1 dice for each model from that unit that is within 18" of the caster and visible to them. For each 6, that unit suffers 1 mortal wound.`,
        when: [HERO_PHASE],
        spell: true,
      },
    ],
  },
  {
    name: `Mortisan Soulmason`,
    effects: [
      {
        name: `Mortek Throne`,
        desc: `At the end of your hero phase, roll a D6 for this model. On a 1, nothing happens. On a 2-5, this model can attempt to cast Soul-guide even if a casting attempt has already been made for that spell in the same phase. On a 6, this model can attempt to cast Soul-guide D3 more times even if a casting attempt has already been made for that spell in the same phase.`,
        when: [END_OF_HERO_PHASE],
      },
      {
        name: `Soul-guide`,
        desc: `Casting value of 6. Pick 1 friendly OSSIARCH BONEREAPERS unit wholly within 24" of the caster that is visible to them. You can reroll hit rolls of 1 for attacks made by that unit until your next hero phase.`,
        when: [HERO_PHASE],
        spell: true,
      },
    ],
  },
  {
    name: `Mortisan Soulreaper`,
    effects: [
      {
        name: `Deathly Touch`,
        desc: `If the unmodified hit roll for an attack made with a Soulreaper Scythe is 6, that attack inflicts 2 mortal wounds on the target and the attack sequence ends (do not make a wound or save roll).`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Soulreaper`,
        desc: `You can reroll hit rolls for attacks made with a Soulreaper Scythe if the target unit has 5 or more models.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Soul-blast`,
        desc: `Casting value of 7. You can either roll 1 dice for each enemy unit within 3" of the caster or roll 1 dice for 1 enemy unit within 18" of the caster that is visible to them. On a 1, nothing happens. On a 2-3, that unit suffers 1 mortal wound. On a 4+, that unit suffers D3 mortal wounds.`,
        when: [HERO_PHASE],
        spell: true,
      },
    ],
  },
  {
    name: `Necropolis Stalkers`,
    effects: [
      {
        name: `Quadrarch Aspects`,
        desc: `At the start of each combat phase, you must pick one of the following aspects for this unit. The rule for that aspect applies to this unit until the end of that phase.

        Blade-strike Aspect: You can reroll hit rolls for attacks made by this unit.

        Blade-parry Aspect: You can reroll save rolls for attacks that target this unit.

        Destroyer Aspect: You can reroll wound rolls for attacks made by this unit.

        Precision Aspect: Improve the Rend and Damage characteristics of this unit's melee weapons by 1.`,
        when: [START_OF_COMBAT_PHASE],
      },
      {
        name: `Hunt and Kill`,
        desc: `You can use this command ability at the start of your hero phase. If you do so, pick 1 friendly NECROPOLIS STALKERS unit. You can reroll run and charge rolls for that unit until your next hero phase. In addition, until your next hero phase, when that unit makes a move, it can pass across terrain features in the same manner as a model that can fly.`,
        when: [HERO_PHASE],
        command_ability: true,
      },
    ],
  },
  {
    name: `Mortek Crawler`,
    effects: [
      {
        name: `Dread Catapult`,
        desc: `Before shooting with a Dread Catapult, choose either the Necrotic Skulls, Cauldron of Torment or Cursed Stele weapon characteristics for that attack. Each Dread Catapult can only make 1 Cauldron of Torment and 1 Cursed Stele attack per battle.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Cauldron of Torment`,
        desc: `Do not use the attack sequence for an attack made with a Cauldron of Torment. Instead, pick 1 enemy unit that is in range of the attack and roll 1 dice for each model in the target unit. Add the modifier for Cauldron of Torment shown on the damage table on the warscroll to each roll. If the result is equal to or greater than the unmodified Bravery characteristic of the target unit, 1 model from that unit is slain.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Cursed Stele`,
        desc: `Do not use the attack sequence for an attack made with a Cursed Stele. Instead, pick 1 enemy model that is in range of the attack and roll 2D6. Add the modifier for Cursed Stele shown on the damage table above to the roll. If the result is equal to or greater than the Wounds characteristic of the target, it is slain.`,
        when: [SHOOTING_PHASE],
      },
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
      EndlessDutyEffect,
      {
        name: `Supreme Lord of the Bonereaper Legions`,
        desc: `You can use this command ability in your hero phase if Katakros is your general. If you do so, until your next hero phase, add 1 to hit rolls for attacks made by friendly OSSIARCH BONEREAPERS units while they are wholly within 18" of this model, and add 1 to save rolls for attacks that target friendly Mortis Praetorian units while they are wholly within 18" of this model. You can only use this command ability once per hero phase.`,
        when: [HERO_PHASE],
        command_ability: true,
      },
      {
        name: `Aviarch Spymaster`,
        desc: `Once per turn you can roll a D6 when your opponent receives a command point. If you do so, on a 4+ that command point is lost.`,
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
        desc: `Each time you allocate a mortal wound to this unit, roll a D6. On a 5+, that mortal wound is ignored.`,
        when: [WOUND_ALLOCATION_PHASE],
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
  {
    name: `Ossiarch Cohort`,
    effects: [
      {
        name: `Unstoppable Battleforce`,
        desc: `At the start of your hero phase, if your general is from this battalion and on the battlefield, you receive D3 relentless discipline points.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  {
    name: `Mortek Shield-Corps`,
    effects: [
      {
        name: `Unbreakable Bulwark`,
        desc: `Once per turn, you can use the Shieldwall command ability for a unit from this battalion without spending a relentless discipline point to do so.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Mortisan Trident`,
    effects: [
      {
        name: `Deadly Combination`,
        desc: `Each MORTISAN from this battalion can attempt to cast 1 extra spell in your hero phase if it is within 18" of the GOTHIZZAR HARVESTER from the same battalion and the GOTHIZZAR HARVESTER is within 3" of any enemy units.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Katakrosian Deathglaive`,
    effects: [
      {
        name: `Supernatural Strike-force`,
        desc: `After armies are set up but before the first battle round begins, if all units from this battalion are wholly within 12" of this battalion's MORGHAST HARBINGERS unit, you can move any units from this battalion up to 6".`,
        when: [END_OF_SETUP],
      },
    ],
  },
  {
    name: `Aegis Immortal`,
    effects: [
      {
        name: `Undying Guardians`,
        desc: `The MORGHAST ARCHAI unit from this battalion has the Soulbound Protectors ability from the IMMORTIS GUARD warscroll. In addition, when you use the Soulbound Protectors ability for a unit from this battalion and the dice roll is 5+, the wound or mortal wound is negated instead of being allocated to a unit from this battalion.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Kavalos Lance`,
    effects: [
      {
        name: `Liege Companions`,
        desc: `Units from this battalion can charge even if they retreated earlier in the same turn if they are wholly within 12" of the LIEGE from the same battalion when the charge roll is made. In addition, once per turn, you can use the Deathrider Wedge command ability for a unit from this battalion without spending a relentless discipline point to do so.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  {
    name: `Mortek Ballistari`,
    effects: [
      {
        name: `Vital Assets`,
        desc: `Roll a D6 before you allocate a wound or mortal wound to a MORTEK CRAWLER from this battalion while it is within 3" of the MORTEK GUARD from the same battalion. Add 2 to the roll if the MORTEK CRAWLER is within 3" of the MORTISAN BONESHAPER from the same battalion. On a 4+, that wound or mortal wound is allocated to the MORTEK GUARD instead of the MORTEK CRAWLER.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
    ],
  },
  {
    name: `Vokmortian's Retinue`,
    effects: [
      {
        name: `Eternal Duty`,
        desc: `At the start of your hero phase, you can pick 1 unit from this battalion within 8" of the VOKMORTIAN from the same battalion. Return 1 slain model to that unit.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
]
