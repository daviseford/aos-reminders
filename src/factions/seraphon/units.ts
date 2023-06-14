import { keyPicker, tagAs } from 'factions/metatagger'
import { GenericEffects } from 'generic_rules'
import {
  BATTLESHOCK_PHASE,
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  DURING_SETUP,
  END_OF_ANY_PHASE,
  END_OF_CHARGE_PHASE,
  END_OF_COMBAT_PHASE,
  END_OF_MOVEMENT_PHASE,
  END_OF_SETUP,
  HERO_PHASE,
  MOVEMENT_PHASE,
  SAVES_PHASE,
  SHOOTING_PHASE,
  START_OF_COMBAT_PHASE,
  START_OF_HERO_PHASE,
  START_OF_MOVEMENT_PHASE,
  WARDS_PHASE,
  WOUND_ALLOCATION_PHASE,
} from 'types/phases'
import CommandAbilities from './command_abilities'
import Spells from './spells'

const TerradonBaseEffects = [
  {
    name: `Deadly Cargo`,
    desc: `Once per battle, after this unit finishes a normal move or run, you can pick 1 enemy unit and roll a dice if this unit passed across any models in that enemy unit. On a 4+, that enemy unit suffers D3 mortal wounds. In addition, if any mortal wounds caused by this ability are allocated to that enemy unit, halve the Move characteristic of that enemy unit until your next hero phase.`,
    when: [MOVEMENT_PHASE],
    shared: true,
  },
  {
    name: `Attack from On High`,
    desc: `Subtract 1 from hit rolls for attacks made with missile weapons that target this unit.`,
    when: [SHOOTING_PHASE],
    shared: true,
  },
]
const RipperdactylBaseEffects = [
  {
    name: `Blot Toad`,
    desc: `You receive 1 Blot Toad marker for each RIPPERDACTYL CHIEF in your army. After the players have received their starting command points but before the start of the first turn, you can pick 1 enemy unit to have a Blot Toad for each Blot Toad marker you have. Place a Blot Toad marker next to that enemy unit.

  Designer's Note: Blot Toads are not units; they are markers that are used to keep track of which enemy units have Blot Toads.`,
    when: [END_OF_SETUP],
    shared: true,
  },
  {
    name: `Toad Rage`,
    desc: `In the combat phase, add 1 to hit rolls and wound rolls for attacks made with this unit's Tearing Jaws that target an enemy unit that has a Blot Toad.`,
    when: [COMBAT_PHASE],
    shared: true,
  },
  {
    name: `Swooping Dive`,
    desc: `Subtract 1 from hit rolls from attacks made with missile weapons that target this unit. In addition, if this unit is targeted by attacks made by an enemy unit that received the Unleash Hell command in that phase, those attacks only score a hit on an unmodified hit roll of 6.`,
    when: [SHOOTING_PHASE, CHARGE_PHASE],
    shared: true,
  },
]
const KroxigorBaseEffects = [
  {
    name: `Skink Guidance`,
    desc: `Unit champions of SKINK units can issue commands to this unit if this unit is wholly within 12" of the SKINK unit.`,
    when: [DURING_GAME],
    shared: true,
  },
  {
    name: `Vice-like Jaws`,
    desc: `Each time this unit fights, after all of its attacks have been resolved, pick 1 enemy unit within 1" of this unit and roll 3 dice for each model in this unit within 1" of that unit. These dice rolls are referred to as bite rolls. For each bite roll of 6+, that enemy unit suffers 1 mortal wound.`,
    when: [COMBAT_PHASE],
    shared: true,
  },
]
const MightySaurusJawsEffect = {
  name: `Mighty Saurus Jaws`,
  desc: `Each time this unit fights, after all of its attacks have been resolved, pick 1 enemy unit within 1" of this unit and roll 3 dice. These dice rolls are referred to as bite rolls. For each bite roll of 6+, that enemy unit suffers 1 mortal wound.`,
  when: [COMBAT_PHASE],
  shared: true,
}
const SelflessProtectorsEffect = {
  name: `Selfless Protectors`,
  desc: `Before you allocate a wound or mortal wound to a friendly SERAPHON HERO that is not a MONSTER, or instead of making a ward roll for a wound or mortal wound that would be allocated to a friendly SERAPHON HERO that is not a MONSTER, if this unit is within 3" of that friendly SERAPHON HERO, you can roll a dice. On a 1-2, that wound or mortal wound is allocated to that SERAPHON HERO as normal. On a 3+, that wound or mortal wound is allocated to this unit instead.`,
  when: [WOUND_ALLOCATION_PHASE, WARDS_PHASE],
  shared: true,
}
const UnstoppableStampedeEffect = {
  name: `Unstoppable Stampede`,
  desc: `After this unit finishes a charge move, roll a dice for each enemy unit within 1" of this unit. On a 2+, that enemy unit suffers D3 mortal wounds.`,
  when: [CHARGE_PHASE],
  shared: true,
}
const SteadfastMajestyEffect = {
  name: `Steadfast Majesty`,
  desc: `Add 3 to the Bravery characteristic of friendly SKINK units that do not have the STEGADON keyword while they are wholly within 12" of any friendly units with this ability.`,
  when: [BATTLESHOCK_PHASE],
  shared: true,
}
const ArmouredCrestEffect = {
  name: `Armoured Crest`,
  desc: `At the start of the combat phase, you can pick 1 enemy unit within 3" of this unit that has up to 5 models. If you do so, until the end of that phase, add 1 to save rolls for attacks made by that unit that target this unit.`,
  when: [START_OF_COMBAT_PHASE],
  shared: true,
}
const CarnosaurBaseEffects = [
  {
    name: `Blood Frenzy`,
    desc: `If any enemy models are slain by wounds caused by this unit's attacks, for the rest of the battle, this unit is blood-frenzied. Add 1 to wound rolls for attacks made by this unit's mount while it is blood-frenzied.`,
    when: [WOUND_ALLOCATION_PHASE, COMBAT_PHASE],
    shared: true,
  },
  GenericEffects.Terror,
]
const ArcaneVassalEffect = {
  name: `Arcane Vassal`,
  desc: `When this unit attempts to cast a spell, before making the casting roll, you can pick either 1 friendly SKINK WIZARD within 12" of this unit or 1 friendly ORACLE anywhere on the battlefield. If you do so and the spell is successfully cast and not unbound, you must measure the range and visibility for that spell from that SKINK WIZARD or ORACLE.`,
  when: [HERO_PHASE],
  shared: true,
}
const SunfireThrowersEffect = {
  name: `Sunfire Throwers`,
  desc: `Do not use the attack sequence for an attack made with Sunfire Throwers. Instead, roll a number of dice equal to the number of models in the target unit that are within range of the attack. For each 5+, the target unit suffers 1 mortal wound.`,
  when: [SHOOTING_PHASE],
  shared: true,
}

