import { keyPicker, tagAs } from 'factions/metatagger'
import { GenericEffects } from 'generic_rules'
import {
  BATTLESHOCK_PHASE,
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  DURING_SETUP,
  END_OF_COMBAT_PHASE,
  END_OF_HERO_PHASE,
  END_OF_MOVEMENT_PHASE,
  HERO_PHASE,
  MOVEMENT_PHASE,
  SHOOTING_PHASE,
  START_OF_COMBAT_PHASE,
  START_OF_HERO_PHASE,
  WARDS_PHASE,
  WOUND_ALLOCATION_PHASE,
} from 'types/phases'
import CommandAbilities from './command_abilities'
import Spells from './spells'

const TheWillOfTheLegionsEffect = {
  name: `The Will of the Legions`,
  desc: `Once per turn, this unit can issue a command to a friendly OSSIARCH BONEREAPERS unit without a command point being spent.`,
  when: [DURING_GAME],
  shared: true,
}
const GrimOpponentsEffect = {
  name: `Grim Opponents`,
  desc: `If you make an unmodified charge roll of 8+ for this unit, the strike-first effect applies to this unit until the end of that turn.`,
  when: [CHARGE_PHASE],
  shared: true,
}
const NecrophorosEffect = {
  name: `Standard Bearer`,
  desc: `Add 1 to run rolls and charge rolls for this unit if it includes any Necrophoroi.`,
  when: [MOVEMENT_PHASE, CHARGE_PHASE],
  shared: true,
}
const HeraldsOfTheAccursedOneEffect = {
  name: `Heralds of the Accursed One`,
  desc: `Enemy units cannot receive commands while they are within 3" of any friendly units with this ability.`,
  when: [DURING_GAME],
  shared: true,
}
const MortekHekatosEffect = {
  name: `Champion`,
  desc: `1 model in this unit can be a Mortek Hekatos. Add 1 to the Attacks characteristic of that model's melee weapon.`,
  when: [COMBAT_PHASE],
  shared: true,
}
const UnstoppableChargeEffects = [
  {
    name: `Unstoppable Charge`,
    desc: `After this unit makes a charge move, you can pick 1 enemy unit within 1" of this unit and roll a number of dice equal to the unmodified charge roll for that charge move. For each 5+, that enemy unit suffers 1 mortal wound.`,
    when: [CHARGE_PHASE],
    shared: true,
  },
  {
    name: `Unstoppable Charge`,
    desc: `This unit can move an extra 3" when it piles in if it made a charge move in the same turn.`,
    when: [COMBAT_PHASE],
    shared: true,
  },
]

