import { TBattalions, TUnits } from 'types/army'
import {
  BATTLESHOCK_PHASE,
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  DURING_SETUP,
  END_OF_CHARGE_PHASE,
  END_OF_MOVEMENT_PHASE,
  HERO_PHASE,
  MOVEMENT_PHASE,
  SHOOTING_PHASE,
  START_OF_BATTLESHOCK_PHASE,
  START_OF_CHARGE_PHASE,
  START_OF_COMBAT_PHASE,
  START_OF_HERO_PHASE,
  START_OF_SHOOTING_PHASE,
  TURN_FOUR_START_OF_TURN,
  WOUND_ALLOCATION_PHASE,
} from 'types/phases'

const SelflessProtectorEffect = {
  name: `Selfless Protector`,
  desc: `Roll a D6 before you allocate a wound or mortal wound to a friendly SLANN while it is within 3" of any friendly units with this ability, On a 2+, you must allocate that wound or mortal wound to a friendly unit with this ability that is within 3" of that SLANN, instead of to that SLANN.`,
  when: [WOUND_ALLOCATION_PHASE],
}
const VoraciousAppetiteEffect = {
  name: `Voracious Appetite`,
  desc: `If the unmodified hit roll for an attack made with Tearing Jaws is 6, that attack scores 2 hits on the target instead of l. Make a wound and save roll for each hit.`,
  when: [COMBAT_PHASE],
}
const CelestiteWarspearEffect = {
  name: `Celestite Warspear`,
  desc: `Add 1 to the Damage characteristic of this unit's Celestite Warspears if this unit made a charge move in the same turn.`,
  when: [COMBAT_PHASE],
}
const SaurianSavageryEffect = {
  name: `Saurian Savagery`,
  desc: `You can use this command ability in the combat phase. If you do so, pick 1 friendly SAURUS unit wholly within 18" of a friendly model with this command ability, Until the end of that phase, if the unmodified hit roll for an attack made with a melee weapon by that friendly SAURUS unit is 6, that attack scores 2 hits on the target instead of 1. Make a wound and save roll for each hit. A unit cannot benefit from this command ability more than once per phase.`,
  when: [COMBAT_PHASE],
  command_ability: true,
}
const WrathOfTheSeraphonEffect = {
  name: `Wrath of the Seraphon`,
  desc: `You can use this command ability in the combat phase. If you do so, pick 1 friendly SAURUS unit wholly within 18" of a friendly model with this command ability. Until the end of that phase, you can add 1 to hit rolls for attacks made by that unit. A unit cannot benefit from this command ability more than once per phase.`,
  when: [COMBAT_PHASE],
  command_ability: true,
}
const TerrorEffect = {
  name: `Terror`,
  desc: `Subtract 1 from the Bravery characteristic of enemy units while they are within 3" of any friendly units with this ability.`,
  when: [BATTLESHOCK_PHASE],
}
const UnstoppableStampedeEffect = {
  name: `Unstoppable Stampede`,
  desc: `Roll 1 dice for each enemy unit that is within 1" of this model when this model finishes a charge move. On a 3+, that enemy unit suffers D3 mortal wounds.`,
  when: [CHARGE_PHASE],
}
const SteadfastMajestyEffect = {
  name: `Steadfast Majesty`,
  desc: `You can reroll battleshock tests for friendly SKINK units while they are wholly within 18" of any friendly STEGADON units.`,
  when: [BATTLESHOCK_PHASE],
}
const ColdFerocityEffect = {
  name: `Cold Ferocity`,
  desc: `If the unmodified hit roll for an attack made with a Celestite weapon by this model is 6, that attack scores 2 hits on the target instead of 1. Make a wound and save roll for each hit.`,
  when: [COMBAT_PHASE],
}
const ArmouredCrestEffect = {
  name: `Armoured Crest`,
  desc: `At the start of the combat phase, you can pick 1 enemy unit within 3" of this model and that has up to 5 models. If you do so, until the end of that phase, add 1 to save rolls for attacks made by that unit that target this model.`,
  when: [START_OF_COMBAT_PHASE],
}
const SkinkChiefEffect = {
  name: `Skink Chief`,
  desc: `This model can include 1 Skink Chief armed with a Meteoric Warspear. If it does, this model has the HERO keyword but any command traits or artefacts of power this model has only affect attacks made by the Skink Chief.`,
  when: [DURING_GAME],
}
const CarnosaurBaseEffects = [
  {
    name: `Pinned Down`,
    desc: `Add 1 to hit rolls for attacks made with Massive Jaws if the target has a Wounds characteristic of 7 or less.`,
    when: [COMBAT_PHASE],
  },
  {
    name: `Blood Frenzy`,
    desc: `If any enemy models are slain by wounds inflicted by this model's attacks, for the rest of the battle this model can run and still charge in the same turn.`,
    when: [DURING_GAME],
  },
  TerrorEffect,
]
const CometsCallEffect = {
  name: `Comet's Call`,
  desc: `Casting value of 7. You can pick up to D3 different enemy units anywhere on the battlefield, Each of those units suffers D3 mortal wounds (roll separately for each). If the casting roll was 10+, pick up to D6 different enemy units instead of up to D3.`,
  when: [HERO_PHASE],
  spell: true,
}
const SlannBaseEffects = [
  {
    name: `Arcane Vassal`,
    desc: `When this model attempts to cast a spell, before making the casting roll, you can pick either 1 friendly SKINK WIZARD that is within 12" of this model or 1 friendly ORACLE anywhere on the battlefield. If you do so and the spell is successfully cast and not unbound, you must measure the range and visibility for the spell from that SKINK WIZARD or ORACLE.`,
    when: [HERO_PHASE],
  },
  {
    name: `Masters of Order`,
    desc: `Add 1 to casting, dispelling and unbinding rolls for this model. In addition, this model can attempt to unbind enemy spells that are cast anywhere on the battlefield and attempt to dispel endless spells anywhere on the battlefield.`,
    when: [HERO_PHASE],
  },
  CometsCallEffect,
  {
    name: `Gift from the Heavens`,
    desc: `You can use this command ability in your hero phase. If you do so, pick 1 friendly SERAPHON unit wholly within 18" of a friendly model with this command ability Until your next hero phase, that unit can fly and you can add 1 to save rolls for attacks made with missile weapons that target that unit. You can only use this command ability once per hero phase.`,
    when: [HERO_PHASE],
    command_ability: true,
  },
]
const GoutOfSunfireEffect = {
  name: `Gout of Sunfire`,
  desc: `Do not use the attack sequence for an attack made with Sunfire Throwers. Instead, roll a number of dice equal to the number of models from the target unit within 8" of the attacking model. For each 5+, the target unit suffers 1 mortal wound.`,
  when: [SHOOTING_PHASE],
}
const StegadonBaseEffects = [ArmouredCrestEffect, SteadfastMajestyEffect, UnstoppableStampedeEffect]
const StardrakeIconEffect = {
  name: `Stardrake Icon`,
  desc: `Subtract 1 from the Bravery characteristic of enemy units while they are within 6" of any friendly Stardrake Icon Bearers.`,
  when: [BATTLESHOCK_PHASE],
}
const WardrummerEffect = {
  name: `Wardrummer`,
  desc: `You can reroll charge rolls for units that include any Wardrummers.`,
  when: [CHARGE_PHASE],
}
const StarbucklersEffect = {
  name: `Star-bucklers`,
  desc: `Add 1 to save rolls for attacks that target a unit armed with Star-bucklers.`,
  when: [COMBAT_PHASE, SHOOTING_PHASE],
}