const StegadonBaseEffects = [ArmouredCrestEffect, SteadfastMajestyEffect, UnstoppableStampedeEffect]

const IconBearersEffect = {
  name: `Standard Bearer`,
  desc: `Add 1 to the Bravery characteristic of this unit if it includes any Icon Bearers.`,
  when: [BATTLESHOCK_PHASE],
  shared: true,
}
const WardrummersEffect = {
  name: `Musician`,
  desc: `Add 1 to run rolls and charge rolls for this unit if it includes any War-drummers.`,
  when: [MOVEMENT_PHASE, CHARGE_PHASE],
  shared: true,
}
const StarbucklersEffect = {
  name: `Shield`,
  desc: `If this unit is armed with Star-bucklers, it has a Save characteristic of 5+ instead of 6+.`,
  when: [SAVES_PHASE],
  shared: true,
}
const ChameleonAmbushEffects = [
  {
    name: `Chameleon Ambush`,
    desc: `During deployment, instead of setting up this unit on the battlefield, you can place it to one side and say that it is hiding as a reserve unit. If you do so, at the end of your movement phase, you can set up this unit on the battlefield more than 9" from all enemy units.`,
    when: [DURING_SETUP, END_OF_MOVEMENT_PHASE],
    shared: true,
  },
  {
    name: `Chameleon Ambush`,
    desc: `If this unit is on the battlefield at the end of your movement phase, you can remove it from the battlefield and say that it is hiding as a reserve unit. If you do so, at the end of any of your subsequent movement phases, you can set up this unit on the battlefield more than 9" from all enemy units.`,
    when: [END_OF_MOVEMENT_PHASE],
    shared: true,
  },
]
const HornblowersEffect = {
  name: `Musician`,
  desc: `Add 1 to run rolls and charge rolls for this unit if it includes any Hornblowers.`,
  when: [CHARGE_PHASE, MOVEMENT_PHASE],
  shared: true,
}
const HuntersOfHuanchiBaseEffects = [
  HornblowersEffect,
  ...ChameleonAmbushEffects,
  {
    name: `Perfect Mimicry`,
    desc: `This unit is not visible to enemy units that are more than 12" away or while it is in cover.`,
    when: [DURING_GAME],
    shared: true,
  },
]
const StarVenomEffect = {
  name: `Star-venom`,
  desc: `If the unmodified hit roll for an attack made with a Dartpipe is 6, the target suffers 1 mortal wound and the attack sequence ends (do not make a wound roll or save roll).`,
  when: [SHOOTING_PHASE],
  shared: true,
}

