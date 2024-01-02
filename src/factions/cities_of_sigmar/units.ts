import { keyPicker, tagAs } from 'factions/metatagger'
import { GenericEffects } from 'generic_rules'
import {
  BATTLESHOCK_PHASE,
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  END_OF_CHARGE_PHASE,
  END_OF_COMBAT_PHASE,
  END_OF_HERO_PHASE,
  END_OF_MOVEMENT_PHASE,
  END_OF_SETUP,
  HERO_PHASE,
  MOVEMENT_PHASE,
  SAVES_PHASE,
  SHOOTING_PHASE,
  START_OF_BATTLESHOCK_PHASE,
  START_OF_COMBAT_PHASE,
  START_OF_GAME,
  START_OF_HERO_PHASE,
  START_OF_SHOOTING_PHASE,
  TURN_ONE_START_OF_ROUND,
  WARDS_PHASE,
  WOUND_ALLOCATION_PHASE,
} from 'types/phases'
import prayers from './prayers'
import spells from './spells'
import { TItemDescriptions } from 'factions/factionTypes'
import monstrous_rampages from './monstrous_rampages'

const CelestialHurricanumEffects = [
  {
    name: `Portents of Battle`,
    desc: `Add 1 to hit rolls for attacks made by friendly CITIES OF SIGMAR HUMAN units wholly within 9" of any friendly units with this ability.`,
    when: [SHOOTING_PHASE, COMBAT_PHASE],
    shared: true,
  },
  {
    name: `Storm of Shemtek`,
    desc: `In your hero phase, you can pick 1 enemy unit within 18" of this unit and roll a number of dice equal to the number of the current battle round. For each roll of 2+, that enemy unit suffers D3 mortal wounds.`,
    when: [HERO_PHASE],
    shared: true,
  },
]
const LuminarkEffects = [
  {
    name: `Aura of Protection`,
    desc: `Friendly CITIES OF SIGMAR HUMAN units have a ward of 6+ while they are wholly within 9" of any friendly units with this ability.`,
    when: [WARDS_PHASE],
    shared: true,
  },
  {
    name: `Searing Beam of Light`,
    desc: `Do not use the attack sequence for an attack made with Searing Beam of Light. Instead, pick 1 point on the battlefield within range of the shooting model that is visible to it and draw a straight line between that point and the closest point on the shooting model's base. Roll a dice for each unit that has any models passed across by that line. For each roll of 2+, that unit suffers D3 mortal wounds.`,
    when: [SHOOTING_PHASE],
    shared: true,
  },
]
const SteamTankEffects = [
  {
    name: `More Pressure!`,
    desc: `In your hero phase, you can say that this unit will overpressure its boiler. If you do so, roll 2D6. If the roll is less than the number of wounds currently allocated to this unit, this unit suffers D3 mortal wounds. Ifthe roll is equal or greater than the number of wounds currently allocated to this unit, pick 1 of the following effects to apply to this unit until the start of your next hero phase:

    Power the Wheels: This unit can run and shoot and/or charge in the same turn.
    
    Power the Guns: Add 1 to the Attacks characteristic of this unit's Steam Cannon and add D6 to the Attacks characteristic of this unit's Steam Gun.`,
    when: [HERO_PHASE],
    shared: true,
  },
  {
    name: `Steel Behemoth`,
    desc: `After this unit makes a charge move, you can pick 1 enemy unit within 1" of this unit and roll a dice. On a 2+, that enemy unit suffers D3 mortal wounds.`,
    when: [CHARGE_PHASE],
    shared: true,
  },
]
const BloodSacrificeEffect = {
  name: `Blood Sacrifice`,
  desc: `At the start of your hero phase, you can pick 1 friendly DARKLING COVENS model within 3" of this unit to be slain. If you do so, add 2 to casting rolls for this unit until the end of that phase.`,
  when: [START_OF_HERO_PHASE],
  shared: true,
}
const NoxiousBreathEffect = {
  name: `Noxious Breath`,
  desc: `The Attacks characteristic of Noxious Breath is equal to the number of models in the target unit (to a maximum Attacks characteristic of 10).`,
  when: [SHOOTING_PHASE],
  shared: true,
}
const GrimResolveEffect = {
  name: `Grim Resolve`,
  desc: `This unit has a ward of 5+.`,
  when: [WARDS_PHASE],
  shared: true,
}
const WeaponsOfBanishmentEffect = {
  name: `Weapons of Banishment`,
  desc: `Double the Damage characteristic of an attack made with this model's weapons if the target of that attack is a WIZARD or DAEMON. In addition, when this model fights or shoots, you can choose an endless spell to be the target of any of its attacks. If you do so, roll a dice to see if that attack scores a hit. If it does, do not make a wound or save roll. Instead, roll 2D6. If the roll is greater than the casting value of that endless spell, that endless spell is dispelled.`,
  when: [SHOOTING_PHASE, COMBAT_PHASE],
  shared: true,
}
const CinderblastBombEffect = {
  name: `Cinderblast Bomb`,
  desc: `If this unit includes a model armed with a Cinderblast Bomb, once per battle, in your shooting phase, that model can throw it. If it does so, pick 1 enemy unit within 6" of that model and roll a dice. On a 2+, that unit suffers D3 mortal wounds.`,
  when: [SHOOTING_PHASE],
  shared: true,
}

