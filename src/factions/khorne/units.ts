import { keyPicker, tagAs } from 'factions/metatagger'
import {
  BATTLESHOCK_PHASE,
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  DURING_SETUP,
  END_OF_ANY_PHASE,
  END_OF_COMBAT_PHASE,
  END_OF_MOVEMENT_PHASE,
  END_OF_SETUP,
  HERO_PHASE,
  MOVEMENT_PHASE,
  SAVES_PHASE,
  SHOOTING_PHASE,
  START_OF_CHARGE_PHASE,
  START_OF_COMBAT_PHASE,
  START_OF_HERO_PHASE,
  START_OF_MOVEMENT_PHASE,
  START_OF_ROUND,
  TURN_TWO_END_OF_MOVEMENT_PHASE,
  WARDS_PHASE,
  WOUND_ALLOCATION_PHASE,
} from 'types/phases'
import CommandAbilities from './command_abilities'
import Prayers from './prayers'
import rule_sources from './rule_sources'
import { TItemDescriptions } from 'factions/factionTypes'

const BrassCladShieldEffect = {
  name: `Brass-clad Shield`,
  desc: `This unit has a ward of 5+ against mortal wounds caused by spells and mortal wounds caused by the abilities of endless spells.`,
  when: [WARDS_PHASE],
  shared: true,
}

const ScornOfSorceryEffect = {
  name: `Scorn of Sorcery`,
  desc: `This unit can attempt to unbind 1 spell in the enemy hero phase in the same manner as a WIZARD.`,
  when: [HERO_PHASE],
  shared: true,
}

const MurderousChargeEffect = {
  name: `Murderous Charge`,
  desc: `After this unit makes a charge move, pick 1 enemy unit and roll a dice for each model in this unit that is within 3" of that enemy unit. For each 2-4, that enemy unit suffers 1 mortal wound. For each 5+, that enemy unit suffers 2 mortal wounds.`,
  when: [CHARGE_PHASE],
  shared: true,
}

const WarriorEffects = [
  {
    name: `Gorefists`,
    desc: `If the unmodified save roll for an attack made with a melee weapon that targets a unit armed with Goreaxes and Gorefists is 6, the attacking unit suffers 1 mortal wound after all of its attacks have been resolved.`,
    when: [SAVES_PHASE],
    shared: true,
  },
  {
    name: `No Respite`,
    desc: `If this unit is included in a Blades of Khorne army, each time a model in this unit is slain, you can make 2 murder rolls instead of 1.`,
    when: [WOUND_ALLOCATION_PHASE],
    shared: true,
  },
]

const BraveryStandardBearerEffect = {
  name: `Standard Bearer`,
  desc: `Add 1 to the Bravery characteristic of this unit while it includes any Icon Bearers.`,
  when: [BATTLESHOCK_PHASE],
  shared: true,
}

const ChargeMusicianEffect = {
  name: `Musician`,
  desc: `Add 1 to charge rolls for this unit while it includes any Hornblowers.`,
  when: [CHARGE_PHASE],
  shared: true,
}

const CollarOfKhorneEffects = [
  {
    name: `Collar of Khorne`,
    desc: `This unit can attempt to unbind one spell in the enemy hero phase in the same manner as a WIZARD.`,
    when: [HERO_PHASE],
    shared: true,
  },
  {
    name: `Collar of Khorne`,
    desc: `This unit can attempt to dispel one endless spell at the start of your hero phase in the same manner as a WIZARD.`,
    when: [START_OF_HERO_PHASE],
    shared: true,
  },
]

const UnflaggingHunterEffect = {
  name: `Unflagging Hunter`,
  desc: `Add 2 to charge rolls for this unit.`,
  when: [CHARGE_PHASE],
  shared: true,
}

const SlaughterousChargeEffect = {
  name: `Slaughterous Charge`,
  desc: `After this unit makes a charge move, pick 1 enemy unit within 3" of this unit and roll a dice. On a 2+. that enemy unit suffers 3 mortal wounds.`,
  when: [CHARGE_PHASE],
  shared: true,
}

const DrawnInForTheKillEffect = {
  name: `Drawn in for the Kill`,
  desc: `At the start of the enemy movement phase, pick 1 enemy unit within 3" of this model. That unit cannot retreat in that phase.`,
  when: [START_OF_MOVEMENT_PHASE],
  shared: true,
}

