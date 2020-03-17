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
  START_OF_CHARGE_PHASE,
  START_OF_COMBAT_PHASE,
  START_OF_HERO_PHASE,
  TURN_FOUR_START_OF_TURN,
  TURN_ONE_HERO_PHASE,
  WOUND_ALLOCATION,
} from 'types/phases'

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
const DeadlyVenomEffect = {
  name: `Deadly Venom`,
  desc: `Each time you roll a hit roll of 6+ for this unit, that attack inflicts 1 mortal wound instead of normal damage (do not make a wound or save roll).`,
  when: [COMBAT_PHASE],
}
const UnstoppableStampedeEffect = {
  name: `Unstoppable Stampede`,
  desc: `When this model attacks with its Crushing Stomps, add 1 to any wound rolls if it charged in the same turn.`,
  when: [COMBAT_PHASE],
}
const SteadfastMajestyEffect = {
  name: `Steadfast Majesty`,
  desc: `You can re-roll battleshock tests for units of SKINKS within 5" of any STEGADONS.`,
  when: [BATTLESHOCK_PHASE],
}
const ColdFerocityEffect = {
  name: `Cold Ferocity`,
  desc: `If the unmodified hit roll for an attack made with a Celestite weapon by this model is 6, that attack scores 2 hits on the target instead of 1. Make a wound and save roll for each hit.`,
  when: [COMBAT_PHASE],
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
  {
    name: `Comet's Call`,
    desc: `Casting value Of 7. You can pick up to D3 different enemy units anywhere on the battlefield, Each of those units suffers D3 mortal wounds (roll separately for each). If the casting roll was 10+, pick up to D6 different enemy units instead of up to D3.`,
    when: [HERO_PHASE],
    spell: true,
  },
  {
    name: `Gift from the Heavens`,
    desc: `You can use this command ability in your hero phase. If you do so, pick 1 friendly SERAPHON unit wholly within 18" of a friendly model with this command ability Until your next hero phase, that unit can fly and you can add 1 to save rolls for attacks made with missile weapons that target that unit. You can only use this command ability once per hero phase.`,
    when: [HERO_PHASE],
    command_ability: true,
  },
]
const StegadonBaseEffects = [
  SteadfastMajestyEffect,
  UnstoppableStampedeEffect,
  {
    name: `Skink Alpha`,
    desc: `If a Stegadon is ridden by a Skink Alpha, then in your hero phase the Alpha can give orders to a SKINK unit within 8". If that unit is not within 3" of an enemy unit, you can immediately roll a D6 and move each of its models up to that many inches. In addition, until your next hero phase, you can re-roll hit rolls of 1 for that unit.`,
    when: [HERO_PHASE],
  },
]
const StardrakeShieldsEffect = {
  name: `Stardrake Shields`,
  desc: `When you make save rolls for this unit, ignore the enemy's Rend characteristic unless it is -2 or better.`,
  when: [COMBAT_PHASE, SHOOTING_PHASE],
}
const StardrakeIconEffect = {
  name: `Stardrake Icon`,
  desc: `Subtract 1 from the Bravery characteristic of enemy units while they are within 6" of any friendly Stardrake Icon Bearers.`,
  when: [BATTLESHOCK_PHASE],
}
const WardrummerEffect = {
  name: `Wardrummer`,
  desc: `You can re-roll charge rolls for units that include any Wardrummers.`,
  when: [CHARGE_PHASE],
}
const StarbucklersEffect = {
  name: `Star-bucklers`,
  desc: `Add 1 to save rolls for attacks that target a unit armed with Star-bucklers.`,
  when: [COMBAT_PHASE, SHOOTING_PHASE],
}
const ImperviousDefenceEffects = [
  {
    name: `Impervious Defence`,
    desc: `When you make save rolls for a Bastiladon, ignore the attacker's Rend characteristic.`,
    when: [COMBAT_PHASE, SHOOTING_PHASE],
  },
  {
    name: `Impervious Defence`,
    desc: `Roll a D6 whenever this model suffers a mortal wound. On a result of 4 or higher, the wound is ignored.`,
    when: [WOUND_ALLOCATION],
  },
]