const Units = {
  Battlemage: {
    effects: [
      GenericEffects.WizardOneSpellEffect,
      {
        name: `Ancient Grimoire`,
        desc: `If you selected this trinket: Add 1 to casting rolls for this unit.`,
        when: [HERO_PHASE],
      },
      {
        name: `Eldritch Hourglass`,
        desc: `If you selected this trinket: This unit has ward of 5+.`,
        when: [WARDS_PHASE],
      },
      {
        name: `Enchanted Blade`,
        desc: `If you selected this trinket: Add 2 to the Attacks characteristic of this unit's Wizard Staff.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Ensorcelled Skull`,
        desc: `If you selected this trinket: Add 1 to unbinding rolls for this unit.`,
        when: [HERO_PHASE],
      },
      {
        name: `Realmstone Orb`,
        desc: `If you selected this trinket: Add 6" to the range of spells cast by this unit.`,
        when: [HERO_PHASE],
      },
      {
        name: `Ritual Dagger`,
        desc: `If you selected this trinket: Once per battle, at the start of your hero phase, you can say that this unit will draw blood. If you do so, this unit suffers 1 mortal wound that cannot be negated and this unit can attempt to cast 1 additional spell in that phase.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Spectral Potion`,
        desc: `If you selected this trinket: Once per battle, in your hero phase, you can say that this unit will uncork its Spectral Potion. If you do so, pick 1 enemy unit within 12" of this unit and roll a dice. On a 2+, that enemy unit suffers D3 mortal wounds.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Battlemage on Griffon': {
    mandatory: {
      spells: [keyPicker(spells, ['Amber Spear'])],
    },
    effects: [
      GenericEffects.WizardOneSpellEffect,
      {
        name: `Two-headed`,
        desc: `If the unmodified hit roll for an attack made with this unit's Twin Beaks is 6, that attack scores 2 hits on the target instead of 1. Make a wound roll and save roll for each hit.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Ghurish Ferocity`,
        desc: `Add 1 to the Damage characteristic of this unit's Razor Claws and Twin Beaks for attacks that target enemy MONSTERS.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Battlemage on Celestial Hurricanum': {
    mandatory: {
      spells: [keyPicker(spells, ['Chain Lightning'])],
    },
    effects: [GenericEffects.WizardOneSpellEffect, ...CelestialHurricanumEffects],
  },
  'Celestial Hurricanum': {
    effects: [...CelestialHurricanumEffects], // updated 2024
  },
  'Battlemage on Luminark of Hysh': {
    mandatory: {
      spells: [keyPicker(spells, ['Burning Gaze'])],
    },
    effects: [...LuminarkEffects],
  },
  'Luminark of Hysh': {
    effects: [...LuminarkEffects], // updated 2024
  },
  Flagellants: {
    effects: [
      {
        name: `Champion`,
        desc: `1 model in this unit can be a Prophet. Add 1 to the Attacks characteristic of that model's melee weapon.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Glorious Martyrs`,
        desc: `Each time a model in this unit is slain by an attack made with a melee weapon, you can pick 1 enemy unit within 3" of this unit and roll a dice. On a 5+, that unit suffers 1 mortal wound.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
    ],
  },
  'Freeguild Steelhelms': {
    effects: [
      {
        name: `Champion`,
        desc: `1 model in this unit can be a Sergeant-at-Arms. Add 1 to the Attacks characteristic of that model's melee weapons.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Standard Bearer`,
        desc: `1 in every 10 models in this unit can be a Steelhelm Herald. Add 1 to the Bravery characteristic of this unit while it includes any Steelhelm Heralds.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Consecrate the Land`,
        desc: `At the end of your movement phase, if this unit includes a Battle Priest and is contesting an objective you control that is not contested by any enemy models, you can say that it will consecrate the land. If you do so, roll a dice. On a 3+, that objective is considered by you to be consecrated. Friendly CITIES OF SIGMAR HUMAN units have a ward of 6+ while they are contesting a consecrated objective. If your opponent gains control of a consecrated objective, it is no longer consecrated.`,
        when: [END_OF_MOVEMENT_PHASE],
      },
      {
        name: `Hold the Line`,
        desc: `Each time this unit receives the All-out Attack or All-out Defence command, you can pick 1 other friendly unit with this ability that is wholly within 12" of this unit and has not received any commands this phase. That unit receives the same command as this unit and the sequence ends.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },
  'Freeguild Marshal on Griffon': {
    effects: [
      {
        name: `Charging Lance`,
        desc: `If this unit made a charge move in the same turn, add 1 to the Damage characteristic of its Freeguild Lance and improve the Rend characteristic of its Freeguild Lance by 1.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Tactical Acumen`,
        desc: `If this unit is included in a Cities of Sigmar army, once per battle, when orders are being given to HEROES, this unit can be given 2 orders instead of 1. Each order must be different.`,
        when: [DURING_GAME],
      },
      {
        name: `Piercing Bloodroar`,
        desc: `When you carry out the Roar monstrous rampage with this unit, you can pick 2 enemy units within 3" of it instead of 1.`,
        when: [END_OF_CHARGE_PHASE],
      },
    ],
  },
  'Freeguild Marshal and Relic Envoy': {
    effects: [
      {
        name: `Attendant Relic Envoy`,
        desc: `At the start of your hero phase, you must choose for this unit's Relic Envoy to attend the Marshal or to deliver a message to a nearby unit.

        If you choose for the Relic Envoy to attend the Marshal, you can carry out a heroic action with this unit in addition to any other unit you carry out a heroic action with.
        
        If you choose for the Relic Envoy to deliver a message to a nearby unit, pick 1 other friendly CITIES OF SIGMAR HUMAN unit wholly within 12" of this unit. Until the start of your next hero phase, the next time that unit receives a command, a command point is not spent.
        
        Designer's Note: The Relic Envoy's miniature isn't considered to be a model for rules purposes, so it can be placed beside the unit to which the message is being delivered.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Heroic Action: Deliver Rousing Speech`,
        desc: `Once per battle, you can carry out the 'Deliver Rousing Speech' heroic action with this unit instead of any other heroic action you can carry out with it. Pick up to 3 friendly CITIES OF SIGMAR HUMAN units wholly within 18" of this unit. For each unit picked, roll 2D6. If the score is less than or equal to that unit's Bravery characteristic, until the end of the turn, models in that unit count as 2 models for the purposes of contesting objectives.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'Freeguild Command Corps': {
    effects: [
      {
        name: `The Marshal's Retinue`,
        desc: `At the start of the first battle round, before determining who has the first turn, you can pick 1 friendly FREEGUILD MARSHAL AND RELIC ENVOY on the battlefield for this unit to be assigned to. The same FREEGUILD MARSHAL cannot have more than 1 FREEGUILD COMMAND CORPS assigned to it. That FREEGUILD MARSHAL has a ward of 4+ while it is within 3" of this unit.`,
        when: [TURN_ONE_START_OF_ROUND, WARDS_PHASE],
      },
      {
        name: `Sawbones`,
        desc: `You can only use this ability while this unit has a War Surgeon. At the end of your hero phase, you can pick up to 3 friendly CITIES OF SIGMAR HUMAN units wholly within 12" of this unit. For each unit picked, you can either heal up to D3 wounds allocated to that unit or, if no wounds have been allocated to that unit, you can return a number of slain models to it that have a combined Wounds characteristic of D3 or less.`,
        when: [END_OF_HERO_PHASE],
      },
      {
        name: `Dispatch Spies`,
        desc: `You can only use this ability while this unit has a Whisperblade. Once per turn, when an enemy unit issues a command, you can say that the Whisperblade will attempt to disrupt it. If you do so, roll a dice. On a 4+, that command is not received (the command ability still counts as having been used) and the command point that was spent to issue that command is lost. Each time a command is issued, no more than 1 attempt to disrupt it can be made.`,
        when: [DURING_GAME],
      },
      {
        name: `Sound the Advance`,
        desc: `You can only use this ability while this unit has a Great Herald. Add 1 to run rolls and charge rolls for friendly CITIES OF SIGMAR HUMAN units while they are wholly within 12" of any friendly units that have a Great Herald. In addition, when a friendly CITIES OF SIGMAR HUMAN unit wholly within 12" of any friendly units that have a Great Herald retreats, you can add D3" to the Move characteristic of all models in that unit until the end of the phase.`,
        when: [MOVEMENT_PHASE, CHARGE_PHASE],
      },
      {
        name: `Tune of the Corpus Somni`,
        desc: `You can only use this ability while this unit has a Soul Shepherd. In the battleshock phase, each time a model would flee from a friendly CITIES OF SIGMAR HUMAN unit while that friendly unit is wholly within 12" of this unit, roll a dice. On a 4+, that model does not flee. The same unit cannot be affected by this ability more than once in the same phase.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
  'Freeguild Cavaliers': {
    effects: [
      {
        name: `Champion`,
        desc: `1 model in this unit can be an Arch-Knight. That model is armed with an Arch-Knight's Blade instead of a Cavalier Weapon.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Standard Bearer`,
        desc: `1 in every 5 models in this unit can be a Cavalier Herald. Add 1 to the Bravery characteristic of this unit while it includes any Cavalier Heralds.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Devastating Charge`,
        desc: `If this unit made a charge move in the same turn, add 1 to the Damage characteristic of its Cavalier Weapons and improve the Rend characteristic of its Cavalier Weapons by 1.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Freeguild Fusiliers': {
    effects: [
      {
        name: `Champion`,
        desc: `1 model in this unit can be a Fusil-Sergeant. Add 2 to the Attacks characteristic of that model's Fusil-cannon. Alternatively, that model can be armed with a Brace of Pistols instead of a Fusil-cannon.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Standard Bearer`,
        desc: `1 in every 10 models in this unit can be a Fusilier Herald. Add 1 to the Bravery characteristic of this unit while it includes any Fusilier Heralds.

        Designer's Note: The Blackpowder Squire isn't a model for rules purposes; it is a marker for the Resupply Run ability.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Fusiliers, Fire!`,
        desc: `Each time a model shoots with a Fusil-cannon, if its unit is in a fortified position, use the Fortified Position weapon characteristics. Otherwise, use the Mobile weapon characteristics.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Fortified Position`,
        desc: `At the start of the battle, this unit is in a fortified position.`,
        when: [START_OF_GAME],
      },
      {
        name: `Fortified Position`,
        desc: `At the end of your movement phase, if this unit both remained stationary and was not set up in that phase, it can establish a fortified position. Once this unit is in a fortified position, it remains so until it moves or is removed from the battlefield. While this unit is in a fortified position, you can ignore negative modifiers to save rolls for attacks made with missile weapons that target it.`,
        when: [END_OF_MOVEMENT_PHASE],
      },
      {
        name: `Resupply Run`,
        desc: `Once per battle, at the start of your shooting phase in the third or subsequent battle rounds, you can say that this unit will be resupplied by its Blackpowder Squire. If you do so, you can reroll hit rolls for attacks made with missile weapons by this unit until the end of that phase.`,
        when: [START_OF_SHOOTING_PHASE],
      },
    ],
  },
  'Freeguild Cavalier-Marshal': {
    effects: [
      {
        name: `For Sigmar, Charge!`,
        desc: `When the 'Their Finest Hour' heroic action is carried out with this unit, in addition to the normal effect, until the end of the turn, add 3 to charge rolls for this unit and friendly FREEGUILD CAVALIERS units while they are wholly within 12" of this unit.`,
        when: [DURING_GAME],
      },
      {
        name: `Run Down the Foe`,
        desc: `The strike-first effect applies to this unit if it made a charge move in the same turn. In addition, in the combat phase, if this unit made a charge move in the same turn, after this unit has fought for the first time in phase, you can pick 1 friendly FREEGUILD CAVALIERS unit wholly within 12" of this unit and that has not yet fought in that phase. That unit can fight immediately.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Warden King': {
    effects: [
      {
        name: `Ancestral Grudgebearer`,
        desc: `If this unit is picked to be your general, at the start of first battle round, you can pick 1 enemy unit to bear a grudge against. If you do so, until the end of the battle, if the unmodified hit roll for an attack made with a melee weapon by a friendly CITIES OF SIGMAR DUARDIN unit that targets that enemy unit is 6, that attack automatically wounds the target (do not make a wound roll).`,
        when: [TURN_ONE_START_OF_ROUND, COMBAT_PHASE],
      },
      {
        name: `Fearless Leader`,
        desc: `In the combat phase, after this unit has fought for the first time in that phase, you can pick 1 friendly CITIES OF SIGMAR DUARDIN unit that has not yet fought in that phase, is within 3" of an enemy unit and is wholly within 12" of this unit. That unit can fight immediately.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  Runelord: {
    mandatory: {
      prayers: [keyPicker(prayers, ['Forgefire'])],
    },
    effects: [
      {
        name: `Runes of Spellbreaking`,
        desc: `This unit can attempt to unbind one spell in the enemy hero phase in the same manner as a WIZARD.`,
        when: [HERO_PHASE],
      },
    ],
  },
  Longbeards: {
    effects: [
      {
        name: `Champion`,
        desc: `1 model in this unit can be an Old Guard. Add 1 to the Attacks characteristic of that model's melee weapons.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Standard Bearer`,
        desc: `1 in every 10 models in this unit can be a Standard Bearer. Add 1 to the Bravery characteristic of this unit while it includes any Standard Bearers.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Musician`,
        desc: `1 in every 10 models in this unit can be a Musician. Add 1 to run rolls and charge rolls for this unit while it includes any Musicians.`,
        when: [MOVEMENT_PHASE, CHARGE_PHASE],
      },
      {
        name: `Shield`,
        desc: `If this unit is armed with Ancestral Weapons and Gromril Shields, it has a Save characteristic of 3+ instead of 4+.`,
        when: [SAVES_PHASE],
      },
      {
        name: `I Thought Duardin Were Made of Sterner Stuff!`,
        desc: `Each time a model would flee from a friendly CITIES OF SIGMAR DUARDIN unit that is wholly within 12" of any friendly units with this ability, roll a dice. On a 4+, that model does not flee.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
  Ironbreakers: {
    effects: [
      {
        name: `Champion`,
        desc: `1 model in this unit can be an Ironbeard. That model is armed with Drakefire Pistols and a Cinderblast Bomb in addition to its Ironbreaker Weapon.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Standard Bearer`,
        desc: `1 in every 10 models in this unit can be a Standard Bearer. Add 1 to the Bravery characteristic ofthis unit while it includes any Standard Bearers.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Musician`,
        desc: `1 in every 10 models in this unit can be a Hornblower. Add 1 to run rolls and charge rolls for this unit while it includes any Hornblowers.`,
        when: [MOVEMENT_PHASE, CHARGE_PHASE],
      },
      CinderblastBombEffect,
      {
        name: `Gromril Shieldwall`,
        desc: `If this unit is picked for the 'Form Shieldwall' order, it has a ward of 4+ until the end of the phase instead of 5+.`,
        when: [WARDS_PHASE],
      },
    ],
  },
  Irondrakes: {
    effects: [
      {
        name: `Champion`,
        desc: `1 model in this unit can be an Ironwarden. An Ironwarden can replace its Drakegun with 1 of the following weapon options: Grudgehammer Torpedo; or Drakefire Pistols and a Cinderblast Bomb.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Standard Bearer`,
        desc: `1 in every 10 models in this unit can be a Standard Bearer. Add 1 to the Bravery characteristic ofthis unit while it includes any Standard Bearers.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Musician`,
        desc: `1 in every 10 models in this unit can be a Hornblower. Add 1 to run rolls and charge rolls for this unit while it includes any Hornblowers.`,
        when: [MOVEMENT_PHASE, CHARGE_PHASE],
      },
      CinderblastBombEffect,
      {
        name: `Blaze Away`,
        desc: `Add 1 to the Attacks characteristic of this unit's missile weapons if there are no enemy units within 3" of this unit and this unit has not made a move or been set up in the same turn.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Grudgehammer Torpedo`,
        desc: `The Damage characteristic of this unit's Grudgehammer Torpedo is 3 if the target of the attack is a MONSTER.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  Hammerers: {
    effects: [
      {
        name: `Champion`,
        desc: `1 model in this unit can be a Keeper of the Gate. Add 1 to the Attacks characteristic of that model's melee weapons.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Standard Bearer`,
        desc: `1 in every 10 models in this unit can be a Standard Bearer. Add 1 to the Bravery characteristic of this unit while it includes any Standard Bearers.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Musician`,
        desc: `1 in every 10 models in this unit can be a Musician. Add 1 to run rolls and charge rolls for this unit while it includes any Musicians.`,
        when: [MOVEMENT_PHASE, CHARGE_PHASE],
      },
      {
        name: `Kingsguard`,
        desc: `At the start of the first battle round, before determining who has the first turn, you can pick 1 friendly WARDEN KING on the battlefield for this unit to be assigned to (the same WARDEN KING cannot have more than 1 unit assigned to it). That WARDEN KING has a ward of 4+ while it is within 3" of this unit.`,
        when: [TURN_ONE_START_OF_ROUND, WARDS_PHASE],
      },
    ],
  },
  'Steam Tank': {
    effects: [
      ...SteamTankEffects,
      {
        name: `Power the Wheels`,
        desc: `This unit can run and shoot and/or charge in the same turn.`,
        when: [MOVEMENT_PHASE, SHOOTING_PHASE, CHARGE_PHASE],
      },
      {
        name: `Power the Guns`,
        desc: `Add 1 to the Attacks characteristic of this unit's Steam Cannon and add D6 to the Attacks characteristic of this unit's Steam Gun.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  'Steam Tank Commander': {
    effects: [
      ...SteamTankEffects,
      {
        name: `Division Commander`,
        desc: `This unit can issue the same command up to 2 times in the same phase. If it does so, each command must be received by a friendly STEAM TANK. No command point is spent the second time this unit issues that command in that phase.`,
        when: [DURING_GAME],
      },
    ],
  },
  Cogsmith: {
    effects: [
      {
        name: `Free Arm`,
        desc: `Add 1 to hit rolls for attacks made with this model's missile weapons if it is not armed with a Cog Axe.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Free Arm`,
        desc: `Add 1 to hit rolls for attacks made with this unit's melee weapons if it is not armed with a Grudge-raker.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Direct the Gyrocorps`,
        desc: `This unit can issue commands to friendly GYROCOPTERS and GYROBOMBER units anywhere on the battlefield.`,
        when: [DURING_GAME],
      },
    ],
  },
  Steamtank: {
    effects: [...SteamTankEffects], // updated 2024
  },
  Gyrobomber: {
    effects: [
      {
        name: `Grudgebuster Bombs`,
        desc: `After this unit has made a normal move, pick 1 enemy unit that this unit passed across and roll a dice. On a 2+, that enemy unit suffers D3 mortal wounds.`,
        when: [MOVEMENT_PHASE],
      },
    ],
  },
  Gyrocopters: {
    effects: [
      {
        name: `Champion`,
        desc: `If this unit has 2 or more models, 1 model in this unit can be a Squadron Leader. Add 1 to the Attacks characteristic of that model's missile weapons.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Guild Bombs`,
        desc: `Once per battle, after this unit has made a normal move, pick 1 enemy unit and roll 1 dice for each model in this unit that passed across any models in that enemy unit. For each roll of 2+, that enemy unit suffers D3 mortal wounds.`,
        when: [MOVEMENT_PHASE],
      },
    ],
  },
  Sorceress: {
    mandatory: {
      spells: [keyPicker(spells, ['Word of Pain'])],
    },
    effects: [GenericEffects.WizardOneSpellEffect, BloodSacrificeEffect],
  },
  'Sorceress on Black Dragon': {
    mandatory: {
      spells: [keyPicker(spells, ['Bladestorm'])],
    },
    effects: [
      GenericEffects.WizardOneSpellEffect,
      {
        name: `Command Underlings`,
        desc: `This unit can issue the same command up to 2 times in the same phase. If it does so, each command must be received by a friendly DARKLING COVENS unit. No command point is spent the second time this unit issues that command in that phase.`,
        when: [DURING_GAME],
      },
      NoxiousBreathEffect,
    ],
  },
  Dreadspears: {
    effects: [
      {
        name: `Champion`,
        desc: `1 model in this unit can be a Lordling. Add 1 to the Attacks characteristic of that model's melee weapons.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Standard Bearer`,
        desc: `1 in every 10 models in this unit can be a Standard Bearer. Add 1 to the Bravery characteristic of this unit while it includes any Standard Bearers.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Musician`,
        desc: `1 in every 10 models in this unit can be a Drummer. Add 1 to charge rolls for this unit while it includes any Drummers.`,
        when: [CHARGE_PHASE],
      },
      {
        name: `Coven Guard`,
        desc: `Add 1 to hit rolls for attacks made by this unit that target an enemy unit that made a charge move in the same turn.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  Bleakswords: {
    effects: [
      {
        name: `Champion`,
        desc: `1 model in this unit can be a Lordling. Add 1 to the Attacks characteristic of that model's melee weapons.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Standard Bearer`,
        desc: `1 in every 10 models in this unit can be a Standard Bearer. Add 1 to the Bravery characteristic of this unit while it includes any Standard Bearers.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Musician`,
        desc: `1 in every 10 models in this unit can be a Hornblower. Add 1 to charge rolls for this unit while it includes any Hornblowers.`,
        when: [CHARGE_PHASE],
      },
      {
        name: `Quicksilver Strike`,
        desc: `If the unmodified hit roll for an attack made with a Darkling Sword is 6, that attack scores 2 hits on the target instead of 1. Make a wound roll and save roll for each hit.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  Darkshards: {
    effects: [
      {
        name: `Champion`,
        desc: `1 model in this unit can be a Lordling. Add 1 to the Attacks characteristic of that model's missile weapons.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Standard Bearer`,
        desc: `1 in every 10 models in this unit can be a Standard Bearer. Add 1 to the Bravery characteristic of this unit while it includes any Standard Bearers.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Musician`,
        desc: `1 in every 10 models in this unit can be a Hornblower. Add 1 to charge rolls for this unit while it includes any Hornblowers.`,
        when: [CHARGE_PHASE],
      },
      {
        name: `Storm of Iron-tipped Bolts`,
        desc: `Add 1 to hit rolls for attacks made with this unit's Repeater Crossbows while it has 10 or more models.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  'Black Guard': {
    effects: [
      {
        name: `Champion`,
        desc: `1 model in this unit can be a Lordling. Add 1 to the Attacks characteristic of that model's melee weapons.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Standard Bearer`,
        desc: `1 in every 10 models in this unit can be a Standard Bearer. Add 1 to the Bravery characteristic of this unit while it includes any Standard Bearers.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Musician`,
        desc: `1 in every 10 models in this unit can be a Drummer. Add 1 to charge rolls for this unit while it includes any Drummers.`,
        when: [CHARGE_PHASE],
      },
      {
        name: `Steel and Sorcery`,
        desc: `This unit has a ward of 4+ while it is within 3" of any friendly Sorceress units. In addition, friendly Sorceress units have a ward of 4+ while they are within 3" of any units with this ability.

        Designer's Note: This does not include Sorceress on Black Dragon units.`,
        when: [WARDS_PHASE],
      },
    ],
  },
  Executioners: {
    effects: [
      {
        name: `Champion`,
        desc: `1 model in this unit can be a Lordling. Add 1 to the Attacks characteristic ofthat model's melee weapons.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Standard Bearer`,
        desc: `1 in every 10 models in this unit can be a Standard Bearer. Add 1 to the Bravery characteristic of this unit while it includes any Standard Bearers.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Musician`,
        desc: `1 in every 10 models in this unit can be a Drummer. Add 1 to charge rolls for this unit while it includes any Drummers.`,
        when: [CHARGE_PHASE],
      },
      {
        name: `Severing Strike`,
        desc: `If the unmodified hit roll for an attack made with an Executioner's Draich is 6, that attack causes 2 mortal wounds to the target and the attack sequence ends.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Dreadlord on Black Dragon': {
    effects: [
      {
        name: `Under the Shadow of Black Wings`,
        desc: `You can reroll charge rolls for this unit and friendly ORDER SERPENTIS units wholly within 12" of this unit.`,
        when: [COMBAT_PHASE],
      },
      NoxiousBreathEffect,
      {
        name: `Shield`,
        desc: `If this unit made a charge move in the same turn, add 1 to the Damage characteristic of its Lance of Spite and improve the Rend characteristic of its Lance of Spite by 1.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Drakespawn Knights': {
    effects: [
      {
        name: `Champion`,
        desc: `1 model in this unit can be a Dread Knight. Add 1 to the Attacks characteristic of that model's melee weapons.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Standard Bearer`,
        desc: `1 in every 5 models in this unit can be a Standard Bearer. Add 1 to the Bravery characteristic of this unit while it includes any Standard Bearers.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Musician`,
        desc: `1 in every 5 models in this unit can be a Hornblower. Add 1 to run rolls and charge rolls for this unit while it includes any Hornblowers.`,
        when: [CHARGE_PHASE, MOVEMENT_PHASE],
      },
      {
        name: `Lance Charge`,
        desc: `If this unit made a charge move in the same turn, add 1 to the Damage characteristic of its Barbed Lances and improve the Rend characteristic of its Barbed Lances by 1.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Drakespawn Chariots': {
    effects: [
      {
        name: `Scythed Runners`,
        desc: `After this unit makes a charge move, pick 1 enemy unit and roll 2 dice for each model in this unit within 3" of a model in that enemy unit. For each roll of 2-4, that enemy unit suffers 1 mortal wound. For each roll of 5+, that enemy unit suffers 3 mortal wounds. If the enemy unit picked is within 3"of any friendly DRAKESPAWN KNIGHTS units, add 2 to each roll.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  'War Hydra': {
    effects: [
      {
        name: `Fiery Breath`,
        desc: `The Attacks characteristic of Fiery Breath is equal to the number of models in the target unit, to a maximum Attacks characteristic of 10.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Sever One Head, Another Takes Its Place`,
        desc: `At the end of the combat phase, you can heal up to 5 wounds allocated to this model.`,
        when: [END_OF_COMBAT_PHASE],
      },
    ],
  },
  Assassin: {
    effects: [
      {
        name: `Deathshead Poison`,
        desc: `If the unmodified wound roll for an attack made with Poison-coated Blades is 6, the target suffers D3 mortal wounds and the attack sequence ends (do not make a save roll).`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Hidden Murderer`,
        desc: `While this unit is within 3" of a friendly CITIES OF SIGMAR AELF unit that has 3 or more models, this unit is not visible to enemy models that are more than 12" away from it.`,
        when: [DURING_GAME],
      },
      {
        name: `In For the Kill`,
        desc: `The strike-first effect applies to this unit if it made a charge move in the same turn.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Dark Riders': {
    effects: [
      {
        name: `Champion`,
        desc: `1 model in this unit can be a Herald. Add 1 to the Attacks characteristic of that model's Barbed Spear.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Standard Bearer`,
        desc: `1 in every 5 models in this unit can be a Standard Bearer. Add 1 to the Bravery characteristic of this unit while it includes any Standard Bearers.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Musician`,
        desc: `1 in every 5 models in this unit can be a Hornblower. Add 1 to charge rolls for this unit while it includes any Hornblowers.`,
        when: [CHARGE_PHASE],
      },
      {
        name: `Sow Terror and Confusion`,
        desc: `Roll a dice each time an enemy unit issues a command within 12" of any friendly units with this ability. On a 5+, that command is not received (it still counts as having been used) and the command point that was spent to issue that command is lost.`,
        when: [DURING_GAME],
      },
      {
        name: `Shadow Raiders`,
        desc: `This unit can retreat and still shoot and or charge later in the turn. In addition, add 1 to hit rolls for attacks made by this unit if it made a retreat move in the same turn.`,
        when: [MOVEMENT_PHASE, SHOOTING_PHASE, CHARGE_PHASE, COMBAT_PHASE],
      },
    ],
  },
  'Black Ark Fleetmaster': {
    effects: [
      {
        name: `Murderous Swashbuckler`,
        desc: `If the unmodified hit roll for an attack made with a melee weapon that targets this unit is 1, the attacking unit suffers 2 mortal wounds after all of its attacks have been resolved.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `'At Them, You Curs!'`,
        desc: `When this unit issues the All-out Attack command to a friendly SCOURGE PRIVATEERS unit, add 1 to the Attacks characteristic of that unit's weapons until the end of the phase. This effect is in addition to the normal effect of All-out Attack.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },
  'Black Ark Corsairs': {
    effects: [
      {
        name: `Champion`,
        desc: `1 model in this unit can be a Reaver. Add 1 to the Attacks characteristic of that model's melee weapons.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Standard Bearer`,
        desc: `1 in every 10 models in this unit can be a Standard Bearer. Add 1 to the Bravery characteristic of this unit while it includes any Standard Bearers.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Musician`,
        desc: `1 in every 10 models in this unit can be a Hornblower. Add 1 to run rolls and charge rolls for this unit while it includes any Hornblowers.`,
        when: [MOVEMENT_PHASE, CHARGE_PHASE],
      },
      {
        name: `Skilled Swashbucklers`,
        desc: `If the unmodified hit roll for an attack made with a melee weapon that targets this unit is 1, the attacking unit suffers 1 mortal wound after all of its attacks have been resolved.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Scourgerunner Chariots': {
    effects: [
      {
        name: `Champion`,
        desc: `If this unit has 2 or more models, 1 model in this unit can be a High Beastmaster. Add 1 to the Attacks characteristic of that model's missile weapons.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Lay the Beast Low`,
        desc: `The Damage characteristic of this unit's Ravager Harpoon is 3 for attacks that target an enemy MONSTER.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  Kharibdyss: {
    effects: [
      {
        name: `Abyssal Howl`,
        desc: `Enemy units cannot receive the Rally and Inspiring Presence commands while they are within 12" of this unit.`,
        when: [START_OF_HERO_PHASE, START_OF_BATTLESHOCK_PHASE],
      },
    ],
  },
  'Doralia Ven Denst': {
    effects: [GrimResolveEffect, WeaponsOfBanishmentEffect],
  },
  'Galen Ven Denst': {
    effects: [
      GrimResolveEffect,
      {
        name: `Guardian and Mentor`,
        desc: `At the start of the combat phase, if this unit is within 3" of a friendly DORALIA VEN DENST and there are any enemy units within 3" of her, the strike-first effect applies to this unit.`,
        when: [START_OF_COMBAT_PHASE],
      },
      WeaponsOfBanishmentEffect,
    ],
  },
  'Tahlia Vedra, Lioness of the Parch': {
    mandatory: {
      monstrous_rampages: [keyPicker(monstrous_rampages, ['Paralysing Venom'])],
    },
    effects: [
      {
        name: `First Marshal of Hammerhal`,
        desc: `This unit has a ward of 6+.`,
        when: [WARDS_PHASE],
      },
      {
        name: `Lead From the Front`,
        desc: `While this unit is within 3" of any enemy units, this unit can issue the Rally command to friendly CITIES OF SIGMAR HUMAN units while they are within 3" of any enemy units. In addition, when it does so, you can return 1 slain model to the unit that receives the command for each 4+ instead of each 6.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Unparalleled Tactician`,
        desc: `If this unit is included in a Cities of Sigmar army, when orders are being given to HEROES, this unit can be given 2 orders instead of 1. Each order must be different.`,
        when: [DURING_GAME],
      },
    ],
  },
  'Alchemite Warforger': {
    mandatory: {
      spells: [keyPicker(spells, ['Blazing Weapons'])],
    },
    effects: [
      GenericEffects.WizardOneSpellEffect,
      {
        name: `Runic Crucible`,
        desc: `At the start of your hero phase, you can pick 1 friendly unit with this ability and say it will either stoke or expend the power of its runic crucible. If this unit stokes the power of its runic crucible, add 1 to casting rolls for this unit until the end of the phase. If it expends the power of its runic crucible, it cannot cast any spells this phase, but until the start of your next hero phase, add 1 save rolls for friendly CITIES OF SIGMAR HUMAN units while they are wholly within 12" of this unit.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'Fusil-Major on Ogor Warhulk': {
    effects: [
      {
        name: `Crack Shot`,
        desc: `If the unmodified hit roll for an attack made with this unit's Long Fusil is 6, you can say that this unit has attempted a crack shot. If you do so, the attack sequence ends. After all of this unit's attacks have been resolved, you can roll a dice for each crack shot it attempted. For each roll that is at least double the target unit's Wounds characteristic, pick 1 model from that unit to be slain.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Range Finder`,
        desc: `At the start of your shooting phase, you can pick 1 friendly CASTELITE unit wholly within 12" of this unit and roll a dice. Until the end of the phase, the Range characteristic of that unit's missile weapons is increased hy a number of inches equal to the roll. The same unit cannot be affected by this ability more than once in the same phase.`,
        when: [START_OF_SHOOTING_PHASE],
      },
      {
        name: `Fortified Position`,
        desc: `At the start of the battle, this unit is in a fortified position.`,
        when: [START_OF_GAME],
      },
      {
        name: `Fortified Position`,
        desc: `At the end of your movement phase, if this unit both remained stationary and was not set up in that phase, it can establish a fortified position. Once this unit is in a fortified position, it remains so until it moves or is removed from the battlefield. While this unit is in a fortified position, you can ignore negative modifiers to save rolls for attacks made with missile weapons that target it.`,
        when: [END_OF_MOVEMENT_PHASE],
      },
    ],
  },
  'Haskel Hexbane': {
    effects: [
      GrimResolveEffect,
      {
        name: `Hunt with Conviction`,
        desc: `After deployment but before the start of the first battle round, pick 1 enemy HERO or MONSTER on the battlefield to be the target of the witch hunt. If there are any enemy WIZARD HEROES on the battlefield, 1 of those units must be picked to be the target of the witch hunt. Add 1 to the damage inflicted by attacks made by this unit that target that unit.`,
        when: [END_OF_SETUP],
      },
      {
        name: `Flamewood Stakes`,
        desc: `At the end of the combat phase, you can pick 1 enemy unit within 1" of this unit and roll a dice. Add 1 to the roll if that unit has the DEATH, DAEMON or WIZARD keyword. On a 3+, that unit suffers D3 mortal wounds.`,
        when: [END_OF_COMBAT_PHASE],
      },
    ],
  },
  "Hexbane's Hunters": {
    effects: [
      GrimResolveEffect,
      {
        name: `Agents of the Order`,
        desc: `Add 1 to the damage inflicted by attacks made by this unit that target the unit you picked to be the target of the witch hunt (see the Haskel Hexbane warscroll).`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
      {
        name: `Flamewood Stakes`,
        desc: `At the end of the combat phase, you can pick 1 enemy unit within 1" of this unit and roll a dice. Add 1 to the roll if that unit has the DEATH, DAEMON or WIZARD keyword. On a 3+, that unit suffers D3 mortal wounds.`,
        when: [END_OF_COMBAT_PHASE],
      },
    ],
  },
  'Ironweld Great Cannon': {
    effects: [
      {
        name: `Shot and Shell`,
        desc: `Each time a model shoots with a Great Cannon, choose either the Cannonball, Armour-piercing Shell or Grapeshot missile weapon characteristics for that shooting attack. The Cannonball and Armour-piercing Shot can only be chosen while this unit is in a fortified position.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Fortified Position`,
        desc: `At the start of the battle, this unit is in a fortified position.`,
        when: [START_OF_GAME],
      },
      {
        name: `Fortified Position`,
        desc: `At the end of your movement phase, if this unit both remained stationary and was not set up in that phase, it can establish a fortified position. Once this unit is in a fortified position, it remains so until it moves or is removed from the battlefield. While this unit is in a fortified position, you can ignore negative modifiers to save rolls for attacks made with missile weapons that target it.`,
        when: [END_OF_MOVEMENT_PHASE],
      },
    ],
  },
  'Wildercorps Hunters': {
    effects: [
      {
        name: `Wildercorps Warden`,
        desc: `1 in every 11 models in this unit must be a Wildercorps Warden. That model is armed with a Ferocious Bite in addition to its other weapons. Wildercorps Wardens can issue commands to their own unit.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Trailhounds`,
        desc: `4 in every 11 models in this unit must be a Trailhound. Each of those models is armed with a Ferocious Bite instead of any other weapons.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Arbalester`,
        desc: `1 in every 11 models in this unit must be an Arbalester. That model is armed with a Hunting Arbalest instead of a Hunting Crossbow.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Expert Trackers`,
        desc: `After deployment but before the first battle round begins, this unit can make a normal move (it cannot run).`,
        when: [END_OF_SETUP],
      },
      {
        name: `Hidden and Dangerous`,
        desc: `This unit is not visible to enemy units while it is in cover or while it is more than 12" away from them.`,
        when: [DURING_GAME],
      },
      {
        name: `Hidden and Dangerous`,
        desc: `Improve the Rend characteristic of this unit's missile weapons by 1 while it is in cover.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  'Pontifex Zenestra, Matriarch of the Great Wheel': {
    mandatory: {
      prayers: [keyPicker(prayers, ['Vessel of Sigmar'])],
    },
    effects: [
      {
        name: `Voice of the God-King`,
        desc: `This unit can attempt to dispel 1 endless spell at the start of your hero phase and attempt to unbind 1 spell in the enemy hero phase, in the same manner as a WIZARD.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Voice of the God-King`,
        desc: `Add 1 to unbinding rolls made for this unit.`,
        when: [HERO_PHASE],
      },
      {
        name: `Blessed Palanquin`,
        desc: `This unit has a ward of 4+.`,
        when: [WARDS_PHASE],
      },
      {
        name: `Wrath of Azyr`,
        desc: `At the start of the combat phase and after this unit fights, roll a dice for each enemy unit within 3" of this unit. On a 2+, the unit being rolled for suffers D3 mortal wounds.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
} satisfies TItemDescriptions

export default tagAs(Units, 'unit')