const Units = {
  // Daemons
  Skarbrand: {
    effects: [
      {
        name: `Roar of Total Rage`,
        desc: `Do not use the attack sequence for an attack made with Roar of Total Rage. Instead, pick 1 enemy unit within range of the attack and roll a number of dice equal to the Roar of Total Rage value on this unit's damage table. For each 4+, that enemy unit suffers 1 mortal wound.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Skarbrand's Rage`,
        desc: `At the start of each battle round after the first, unless this unit fought in both combat phases in the previous battle round, it becomes enraged until the end of the battle round. While this unit is enraged, use the bottom row on its damage table regardless of how many wounds are allocated to it.`,
        when: [START_OF_ROUND],
      },
      {
        name: `Total Carnage`,
        desc: `The Attacks characteristic of Carnage cannot be modified. In addition, do not use the attack sequence for an attack made with Carnage. Instead, roll a dice. The target unit suffers 8 mortal wounds if the roll is equal to or greater than the Carnage value shown on this unit's damage table. If the roll is 6, the target unit suffers 16 mortal wounds instead.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Inescapable Wrath`,
        desc: `This unit can attempt a charge if it is within 18" of an enemy unit instead of 12", and you can roll 3D6 instead of 2D6 when making a charge roll for this unit.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  'Bloodthirster of Unfettered Fury': {
    effects: [
      {
        name: `Beckon the Hunt`,
        desc: `At the start of your charge phase, you can pick 1 friendly BLADES OF KHORNE unit wholly within 16" of this unit that is not a HERO. Until the end of that phase, that unit can attempt a charge if it is within 18" of an enemy unit instead of 12", and you can roll 3D6 instead of 2D6 when making a charge roll for that unit.`,
        when: [START_OF_CHARGE_PHASE],
      },
      {
        name: `The Land Rebels`,
        desc: `Subtract 1 from hit rolls for attacks made by enemy units while they are within 8" of any friendly units with this ability.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `The Land Rebels`,
        desc: `At the end of the combat phase, roll a dice for each enemy unit within 8" of any friendly units with this ability. On a 4+, that enemy unit suffers D3 mortal wounds.`,
        when: [END_OF_COMBAT_PHASE],
      },
    ],
  },
  'Bloodthirster of Insensate Rage': {
    effects: [
      {
        name: `Outrageous Carnage`,
        desc: `If the unmodified wound roll for an attack made with this unit's Great Axe of Khorne is 6, that attack causes a number of mortal wounds to each enemy unit within 8" of this unit equal to the Outrageous Carnage value on this unit's damage table, in addition to any damage that attack inflicts on the target unit.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Wrath of Khorne Bloodthirster': {
    effects: [
      {
        name: `Commander of Tyrants`,
        desc: `In the combat phase, when you pick this unit to fight for the first time in that phase, you can pick 1 friendly BLOODTHIRSTER OF INSENSATE RAGE or 1 friendly BLOODTHIRSTER OF UNFETTERED FURY wholly within 16" of this unit and that has not yet fought in that phase. This unit and that unit can fight one after the other in the order of your choice.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Hellfire Breath`,
        desc: `The Attacks characteristic of Hellfire Breath is equal to the number of models in the target unit (to a maximum of 10).`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Marshal of Khorne's Legions`,
        desc: `Once per turn, this unit can issue a command without a command point being spent.`,
        when: [DURING_GAME],
      },
    ],
  },
  Skulltaker: {
    effects: [
      {
        name: `Cloak of Skulls`,
        desc: `This unit has a ward of 4+.`,
        when: [WARDS_PHASE],
      },
      {
        name: `The Slayer Sword`,
        desc: `If the unmodified hit roll for an attack made with the Slayer Sword is 6, that attack causes 2 mortal wounds to the target and the attack sequence ends. If the target is an enemy HERO, that attack instead causes 3 mortal wounds to the target and the attack sequence ends.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Heroes' Bane`,
        desc: `At the start of the combat phase, you can say that Skulltaker is issuing a challenge. If you do so, pick 1 enemy HERO within 3" of this unit. Until the end of that phase, the strike-first effect applies to this unit but all of the attacks it makes in that phase must target that enemy HERO.`,
        when: [START_OF_COMBAT_PHASE],
      },
      {
        name: `Skulls for the Skull Throne!`,
        desc: `If this unit is included in a Blades of Khorne army, each time an enemy HERO is slain by attacks made by this unit, you receive 1 additional Blood Tithe point.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
    ],
  },
  Karanak: {
    effects: [
      {
        name: `Brass Collar of Bloody Vengeance`,
        desc: `This unit can attempt to unbind 1 spell in the enemy hero phase in the same manner as a WIZARD. If this unit successfully unbinds a spell, the caster suffers D3 mortal wounds.`,
        when: [HERO_PHASE],
      },
      UnflaggingHunterEffect,
      {
        name: `Call of the Hunt`,
        desc: `If this unit is included in a Blades of Khorne army, friendly summoned FLESH HOUNDS units can be set up within 9" of enemy units as long as they are set up wholly within 8" of this unit.`,
        when: [DURING_GAME],
      },
      {
        name: `Prey of the Blood God`,
        desc: `After deployment but before the first battle round begins, pick 1 enemy HERO to be this unit's quarry. At the end of the enemy movement phase, if this unit is more than 9" from all enemy units, it can make a normal move. It must finish that move closer to its quarry than it was at the start of the move.`,
        when: [END_OF_SETUP],
      },
      {
        name: `Prey of the Blood God`,
        desc: `At the end of the enemy movement phase, if this unit is more than 9" from all enemy units, it can make a normal move. It must finish that move closer to its quarry than it was at the start of the move.`,
        when: [END_OF_MOVEMENT_PHASE],
      },
    ],
  },
  'Flesh Hounds': {
    effects: [
      {
        name: `Gore Hounds`,
        desc: `1 in every 5 models in this unit can be a Gore Hound. Add 1 to the Attacks characteristic of that model's melee weapons. That model is also armed with a Burning Roar.`,
        when: [HERO_PHASE],
      },
      {
        name: `Collars of Khorne`,
        desc: `This unit can attempt to unbind 1 spell in the enemy hero phase in the same manner as a WIZARD.`,
        when: [HERO_PHASE],
      },
      {
        name: `Unflagging Hunters`,
        desc: `Add 2 to charge rolls for this unit.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  'Skullmaster, Herald of Khorne': {
    effects: [
      {
        name: `Decapitating Blow`,
        desc: `If the unmodified hit roll for an attack made with a Blade of Blood is 6, that attack causes 2 mortal wounds to the target and the attack sequence ends.`,
        when: [COMBAT_PHASE],
      },
      SlaughterousChargeEffect,
      {
        name: `Herald of the Bloodthunder Stampede`,
        desc: `Once per battle, at the start of the charge phase, you can say that this Skullmaster will declare a Bloodthunder Stampede. If you do so, until the end of that phase, you can reroll charge rolls for this unit and friendly BLOODCRUSHERS units wholly within 16" of this unit.`,
        when: [START_OF_CHARGE_PHASE],
      },
    ],
  },
  'Bloodmaster, Herald of Khorne': {
    mandatory: {
      prayers: [keyPicker(Prayers, ['Bloodmark'])],
    },
    effects: [
      {
        name: `Decapitating Blow`,
        desc: `If the unmodified hit roll for an attack made with a Blade of Blood is 6, that attack causes 2 mortal wounds to the target and the attack sequence ends.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `The Blood Must Flow`,
        desc: `In the combat phase, when you pick this unit to fight for the first time in that phase, you can pick 1 friendly BLOODLETTER unit wholly within 16" of this unit and that has not yet fought in that phase. This unit and that unit can fight one after the other in the order of your choice.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  Bloodletters: {
    effects: [
      {
        name: `Champion`,
        desc: `1 model in this unit can be a Bloodreaper. Add 1 to the Attacks characteristic of that model's melee weapons.`,
        when: [COMBAT_PHASE],
      },
      ChargeMusicianEffect,
      {
        name: `Standard Bearer`,
        desc: `1 in every 10 models in this unit can be an Icon Bearer. If an unmodified battleshock roll of 1 is made for this unit while it includes any Icon Bearers, you can return 1 slain model to this unit and no models in this unit flee in that phase.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Decapitating Blow`,
        desc: `If the unmodified hit roll for an attack made with a Hellblade is 6, that attack causes 1 mortal wound to the target and the attack sequence ends.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  Bloodcrushers: {
    effects: [
      {
        name: `Champion`,
        desc: `1 model in this unit can be a Bloodhunter. Add 1 to the Attacks characteristic of that model's Hellblade.`,
        when: [COMBAT_PHASE],
      },
      ChargeMusicianEffect,
      {
        name: `Standard Bearer`,
        desc: `1 in every 3 models in this unit can be an Icon Bearer. If an unmodified battleshock roll of 1 is made for this unit while it includes any Icon Bearers, you can return 1 slain model to this unit and no models in this unit flee in that phase.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Decapitating Blow`,
        desc: `If the unmodified hit roll for an attack made with a Hellblade is 6, that attack causes 1 mortal wound to the target and the attack sequence ends.`,
        when: [CHARGE_PHASE],
      },
      MurderousChargeEffect,
    ],
  },
  'Herald of Khorne on Blood Throne': {
    mandatory: {
      prayers: [keyPicker(Prayers, ['Blood Call'])],
    },
    effects: [
      {
        name: `Decapitating Blow`,
        desc: `If the unmodified hit roll for an attack made with a Blade of Blood or Hellblades is 6, that attack causes a number of mortal wounds to the target equal to its Damage characteristic and the attack sequence ends.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Gorefeast`,
        desc: `Each time an enemy model is slain by an attack made by this unit, you can heal 1 wound allocated to this unit.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
    ],
  },
  'Skull Cannon': {
    effects: [
      {
        name: `Grind their Bones, Seize their Skulls`,
        desc: `In the combat phase, after this unit has fought for the first time in that phase, if any enemy models were slain by this unit's attacks in that phase, this unit can immediately shoot.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Decapitating Blow`,
        desc: `If the unmodified hit roll for an attack made with Hellblades is 6, that attack causes 1 mortal wound to the target and the attack sequence ends.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Exalted Greater Daemon of Khorne': {
    mandatory: {
      command_abilities: [keyPicker(CommandAbilities, ['Rejoice in Exalted Slaughter'])],
    },
    effects: [
      DrawnInForTheKillEffect,
      {
        name: `The Land Rebels`,
        desc: `At the start of your hero phase, roll a dice for each enemy unit within 8" of any friendly models with this ability. On a 5+, that enemy unit suffers 1 mortal wound.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'Mazarall the Butcher': {
    mandatory: {
      command_abilities: [keyPicker(CommandAbilities, ["The Butcher's Due"])],
    },
    effects: [
      {
        name: `Bloody Charge`,
        desc: `Roll a dice for each enemy unit that is within 1" of this model after this model makes a charge move. On a 4+ that unit suffers D3 mortal wounds.`,
        when: [CHARGE_PHASE],
      },
      {
        name: `Harrow Meat's Hunger`,
        desc: `At the end of the combat phase, if any enemy models were slain by wounds inflicted by this model's attacks in that combat phase, add 1 to the Attacks characteristic of Harrow Meat for the rest of the battle.`,
        when: [END_OF_COMBAT_PHASE],
      },
      {
        name: `The Ancyte Shield`,
        desc: `This model can attempt to unbind 1 spell in the enemy hero phase in the same manner as a WIZARD.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Korghos Khul': {
    effects: [
      {
        name: `Aqshy's Bane`,
        desc: `This unit is eligible to fight in the combat phase if it is within 8" of an enemy unit instead of 3", and it can move an extra 5" when it piles in.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Collar of Khorne`,
        desc: `This unit can attempt to unbind 1 spell in the enemy hero phase in the same manner as a WIZARD.`,
        when: [HERO_PHASE],
      },
      {
        name: `Reality-splitting Axe`,
        desc: `Each time this unit fights, wounds caused by its Blood-dark Claws must be allocated before wounds caused by its Axe of Khorne. At the end of any phase, if any wounds caused by this unit's Axe of Khorne in that phase were allocated to an enemy model and that enemy model has not been slain, roll a dice. On a 5+, that enemy model is slain.`,
        when: [END_OF_ANY_PHASE],
      },
      {
        name: `Lord of the Goretide`,
        desc: `If this unit is included in a Goretide army, once per battle, at the start of the combat phase, you can say that Khul will unleash the wrath of the Goretide. If you do so, until the end of that phase, each time a friendly GORETIDE BLOODBOUND model is slain, you can make 1 additional murder roll.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  'Skarr Bloodwrath': {
    effects: [
      {
        name: `Slaughterstorm`,
        desc: `The Attacks characteristic of the Bloodstorm Blades is either 5 or equal to the number of enemy models within 3" of the attacking unit (whichever is higher).`,
        when: [COMBAT_PHASE],
      },
      {
        name: `The Slaughterborn`,
        desc: `At the end of the movement phase, if this unit has been destroyed, roll 2D6. On an 8+, you can set up this unit anywhere on the battlefield more than 9" from all enemy units and with no wounds allocated to it.`,
        when: [END_OF_MOVEMENT_PHASE],
      },
      {
        name: `Murderous Paragon`,
        desc: `If this unit is included in a Blades of Khorne army, you can make 1 additional murder roll each time a model from a friendly WRATHMONGERS unit within 8" of this unit is slain.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
    ],
  },
  'Valkia the Bloody': {
    effects: [
      {
        name: `The Red Angel of Slaughter`,
        desc: `During deployment, instead of setting up this unit on the battlefield, you can place it to one side and say that it is set up in the skies as a reserve unit. If you do so, at the end of your movement phase, you can set up this unit on the battlefield more than 9" from all enemy units. Then, you can pick 1 enemy unit within 10" of this unit and roll a dice. On a 1, nothing happens. On a 2+, that enemy unit suffers a number of mortal wounds equal to the roll.`,
        when: [DURING_SETUP],
      },
      {
        name: `The Red Angel of Slaughter`,
        desc: `If you set this unit up in reserve, at the end of your movement phase, you can set up this unit on the battlefield more than 9" from all enemy units. Then, you can pick 1 enemy unit within 10" of this unit and roll a dice. On a 1, nothing happens. On a 2+, that enemy unit suffers a number of mortal wounds equal to the roll.`,
        when: [END_OF_MOVEMENT_PHASE],
      },
      {
        name: `Daemonshield`,
        desc: `This unit has a ward of 5+.`,
        when: [WARDS_PHASE],
      },
      {
        name: `The Gaze of Khorne`,
        desc: `Add 3 to the Bravery characteristic of other friendly BLOODBOUND units while they are wholly within 16" of this unit. However, friendly BLOODBOUND units cannot retreat while they are wholly within 16" of this unit.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
  'Mighty Lord of Khorne': {
    mandatory: {
      command_abilities: [keyPicker(CommandAbilities, ["'Bring Me Their Skull!'"])],
    },
    effects: [
      {
        name: `Collar of Khorne`,
        desc: `This unit can attempt to unbind 1 spell in the enemy hero phase in the same manner as a WIZARD.`,
        when: [HERO_PHASE],
      },
    ],
  },
  Bloodsecrator: {
    effects: [
      {
        name: `Rage of Khorne`,
        desc: `Once per battle, at the start of the combat phase, you can pick 1 friendly unit on the battlefield with this ability to plant its Icon of Khorne. If you do so, add 1 to the Attacks characteristic of melee weapons used by friendly BLADES OF KHORNE units on the battlefield until the end of that phase.`,
        when: [START_OF_COMBAT_PHASE],
      },
      {
        name: `Icon of the Blood God`,
        desc: `If this unit issues the Rally command (core rules, 7.2) to a friendly BLOODBOUND unit with a Wounds characteristic of 3 or less, you can return 1 slain model to that unit for each 4+ instead of each 6.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'Lord of Khorne on Juggernaut': {
    effects: [
      BrassCladShieldEffect,
      SlaughterousChargeEffect,
      {
        name: `Lord of the Brass Stampede`,
        desc: `Once per battle, at the start of the charge phase, you can say this unit will declare a Brass Stampede. If you do so, until the end of that phase, you can reroll charge rolls for this unit and friendly MIGHTY SKULLCRUSHER units wholly within 16" of this unit.`,
        when: [START_OF_CHARGE_PHASE],
      },
    ],
  },
  Slaughterpriest: {
    mandatory: {
      prayers: [keyPicker(Prayers, ['Blood Boil'])],
    },
    effects: [ScornOfSorceryEffect],
  },
  Skullgrinder: {
    effects: [
      {
        name: `Bone-crushing Strikes`,
        desc: `Add 1 to the Damage characteristic of this unit's Brazen Anvil for attacks that target an enemy MONSTER. In addition, if any wounds caused by an attack made with this unit's Brazen Anvil are allocated to an enemy MONSTER, the strike-last effect applies to that enemy MONSTER until the end of the phase.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Tempered with Fury`,
        desc: `At the end of deployment, you can pick 1 other friendly BLOODBOUND HERO within 8" of this unit to have their weapon tempered. If you do so, pick 1 of that HERO's melee weapons. Improve the Rend characteristic of that weapon by 1 until the end of the battle. The same unit cannot be picked to have their weapon tempered more than once in the same battle.`,
        when: [END_OF_SETUP],
      },
    ],
  },
  'Aspiring Deathbringer': {
    effects: [
      {
        name: `Favour Through Triumph`,
        desc: `If the unmodified hit roll for an attack made by this unit is 6 and the target is a HERO, that attack causes 1 mortal wound to the target in addition to any damage it inflicts.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Exalted Deathbringer': {
    effects: [
      {
        name: `Blood-marked Warrior`,
        desc: `This unit has a ward of 5+.`,
        when: [WARDS_PHASE],
      },
      {
        name: `Skullgouger`,
        desc: `If the unmodified save roll for an attack made with a melee weapon that targets a unit armed with a Ruinous Axe and Skullgouger is 6, the attacking unit suffers D3 mortal wounds after all of its attacks have been resolved.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `First of the Gorechosen`,
        desc: `Add 1 to hit rolls for attacks made by this unit while it is wholly within 8" of another friendly BLOODBOUND unit that is a general.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  Bloodstoker: {
    effects: [
      {
        name: `Whipped to Fury`,
        desc: `At the start of your movement phase, you can pick up to D3 other friendly BLOODBOUND units within 3" of this unit and roll a dice for each of those units. Regardless of the roll, that unit can run and still charge later in the turn, but on a roll of 1 it also suffers 1 mortal wound.`,
        when: [START_OF_MOVEMENT_PHASE, CHARGE_PHASE],
      },
    ],
  },
  'Blood Warriors': {
    effects: [
      ...WarriorEffects,
      BraveryStandardBearerEffect,
      {
        name: `Champion`,
        desc: `1 model in this unit can be a Blood Champion. Add 1 to the Attacks characteristic of that model's melee weapons.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  Bloodreavers: {
    effects: [
      {
        name: `Champion`,
        desc: `1 model in this unit can be a Blood Chieftain. Add 1 to the Attacks characteristic of that model's melee weapons.`,
        when: [COMBAT_PHASE],
      },
      BraveryStandardBearerEffect,
      ChargeMusicianEffect,
      {
        name: `Frenzied Devotion`,
        desc: `Add 1 to wound rolls for attacks made with melee weapons by this unit while it is wholly within 16" of any friendly KHORNE TOTEMS.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  "Garrek's Reavers": {
    effects: [
      {
        name: `Champion`,
        desc: `Garrek Gorebeard is the unit champion. Add 1 to the Attacks characteristic of that model's melee weapons.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Grisly Trophies`,
        desc: `If this unit is included in a Blades of Khorne army, at the end of the combat phase, if this unit is on the battlefield and any enemy models were slain by attacks made by this unit in that phase, you receive 1 additional Blood Tithe point.`,
        when: [END_OF_COMBAT_PHASE],
      },
    ],
  },
  "Magore's Fiends": {
    effects: [
      ...WarriorEffects,
      {
        name: `Riptooth`,
        desc: `The first time this unit is set up on the battlefield, you must summon 1 FLESH HOUNDS unit consisting of 1 model to the battlefield and add it to your army. That model must not be a Gore Hound and must be on a 50mm base. Set up that FLESH HOUNDS unit wholly within 3" of this unit and more than 9" from all enemy units.`,
        when: [DURING_GAME],
        rule_sources: [rule_sources.BATTLETOME_KHORNE, rule_sources.ERRATA_APRIL_2023],
      },
    ],
  },
  Riptooth: {
    effects: [...CollarOfKhorneEffects, UnflaggingHunterEffect],
  },
  Wrathmongers: {
    effects: [
      {
        name: `Champion`,
        desc: `1 model in this unit can be a Wrathmaster. Add 1 to the Attacks characteristic of that model's melee weapons.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Crimson Haze`,
        desc: `Add 1 to the Attacks characteristic of melee weapons used by friendly BLADES OF KHORNE units while they are wholly within 8" of any units with this ability. This ability has no effect on WRATHMONGERS.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Bloodfury`,
        desc: `If the unmodified hit roll for an attack made with a melee weapon that targets this unit is 1, the attacking unit suffers 1 mortal wound after all of its attacks have been resolved.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Mighty Skullcrushers': {
    effects: [
      {
        name: `Champion`,
        desc: `1 model in this unit can be a Skullhunter. Add 1 to the Attacks characteristic of that model's Bloodglaive or Ensorcelled Axe.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Standard Bearer`,
        desc: `1 in every 3 models in this unit can be a Standard Bearer. Add 1 to the Bravery characteristic of this unit while it includes any Standard Bearers.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Musician`,
        desc: `1 in every 3 models in this unit can be a Hornblower. Add 1 to run rolls and charge rolls for this unit while it includes any Hornblowers.`,
        when: [MOVEMENT_PHASE, CHARGE_PHASE],
      },
      BrassCladShieldEffect,
      MurderousChargeEffect,
    ],
  },
  Skullreapers: {
    effects: [
      {
        name: `Champion`,
        desc: `1 model in this unit can be a Skullseeker. A Skullseeker is armed with a Vicious Mutation in addition to Daemonforged Weapons.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Standard Bearer`,
        desc: `1 in every 5 models in this unit can be an Icon Bearer. Add 1 to the Bravery characteristic of this unit while it includes any Icon Bearers.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Daemonforged Weapons`,
        desc: `If the unmodified hit roll for an attack made with this unit's Daemonforged Weapons is 6, that attack causes 1 mortal wound to the target in addition to any damage it inflicts.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Reap a Deadly Toll`,
        desc: `Add 1 to hit rolls for attacks made by this unit if the target unit has 5 or more models.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Scyla Anfingrimm': {
    effects: [
      {
        name: `Brass Collar of Khorne`,
        desc: `This unit can attempt to unbind 1 spell in the enemy hero phase in the same manner as a WIZARD.`,
        when: [HERO_PHASE],
      },
      {
        name: `Bestial Leap`,
        desc: `This unit is eligible to fight in the combat phase if it is within 8" of an enemy unit instead of 3", and it can move an extra 5" when it piles in.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  Khorgoraths: {
    effects: [
      {
        name: `Horrific Predators`,
        desc: `Enemy units cannot receive the Inspiring Presence command while they are within 3" of any friendly units with this ability.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Taker of Heads`,
        desc: `Each time an enemy model is slain by an attack made by this unit, you can heal 1 wound allocated to this unit.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
      {
        name: `Violent Monstrosity`,
        desc: `If this unit is included in a Blades of Khorne army, when this unit is destroyed, you can make 5 murder rolls instead of 1.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
    ],
  },
  'Vorgaroth the Scarred on Skalok the Skull Host of Khorne': {
    effects: [
      {
        name: `Monstrous Trophies`,
        desc: `Add 1 to wound rolls for attacks made with this model's Skull Cleaver Axe of Khorne that target a MONSTER. In addition, if the unmodified wound roll for an attack made with the Skull Cleaver Axe of Khorne is 6, that attack causes D3 mortal wounds to the target in addition to any damage it inflicts.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Crushing Bulk`,
        desc: `Roll a dice for each enemy unit that is within 1" of this model after this model makes a charge move. On a 2+, that unit suffers D3 mortal wounds.`,
        when: [CHARGE_PHASE],
      },
      {
        name: `Eternal Hunt`,
        desc: `Instead of setting up this model on the battlefield, you can place it to one side and say that it is in reserve. If you do so, at the end of your second movement phase, you must set up this model anywhere on the battlefield more than 9" from all enemy units.`,
        when: [DURING_SETUP],
      },
      {
        name: `Eternal Hunt`,
        desc: `If you set this unit up in reserve, at the end of your second movement phase, you must set up this model anywhere on the battlefield more than 9" from all enemy units.`,
        when: [TURN_TWO_END_OF_MOVEMENT_PHASE],
      },
      {
        name: `Fettered Servitude`,
        desc: `Once per battleshock phase, before you take a battleshock test for a friendly KHORNE unit wholly within 12" of this model, you can say that this model demands unwavering obedience. If you do so, 1 model in that unit is slain, but you do not have to take a battleshock test for that unit in that phase.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Fuelled by Death`,
        desc: `In your hero phase, you can pick 1 friendly model within 3" of this model and roll a dice. If you do so and the roll is equal to or greater than that model's Wounds characteristic, that model is slain and you can heal a number of wounds allocated to this model equal to the slain model's Wounds characteristic.`,
        when: [HERO_PHASE],
      },
      {
        name: `Wings of Fury`,
        desc: `Subtract 3 from casting and unbinding rolls for enemy WIZARDS that are within 18" of this model.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Skaarac the Bloodborn': {
    effects: [
      {
        name: `Life-eater`,
        desc: `At the end of the combat phase, if any enemy models were slain by wounds inflicted by this model's attacks in that combat phase, you can heal up to D3 wounds allocated to this model.`,
        when: [END_OF_COMBAT_PHASE],
      },
      {
        name: `Infernal Iron`,
        desc: `Subtract 2 from casting rolls for enemy WIZARDS while they are within 12" of this model.`,
        when: [HERO_PHASE],
      },
      {
        name: `Towering Horror`,
        desc: `Subtract 1 from the Bravery characteristic of enemy units while they are within 12" of this model.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Undying Hate`,
        desc: `If this model is slain, before removing it from play, roll a dice for each enemy model within 3" of this model. On a 4+, that model's unit suffers 1 mortal wound. This model is then removed from play.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
      {
        name: `Call of the Skull Throne`,
        desc: `Add 1 to charge rolls for friendly KHORNE units that are wholly within 12" of this model.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  'Dromm, Wounder of Worlds': {
    mandatory: {
      prayers: [keyPicker(Prayers, ['Wound the Realm'])],
    },
    effects: [ScornOfSorceryEffect],
  },
  'Gorechosen of Dromm': {
    effects: [
      {
        name: `Gorechosen of Dromm`,
        desc: `While this unit is wholly within 3" of a friendly DROMM, he has a ward of 4+.`,
        when: [WARDS_PHASE],
      },
      {
        name: `Throttle`,
        desc: `At the end of the combat phase, if this unit includes the Gorehulk, you can pick 1 enemy model within 3" of this unit and roll a dice. If the roll is more than double that model's Wounds characteristic, it is slain.`,
        when: [END_OF_COMBAT_PHASE],
      },
      {
        name: `White-hot Anger`,
        desc: `At the end of the combat phase, roll a dice for each enemy model within 3" of this unit's Skullgrinder Herax. For each 5+, that enemy model's unit suffers 1 mortal wound.`,
        when: [END_OF_COMBAT_PHASE],
      },
    ],
  },
  'Realmgore Ritualist': {
    mandatory: {
      prayers: [keyPicker(Prayers, ['Bloodhex'])],
    },
    effects: [
      {
        name: `Desecrating Blood Runes`,
        desc: `Once per battle, at the end of your movement phase, you can pick 1 objective or terrain feature within 3" of this unit and say that it has been marked with desecrating blood runes. If you do so, until the end of the battle, add 1 to hit rolls for attacks made with melee weapons by friendly BLOODBOUND units while they arc wholly within 8" of that objective or terrain feature.`,
        when: [END_OF_MOVEMENT_PHASE],
      },
    ],
  },
  'Claws of Karanak': {
    effects: [
      {
        name: `Packlord`,
        desc: `1 in every 8 models in this unit must be a Packlord. Add 2 to the Attacks characteristic of that model's melee weapons.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Packlord`,
        desc: `A Packlord can issue commands to their own unit.`,
        when: [DURING_GAME],
      },
      {
        name: `Brutaliser`,
        desc: `2 in every 8 models in this unit must be a Brutaliser. Add 1 to the Attacks characteristic of those models' melee weapons.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Hound of Wrath`,
        desc: `1 in every 8 models in this unit must be a Hound of Wrath. A Hound of Wrath is armed with Gouge-claws instead of Weapons of the Hunt. In addition, add 1 to that model's Wounds characteristic.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
      {
        name: `The Scent of Blood`,
        desc: `After deployment but before the first battle round begins, this unit can make a normal move.`,
        when: [END_OF_SETUP],
      },
      {
        name: `Pack Hunters`,
        desc: `Add 1 to hit rolls for attacks made by this unit while they are wholly within 8" of any friendly FLESH HOUNDS units.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
} satisfies TItemDescriptions

export default tagAs(Units, 'unit')