// Unit Names
export const Units: TUnits = [
  {
    name: `Lord Kroak`,
    effects: [
      ...SlannBaseEffects,
      {
        name: `Azyrite Force Barrier`,
        desc: `The Attacks characteristic Of Azyrite Force Barrier is equal to the number ofenemy models within 3" of the attacking model when the number of attacks made with the weapon is determined.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Dead for Innumerable Ages`,
        desc: `Roll a dice each time you allocate a wound or mortal wound to this model. On a 4+, that wound or mortal wound is negated.`,
        when: [WOUND_ALLOCATION],
      },
      {
        name: `Impeccable Foresight`,
        desc: `At the start of your hero phase, roll 3 dice for this model. For each 4+, you receive 1 command point.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Celestial Deliverance`,
        desc: `The caster can attempt to cast this spell up to 3 times in the same hero phase. 
        
        Casting value Of 7 the first time it is attempted in a phase, a casting value of 8 the second time it is attempted in a phase, and a casting value Of 9 the third time it is attempted in a phase.
        
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
        desc: `At the start Of your hero phase, roll 2 dice for this model. For each 4+, you receive 1 command point.`,
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
        name: `Selfless Protector`,
        desc: `Each time this model is within 2" of a Slann that suffers a wound or mortal wound, it can attempt to intervene. If it does so, roll a D6. If the result is 2 or higher, the Slann ignores that wound or mortal wound but this model suffers a mortal wound in its place.`,
        when: [WOUND_ALLOCATION],
      },
      {
        name: `Alpha Warden`,
        desc: `Saurus Guard make an additional attack with their Celestite Polearms while their unit is within 5" of any Saurus Eternity Wardens from your army.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Saurus Sunblood`,
    effects: [
      {
        name: `Primal Rage`,
        desc: `If the unmodified hit roll for an attack made by this model is 6, that attack scores 2 hits on the target instead Of 1. Make a wound and save roll for each hit. In addition, if the unmodified wound roll for an attack made by this model is 6, that attack inflicts 1 mortal wound on the target in addition to any normal damage.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Scent of Weakness`,
        desc: `You can use this command ability in the combat phase. If you do so, pick 1 enemy unit within 12" of a friendly model with this command ability, Until the end Of that phase, add 1 to wound rolls for attacks made by friendly SAURUS models that target that enemy unit. A unit cannot benefit from this command ability more than once per phase.`,
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
        desc: `Roll a dice each time you allocate a wound or mortal wound to a friendly SERAPHON unit wholly within 12" of any models with this ability. On a 6, that wound or mortal wound is negated.`,
        when: [WOUND_ALLOCATION],
      },
    ],
  },
  {
    name: `Skink Priest`,
    effects: [
      {
        name: `Star-stone Staff`,
        desc: `In your hero phase, you can pick 1 friendly SKINK unit wholly within 12" of this model and roll a dice, On a 3+, until your next hero phase, that unit can run and still shoot and/or charge in the same turn, and you can add 1 to save rolls for attacks that target that unit. A unit cannot benefit from this ability more than once per phase.`,
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
        desc: `At the start of your hero phase, roll a dice for this model. On a 4+, you receive 1 command point.`,
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
        desc: `At the start of your hero phase, roll a dice for this model. On a 5+ you receive 1 command point.`,
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
      {
        name: `Cosmic Engine`,
        desc: `Roll for Engine of the Gods effect.`,
        when: [HERO_PHASE],
      },
      SteadfastMajestyEffect,
      UnstoppableStampedeEffect,
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
        desc: `1 model in this unit can be a Saurus Warrior Alpha. Add 1 to the Attacks characteristic Of that model's Celestite Club or Celestite Spear.`,
        when: [COMBAT_PHASE],
      },
      StardrakeIconEffect,
      WardrummerEffect,
    ],
  },
  {
    name: `Saurus Guard`,
    effects: [
      StardrakeIconEffect,
      StardrakeShieldsEffect,
      WardrummerEffect,
      {
        name: `Sworn Guardians`,
        desc: `If this unit is within 8" of any SERAPHON HEROES, add 1 to the result of any save rolls for it.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
      {
        name: `Sworn Guardians`,
        desc: `If this unit is within 8" of any SERAPHON HEROES, add 2 to its Bravery.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Alpha Guardian`,
        desc: `The leader of this unit is the Alpha Guardian. An Alpha Guardian makes 3 attacks rather than 2 with its Celestite Polearm.`,
        when: [COMBAT_PHASE],
      },
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
    name: `Terradon Riders`,
    effects: [
      {
        name: `Deadly Cargo`,
        desc: `Once per game, the unit can drop its boulders onto an enemy unit it moves over during the movement phase. Roll a D6 for each Terradon in this unit; for each result of 4 or more, the enemy unit is struck by an exploding boulder and suffers D3 mortal wounds.`,
        when: [MOVEMENT_PHASE],
      },
      {
        name: `Sunleech Bolas`,
        desc: `If an attack made with a Sunleech Bolas scores a hit, the projectile bursts and spreads flames among the foe. Roll a D6 and make that many wound rolls.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Skyblade`,
        desc: `If the target of an attack made with a Skyblade can fly, you can re-roll failed hit rolls.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Swooping Dive`,
        desc: `Remember to declare that your Terradons are swooping. In the following combat phase you can re-roll failed hit and wound rolls for this unit.`,
        when: [END_OF_MOVEMENT_PHASE],
      },
      {
        name: `Unit Leader - Alpha`,
        desc: `The leader of this unit is either an Alpha or a Master of the Skies. An Alpha's ranged weapon has a To Hit characteristic of 3+ rather than 4+.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Unit Leader - Master of the Skies`,
        desc: `The leader of this unit is either an Alpha or a Master of the Skies. A Master of the Skies is armed with a Skyblade instead of its ranged weapon.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Ripperdactyl Riders`,
    effects: [
      {
        name: `Toad Rage`,
        desc: `Place Blot Toad for Ripperdactyls.`,
        when: [TURN_ONE_HERO_PHASE],
      },
      {
        name: `Toad Rage`,
        desc: `Move Blot Toad up to D6 inches.`,
        when: [MOVEMENT_PHASE],
      },
      {
        name: `Swooping Dive`,
        desc: `Remember to declare that your Ripperdactyls are swooping. In your following combat phase you can re-roll failed hit and wound rolls for this unit.`,
        when: [END_OF_MOVEMENT_PHASE],
      },
      {
        name: `Swooping Dive`,
        desc: `You can re-roll failed hit and wound rolls for this unit in your combat phase.`,
        when: [COMBAT_PHASE],
      },
      StarbucklersEffect,
      {
        name: `Voracious Appetite`,
        desc: `If the hit roll for an attack made with a Ripperdactyl's Vicious Beak scores a hit, that attack inflicts D3 hits on the target instead of 1. Make a wound and save roll for each hit.`,
        when: [COMBAT_PHASE],
      },
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
        desc: `Add 1 to hit rolls for attacks made by this unit while it is wholly within 6" Of any SKINK units.`,
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
    name: `Stegadon w/ Skystreak Bow`,
    effects: [...StegadonBaseEffects],
  },
  {
    name: `Stegadon w/ Sunfire Throwers`,
    effects: [
      ...StegadonBaseEffects,
      {
        name: `Gout of Sunfire`,
        desc: `When a Stegadon attacks with its Sunfire Throwers, select a target unit and make one attack against it for each of its models within range.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Bastiladon w/ Ark of Sotek`,
    effects: [
      ...ImperviousDefenceEffects,
      {
        name: `Tide of Snakes`,
        desc: `At the start of each combat phase, a Bastiladon carrying an Ark of Sotek can unleash a tide of venomous serpents. Pick up to six enemy units within 8" and mark each one with a dice showing a different number. Then roll twelve dice to see where the snakes go. Each enemy unit suffers one mortal wound for each roll that matches the number on its dice. Any dice that do not roll a matching number have no effect as the snakes slither away.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Bastiladon w/ Solar Engine`,
    effects: [
      ...ImperviousDefenceEffects,
      {
        name: `Light of the Heavens`,
        desc: `If this model's Searing Beam targets a unit of CHAOS DAEMONS, its Damage characteristic is 3 rather than 2.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Celestial Swarm`,
    effects: [
      {
        name: `Swarming Tide`,
        desc: `In your hero phase, you may heal D3 wounds allocated to this unit, as more creatures materialise to supplement their number.`,
        when: [HERO_PHASE],
      },
      DeadlyVenomEffect,
    ],
  },
  {
    name: `Skink Chief`,
    effects: [
      {
        name: `Marked for Greatness`,
        desc: `You can re-roll a single dice for this model in each phase.`,
        when: [DURING_GAME],
      },
      StarbucklersEffect,
    ],
  },
  {
    name: `Skink Prophet`,
    effects: [
      DeadlyVenomEffect,
      {
        name: `Priestly Rites`,
        desc: `In your hero phase, you may declare that this model is performing a rite to harness the power of the heavens. If you do so, roll a D6. If the result is 4+ you can re-roll run rolls, charge rolls and save rolls for this model until your next hero phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Skink Oracle on Troglodon`,
    effects: [
      {
        name: `Oracle of the Slann`,
        desc: `Add 1 to casting, dispelling and unbinding rolls for this model. In addition, this model can attempt to unbind spells that are cast anywhere on the battlefield and attempt to dispel endless spells anywhere on the battlefield.`,
        when: [HERO_PHASE],
      },
      {
        name: `Regeneration`,
        desc: `In your hero phase, you can roll a dice for this model. If you do so, on a 2+, heal up to D3 wounds allocated to this model.`,
        when: [HERO_PHASE],
      },
      {
        name: `Venomous Spittle`,
        desc: `If the unmodified wound roll for an attack made with this model's Noxious Spittle or Venomous Jaws is 6, that attack inflicts 1 mortal wound on the target in addition to any normal damage.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
      {
        name: `Drawn to the Screams`,
        desc: `If any wounds inflicted by this model's Noxious Spittle are allocated to an enemy model and not negated, until the end of the turn, you can re-roll charge rolls for this model.`,
        when: [SHOOTING_PHASE, CHARGE_PHASE],
      },
      TerrorEffect,
    ],
  },
  {
    name: `Dread Saurian`,
    effects: [
      {
        name: `Primal Presence`,
        desc: `Do not take battleshock tests for friendly Skink units while they are wholly within 24" of this model.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Arcane Glyphs`,
        desc: `You can heal up to D3 wounds allocated to this model.`,
        when: [HERO_PHASE],
      },
      {
        name: `Devourer of Beasts`,
        desc: `You can re-roll hit and wound rolls of 1 for attacks made by this model that target a MONSTER.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Roar of Ruin`,
        desc: `Subtract 1 from the Bravery characteristic of enemy units while they are within 12" of any friendly models with this ability.`,
        when: [BATTLESHOCK_PHASE],
      },
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
]