const Units = {
  'Gothizzar Harvester': {
    effects: [
      {
        name: `Bone Harvest`,
        desc: `At the end of the combat phase, you can pick 1 friendly OSSIARCH BONEREAPERS unit that is within 6" of this unit and had models slain in that phase. If you do so, roll a dice for each model from that unit that was slain in that phase. On a 4+:
        
        If the slain model had a Wounds characteristic of 4 or less, you can heal 1 wound allocated to its unit.
        If the slain model had a Wounds characteristic of 5 or more, you can heal up to 3 wounds allocated to its unit.
        If no wounds are currently allocated to the unit you picked, you can return a number of slain models to it that have a combined Wounds characteristic of equal to or less than the number of wounds you could have healed.
        
        You cannot pick the same unit with this ability more than once per phase.`,
        when: [END_OF_COMBAT_PHASE],
      },
    ],
  },
  'Immortis Guard': {
    mandatory: {
      command_abilities: [keyPicker(CommandAbilities, ['Crushing Assault'])],
    },
    effects: [
      GenericEffects.Elite,
      {
        name: `Soulbound Protectors`,
        desc: `If a friendly OSSIARCH BONEREAPERS HERO is within 3" of this unit, before you allocate a wound or mortal wound to that HERO, or instead of making a ward roll for a wound or mortal wound that would be allocated to that HERO, roll a dice. On a 2+, that wound or mortal wound is allocated to this unit instead of that HERO and cannot be negated.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
    ],
  },
  'Mortek Guard': {
    mandatory: {
      command_abilities: [keyPicker(CommandAbilities, ['Shieldwall'])],
    },
    effects: [
      {
        name: `Champion`,
        desc: `1 model in this unit can be a Mortek Hekatos. Add 1 to the Attacks characteristic of that model's Nadirite Spear or Nadirite Blade.`,
        when: [COMBAT_PHASE],
      },
      NecrophorosEffect,
    ],
  },
  'Kavalos Deathriders': {
    mandatory: {
      command_abilities: [keyPicker(CommandAbilities, ['Deathrider Wedge'])],
    },
    effects: [NecrophorosEffect, MortekHekatosEffect, ...UnstoppableChargeEffects],
  },
  'Necropolis Stalkers': {
    mandatory: {
      command_abilities: [keyPicker(CommandAbilities, ['Hunt and Kill'])],
    },
    effects: [
      GenericEffects.Elite,
      {
        name: `Quadrarch Aspects`,
        desc: `At the start of the combat phase, you must pick 1 of the following aspects to apply to this unit until the end of that phase.

        Blade-strike Aspect: Add 1 to hit rolls for attacks made by this unit.
        
        Blade-parry Aspect: Add 1 to save rolls for attacks that target this unit.
        
        Destroyer Aspect: Add 1 to wound rolls for attacks made by this unit.
        
        Precision Aspect: Add 1 to the Damage characteristic of this unit's melee weapons.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  'Mortek Crawler': {
    effects: [
      {
        name: `Dread Catapult`,
        desc: `Each time this unit shoots, choose either the Cauldron of Torment, Necrotic Skulls or Cursed Stele weapon characteristics for all the attacks it makes with its Dread Catapult.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Deathly Barrage`,
        desc: `After this unit shoots, roll a dice for each enemy unit that was targeted by this unit's attacks in that phase. Add 2 to the roll if that unit was targeted by all of this unit's attacks in that phase. On a 5+, the strike-last effect applies to that unit until the end of that turn.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  'Morghast Archai': {
    effects: [
      GenericEffects.Elite,
      HeraldsOfTheAccursedOneEffect,
      GrimOpponentsEffect,
      {
        name: `Necromantic Custodians`,
        desc: `This unit has a ward of 5+ if it is wholly within 12" of any friendly OSSIARCH BONEREAPERS HEROES.`,
        when: [WARDS_PHASE],
      },
    ],
  },
  'Morghast Harbingers': {
    effects: [
      GenericEffects.Elite,
      HeraldsOfTheAccursedOneEffect,
      GrimOpponentsEffect,
      {
        name: `On Wings of Malice`,
        desc: `During deployment, instead of setting up this unit on the battlefield, you can place it to one side and say that it is soaring above the battlefield as a reserve unit. If you do so, at the end of your movement phase, you can set up this unit on the battlefield more than 9" from all enemy units.`,
        when: [DURING_SETUP],
      },
      {
        name: `On Wings of Malice`,
        desc: `If you set this unit up in reserve, at the end of your movement phase, you can set up this unit on the battlefield more than 9" from all enemy units.`,
        when: [END_OF_MOVEMENT_PHASE],
      },
    ],
  },
  'Arch-Kavalos Zandtos': {
    mandatory: {
      command_abilities: [keyPicker(CommandAbilities, ['Still Their Breath!'])],
    },
    effects: [
      ...UnstoppableChargeEffects,
      {
        name: `Warmaster`,
        desc: `If this unit is included in a Mortis Praetorians army, it is treated as a general even if it is not the model picked to be the army's general.`,
        when: [DURING_GAME],
      },
      TheWillOfTheLegionsEffect,
      {
        name: `The Dark Lance`,
        desc: `Add 1 to the Damage characteristic of this unit's Dark Lance if this unit made a charge move in the same turn.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  Vokmortian: {
    mandatory: {
      spells: [keyPicker(Spells, ['Mortal Touch'])],
    },
    effects: [
      {
        name: `Wizard`,
        desc: `This unit can attempt to cast 2 spells in your hero phase and attempt to unbind 2 spells in the enemy hero phase. If this unit is part of an Ossiarch Bonereapers army, it knows all of the spells from the Lore of Ossian Sorcery in addition to the other spells it knows.`,
        when: [HERO_PHASE],
      },
      {
        name: `Contract of Nagash`,
        desc: `At the start of the combat phase, you can pick 1 enemy unit within 3" of this unit and roll a dice. On a 3+, your opponent must spend a command point to pick this unit to be the target of that enemy unit's attacks in that phase.`,
        when: [START_OF_COMBAT_PHASE],
      },
      {
        name: `Grim Warnings`,
        desc: `Subtract 2 from the Bravery characteristic of enemy units while they are within 12" of this unit. If the model picked to be the enemy general has been slain, subtract 3 from the Bravery characteristic of those units instead of 2.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
  'Liege-Kavalos': {
    mandatory: {
      command_abilities: [keyPicker(CommandAbilities, ['Endless Duty'])],
    },
    effects: [TheWillOfTheLegionsEffect, ...UnstoppableChargeEffects],
  },
  'Mortisan Boneshaper': {
    mandatory: {
      spells: [keyPicker(Spells, ['Shard-storm'])],
    },
    effects: [
      GenericEffects.WizardOneSpellEffect,
      {
        name: `Boneshaper`,
        desc: `In your hero phase, you can pick 1 friendly OSSIARCH BONEREAPERS unit within 6" of this unit. If that unit is not an IMMORTIS GUARD or NECROPOLIS STALKERS unit, you can either heal up to 3 wounds allocated to that unit or, if no wounds have been allocated to that unit, you can return a number of slain models to it that have a combined Wounds characteristic of 3 or less. If that unit is an IMMORTIS GUARD or NECROPOLIS STALKERS unit, you can either heal up to 3 wounds allocated to that unit or, if no wounds have been allocated to that unit, roll a dice. On a 3+, you can return 1 slain model to that unit.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Mortisan Soulmason': {
    mandatory: {
      spells: [keyPicker(Spells, ['Soul-guide'])],
    },
    effects: [
      {
        name: `Wizard`,
        desc: `This unit can attempt to cast 2 spells in your hero phase and attempt to unbind 2 spells in the enemy hero phase. If this unit is part of an Ossiarch Bonereapers army, it knows all of the spells from the Lore of Ossian Sorcery in addition to the other spells it knows.`,
        when: [HERO_PHASE],
      },
      {
        name: `Mortek Throne`,
        desc: `At the end of your hero phase, roll a dice for this unit. On a 1, nothing happens. On a 2-5, this unit can immediately attempt to cast Soul-guide even if a casting attempt has already been made for that spell in that phase. On a 6, this unit can immediately attempt to cast Soul-guide D3 times even if a casting attempt has already been made for that spell in that phase.`,
        when: [END_OF_HERO_PHASE],
      },
    ],
  },
  'Mortisan Soulreaper': {
    mandatory: {
      spells: [keyPicker(Spells, ['Soul-blast'])],
    },
    effects: [
      GenericEffects.WizardOneSpellEffect,
      {
        name: `Soulreaper`,
        desc: `Each time this unit fights, you can say it will unleash a reaping strike. If you do so, add 2 to the Attacks characteristic of this unit's melee weapons until the end of the phase, but this unit can only target enemy units that have 5 or more models.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Mortisan Ossifector': {
    mandatory: {
      spells: [keyPicker(Spells, ['Empower Ossification'])],
    },
    effects: [
      GenericEffects.WizardOneSpellEffect,
      {
        name: `Refined Creations`,
        desc: `In your hero phase, you can pick 1 friendly GOTHIZZAR HARVESTER, MORTEK CRAWLER or MORGHAST unit wholly within 12" of this unit and pick 1 of the following augmentations to apply to that unit until your next hero phase. The same unit cannot be picked to benefit from this ability more than once per turn.

        Ossified Barbs: Improve the Rend characteristic of that unit's melee weapons by 1.
        
        Accelerated Calcification: The first wound or mortal wound caused to that unit in each phase is negated.
        
        Enhanced Clawspan: If the unmodified hit roll for an attack made with a missile weapon by that unit is 6, that attack scores 2 hits on the target instead of 1. Make a wound roll and save roll for each hit.`,
        when: [HERO_PHASE],
      },
    ],
  },
  Katakros: {
    mandatory: {
      command_abilities: [
        keyPicker(CommandAbilities, ['Supreme Lord of the Bonereaper Legions', 'Endless Duty']),
      ],
    },
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
        name: `Warmaster`,
        desc: `If this unit is included in a Mortis Praetorians army, it is treated as a general even if it is not the model picked to be the army's general.`,
        when: [DURING_GAME],
      },
      {
        name: `Companion`,
        desc: `This unit is accompanied by a personal guard armed with Retinue Blades. The Nadirite Weapons battle trait applies to attacks made with Retinue Blades.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Prime Necrophoros`,
        desc: `Once per turn, this unit can issue a command to a friendly OSSIARCH BONEREAPERS unit anywhere on the battlefield without a command point being spent.`,
        when: [DURING_GAME],
      },
      {
        name: `Gnosis Scrollbearer`,
        desc: `At the start of your hero phase, you can pick 1 enemy unit on the battlefield. Until your next hero phase, subtract 1 from hit rolls for attacks made by that unit that target friendly OSSIARCH BONEREAPERS units.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Aviarch Spymaster`,
        desc: `Once per turn, you can roll a dice when your opponent receives a command point. If you do so, on a 5+, that command point is lost.`,
        when: [DURING_GAME],
      },
      {
        name: `Do Nothing! This One is Mine!`,
        desc: `Use the bottom row of this unit's damage table while it is within 3" of any enemy HEROES.`,
        when: [DURING_GAME],
      },
      {
        name: `Mortarch of the Necropolis`,
        desc: `In your hero phase, you can pick up to 3 different friendly OSSIARCH BONEREAPERS units wholly within 24" of this unit. If that unit is not an IMMORTIS GUARD or NECROPOLIS STALKERS unit, you can either heal up to 3 wounds allocated to that unit or, if no wounds have been allocated to that unit, you can return a number of slain models to it that have a combined Wounds characteristic of 3 or less.

        If that unit is an IMMORTIS GUARD or NECROPOLIS STALKERS unit, you can either heal up to 3 wounds allocated to that unit or, if no wounds have been allocated to that unit, roll a dice. On a 3+, you can return 1 slain model to that unit. `,
        when: [HERO_PHASE],
      },
    ],
  },
  'Mir Kainan': {
    mandatory: {
      spells: [keyPicker(Spells, ['Dire Ultimatum'])],
    },
    effects: [
      GenericEffects.WizardOneSpellEffect,
      {
        name: `Bone-tithe`,
        desc: `This unit has a tithe score that starts at 0 at the start of the battle. Each time an enemy model is slain by this unit's attacks, increase this unit's tithe score by 1. If that slain model had a Wounds characteristic of 4 or more, increase this unit's tithe score by 2 instead of 1.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
      {
        name: `Bone-tithe`,
        desc: `At the start of your hero phase, if this unit has a tithe score of 1 or more, you can reduce its tithe score by 1. If you do so, pick 1 of the following abilities:

        Built for War: Pick 1 friendly KAINAN'S REAPERS unit wholly within 6" of this unit. You can return up to 3 slain models to that unit.
        
        Invigorated: Until your next hero phase, add 1 to the Attacks characteristic of melee weapons used by this unit and by friendly KAINAN'S REAPERS units wholly within 6" of this unit.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  "Kainan's Reapers": {
    effects: [
      {
        name: `Dark Efficiency`,
        desc: `If a friendly MIR KAINAN is within 3" of this unit, before you allocate a wound or mortal wound to that HERO, or instead of making a ward roll for a wound or mortal wound that would be allocated to that HERO, roll a dice. On a 2+, that wound or mortal wound is allocated to this unit instead of MIR KAINAN and cannot be negated.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
      {
        name: `Tithe Reapers`,
        desc: `Each model in this unit counts as 3 models for the purposes of controlling objectives.`,
        when: [DURING_GAME],
      },
    ],
  },
}

export default tagAs(Units, 'unit')