const Units = {
  'Lord Kroak': {
    mandatory: {
      spells: [keyPicker(Spells, ['Celestial Deliverance'])],
    },
    effects: [
      ArcaneVassalEffect,
      {
        name: `Azyrite Force Barrier`,
        desc: `The Attacks characteristic of this unit's Azyrite Force Barrier cannot be modified. Each time this unit attacks with its Azyrite Force Barrier, roll 1 dice for each enemy model within range. Roll 5 dice instead of 1 for each enemy MONSTER within range. On a 5+, that model's unit suffers 1 mortal wound.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Dead for Innumerable Ages`,
        desc: `At the end of each phase, roll 3D6 and add the current number of wounds allocated to this model. On a 20+ this model is slain, otherwise all wounds allocated are healed.`,
        when: [DURING_GAME],
      },
      {
        name: `Dead for Innumerable Ages`,
        desc: `At the end of each phase, if any wounds are allocated to this model, roll 3D6 and add the number of wounds allocated to this model to the roll. On a 20+, this model is slain. On any other roll, heal all wounds allocated to this model.`,
        when: [END_OF_ANY_PHASE],
      },
      {
        name: `Impeccable Foresight`,
        desc: `At the start of your hero phase, roll 3 dice for this unit. For each 4+, you receive 1 command point.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Supreme Master of Order`,
        desc: `Add 2 to casting, dispelling and unbinding rolls for this unit. In addition, this unit can attempt to unbind enemy spells that are cast anywhere on the battlefield and attempt to dispel endless spells anywhere on the battlefield.`,
        when: [HERO_PHASE],
      },
      {
        name: `Golden Death Mask`,
        desc: `At the start of the combat phase, you can pick 1 enemy unit within 12" of this unit and visible to it, and roll 2D6. If the roll is equal to or greater than that unit's Bravery characteristic, the strike-last effect applies to that unit until the end of that phase.`,
        when: [START_OF_COMBAT_PHASE],
      },
      {
        name: `Wizard`,
        desc: `This unit can attempt to cast 4 spells in your hero phase and attempt to unbind 4 spells in the enemy hero phase. If this unit is part of a Starborne army, it knows all of the spells from the Lore of Celestial Domination in addition to the other spells it knows. If this unit is part of a Coalesced army, it knows all the spells from the Lore of Ancient Domains in addition to the other spells it knows.`,
        when: [HERO_PHASE],
      },
      {
        name: `Warmaster`,
        desc: `If this unit is included in a Seraphon army, it is treated as a general even if it is not the model picked to be the army's general.`,
        when: [DURING_GAME],
      },
    ],
  },
  'Slann Starmaster': {
    mandatory: {
      spells: [keyPicker(Spells, ['Celestial Equilibrium', 'Shield of the Old Ones'])],
      command_abilities: [keyPicker(CommandAbilities, ['Gift from the Heavens'])],
    },
    effects: [
      {
        name: `Wizard`,
        desc: `This unit can attempt to cast 3 spells in your hero phase and attempt to unbind 3 spells in the enemy hero phase.`,
        when: [HERO_PHASE],
      },
      ArcaneVassalEffect,
      {
        name: `Masters of Order`,
        desc: `Add 1 to casting, dispelling and unbinding rolls for this unit. In addition, this unit can attempt to unbind enemy spells that are cast anywhere on the battlefield and attempt to dispel endless spells anywhere on the battlefield.`,
        when: [HERO_PHASE],
      },
      {
        name: `Foresight`,
        desc: `At the start of your hero phase, roll 2 dice for this unit. For each 4+, you receive 1 command point.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  // 'Saurus Oldblood on Carnosaur': {
  //   mandatory: {
  //     command_abilities: [keyPicker(CommandAbilities, ['Wrath of the Seraphon'])],
  //   },
  //   effects: [
  //     ...CarnosaurBaseEffects,
  //     {
  //       name: `Blazing Sunbolts`,
  //       desc: `Add 1 to wound rolls for attacks made with a Sunbolt Gauntlet if the target is a CHAOS DAEMON unit.`,
  //       when: [SHOOTING_PHASE],
  //     },
  //     ColdFerocityEffect,
  //   ],
  // },
  'Saurus Oldblood': {
    effects: [
      {
        name: `Predatory Exemplar`,
        desc: `In the combat phase, when you pick this unit to fight for the first time in that phase, you can pick 1 friendly SAURUS WARRIORS or SAURUS GUARD unit wholly within 12" of this unit and that has not yet fought in that phase. This unit and that unit can fight one after the other in the order of your choice.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Wrath of the Seraphon`,
        desc: `In the combat phase, if this unit issues the All-out Attack command to a friendly SAURUS WARRIORS or SAURUS GUARD unit, in addition to the effect of the command ability, add 1 to wound rolls for attacks made by melee weapons by that unit until the end of that phase.`,
        when: [COMBAT_PHASE],
      },
      MightySaurusJawsEffect,
    ],
  },
  'Saurus Scar-Veteran on Aggradon': {
    effects: [
      {
        name: `Primal Rage`,
        desc: `This unit has a rage score that starts at 0 at the start of the battle. At the end of each combat phase, if this unit is within 3" of any enemy units, increase its rage score by 1 (to a maximum of 3). At the end of each combat phase, if this unit is not within 3" of any enemy units, reset its rage score to 0. While this unit has a rage score of 1 or more, add its rage score to the Attacks characteristic of its Rending Bites and Striking Talons.`,
        when: [END_OF_COMBAT_PHASE],
      },
      {
        name: `Alpha Roar`,
        desc: `Once per battle, at the start of your combat phase, you can pick 1 friendly unit with this ability on the battlefield to unleash a feral roar. If you do so, increase the rage score of friendly AGGRADON units wholly within 18" of that unit by 1 (to a maximum of 3).`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  // 'Saurus Eternity Warden': {
  //   mandatory: {
  //     command_abilities: [keyPicker(CommandAbilities, ['Prime Guardian'])],
  //   },
  //   effects: [ColdFerocityEffect, SelflessProtectorsEffect],
  // },
  // 'Saurus Sunblood': {
  //   mandatory: {
  //     command_abilities: [keyPicker(CommandAbilities, ['Scent of Weakness'])],
  //   },
  //   effects: [
  //     {
  //       name: `Primal Rage`,
  //       desc: `If the unmodified hit roll for an attack made by this model is 6, that attack scores 2 hits on the target instead of 1. Make a wound and save roll for each hit. In addition, if the unmodified wound roll for an attack made by this model is 6, that attack inflicts 1 mortal wound on the target in addition to any normal damage.`,
  //       when: [COMBAT_PHASE],
  //     },
  //   ],
  // },
  'Saurus Scar-Veteran on Carnosaur': {
    effects: [
      ...CarnosaurBaseEffects,
      {
        name: `Maim and Tear`,
        desc: `At the end of the combat phase, you can pick 1 enemy unit within 1" of this unit and roll a number of dice equal to the number of wounds allocated to that enemy unit. For each 5+, that unit suffers 1 mortal wound.`,
        when: [END_OF_COMBAT_PHASE],
      },
    ],
  },
  'Saurus Astrolith Bearer': {
    effects: [
      {
        name: `Celestial Conduit`,
        desc: `Add 1 to casting rolls for friendly SERAPHON WIZARDS within 12" of any friendly units with this ability. In addition, add 6" to the range of any spells cast by friendly SERAPHON WIZARDS within 12" of any friendly units with this ability.`,
        when: [HERO_PHASE],
      },
      {
        name: `Revivifying Energies`,
        desc: `Friendly SERAPHON units have a ward of 6+ while they are wholly within 12" of any friendly units with this ability.`,
        when: [WARDS_PHASE],
      },
      MightySaurusJawsEffect,
    ],
  },
  // 'Skink Priest': {
  //   mandatory: {
  //     command_abilities: [keyPicker(CommandAbilities, ['Herald of the Old Ones'])],
  //   },
  //   effects: [
  //     {
  //       name: `Star-stone Staff`,
  //       desc: `In your hero phase, you can pick 1 friendly SKINK unit wholly within 12" of this model and roll a D6. On a 3+, until your next hero phase, that unit can run and still shoot and/or charge in the same turn, and you can add 1 to save rolls for attacks that target that unit. A unit cannot benefit from this ability more than once per phase.`,
  //       when: [HERO_PHASE],
  //     },
  //     {
  //       name: `Star-stone Staff`,
  //       desc: `If active, until your next hero phase, that unit can run and still shoot and/or charge in the same turn.`,
  //       when: [MOVEMENT_PHASE, SHOOTING_PHASE, CHARGE_PHASE],
  //     },
  //     {
  //       name: `Star-stone Staff`,
  //       desc: `If active, until your next hero phase, you can add 1 to save rolls for attacks that target that unit.`,
  //       when: [SAVES_PHASE],
  //     },
  //   ],
  // },
  'Skink Starseer': {
    mandatory: {
      spells: [keyPicker(Spells, ['Celestial Doom'])],
    },
    effects: [
      GenericEffects.WizardOneSpellEffect,
      {
        name: `Scry the Stars`,
        desc: `Once per battle, in your hero phase, you can say that this unit will scry the stars. If you do so, roll a number of dice equal to the number of the current battle round. For each 2+, you can pick 1 friendly SERAPHON unit on the battlefield. That unit has a ward of 5+ until the start of your next hero phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Skink Starpriest': {
    mandatory: {
      spells: [keyPicker(Spells, ['Blazing Starlight'])],
    },
    effects: [
      GenericEffects.WizardOneSpellEffect,
      {
        name: `Serpent Staff`,
        desc: `In your hero phase, you can pick 1 friendly SERAPHON unit wholly within 12" of this unit. If you do so, until your next hero phase, if the unmodified wound roll for an attack made by that unit is 6, that attack causes 1 mortal wound to the target in addition to any damage it inflicts.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Engine of the Gods': {
    effects: [
      ...StegadonBaseEffects,
      {
        name: `Cosmic Engine`,
        desc: `In your shooting phase, you can say that this unit will either harness or reserve the power of its cosmic engine. If you say that it will harness the power, pick 1 of the effects below and generate a power score by rolling 2D6. If you say that it will reserve the power, nothing happens, but you can roll 1 additional dice the next time this unit harnesses the power of its cosmic engine.

        Designer's Note: A unit can reserve the power of its cosmic engine multiple times before it next harnesses it. For example, if a unit reserves the power of its cosmic engine in 2 of your shooting phases consecutively, when it next harnesses the power of its cosmic engine, you would roll 2 additional dice when generating the power score for a total of 4D6.
        
        Healing Light: On a power score of 2-6, nothing happens. On a power score of 7+, heal D3 wounds allocated to each friendly SERAPHON unit wholly within 6" of this unit (roll separately for each unit).
        
        Bolts of Azure Energy: On a power score of 2-8, this unit sulfers 1 mortal wound. On a power score of 9+, pick 1 enemy unit within 24" of this unit and visible to it, and roll a number of dice equal to the power score. For each 4+, that enemy unit suffers 1 mortal wound.
        
        Time Slows: On a power score of 2-10, this unit suffers D3 mortal wounds. On a power score of 11+, until the end of the turn, the strike-first effect applies to friendly SERAPHON units wholly within 6" of this unit.
        
        Starlight Summons: On a power score of 2-12, this unit suffers 3 mortal wounds. On a power score of 13+, you can summon 1 SAURUS WARRIORS unit of 10 models or 1 SKINK COHORT unit of 20 models to the battlefield and add it to your army. The summoned unit must be set up wholly within 6" of this unit and more than 9" from all enemy units.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  'Saurus Warriors': {
    effects: [
      {
        name: `Ordered Cohort`,
        desc: `Add 1 to save rolls for attacks that target this unit if it is contesting any objectives or if it is wholly within your territory.`,
        when: [SAVES_PHASE],
      },
      {
        name: `Champion`,
        desc: `1 model in this unit can be a Saurus Warrior Alpha. Add 1 to the Attacks characteristic of that model's Celestite Club or Celestite Spear.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Saurus Jaws`,
        desc: `Each time this unit fights, after all of its attacks have been resolved, pick 1 enemy unit within 1" of this unit and roll 1 dice for each model in this unit within 1" of that unit. These dice rolls are referred to as bite rolls. For each bite roll of 6+, that enemy unit suffers 1 mortal wound.`,
        when: [COMBAT_PHASE],
      },
      IconBearersEffect,
      WardrummersEffect,
    ],
  },
  'Saurus Guard': {
    effects: [
      {
        name: `Champion`,
        desc: `1 model in this unit can be a Saurus Guard Alpha. Add 1 to the Attacks characteristic of that model's Celestite Polearm.`,
        when: [COMBAT_PHASE],
      },
      IconBearersEffect,
      WardrummersEffect,
      SelflessProtectorsEffect,
    ],
  },
  // 'Saurus Knights': {
  //   effects: [
  //     {
  //       name: `Saurus Knight Alpha`,
  //       desc: `1 model in this unit can be a Saurus Knight Alpha. Add 1 to the Attacks characteristic of that model's Celestite Blade or Celestite Warspear.`,
  //       when: [COMBAT_PHASE],
  //     },
  //     CelestiteWarspearEffect,
  //     IconBearersEffect,
  //     WardrummersEffect,
  //   ],
  // },
  Skinks: {
    effects: [
      {
        name: `Champion`,
        desc: `1 model in this unit can be a Skink Alpha. Add 1 to the Attacks characteristic of that model's weapons.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Swift and Nimble`,
        desc: `Each time this unit runs or receives the Redeploy command, when determining the distance this unit can move, you can roll 2 dice instead of 1 and pick either result.`,
        when: [MOVEMENT_PHASE],
      },
      StarbucklersEffect,
    ],
  },
  // 'Chameleon Skinks': {
  //   effects: [
  //     ...ChameleonAmbushEffects,
  //     {
  //       name: `Perfect Mimicry`,
  //       desc: `Models in this unit that are within 1" of a terrain feature have a ward of 4+`,
  //       when: [WARDS_PHASE],
  //     },
  //     StarVenomEffect,
  //   ],
  // },
  'Terradon Chief': {
    effects: [
      ...TerradonBaseEffects,
      {
        name: `Coordinated Attack`,
        desc: `Once per battle, at the start of your movement phase, you can pick 1 friendly unit with this ability on the battlefield to call a Terradon attack. If you do so, until the end of that phase, each time a friendly TERRADON unit wholly within 12" of that unit uses its Deadly Cargo ability, the enemy unit suffers D3 mortal wounds for each 2+ instead of each 4+.`,
        when: [START_OF_MOVEMENT_PHASE],
      },
    ],
  },
  'Terradon Riders': {
    effects: [
      {
        name: `Champion`,
        desc: `1 model in this unit can be a Terradon Rider Alpha. Add 1 to the Attacks characteristic of that model's Starstrike Javelin or Sunleech Bolas.`,
        when: [SHOOTING_PHASE],
      },
      ...TerradonBaseEffects,
    ],
  },
  'Ripperdactyl Chief': {
    effects: [
      ...RipperdactylBaseEffects,
      {
        name: `Ripperdactyl Assault`,
        desc: `Once per battle, at the start of your combat phase, you can pick 1 friendly unit with this ability on the battlefield to call a Ripperdactyl assault. If you do so, until the end of that phase, add 1 to the Attacks characteristic of melee weapons used by friendly RIPPERDACTYL units while they are wholly within 12" of that unit.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  'Ripperdactyl Riders': {
    effects: [
      {
        name: `Champion`,
        desc: `1 model in this unit can be a Ripperdactyl Rider Alpha. Add 1 to the Attacks characteristic of that model's Moonstone Warspear.`,
        when: [COMBAT_PHASE],
      },
      ...RipperdactylBaseEffects,
    ],
  },
  // 'Salamander Hunting Pack': {
  //   effects: [
  //     {
  //       name: `It Burns!`,
  //       desc: `If the unmodified hit roll for an attack made with a Stream of Fire or Burning Jaws is 6, that attack inflicts mortal wounds on the target unit and the attack sequence ends (do not make a wound or save roll).`,
  //       when: [SHOOTING_PHASE, COMBAT_PHASE],
  //     },
  //   ],
  // },
  // 'Razordon Hunting Pack': {
  //   effects: [
  //     {
  //       name: `Instinctive Defence`,
  //       desc: `If there are any enemy units within 3" of this unit at the end of the charge phase, and no enemy units were within 3" of this unit at the start of that phase, each Razordon in this unit can make a shooting attack with its Volley of Spikes but the Attacks characteristic for that attack is D6 instead of 2D6.`,
  //       when: [END_OF_CHARGE_PHASE],
  //     },
  //     {
  //       name: `Piercing Barbs`,
  //       desc: `Improve the Rend characteristic by 1 for an attack made with a Volley of Spikes if the distance to the target is 6" or less.`,
  //       when: [SHOOTING_PHASE],
  //     },
  //   ],
  // },
  Kroxigor: {
    effects: [
      ...KroxigorBaseEffects,
      {
        name: `Sweeping Blows`,
        desc: `If the unmodified hit roll for an attack made with a Drakebite Maul or Moonstone Hammer is 6 and the target unit has 10 or more models, that attack scores 2 hits on the target instead of 1. Make a wound roll and save roll for each hit.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Kroxigor Warspawned': {
    effects: [
      ...KroxigorBaseEffects,
      {
        name: `Heavy-scaled Skin`,
        desc: `Subtract 1 from wound rolls for attacks made with missile weapons that target this unit.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Spawn of Sotek`,
        desc: `Add 1 to the Attacks characteristic of this unit's melee weapons if any models in friendly SKINK units wholly within 12" of this unit have been slain in this phase.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Stegadon Chief': {
    effects: [
      ...StegadonBaseEffects,
      SunfireThrowersEffect,
      {
        name: `Coordinated Strike`,
        desc: `Once per turn, this unit can issue a command to a friendly SKINK unit without a command point being spent.`,
        when: [DURING_GAME],
      },
    ],
  },
  Stegadon: {
    effects: [
      ...StegadonBaseEffects,
      SunfireThrowersEffect,
      {
        name: `Skink Warparty`,
        desc: `This unit counts as 10 models for the purposes of contesting objectives.`,
        when: [DURING_GAME],
      },
    ],
  },
  Bastiladon: {
    effects: [
      {
        name: `Tide of Snakes`,
        desc: `If the unmodified hit roll for an attack made with an Ark of Sotek is 6, the target suffers 1 mortal wound and the attack sequence ends (do not make a wound roll or save roll).`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Skink Oracle on Troglodon': {
    mandatory: {
      spells: [keyPicker(Spells, ['Primordial Mire'])],
    },
    effects: [
      {
        name: `Stench of Death`,
        desc: `Subtract 1 from hit rolls for attacks made by enemy units within 9" of any friendly units with this ability.`,
        when: [HERO_PHASE],
      },
      {
        name: `Regeneration`,
        desc: `At the start of the hero phase, you can heal up to D3 wounds allocated to this unit.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Venomous Spittle`,
        desc: `If the unmodified hit roll for an attack made with this unit's Noxious Spittle or Venomous Jaws is 6, that attack causes a number of mortal wounds to the target equal to the weapon's Damage characteristic and the attack sequence ends (do not make a wound roll or save roll).`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
      GenericEffects.Terror,
    ],
  },
  'Dread Saurian': {
    effects: [
      {
        name: `Arcane Glyphs`,
        desc: `Each time this model is affected by a spell or the ability of an endless spell, you can roll a dice. If you do so, on a 6+, ignore the effects of that spell or the ability of that endless spell on this model. Add 2 to the roll if this model is within 12" of a friendly SLANN.`,
        when: [HERO_PHASE],
      },
      {
        name: `Obliterating Charge`,
        desc: `After this model makes a charge move, roll a dice for each enemy unit within 1" of this model. On a 2+, that unit suffers D3 mortal wounds if it is a MONSTER or D6 mortal wounds if it is not a MONSTER.`,
        when: [CHARGE_PHASE],
      },
      {
        name: `Death Throes`,
        desc: `If this model is slain, before removing it from play, roll a dice for each enemy unit within 3" of it that is not a MONSTER. On a 4+, that unit suffers D3 mortal wounds.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
      GenericEffects.Terror,
    ],
  },
  // 'Celestial Swarm': {
  //   effects: [
  //     {
  //       name: `Swarming Tide`,
  //       desc: `You may heal D3 wounds allocated to this unit.`,
  //       when: [HERO_PHASE],
  //     },
  //     DeadlyVenomEffect,
  //   ],
  // },
  // 'Chameleon Skink Stalker': {
  //   effects: [
  //     ...ChameleonAmbushEffects,
  //     {
  //       name: `Disappear from Sight`,
  //       desc: `Remove the model from the battlefield and follow the Chameleon Ambush rules for this or future turns.`,
  //       when: [HERO_PHASE],
  //     },
  //     {
  //       name: `Flawless Mimicry`,
  //       desc: `If this model is within or on terrain, its Save characteristic is 3+ instead of 6+. This counts as the cover bonus.`,
  //       when: [SAVES_PHASE],
  //     },
  //     {
  //       name: `Master Hunter`,
  //       desc: `Add 2 to wound rolls for the Stalker Blowpipes if this model did not move and was not set up this turn.`,
  //       when: [SHOOTING_PHASE],
  //     },
  //   ],
  // },
  // 'Skink Prophet': {
  //   effects: [
  //     DeadlyVenomEffect,
  //     {
  //       name: `Priestly Rites`,
  //       desc: `Roll a D6. On a 4+, you can reroll run, charge, and save rolls for this model until your next hero phase.`,
  //       when: [HERO_PHASE],
  //     },
  //     {
  //       name: `Priestly Rites`,
  //       desc: `If active you can reroll run rolls.`,
  //       when: [MOVEMENT_PHASE],
  //     },
  //     {
  //       name: `Priestly Rites`,
  //       desc: `If active you can reroll charge rolls.`,
  //       when: [CHARGE_PHASE],
  //     },
  //     {
  //       name: `Priestly Rites`,
  //       desc: `If active you can reroll save rolls.`,
  //       when: [SAVES_PHASE],
  //     },
  //   ],
  // },
  'Hunters of Huanchi with Dartpipes': {
    effects: [
      ...HuntersOfHuanchiBaseEffects,
      {
        name: `Champion`,
        desc: `1 model in this unit can be a Chameleon Skink Alpha. Add 1 to the Attacks characteristic of that model's Dartpipe.`,
        when: [SHOOTING_PHASE],
      },
      StarVenomEffect,
    ],
  },
  'Hunters of Huanchi with Starstone Bolas': {
    effects: [
      ...HuntersOfHuanchiBaseEffects,
      {
        name: `Champion`,
        desc: `1 model in this unit can be a Chameleon Skink Alpha. Add 1 to the Attacks characteristic of that model's Moonstone Club.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Starstone Bolas`,
        desc: `If the unmodified hit roll for an attack made with a Starstone Bolas is 6, the target unit is stunned until the end of the following combat phase. Subtract 1 from hit rolls for attacks made by a unit that is stunned.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  Terrawings: {
    effects: [
      {
        name: `Nerve-shredding Screeches`,
        desc: `In the shooting phase, you can pick 1 enemy unit within 12" of this unit and roll 2D6. If the roll is higher than that unit's Bravery characteristic, that enemy unit cannot issue or receive commands until the end of the turn.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Symbiotic Relationship`,
        desc: `During deployment, instead of setting up this unit on the battlefield, if you have any HUNTERS OF HUANCHI units in reserve, you can place this unit to one side and say that it is hiding as a reserve unit. If you do so, at the end of your movement phase, you can set up this unit on the battlefield, within 3" of a friendly HUNTERS OF HUANCHI unit and more than 9" from all enemy units.`,
        when: [DURING_SETUP],
      },
      {
        name: `Symbiotic Relationship`,
        desc: `If you set this unit up in reserve, at the end of your movement phase, you can set up this unit on the battlefield, within 3" of a friendly HUNTERS OF HUANCHI unit and more than 9" from all enemy units.`,
        when: [END_OF_MOVEMENT_PHASE],
      },
    ],
  },
  'The Starblood Stalkers': {
    effects: [
      {
        name: `Sacred Duty`,
        desc: `Before you allocate a wound or mortal wound to a friendly KIXI-TAKA, or instead of making a ward roll for a wound or mortal wound that would be allocated to a friendly KIXI-TAKA, if this unit is within 3" of that friendly KIXI-TAKA, you can roll a dice. On a 1-2, that wound or mortal wound is allocated to that KIXI-TAKA as normal. On a 3+, that wound or mortal wound is allocated to this unit instead.`,
        when: [WOUND_ALLOCATION_PHASE, WARDS_PHASE],
      },
      StarVenomEffect,
    ],
  },
  'Kixi-Taka, the Diviner': {
    effects: [
      {
        name: `Servant of the Starmasters`,
        desc: `Once per battle, in your hero phase, you can pick 1 enemy unit within 6" of this unit and roll a dice. On a 2+, models in that unit cannot contest objectives until the start of the next turn.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Aggradon Lancers': {
    effects: [
      {
        name: `Champion`,
        desc: `1 model in this unit can be an Aggradon Lancer Alpha. Add 1 to the Attacks characteristic of that model's Celestite Club or Celestite Spear.`,
        when: [COMBAT_PHASE],
      },
      IconBearersEffect,
      WardrummersEffect,
      {
        name: `Primal Rage`,
        desc: `This unit has a rage score that starts at 0 at the start of the battle. At the end of each combat phase, if this unit is within 3" of any enemy units, increase its rage score by 1 (to a maximum of 3). At the end of each combat phase, if this unit is not within 3" of any enemy units, reset its rage score to 0. While this unit has a rage score of 1 or more, add its rage score to the Attacks characteristic of its Rending Bites and Striking Talons.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Klaq-Trok': {
    effects: [
      {
        name: `Savage Protector`,
        desc: `You can reroll hit rolls and wound rolls for attacks made by this unit while it is within 3" of a friendly KIXI-TAKA.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Bolstering Presence`,
        desc: `Add 3 to the Bravery characteristic of friendly THE STARBLOOD STALKERS units while they are wholly within 9" of this unit.`,
        when: [BATTLESHOCK_PHASE],
      },
      MightySaurusJawsEffect,
    ],
  },
  'Raptadon Chargers': {
    effects: [
      {
        name: `Champion`,
        desc: `1 model in this unit can be a Raptadon Charger Alpha. Add 1 to the Attacks characteristic of that model's Tepok Lance.`,
        when: [COMBAT_PHASE],
      },
      IconBearersEffect,
      HornblowersEffect,
      {
        name: `Cold-blooded Unity`,
        desc: `Add 1 to hit rolls for attacks made with this unit's Tepok Lances that target an enemy unit if that unit was the target of a shooting attack made by a friendly RAPTADON HUNTERS unit in the same turn.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Geomantic Empowerment`,
        desc: `The Damage characteristic of this unit's Tepok Lances is 2 instead of 1 if this unit is contesting an objective or if it is within 3" of any terrain features with the Arcane scenery rule.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Raptadon Hunters': {
    effects: [
      {
        name: `Champion`,
        desc: `1 model in this unit can be a Raptadon Hunter Alpha. Add 1 to the Attacks characteristic of that model's Starstone Atlatl.`,
        when: [COMBAT_PHASE],
      },
      IconBearersEffect,
      HornblowersEffect,
      {
        name: `Deadly Cohesion`,
        desc: `At the end of your charge phase, if this unit is more than 3" from all enemy units and within 12" of any friendly RAPTADON CHARGERS units that made a charge move in that phase, this unit can shoot. If it does so, it must target a unit within 3" of a friendly RAPTADON CHARGERS unit that made a charge move in that phase.`,
        when: [END_OF_CHARGE_PHASE],
      },
    ],
  },
  'Spawn of Chotec': {
    effects: [
      {
        name: `Crew`,
        desc: `This unit has a crew of 3 Sun Acolytes armed with Celestite Goads. The crew must remain within 1" of the Spawn of Chotec. For rules purposes, the Spawn of Chotec and its crew are treated as a single model.`,
        when: [MOVEMENT_PHASE],
      },
      {
        name: `Fiery Maw`,
        desc: `Each time this unit shoots, choose either the Glob of Flame Acid or Stream of Fire weapon characteristics for all the attacks it makes with its Fiery Maw.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Stream of Fire`,
        desc: `The Attacks characteristic of a Stream of Fire is equal to the number of models in the target unit (to a maximum Attacks characteristic of 10).`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Glob of Flame Acid`,
        desc: `If any wounds caused by attacks made with a Glob of Flame Acid are allocated to an enemy unit, subtract 1 from save rolls for attacks that target that unit until the end of the turn. The same unit cannot be affected by this ability more than once per turn.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
}

export default tagAs(Units, 'unit')