// Unit Names
export const Units: TUnits = [
  {
    name: `Lord Kroak`,
    effects: [
      ...SlannBaseEffects,
      {
        name: `Azyrite Force Barrier`,
        desc: `The Attacks characteristic of Azyrite Force Barrier is equal to the number of enemy models within 3" of the attacking model when the number of attacks made with the weapon is determined.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Dead for Innumerable Ages`,
        desc: `Roll a D6 each time you allocate a wound or mortal wound to this model. On a 4+, that wound or mortal wound is negated.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
      {
        name: `Impeccable Foresight`,
        desc: `At the start of your hero phase, roll 3 dice for this model. For each 4+, you receive 1 command point.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Celestial Deliverance`,
        desc: `The caster can attempt to cast this spell up to 3 times in the same hero phase. 
        
        Casting value of 7 the first time it is attempted in a phase, a casting value of 8 the second time it is attempted in a phase, and a casting value of 9 the third time it is attempted in a phase.
        
        Each time this spell is successfully cast, pick up to 3 different enemy units within 10" of the caster and visible to them, and roll 1 dice for each unit you pick. On a 2+, that unit suffers D3 mortal wounds, If that unit is a CHAOS DAEMON unit, on a 2+ it suffers 3 mortal wounds instead of D3 mortal wounds.`,
        when: [HERO_PHASE],
        spell: true,
      },
    ],
  },
  {
    name: `Slann Starmaster`,
    effects: [
      ...SlannBaseEffects,
      {
        name: `Foresight`,
        desc: `At the start of your hero phase, roll 2 dice for this model. For each 4+, you receive 1 command point.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  {
    name: `Saurus Oldblood on Carnosaur`,
    effects: [
      ...CarnosaurBaseEffects,
      {
        name: `Blazing Sunbolts`,
        desc: `Add 1 to wound rolls for attacks made with a Sunbolt Gauntlet if the target is a CHAOS DAEMON unit.`,
        when: [SHOOTING_PHASE],
      },
      ColdFerocityEffect,
      WrathOfTheSeraphonEffect,
    ],
  },
  {
    name: `Saurus Oldblood`,
    effects: [ColdFerocityEffect, WrathOfTheSeraphonEffect],
  },
  {
    name: `Saurus Scar-Veteran on Cold One`,
    effects: [ColdFerocityEffect, SaurianSavageryEffect],
  },
  {
    name: `Saurus Eternity Warden`,
    effects: [
      {
        name: `Prime Guardian`,
        desc: `You can use this command ability in the combat phase. If you do so, pick 1 friendly SAURUS GUARD unit wholly within 18" of a friendly model with this command ability. Until the end of that phase, you can add 1 to hit rolls for attacks made by that unit. A unit cannot benefit from this command ability more than once per phase.`,
        when: [COMBAT_PHASE],
        command_ability: true,
      },
      ColdFerocityEffect,
      SelflessProtectorEffect,
    ],
  },
  {
    name: `Saurus Sunblood`,
    effects: [
      {
        name: `Primal Rage`,
        desc: `If the unmodified hit roll for an attack made by this model is 6, that attack scores 2 hits on the target instead of 1. Make a wound and save roll for each hit. In addition, if the unmodified wound roll for an attack made by this model is 6, that attack inflicts 1 mortal wound on the target in addition to any normal damage.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Scent of Weakness`,
        desc: `You can use this command ability in the combat phase. If you do so, pick 1 enemy unit within 12" of a friendly model with this command ability, Until the end of that phase, add 1 to wound rolls for attacks made by friendly SAURUS models that target that enemy unit. A unit cannot benefit from this command ability more than once per phase.`,
        when: [COMBAT_PHASE],
        command_ability: true,
      },
    ],
  },
  {
    name: `Saurus Scar-Veteran on Carnosaur`,
    effects: [...CarnosaurBaseEffects, CelestiteWarspearEffect, ColdFerocityEffect, SaurianSavageryEffect],
  },
  {
    name: `Saurus Astrolith Bearer`,
    effects: [
      {
        name: `Celestial Conduit`,
        desc: `Add 1 to casting rolls for friendly SERAPHON WIZARDS while they are within 12" of any models with this ability. In addition, add 6" to the range of any spells cast by friendly SERAPHON WIZARDS while they are within 12" of any models with this ability.`,
        when: [HERO_PHASE],
      },
      {
        name: `Revivifying Energies`,
        desc: `Roll a D6 each time you allocate a wound or mortal wound to a friendly SERAPHON unit wholly within 12" of any models with this ability. On a 6, that wound or mortal wound is negated.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
    ],
  },
  {
    name: `Skink Priest`,
    effects: [
      {
        name: `Star-stone Staff`,
        desc: `In your hero phase, you can pick 1 friendly SKINK unit wholly within 12" of this model and roll a D6, On a 3+, until your next hero phase, that unit can run and still shoot and/or charge in the same turn, and you can add 1 to save rolls for attacks that target that unit. A unit cannot benefit from this ability more than once per phase.`,
        when: [HERO_PHASE],
      },
      {
        name: `Herald of the Old Ones`,
        desc: `You can use this command ability in your hero phase, If you do so, pick 1 friendly SKINK unit wholly within 18" of a friendly model with this command ability. Until your next hero phase, you can add 1 to hit rolls for attacks made by that unit. A unit cannot benefit from this command ability more than once per phase.`,
        when: [HERO_PHASE],
        command_ability: true,
      },
    ],
  },
  {
    name: `Skink Starseer`,
    effects: [
      {
        name: `Cosmic Herald`,
        desc: `At the start of your hero phase, roll a D6 for this model. On a 4+, you receive 1 command point.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Astromancer's Staff`,
        desc: `At the start of your charge phase, you can pick 1 friendly SERAPHON unit wholly within 12" of this model. If you do so, in that phase you can attempt to charge with that unit if it is within 18" of the enemy instead of 12", and you roll 3D6 instead of 2D6 when making the charge roll.`,
        when: [START_OF_CHARGE_PHASE],
      },
      {
        name: `Control Fate`,
        desc: `Casting value of 7. Pick 1 unit within 18" of the caster and visible to them. If that unit is an enemy unit, until your next hero phase, subtract 1 from save rolls for attacks that target that unit, If that unit is a friendly SERAPHON unit, until your next hero phase, add 1 to save rolls for attacks that target that unit.`,
        when: [HERO_PHASE],
        spell: true,
      },
    ],
  },
  {
    name: `Skink Starpriest`,
    effects: [
      {
        name: `Astral Herald`,
        desc: `At the start of your hero phase, roll a D6 for this model. On a 5+ you receive 1 command point.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Serpent Staff`,
        desc: `In your hero phase, you can pick 1 friendly SERAPHON unit wholly within 12" of this model. If you do so, until your next hero phase, if the unmodified wound roll for an attack made by that unit is 6, that attack inflicts 1 mortal wound on the target in addition to any normal damage. A unit cannot benefit from this ability more than once per phase.`,
        when: [HERO_PHASE],
      },
      {
        name: `Blazing Starlight`,
        desc: `Casting value of 6. Pick 1 enemy unit within 18" of the caster and visible to them. Until your next hero phase, subtract 1 from hit rolls for attacks made by that unit.`,
        when: [HERO_PHASE],
        spell: true,
      },
    ],
  },
  {
    name: `Engine of the Gods`,
    effects: [
      ...StegadonBaseEffects,
      {
        name: `Cosmic Engine`,
        desc: `At the start of your shooting phase, you can make 1 cosmic engine roll for 1 model with this ability. Roll 2D6 and look up the roll on the table. If there is a friendly SLANN within 12" of this model, you can choose to roll 3D6.
        
        2-3: This model suffers D3 mortal wounds.
        4-8: Heal D3 wounds allocated to each friendly SERAPHON unit wholly within 12" of this model (roll separately for each unit).
        9-12: You can either pick 1 enemy unit within 24" this model that is visible to it and roll 1 dice, or roll 1 dice for each enemy unit within 12" of this model that is visible to it. On a 2+, that unit suffers D3 mortal wounds.
        13-17: You can set up 1 unit of 10 Saurus Warriors wholly within 12" of this model and more than 9" from any enemy units, and add it to your army.
        18: For the rest of the turn you can reroll charge rolls for friendly SERAPHON units wholly within 24" of this model, and double the Attacks characteristic of weapons used by friendly SERAPHON units while they are wholly within 24" of this model.`,
        when: [START_OF_SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Saurus Warriors`,
    effects: [
      {
        name: `Ordered Cohort`,
        desc: `Add 1 to the Attacks characteristic of this unit's Celestite Clubs or Celestite Spears while this unit has 15 or more models,`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Saurus Warrior Alpha`,
        desc: `1 model in this unit can be a Saurus Warrior Alpha. Add 1 to the Attacks characteristic of that model's Celestite Club or Celestite Spear.`,
        when: [COMBAT_PHASE],
      },
      StardrakeIconEffect,
      WardrummerEffect,
    ],
  },
  {
    name: `Saurus Guard`,
    effects: [
      {
        name: `Saurus Guard Alpha`,
        desc: `1 model in this unit can be a Saurus Guard Alpha. Add 1 to the Attacks characteristic of that model's Celestite Polearm.`,
        when: [COMBAT_PHASE],
      },
      SelflessProtectorEffect,
      StardrakeIconEffect,
      WardrummerEffect,
    ],
  },
  {
    name: `Saurus Knights`,
    effects: [
      {
        name: `Saurus Knight Alpha`,
        desc: `1 model in this unit can be a Saurus Knight Alpha. Add 1 to the Attacks characteristic of that model's Celestite Blade or Celestite Warspear.`,
        when: [COMBAT_PHASE],
      },
      CelestiteWarspearEffect,
      StardrakeIconEffect,
      WardrummerEffect,
    ],
  },
  {
    name: `Skinks`,
    effects: [
      {
        name: `Skink Alpha`,
        desc: `1 model in this unit can be a Skink Alpha. Add 1 to the Attacks characteristic of that model's melee weapons.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Swarming Cohort`,
        desc: `Add 1 to the Attacks characteristic of weapons used by this unit while it has 15 or more models,`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
      StarbucklersEffect,
    ],
  },
  {
    name: `Chameleon Skinks`,
    effects: [
      {
        name: `Chameleon Ambush`,
        desc: `Instead of setting up this unit on the battlefield, you can place it to one side and say that it is hiding as a reserve unit.`,
        when: [DURING_SETUP],
      },
      {
        name: `Chameleon Ambush`,
        desc: `If you set this unit up in reserve, at the end of any of your movement phases, you can set up this unit on the battlefield more than 9" from any enemy units.
    
        If this unit is on the battlefield at the end of your movement phase, you can remove it and say that it is hiding as a reserve unit. You can reveal it as described above at the end of any of your subsequent movement phases.`,
        when: [END_OF_MOVEMENT_PHASE],
      },
      {
        name: `Perfect Mimicry`,
        desc: `The cover modifier adds 3 to save rolls for attacks that target this unit, instead of 1.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
      {
        name: `Star-venom`,
        desc: `If the unmodified hit roll for an attack made with a Dartpipe is 6, that attack inflicts 1 mortal wound on the target and the attack sequence ends (do not make a wound or save roll).`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Terradon Chief`,
    effects: [
      {
        name: `Lead from on High`,
        desc: `Subtract 1 from hit rolls for attacks made with melee weapons by models that cannot fly that target this model.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Coordinated Attack`,
        desc: `You can this command ability when a friendly TERRADON RIDERS unit uses its Deadly Cargo ability while it is wholly within 12" of a friendly model with this command ability. If you do so, the enemy unit suffers D3 mortal wounds for each 2+ instead of each 4+.`,
        when: [MOVEMENT_PHASE],
        command_ability: true,
      },
    ],
  },
  {
    name: `Terradon Riders`,
    effects: [
      {
        name: `Deadly Cargo`,
        desc: `Once per battle, after this unit finishes a move, you can pick 1 enemy unit and roll 1 dice for each model in this unit that passed across any models from that enemy unit. For each 4+, that enemy unit suffers D3 mortal wounds.`,
        when: [MOVEMENT_PHASE],
      },
      {
        name: `Terradon Rider Alpha`,
        desc: `1 model in this unit can be a Terradon Rider Alpha. Add 1 to the Attacks characteristic of that model's missile weapons.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Ripperdactyl Chief`,
    effects: [
      VoraciousAppetiteEffect,
      {
        name: `Ripperdactyl Assault`,
        desc: `You can this command ability at the start of the combat phase. If you do so, pick 1 friendly model with this command ability. Until the end of that phase, add 1 to the Attacks characteristic of melee weapons used by friendly RIPPERDACTYL units that are wholly within 18" of that model. The same unit cannot benefit from this command ability more than once per phase.`,
        when: [START_OF_COMBAT_PHASE],
        command_ability: true,
      },
    ],
  },
  {
    name: `Ripperdactyl Riders`,
    effects: [
      {
        name: `Ripperdactyl Rider Alpha`,
        desc: `1 model in this unit can be a Ripperdactyl Rider Alpha. Add 1 to the Attacks characteristic of that model's Moonstone Warspear,`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Toad Rage`,
        desc: `At the start of the combat phase, you can set up 1 Blot Toad marker next to 1 enemy unit. If you do so, you can reroll hit rolls for attacks made with Tearing Jaws by friendly RIPPERDACTYL units that are wholly within 6" of that enemy unit. At the end of the combat phase, remove the Blot Toad marker; it cannot be used again in that battle.

        Designer's Note: Blot Toads are not units; they are markers that are used to keep track of which enemy units this ability affects and how many times you can use this ability during a battle.`,
        when: [START_OF_COMBAT_PHASE],
      },
      VoraciousAppetiteEffect,
    ],
  },
  {
    name: `Salamander Hunting Pack`,
    effects: [
      {
        name: `It Burns!`,
        desc: `If the unmodified hit roll for an attack made with a Stream of Fire or Burning Jaws is 6, that attack inflicts mortal wounds on the target unit and the attack sequence ends (do not make a wound or save roll).`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Razordon Hunting Pack`,
    effects: [
      {
        name: `Instinctive Defence`,
        desc: `If there are any enemy units within 3" of this unit at the end of the charge phase, and no enemy units were within 3" of this unit at the start of that phase, each Razordon in this unit can make a shooting attack with its Volley of Spikes but the Attacks characteristic for that attack is D6 instead of 2D6.`,
        when: [END_OF_CHARGE_PHASE],
      },
      {
        name: `Piercing Barbs`,
        desc: `Improve the Rend characteristic by 1 for an attack made with a Volley of Spikes if the distance to the target is 6" or less.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Kroxigor`,
    effects: [
      {
        name: `Battle Synergy`,
        desc: `Add 1 to hit rolls for attacks made by this unit while it is wholly within 6" of any SKINK units.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Sweeping Blows`,
        desc: `The Attacks characteristic of a Moon Hammer is equal to the number of enemy models within 2" of the attacking model when the number of attacks made with the weapon is determined.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Jaws Like a Steel Trap`,
        desc: `If the unmodified hit roll for an attack made with Vice-like Jaws is 6, that attack inflicts 1 mortal wound on the target in addition to any normal damage,`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Stegadon with Skink Chief`,
    effects: [
      ...StegadonBaseEffects,
      GoutOfSunfireEffect,
      SkinkChiefEffect,
      {
        name: `Coordinated Strike`,
        desc: `You can this command ability at the start of the combat phase. If you do so, pick 1 friendly SKINK unit wholly within 24" of a friendly STEGADON HERO with this command ability. Until the end of that phase, add 1 to the Attacks characteristic of melee weapons used by that SKINK unit. A unit cannot benefit from this command ability more than once per phase.`,
        when: [START_OF_COMBAT_PHASE],
        command_ability: true,
      },
    ],
  },
  {
    name: `Stegadon`,
    effects: [...StegadonBaseEffects, GoutOfSunfireEffect],
  },
  {
    name: `Bastiladon`,
    effects: [
      {
        name: `Light of the Heavens`,
        desc: `Add 1 to the damage inflicted by each successful attack made with a Solar Engine that targets a CHAOS DAEMON unit.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Tide of Snakes`,
        desc: `If the unmodified hit roll for an attack made with an Ark of Sotek is 6, that attack inflicts 1 mortal wound on the target and the attack sequence ends (do not make a wound or save roll),`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Skink Oracle on Troglodon`,
    effects: [
      CometsCallEffect,
      {
        name: `Oracle of the Slann`,
        desc: `Add 1 to casting, dispelling and unbinding rolls for this model. In addition, this model can attempt to unbind spells that are cast anywhere on the battlefield and attempt to dispel endless spells anywhere on the battlefield.`,
        when: [HERO_PHASE],
      },
      {
        name: `Regeneration`,
        desc: `In your hero phase, you can roll a D6 for this model. If you do so, on a 2+, heal up to D3 wounds allocated to this model.`,
        when: [HERO_PHASE],
      },
      {
        name: `Venomous Spittle`,
        desc: `If the unmodified wound roll for an attack made with this model's Noxious Spittle or Venomous Jaws is 6, that attack inflicts 1 mortal wound on the target in addition to any normal damage.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
      {
        name: `Drawn to the Screams`,
        desc: `If any wounds inflicted by this model's Noxious Spittle are allocated to an enemy model and not negated, until the end of the turn, you can reroll charge rolls for this model.`,
        when: [SHOOTING_PHASE, CHARGE_PHASE],
      },
      TerrorEffect,
    ],
  },
  {
    name: `Dread Saurian`,
    effects: [
      {
        name: `Arcane Glyphs`,
        desc: `Each time this model is affected by a spell or endless spell, you can roll a D6. If you do so, on a 6+, ignore the effects of that spell or endless spell on this model. Add 2 to the roll if this model is within 12" of a friendly Slann.`,
        when: [HERO_PHASE],
      },
      {
        name: `Obliterating Charge`,
        desc: `After this model makes a charge move, roll a D6 for each enemy unit within 1" of this model. On a 2+, that unit suffers D3 mortal wounds if it is a Monster or D6 mortal wounds if it is not a Monster.`,
        when: [CHARGE_PHASE],
      },
      {
        name: `Death Throes`,
        desc: `If this model is slain, before removing it from the battlefield, roll a D6 for each enemy unit within 3" of it that is not a Monster. On a 4+, that unit suffers D3 mortal wounds.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
      {
        name: `Roar of Ruin`,
        desc: `Once per battle at the start of the battleshock phase, you can say this model will use its Roar of Ruin. If you do so, halve the Bravery characteristic of enemy units (rounding up) that are within 12" of this model until the end of that phase.

        Designer's Note: If a unit is affected by both the Roar of Ruin and Terror abilities, its Bravery characteristic is first halved (rounding up), and then 1 is subtracted from it.`,
        when: [START_OF_BATTLESHOCK_PHASE],
      },
      TerrorEffect,
    ],
  },
]

// Battalions
export const Battalions: TBattalions = [
  {
    name: `Eternal Starhost`,
    effects: [
      {
        name: `Celestial Reinforcement`,
        desc: `At the start of your hero phase, you receive D3 celestial conjuration points if the SLANN, STARSEER or ORACLE from this battalion is on the battlefield.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  {
    name: `Shadowstrike Temple-host`,
    effects: [
      {
        name: `The Trap is Sprung`,
        desc: `In your hero phase, pick 1 enemy unit that is visible to the STARPRIESTor PRIESTfrom this battalion. Until your next hero phase, add 1 to hit rolls for attacks made by units from this battalion that target that unit.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Shadowstrike Starhost`,
    effects: [
      {
        name: `Strike from the Stars`,
        desc: `Instead of setting up a unit from this battalion on the battlefield, you can place it to one side and say that it is waiting in the stars as a reserve unit.`,
        when: [DURING_SETUP],
      },
      {
        name: `Strike from the Stars`,
        desc: `At the end of any of your movement phases, you can set up any of those units on the battlefield more than 9" from any enemy units.`,
        when: [END_OF_MOVEMENT_PHASE],
      },
      {
        name: `Strike from the Stars`,
        desc: `Reserve units that are not set up on the battlefield before the start of the fourth battle round are slain.`,
        when: [TURN_FOUR_START_OF_TURN],
      },
    ],
  },
  {
    name: `Firelance Temple-host`,
    effects: [
      {
        name: `Savage Hunters`,
        desc: `Add 3 to run and charge rolls for units from this battalion that are wholly within 18" of the SCAR-VETERAN from the same battalion.`,
        when: [MOVEMENT_PHASE, CHARGE_PHASE],
      },
    ],
  },
  {
    name: `Firelance Starhost`,
    effects: [
      {
        name: `Blazing Cohorts`,
        desc: `If the unmodified wound roll for an attack made with a Celestite weapon by a unit from this battalion is 6, that attacks inflicts 1 mortal wound on the target in addition to any normal damage.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Sunclaw Temple-host`,
    effects: [
      {
        name: `Ferocity Unbound`,
        desc: `Improve the Rend characteristic of Jaws weapons used by units from this battalion by 1.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Sunclaw Starhost`,
    effects: [
      {
        name: `Star-charged Celestite`,
        desc: `Improve the Rend characteristic of Celestite weapons used by units from this battalion by 1.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Thunderquake Temple-host`,
    effects: [
      {
        name: `Beastmasters`,
        desc: `In your hero phase, declare if this battalion will be swift or savage. If you choose for it to be swift, until your next hero phase, units from this battalion can run and still shoot and/or charge in the same turn. If you choose savage, until your next hero phase, add 1 to the Attacks characteristic of melee weapons used by units from this battalion.`,
        when: [HERO_PHASE],
      },
      {
        name: `Beastmasters (Swift)`,
        desc: `If you chose for this battalion to be swift, until your next hero phase, units from this battalion can run and still shoot and/or charge in the same turn. If you choose savage, until your next hero phase, add 1 to the Attacks characteristic of melee weapons used by units from this battalion.`,
        when: [SHOOTING_PHASE, CHARGE_PHASE],
      },
      {
        name: `Beastmasters (Savage)`,
        desc: `If you chose for this battalion to be savage, until your next hero phase, add 1 to the Attacks characteristic of melee weapons used by units from this battalion.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Thunderquake Starhost`,
    effects: [
      {
        name: `Celestial Surge`,
        desc: `In your hero phase, you can heal 1 wound allocated to each unit from this battalion. If the unit is wholly within 18" of a friendly SLANN, heal D3 wounds instead of 1.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Eternal Temple-host`,
    effects: [
      {
        name: `Primal Vistas`,
        desc: `If the SLANN, STARSEER or ORACLE from this battalion is on the battlefield, the Primeval Domain battle trait (pg 55) applies to all terrain features, not just those in your territory.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Gul'Rok's Starhost`,
    effects: [
      {
        name: `Reform Ranks`,
        desc: `In each of your hero phases, a Starhost unit within 10" of their Scar-Veteran can reform. To do so, choose one model in the unit to be the lynchpin. Remove all other models in the unit from the battlefield and then set them up again within 5" of the lynchpin. The unit can move normally in the same turn.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Venomblade Starhost`,
    effects: [
      {
        name: `Blessing of the Serpent`,
        desc: `When the STARPRIEST from this battalion uses its Serpent Staff ability, you can pick any number of units from the same battalion that are wholly within 18" of the STARPRIEST to be affected by the ability instead of 1 SERAPHON unit that is wholly within 12" of the STARPRIEST.`,
        when: [HERO_PHASE],
      },
    ],
  },
]
