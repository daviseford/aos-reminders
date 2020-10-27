import KharadronOverlords from 'army/kharadron_overlords'
import Stormcast from 'army/stormcast_eternals'
import Sylvaneth from 'army/sylvaneth'
import { TBattalions, TUnits } from 'types/army'
import { AZYR } from 'types/import'
import {
  BATTLESHOCK_PHASE,
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  DURING_SETUP,
  END_OF_COMBAT_PHASE,
  END_OF_MOVEMENT_PHASE,
  HERO_PHASE,
  MOVEMENT_PHASE,
  SHOOTING_PHASE,
  START_OF_CHARGE_PHASE,
  START_OF_COMBAT_PHASE,
  START_OF_HERO_PHASE,
  START_OF_SETUP,
  START_OF_SHOOTING_PHASE,
  TURN_FOUR_START_OF_ROUND,
  WOUND_ALLOCATION_PHASE,
} from 'types/phases'
import { AQSHY, CHAMON, GHUR, GHYRAN, HYSH, SHYISH, ULGU } from 'types/realmscapes'

const getKharadronUnits = () => KharadronOverlords.Units
const getStormcastUnits = () => Stormcast.Units
const getSylvanethUnits = () => Sylvaneth.Units

const DuardinArtilleryEffects = [
  {
    name: `Duardin Artillery`,
    desc: `The Crew are in cover while they are within 1" of their war machine.`,
    when: [DURING_GAME],
  },
  {
    name: `Duardin Artillery`,
    desc: `The war machine does not need to take battleshock tests and is unaffected by any attack or ability that uses Bravery.`,
    when: [BATTLESHOCK_PHASE],
  },
  {
    name: `Duardin Artillery`,
    desc: `The war machine cannot make charge moves.`,
    when: [CHARGE_PHASE],
  },
  {
    name: `Duardin Artillery`,
    desc: `If its Crew are within 1" of the model in the shooting phase, they can fire the war machine.`,
    when: [SHOOTING_PHASE],
  },
  {
    name: `Duardin Artillery`,
    desc: `This model can only move if its Crew are within 1" at the start of the movement phase.`,
    when: [MOVEMENT_PHASE],
  },
]
const CelestialHurricanumEffects = [
  {
    name: `Locus of Azyr`,
    desc: `Add 1 to casting rolls made for friendly COLLEGIATE ARCANE WIZARDS wholly within 12" of any friendly CELESTIAL HURRICANUMS.`,
    when: [HERO_PHASE],
  },
  {
    name: `Portents of Battle`,
    desc: `Add 1 to hit rolls for attacks made by friendly CITIES OF SIGMAR models within range of the Portents of Battle ability of any friendly CELESTIAL HURRICANUMS. Range is on damage table.`,
    when: [DURING_GAME],
  },
  {
    name: `Storm of Shemtek`,
    desc: `Roll a number of dice equal to the Storm of Shemtek value shown on this model's damage table. For each 2+, the target suffers D3 mortal wounds.`,
    when: [SHOOTING_PHASE],
  },
]
const LuminarkEffects = [
  {
    name: `Aura of Protection`,
    desc: `Roll a D6 each time you allocate a wound or mortal wound to a friendly CITIES OF SIGMAR model within range of any friendly LUMINARKS OF HYSH. On a 6+, that wound or mortal wound is negated. The range of this ability is shown on the damage table.`,
    when: [WOUND_ALLOCATION_PHASE],
  },
  {
    name: `Locus of Hysh`,
    desc: `Add 1 to unbinding rolls for friendly COLLEGIATE ARCANE WIZARDS wholly within 12" of any friendly LUMINARKS OF HYSH.`,
    when: [HERO_PHASE],
  },
  {
    name: `Searing Beam of Light`,
    desc: `Pick 1 visible point on the battlefield within range of this ability (see damage table) and draw an imaginary straight line 1mm wide between that point and the closest part of this model's base. Roll a D6 for each unit that has models passed across by this line. For each roll that is equal to or greater than the Searing Beam of Light value shown on this model's damage table, that unit suffers D3 mortal wounds.`,
    when: [SHOOTING_PHASE],
  },
]
const SteamTankEffects = [
  {
    name: `Bouncing Cannon Balls`,
    desc: `Add 1 to hit rolls for attacks made by this model's Steam Cannon that target an enemy unit that has 10 or more models.`,
    when: [SHOOTING_PHASE],
  },
  {
    name: `More Pressure!`,
    desc: `You can choose to overpressure this model's boiler. If you do so, roll 2D6. If the roll is less than the number of wounds currently allocated to this model, this model immediately suffers D3 mortal wounds. If the roll is equal to or greater than the number of wounds currently allocated to this model, until the start of your next hero phase, you can add 2 to this model's Move characteristic and add 2 to the Attacks characteristic of this model's Steam Gun.`,
    when: [START_OF_HERO_PHASE],
  },
  {
    name: `Steel Behemoth`,
    desc: `After this model makes a charge move, you can pick 1 enemy unit within 1" of this model and roll a D6. On a 2+, that enemy unit suffers D3 mortal wounds.`,
    when: [CHARGE_PHASE],
  },
]
const SorceressEffects = [
  {
    name: `Blood Sacrifice`,
    desc: `At the start of your hero phase, you can pick 1 friendly DARKLING COVEN model within 3" to be slain. If you do so, add 2 to casting rolls for this model until the end of that phase.`,
    when: [START_OF_HERO_PHASE],
  },
  {
    name: `Command Underlings`,
    desc: `Pick 1 friendly DARKLING COVEN unit wholly within 12" of a friendly DARKLING COVEN HERO with this command ability. Until your next hero phase, that unit can run and still shoot and/or charge later in the same turn.`,
    when: [HERO_PHASE],
    command_ability: true,
  },
]
const NoxiousBreathEffect = {
  name: `Noxious Breath`,
  desc: `Do not use the attack sequence for an attack made with Noxious Breath. Instead, roll a number of dice equal to the number of models from the target unit that are in range of the attack. For each 6, the target unit suffers 1 mortal wound.`,
  when: [SHOOTING_PHASE],
}
const WitnessToDestinyEffect = {
  name: `Witness to Destiny`,
  desc: `Roll a D6 each time you allocate a wound or mortal wound to this model. On a 4+, that wound or mortal wound is negated.`,
  when: [WOUND_ALLOCATION_PHASE],
}
const AttunedToMagicEffect = {
  name: `Attuned to Magic`,
  desc: `If a friendly WIZARD within 12" of this model casts a spell that is not unbound, this model is imbued with magical energy until the start of your next hero phase. Add 1 to save rolls for attacks that target this model while it is imbued with magical energy (this ability can never add more than 1 to the save roll).`,
  when: [HERO_PHASE],
}
const LordlingAndRanksOfColdSteelEffects = [
  {
    name: `Lordling`,
    desc: `Add 1 to the Attacks characteristic of that model's melee weapon.`,
    when: [COMBAT_PHASE],
  },
  {
    name: `Ranks of Cold Steel`,
    desc: `Add 1 to hit rolls for attacks made by this unit if it has 10 or more models.`,
    when: [COMBAT_PHASE],
  },
]
const DrummerEffect = {
  name: `Drummer`,
  desc: `Add 1 to run and charge rolls for units that include any Drummers.`,
  when: [MOVEMENT_PHASE, CHARGE_PHASE],
}
const TrumpeterEffect = {
  name: `Trumpeter`,
  desc: `Add 1 to charge rolls for units that include any Trumpeters.`,
  when: [CHARGE_PHASE],
}
const MusicianEffect = {
  name: `Musician`,
  desc: `Add 1 to run and charge rolls for units that include any Musicians.`,
  when: [MOVEMENT_PHASE, CHARGE_PHASE],
}
const SeaDragonCloakEffect = {
  name: `Sea Dragon Cloak`,
  desc: `Add 1 to save rolls for attacks made with missile weapons that target this unit.`,
  when: [SHOOTING_PHASE],
}
const StandardBearerEffect = {
  name: `Standard Bearer`,
  desc: `Add 1 to the Bravery characteristic of units that include any Standard Bearers.`,
  when: [BATTLESHOCK_PHASE],
}
const DecapitatingSwingEffect = {
  name: `Decapitating Swing`,
  desc: `If the unmodified hit roll for an attack made with a Zweihander is 6, that attack inflicts 1 mortal wound on the target in addition to any normal damage.`,
  when: [COMBAT_PHASE],
}
const HornblowerEffect = {
  name: `Hornblower`,
  desc: `Add 1 to run and charge rolls for units that include any Hornblowers.`,
  when: [MOVEMENT_PHASE, CHARGE_PHASE],
}
const QuickWithTheLashEffect = {
  name: `Quick with the Lash`,
  desc: `Before you make a charge roll for this model, you can say that its Handlers are going to apply the lash. If you do so, roll 3D6, remove 1 dice of your choice, and then use the remaining 2D6 to determine the charge roll. However, if the 3D6 roll was a triple, this model suffers 1 mortal wound and it cannot make a charge move in that phase.`,
  when: [CHARGE_PHASE],
}
const FrostheartPhoenixEffects = [
  AttunedToMagicEffect,
  {
    name: `Blizzard Aura`,
    desc: `Subtract 1 from wound rolls for attacks made with melee weapons by enemy units within range of the Blizzard Aura ability of any friendly models. The range of the Blizzard Aura ability for this model is shown on the damage table.`,
    when: [COMBAT_PHASE],
  },
]
const FlamespyrePhoenixEffects = [
  AttunedToMagicEffect,
  {
    name: `Phoenix Reborn`,
    desc: `The first time this model is slain, before removing it from the battlefield, roll a D6. On a 1-3, this model is slain. On a 4-6, this model is not slain, all wounds allocated to it are healed, and any wounds that currently remain to be allocated to it are negated.`,
    when: [WOUND_ALLOCATION_PHASE],
  },
  {
    name: `Wake of Fire`,
    desc: `After this model has made a normal move, pick 1 enemy unit that has any models that this model passed across and roll a D6. On a 2+, that unit suffers a number of mortal wounds equal to the Wake of Fire value shown on this model's damage table.`,
    when: [MOVEMENT_PHASE],
  },
]
const MagicOfTheRealmsEffect = {
  name: `Magic of the Realms`,
  desc: `When you select this model to be part of your army, you must choose the realm that your Battlemage comes from.`,
  when: [START_OF_SETUP],
}
const MagicOfTheRealmsCastingEffect = {
  name: `Magic of the Realms`,
  desc: `Add 1 to casting rolls for this model if the battle is taking place in the realm it comes from.`,
  when: [HERO_PHASE],
}
const BattlemageMagicEffect = {
  name: `Magic`,
  desc: `This model knows the spell from its warscroll that includes the name of the realm it comes from.`,
  when: [HERO_PHASE],
}
const WildformEffect = {
  name: `Wildform (${GHUR})`,
  desc: `Casting value of 5+. Pick 1 visible friendly unit within 12" of the caster. Add 2 to run and charge rolls for that unit until your next hero phase.`,
  when: [HERO_PHASE],
  spell: true,
}
const ChainLightningEffect = {
  name: `Chain Lightning (${AZYR})`,
  desc: `Casting value of 6+. Pick 1 visible enemy unit within 18" of the caster. That unit suffers D3 mortal wounds. Then, roll a D6 for every other enemy unit within 6" of the original target. On a 4+, that unit suffers D3 mortal wounds.`,
  when: [HERO_PHASE],
  spell: true,
}
const FireballEffect = {
  name: `Fireball (${AQSHY})`,
  desc: `Casting value of 5+. Pick 1 visible enemy unit within 18" of the caster. If the enemy unit has 1 model, it suffers 1 mortal wound; if it has 2 to 9 models, it suffers D3 mortal wounds; and if it has 10 or more models, it suffers D6 mortal wounds.`,
  when: [HERO_PHASE],
  spell: true,
}
const MystifyingMiasmaEffect = {
  name: `Mystifying Miasma (${ULGU})`,
  desc: `Casting value of 4+. Pick 1 visible enemy unit within 18" of the caster. That unit cannot run until your next hero phase. In addition, subtract 2 from charge rolls for that unit until your next hero phase.`,
  when: [HERO_PHASE],
  spell: true,
}
const PallOfDoomEffect = {
  name: `Pall of Doom (${SHYISH})`,
  desc: `Casting value of 6+. Pick 1 visible enemy unit within 18" of the caster. Subtract 2 from the Bravery characteristic of that unit until your next hero phase.`,
  when: [HERO_PHASE],
  spell: true,
}
const PhasProtectionEffect = {
  name: `Pha's Protection (${HYSH})`,
  desc: `Casting value of 5+. Pick 1 visible friendly unit within 18" of the caster. Subtract 1 from hit rolls for attacks that target that unit until your next hero phase.`,
  when: [HERO_PHASE],
  spell: true,
}
const TransmutationOfLeadEffect = {
  name: `Transmutation of Lead (${CHAMON})`,
  desc: `Casting value of 7+. Pick 1 visible enemy unit within 18" of the caster. Until your next hero phase, halve the Move characteristic of the unit you picked, rounding up. In addition, if that unit has a Save characteristic of 2+, 3+ or 4+, you can reroll hit rolls of 1 for attacks that target that unit until your next hero phase.`,
  when: [HERO_PHASE],
  spell: true,
}
const ShieldOfThornsEffect = {
  name: `Shield of Thorns (${GHYRAN})`,
  desc: `Casting value of 5+. Pick 1 visible friendly unit within 18" of the caster. Until your next hero phase, any enemy unit that finishes a charge move within 3" of that unit suffers D3 mortal wounds.`,
  when: [HERO_PHASE],
  spell: true,
}

// Unit Names
export const Units: TUnits = [
  {
    name: `Battlemage`,
    effects: [
      BattlemageMagicEffect,
      ChainLightningEffect,
      FireballEffect,
      MagicOfTheRealmsCastingEffect,
      MagicOfTheRealmsEffect,
      MystifyingMiasmaEffect,
      PallOfDoomEffect,
      PhasProtectionEffect,
      ShieldOfThornsEffect,
      TransmutationOfLeadEffect,
      WildformEffect,
    ],
  },
  {
    name: `Battlemage (${AZYR})`,
    effects: [MagicOfTheRealmsCastingEffect, ChainLightningEffect],
  },
  {
    name: `Battlemage (${AQSHY})`,
    effects: [MagicOfTheRealmsCastingEffect, FireballEffect],
  },
  {
    name: `Battlemage (${ULGU})`,
    effects: [MagicOfTheRealmsCastingEffect, MystifyingMiasmaEffect],
  },
  {
    name: `Battlemage (${SHYISH})`,
    effects: [MagicOfTheRealmsCastingEffect, PallOfDoomEffect],
  },
  {
    name: `Battlemage (${HYSH})`,
    effects: [MagicOfTheRealmsCastingEffect, PhasProtectionEffect],
  },
  {
    name: `Battlemage (${CHAMON})`,
    effects: [MagicOfTheRealmsCastingEffect, TransmutationOfLeadEffect],
  },
  {
    name: `Battlemage (${GHUR})`,
    effects: [MagicOfTheRealmsCastingEffect, WildformEffect],
  },
  {
    name: `Battlemage (${GHYRAN})`,
    effects: [MagicOfTheRealmsCastingEffect, ShieldOfThornsEffect],
  },
  {
    name: `Battlemage on Griffon`,
    effects: [
      {
        name: `Amber Battlemage`,
        desc: `Add 1 to casting rolls for this model if the battle is taking place in Ghur.`,
        when: [HERO_PHASE],
      },
      {
        name: `Two-headed`,
        desc: `If the unmodified hit roll for an attack made with Twin Beaks is 6, that attack scores 2 hits on the target instead of 1. Make a wound and save roll for each hit.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Amber Spear`,
        desc: `Casting value of 7+. Pick 1 visible point on the battlefield within 18" of the caster. Draw an imaginary straight line 1mm wide between that point and the closest part of the caster's base. Roll a D6 for each unit that has models passed across by this line. On a 2+, that unit suffers D3 mortal wounds.`,
        when: [HERO_PHASE],
        spell: true,
      },
      WildformEffect,
    ],
  },
  {
    name: `Celestial Hurricanum with Celestial Battlemage`,
    effects: [
      {
        name: `Celestial Battlemage`,
        desc: `Add 1 to casting rolls for this model if the battle is taking place in Azyr.`,
        when: [HERO_PHASE],
      },
      ...CelestialHurricanumEffects,
      ChainLightningEffect,
      {
        name: `Comet of Casandora`,
        desc: `Casting value of 6+. Pick 1 visible enemy unit within 18" of the caster and roll 2D6. If the roll is less than or equal to that unit's Move characteristic, that unit suffers D3 mortal wounds. If the roll is greater than that unit's Move characteristic, that unit suffers D6 mortal wounds.`,
        when: [HERO_PHASE],
        spell: true,
      },
    ],
  },
  {
    name: `Celestial Hurricanum`,
    effects: [...CelestialHurricanumEffects],
  },
  {
    name: `Luminark of Hysh with White Battlemage`,
    effects: [
      ...LuminarkEffects,
      {
        name: `White Battlemage`,
        desc: `Add 1 to casting rolls for this model if the battle is taking place in Hysh.`,
        when: [HERO_PHASE],
      },
      {
        name: `Burning Gaze`,
        desc: `Casting value of 6+. Pick 1 visible enemy unit within 18" of the caster. That unit suffers D3 mortal wounds. Double the number of wounds inflicted if that unit has 10 or more models, or triple the number of wounds inflicted if that unit has 20 or more models.`,
        when: [HERO_PHASE],
        spell: true,
      },
    ],
  },
  {
    name: `Luminark of Hysh`,
    effects: [...LuminarkEffects],
  },
  {
    name: `Flagellants`,
    effects: [
      {
        name: `Prophet`,
        desc: `Leader gets +1 melee attack.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Glorious Martyrs`,
        desc: `+1 melee attacks if any models from this unit have been slain in the same turn. +2 attacks instead of 1 if 5 or more models from this unit have been slain in the same turn.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Fanatical Fury`,
        desc: `+1 to hit and to wound by this unit if it made a charge move in the same turn.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Wreckless Abandon`,
        desc: `Each time a model from this unit flees, you can pick 1 enemy unit within 6" of this unit and roll a D6. On a 4+, that enemy unit suffers 1 mortal wound.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
  {
    name: `Freeguild General`,
    effects: [
      DecapitatingSwingEffect,
      {
        name: `Inspiring Leader`,
        desc: `Add 1 to the Bravery characteristic of friendly FREEGUILD units while they are wholly within 18" of this model.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Hold the Line`,
        desc: `Pick up to 3 friendly FREEGUILD units wholly within 18" of a friendly FREEGUILD HERO with this command ability. Until the start of your next hero phase, add 1 to hit and wound rolls for attacks made by those friendly units if they have not made a normal move or a charge move in the same turn. A unit cannot benefit from this command ability more than once per phase.`,
        when: [HERO_PHASE],
        command_ability: true,
      },
    ],
  },
  {
    name: `Freeguild General on Griffon`,
    effects: [
      {
        name: `Charging Lance`,
        desc: `This model's Freeguild Lance has a Rend characteristic of -2 instead of -1 if this model made a charge move in the same turn.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Freeguild Shield`,
        desc: `+1 to save.`,
        when: [DURING_GAME],
      },
      {
        name: `Skilled Rider`,
        desc: `Add 1 to run rolls for this model if it does not carry a Freeguild Shield.`,
        when: [MOVEMENT_PHASE],
      },
      {
        name: `Skilled Rider`,
        desc: `Add 1 to charge rolls for this model if it does not carry a Freeguild Shield.`,
        when: [CHARGE_PHASE],
      },
      {
        name: `Piercing Bloodroar`,
        desc: `Subtract 1 from the Bravery characteristic of enemy units while they are within 8" of any friendly units with this ability.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Rousing Battle Cry`,
        desc: `Pick 1 friendly FREEGUILD HERO with this CA. Until the end of that phase, add 1 to charge rolls for friendly FREEGUILD units while they are wholly within 12" of that HERO. In addition, in the next combat phase, add 1 to hit rolls for attacks made with melee weapons by friendly FREEGUILD units while they are wholly within 12" of that HERO. A unit cannot benefit from this command ability more than once per phase.`,
        when: [START_OF_CHARGE_PHASE],
        command_ability: true,
      },
    ],
  },
  {
    name: `Freeguild Guard`,
    effects: [
      {
        name: `Sergeant`,
        desc: `Add 1 to the Attacks characteristic of that model's melee weapon.`,
        when: [COMBAT_PHASE],
      },
      DrummerEffect,
      StandardBearerEffect,
      {
        name: `Massed Ranks`,
        desc: `+1 to hit for attacks made by this unit if it has 10 or more models. Add 2 to hit rolls instead of 1 if this unit has 20 or more models.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Parry and Block`,
        desc: `+1 save for attacks that target a unit armed with Freeguild Swords and Shields.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Wall of Spears`,
        desc: `+1 to hit with Freeguild Spears that target an enemy unit that made a charge move in the same turn.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Freeguild Crossbowmen`,
    effects: [
      {
        name: `Marksman`,
        desc: `+1 to hit for attacks made with this model's crossbow.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Piper`,
        desc: `Add 1 to run and charge rolls for units that include any Pipers.`,
        when: [MOVEMENT_PHASE, CHARGE_PHASE],
      },
      StandardBearerEffect,
      {
        name: `Reload, Fire!`,
        desc: `Add 1 to the Attacks characteristic of this unit's Freeguild Crossbows if it has 10 or more models, there are no enemy models within 3" of this unit, and this unit has not made a move in the same turn.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Freeguild Handgunners`,
    effects: [
      {
        name: `Marksman`,
        desc: `May replace their Freeguild Handgun with: Long Rifle; or Repeater Handgun. In addition, add 2 to hit rolls for attacks made with that model's Freeguild Handgun.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Piper`,
        desc: `Add 1 to run and charge rolls for units that include any Pipers.`,
        when: [MOVEMENT_PHASE, CHARGE_PHASE],
      },
      StandardBearerEffect,
      {
        name: `Stand and Shoot`,
        desc: `Once per turn, when an enemy unit ends a charge move within 3" of this unit and there are no other enemy units within 3" of this unit, this unit can shoot.`,
        when: [CHARGE_PHASE],
      },
      {
        name: `Steady Aim`,
        desc: `Add 1 to hit rolls for attacks made by this unit if it has 10 or more models, there are no enemy models within 3" of this unit, and this unit has not made a move in the same turn.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Crack Shot`,
        desc: `Enemy HEROES do not benefit from the Look Out, Sir! rule for attacks made with a Long Rifle.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Freeguild Greatswords`,
    effects: [
      {
        name: `Guild Champion`,
        desc: `Add 1 to the Attacks characteristic of that model's melee weapon.`,
        when: [COMBAT_PHASE],
      },
      HornblowerEffect,
      StandardBearerEffect,
      DecapitatingSwingEffect,
      {
        name: `Oathsworn Honour Guard`,
        desc: `Add 1 to hit rolls for attacks made with melee weapons by this unit if it is wholly within 18" of any friendly FREEGUILD HEROES.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Demigryph Knights`,
    effects: [
      {
        name: `Preceptor`,
        desc: `Add 1 to the Attacks characteristic of that model's Demigryph Knight's Halberd or Demigryph Knight's Lance.`,
        when: [COMBAT_PHASE],
      },
      HornblowerEffect,
      StandardBearerEffect,
      {
        name: `Charging Lance`,
        desc: `Rend and Damage 2 for lances if this unit made a charge move in the same turn.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Savage Ferocity`,
        desc: `If the unmodified wound roll for an attack made with this unit's Beak and Talons is 6, that attack inflicts 1 mortal wound on the target in addition to any normal damage.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Freeguild Outriders`,
    effects: [
      {
        name: `Sharpshooter`,
        desc: `+1 Attacks for that model's Freeguild Cavalry Sabre. In addition, a Sharpshooter can replace their Repeater Handgun with: Grenade-launching Blunderbuss; or Brace of Pistols.`,
        when: [COMBAT_PHASE],
      },
      TrumpeterEffect,
      {
        name: `Expert Gunners`,
        desc: `Add 1 to the Attacks characteristic of this unit's Repeater Handguns if this unit is not within 3" of any enemy units.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Skilled Riders`,
        desc: `This unit can run and/or retreat and still shoot later in the same turn.`,
        when: [MOVEMENT_PHASE, SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Freeguild Pistoliers`,
    effects: [
      {
        name: `Outrider`,
        desc: `+1 Attacks for that model's Sabre and Pistol Butt. In addition, a Sharpshooter can replace their Brace of Pistols with a Repeater Handgun.`,
        when: [COMBAT_PHASE],
      },
      TrumpeterEffect,
      {
        name: `Hail of Bullets`,
        desc: `After this unit makes a charge move, it can shoot with any Braces of Pistols it is armed with.`,
        when: [CHARGE_PHASE],
      },
      {
        name: `Reckless Riders`,
        desc: `You can reroll run and charge rolls for this unit.`,
        when: [MOVEMENT_PHASE, CHARGE_PHASE],
      },
    ],
  },
  {
    name: `Warden King`,
    effects: [
      {
        name: `Oath Stone`,
        desc: `In your hero phase, you can say this model will stand atop its oath stone. If you do so, until the start of your next turn, this model cannot move. In addition, until the start of your next turn, do not take battleshock tests for friendly DISPOSSESSED units wholly within 18" of this model.`,
        when: [HERO_PHASE],
      },
      {
        name: `Ancestral Grudge`,
        desc: `Pick 1 enemy unit within 18" of a friendly HERO with this command ability. Until the end of that phase, add 1 to the Attacks characteristic of attacks made with melee weapons used by friendly DISPOSSESSED units that target that unit. A unit cannot benefit from this command ability more than once per phase.`,
        when: [START_OF_COMBAT_PHASE],
        command_ability: true,
      },
    ],
  },
  {
    name: `Runelord`,
    effects: [
      {
        name: `Runes of Spellbreaking`,
        desc: `This model can attempt to dispel 1 endless spell in your hero phase and attempt to unbind 1 spell in the enemy hero phase. Add 2 to dispelling and unbinding rolls for this model.`,
        when: [HERO_PHASE],
      },
      {
        name: `Rune Lore: Ancestral Shield`,
        desc: `2+ for this prayer to succeed. Pick 1 friendly DISPOSSESSED unit wholly within 12" of this model. Until the start of your next hero phase, roll a D6 each time you allocate a wound or mortal wound to that unit. On a 6, that wound or mortal wound is negated.`,
        when: [HERO_PHASE],
        prayer: true,
      },
      {
        name: `Rune Lore: Ancestral Shield`,
        desc: `If active, roll a D6 each time you allocate a wound or mortal wound to that unit. On a 6, that wound or mortal wound is negated.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
      {
        name: `Rune Lore: Forge Fire`,
        desc: `2+ for this prayer to succeed. Pick 1 friendly DISPOSSESSED unit wholly within 12" of this model. Until the start of your next hero phase, improve the Rend characteristic of that unit's weapons by 1.`,
        when: [HERO_PHASE],
        prayer: true,
      },
    ],
  },
  {
    name: `Longbeards`,
    effects: [
      {
        name: `Old Guard`,
        desc: `Add 1 to the Attacks characteristic of the leader's melee weapon.`,
        when: [COMBAT_PHASE],
      },
      StandardBearerEffect,
      MusicianEffect,
      {
        name: `Gromril Shieldwall`,
        desc: `Add 1 to save rolls for attacks made with melee weapons that target a unit with Gromril Shields.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Old Grumblers`,
        desc: `Pick a grumble. That complaint is in effect until the start of your next hero phase.`,
        when: [HERO_PHASE],
      },
      {
        name: `Grumble - 'I thought duardin were made of sterner stuff!'`,
        desc: `Add 1 to the Bravery characteristic of friendly Dispossessed units while they are wholly within 12" of any units with this complaint.`,
        when: [HERO_PHASE],
      },
      {
        name: `Grumble - 'Put your back into it, beardling!'`,
        desc: `You can reroll wound rolls of 1 for attacks made by friendly Dispossessed units while they are wholly within 12" of any units with this complaint.`,
        when: [HERO_PHASE],
      },
      {
        name: `Grumble - 'Too much damned magic flying about these days!'`,
        desc: `A unit with this complaint can attempt to dispel 1 endless spell in your hero phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Ironbreakers`,
    effects: [
      {
        name: `Ironbeard`,
        desc: `+1 melee attacks. Can carry Drakefire Pistol and Cinderblast Bomb; or a pair of Drakefire Pistols.`,
        when: [COMBAT_PHASE],
      },
      StandardBearerEffect,
      DrummerEffect,
      {
        name: `Cinderblast Bomb`,
        desc: `Once per battle, in your shooting phase, a model armed with a Cinderblast Bomb can throw it. If they do so, pick 1 enemy unit within 6" of that model and roll a D6. On a 2+, that unit suffers D3 mortal wounds.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Paired Drakefire Pistols`,
        desc: `Add 1 to the Attacks characteristic of a Drakefire Pistol for models armed with a pair of Drakefire Pistols.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Irondrakes`,
    effects: [
      {
        name: `Ironwarden`,
        desc: `+1 Melee attack. Can carry Grudgehammer Torpedo; Drakefire Pistol and Cinderblast Bomb; or a pair of Drakefire Pistols.`,
        when: [COMBAT_PHASE],
      },
      StandardBearerEffect,
      HornblowerEffect,
      {
        name: `Blaze Away`,
        desc: `Add 1 to the Attacks characteristic of this unit's missile weapons if there are no enemy units within 3" of this unit and this unit has not made a move in the same turn.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Cinderblast Bomb`,
        desc: `Once per battle, in your shooting phase, a model armed with a Cinderblast Bomb can throw it. If they do so, pick 1 enemy unit within 6" of that model and roll a D6. On a 2+, that unit suffers D3 mortal wounds.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Forge-proven Gromril Armour`,
        desc: `Add 1 to save rolls for attacks made with missile weapons that target this unit.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Grudgehammer Torpedo`,
        desc: `A Grudgehammer Torpedo has a Damage characteristic of D6 instead of D3 if the target is a MONSTER.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Paired Drakefire Pistols`,
        desc: `Add 1 to the Attacks characteristic of a Drakefire Pistol for models armed with a pair of Drakefire Pistols.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Hammerers`,
    effects: [
      {
        name: `Keeper of the gate`,
        desc: `Add 1 to the Attacks characteristic of this model's melee weapon.`,
        when: [COMBAT_PHASE],
      },
      StandardBearerEffect,
      MusicianEffect,
      {
        name: `Kingsguard`,
        desc: `Do not take battleshock tests for this unit while it is wholly within 12" of a friendly DISPOSSESSED HERO.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Shattering Blow`,
        desc: `If the unmodified wound roll for an attack made with a Gromril Great Hammer is 6, that attack inflicts 1 mortal wound on the target in addition to any normal damage.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Steam Tank with Commander`,
    effects: [
      {
        name: `Target Sighted`,
        desc: `Pick 1 friendly IRONWELD ARSENEL HERO with this command ability and 1 enemy unit. Until the end of that phase, add 1 to hit rolls for attacks that target that enemy unit made by friendly STEAM TANKS while they are within 6" of that friendly IRONWELD ARSENEL HERO. A unit cannot benefit from this command ability more than once per phase.`,
        when: [START_OF_SHOOTING_PHASE],
        command_ability: true,
      },
      {
        name: `I'll Fix It`,
        desc: `In your hero phase, you can heal up to D3 wounds allocated to this model if it includes a Commander and has not used the More Pressure! ability.`,
        when: [HERO_PHASE],
      },
      ...SteamTankEffects,
    ],
  },
  {
    name: `Cogsmith`,
    effects: [
      {
        name: `Free Arm`,
        desc: `Add 1 to hit rolls for attacks made with this model's missile weapons if it is not armed with a Cog Axe.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Free Arm`,
        desc: `Add 1 to hit rolls for attacks made with this model's melee weapons if it is not armed with a Grudge-raker.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Master Engineer`,
        desc: `In your hero phase, you can pick 1 friendly IRONWELD ARSENAL WAR MACHINE unit within 3" of this model. You can heal up to D3 wounds allocated to that unit.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Steamtank`,
    effects: [...SteamTankEffects],
  },
  {
    name: `Helstorm Rocket Battery`,
    effects: [
      {
        name: `Rocket Salvo`,
        desc: `Add 1 to hit rolls for attacks made with this model's Helstorm Rocket Salvo if all of the attacks made by that Helstorm Rocket Salvo in the same phase target the same enemy unit.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Calculated Trajectory`,
        desc: `You can reroll hit rolls of 1 for attacks made with this model's Helstorm Rocket Salvo if this model is within 3" of a friendly IRONWELD ARSENAL ENGINEER.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Helblaster Volley Gun`,
    effects: [
      {
        name: `Point Blank`,
        desc: `Add 1 to hit rolls for attacks made with this model's missile weapons that target an enemy unit wholly within 12" of this model.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Helblaster Volley`,
        desc: `Before attacking with a Volley of Shots, choose either the 1 Deck, 2 Decks or 3 Decks missile weapon characteristics for that shooting attack. However, if the roll to determine the Attacks characteristic includes a double, this model cannot shoot in that phase and instead suffers 1 mortal wound.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Working Like Clockwork`,
        desc: `You can reroll any dice when rolling to determine the Attacks characteristic of this model's Volley of Shots if this model is within 3" of a friendly IRONWELD ARSENAL ENGINEER.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Gyrobombers`,
    effects: [
      {
        name: `Grudgebuster Bombs`,
        desc: `After this unit has made a normal move, pick 1 enemy unit and roll 1 dice for each model in this unit that passed across any models from that enemy unit. For each 2+, that enemy unit suffers D3 mortal wounds.`,
        when: [MOVEMENT_PHASE],
      },
    ],
  },
  {
    name: `Gyrocopters`,
    effects: [
      {
        name: `Steam Gun`,
        desc: `Before attacking with a Steam Gun, pick 1 enemy unit that is within range of the attacking model's Steam Gun. The Attacks characteristic of that model's Steam Gun is equal to the number of models from that enemy unit within range of the attacking model's Steam Gun. All attacks made with that Steam Gun must target that enemy unit.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Guild Bombs`,
        desc: `Once per battle, after this unit has made a normal move, pick 1 enemy unit and roll 1 dice for each model in this unit that passed across any models from that enemy unit. For each 2+, that enemy unit suffers D3 mortal wounds.`,
        when: [MOVEMENT_PHASE],
      },
    ],
  },
  {
    name: `Sorceress`,
    effects: [
      ...SorceressEffects,
      {
        name: `Word of Pain`,
        desc: `Cast on 7+. Pick 1 visible enemy unit within 18". That unit suffers D3 mortal wounds. In addition, subtract 1 from hit rolls for attacks made by that unit until your next hero phase.`,
        when: [HERO_PHASE],
        spell: true,
      },
    ],
  },
  {
    name: `Sorceress on Black Dragon`,
    effects: [
      ...SorceressEffects,
      NoxiousBreathEffect,
      {
        name: `Bladewind`,
        desc: `Cast on 6+. Pick 1 visible enemy unit within 18" and roll 9 dice. For each roll that is lower than that unit's Save characteristic, that unit suffers 1 mortal wound.`,
        when: [HERO_PHASE],
        spell: true,
      },
      {
        name: `Inspire Hatred`,
        desc: `Pick 1 friendly DARKLING COVEN unit wholly within 12" of a friendly DARKLING COVEN HERO with this command ability. You can reroll wound rolls of 1 for attacks made by that unit in that combat phase.`,
        when: [START_OF_COMBAT_PHASE],
        command_ability: true,
      },
    ],
  },
  {
    name: `Dreadspears`,
    effects: [
      StandardBearerEffect,
      HornblowerEffect,
      {
        name: `Coven Guard`,
        desc: `If the unmodified hit roll for an attack made with a Darkling Spear is 6, that weapon has a Rend characteristic of -1 for that attack.`,
        when: [COMBAT_PHASE],
      },
      ...LordlingAndRanksOfColdSteelEffects,
    ],
  },
  {
    name: `Bleakswords`,
    effects: [
      StandardBearerEffect,
      HornblowerEffect,
      {
        name: `Quicksilver Strike`,
        desc: `If the unmodified hit roll for an attack made with a Darkling Sword is 6, that attack scores 2 hits on the target instead of 1. Make a wound and save roll for each hit.`,
        when: [COMBAT_PHASE],
      },
      ...LordlingAndRanksOfColdSteelEffects,
    ],
  },
  {
    name: `Darkshards`,
    effects: [
      {
        name: `Guardmaster`,
        desc: `Add 1 to hit rolls for attacks made with this model's missile weapon.`,
        when: [SHOOTING_PHASE],
      },
      StandardBearerEffect,
      HornblowerEffect,
      {
        name: `Storm of Iron-tipped Bolts`,
        desc: `Add 1 to hit rolls for attacks made with this unit's Repeater Crossbows if it has 10 or more models.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Black Guard`,
    effects: [
      {
        name: `Captain`,
        desc: `Add 1 to the Attacks characteristic of that model's melee weapon.`,
        when: [COMBAT_PHASE],
      },
      StandardBearerEffect,
      DrummerEffect,
      {
        name: `Elite Bodyguard`,
        desc: `Add 1 to hit rolls for attacks made by this unit if this unit is wholly within 12" of a friendly DARKLING COVEN HERO.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Executioners`,
    effects: [
      {
        name: `Draich Master`,
        desc: `Add 1 to the Attacks characteristic of that model's melee weapon.`,
        when: [COMBAT_PHASE],
      },
      StandardBearerEffect,
      DrummerEffect,
      {
        name: `Severing Strike`,
        desc: `If the unmodified hit roll for an attack made with an Executioner's Draich is 6, that attack inflicts 1 mortal wound on the target and the attack sequence ends (do not make a wound or save roll).`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Anointed`,
    effects: [
      {
        name: `Blessing of the Ur-Phoenix`,
        desc: `This model can attempt to dispel 1 endless spell in your hero phase and attempt to unbind 1 spell in the enemy hero phase.`,
        when: [HERO_PHASE],
      },
      WitnessToDestinyEffect,
      {
        name: `Captain of the Phoenix Guard`,
        desc: `You can use this command ability at the start of the combat phase. If you do so, pick 1 friendly HERO with this command ability. Until the end of that phase, you can reroll wound rolls for attacks made by friendly PHOENIX TEMPLE units while they are wholly within 12" of that HERO.`,
        when: [START_OF_COMBAT_PHASE],
        command_ability: true,
      },
    ],
  },
  {
    name: `Anointed on Flamespyre Phoenix`,
    effects: [
      ...FlamespyrePhoenixEffects,
      WitnessToDestinyEffect,
      {
        name: `Captain of the Phoenix Guard`,
        desc: `You can use this command ability at the start of the combat phase. If you do so, pick 1 friendly FLAMESPYRE PHOENIX that includes an Anointed. Until the end of that phase, you can reroll wound rolls for attacks made by friendly PHOENIX TEMPLE units that are wholly within 12" of that FLAMESPYRE PHOENIX.`,
        when: [START_OF_COMBAT_PHASE],
        command_ability: true,
      },
    ],
  },
  {
    name: `Anointed on Frostheart Phoenix`,
    effects: [
      ...FrostheartPhoenixEffects,
      WitnessToDestinyEffect,
      {
        name: `Captain of the Phoenix Guard`,
        desc: `You can use this command ability at the start of the combat phase. If you do so, pick 1 friendly FROSTHEART PHOENIX that includes an Anointed. Until the end of that phase, you can reroll wound rolls for attacks made by friendly PHOENIX TEMPLE units that are wholly within 12" of that FROSTHEART PHOENIX.`,
        when: [START_OF_COMBAT_PHASE],
        command_ability: true,
      },
    ],
  },
  {
    name: `Flamespyre Phoenix`,
    effects: [...FlamespyrePhoenixEffects],
  },
  {
    name: `Frostheart Phoenix`,
    effects: [...FrostheartPhoenixEffects],
  },
  {
    name: `Phoenix Guard`,
    effects: [
      {
        name: `Keeper of the Flame`,
        desc: `Add 1 to the Attacks characteristic of that model's melee weapon.`,
        when: [COMBAT_PHASE],
      },
      StandardBearerEffect,
      {
        name: `Drummer`,
        desc: `Add 1 to charge rolls for units that include any Drummers.`,
        when: [CHARGE_PHASE],
      },
      {
        name: `Emboldened`,
        desc: `Do not take battleshock tests for this unit while it is wholly within 12" of a friendly PHOENIX TEMPLE HERO.`,
        when: [BATTLESHOCK_PHASE],
      },
      WitnessToDestinyEffect,
    ],
  },
  {
    name: `Dreadlord on Black Dragon`,
    effects: [
      {
        name: `Lance of Spite`,
        desc: `This model's Lance of Spite has a Rend characteristic of -2 instead of -1 and a Damage characteristic of 2 instead of 1 if this model made a charge move in the same turn.`,
        when: [COMBAT_PHASE],
      },
      NoxiousBreathEffect,
      {
        name: `Paired Exile Blades`,
        desc: `You can reroll hit rolls for attacks made with a pair of Exile Blades.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Tyrant Shield`,
        desc: `Add 1 to save rolls for attacks that target this model if it is armed with a Tyrant Shield.`,
        when: [DURING_GAME],
      },
      {
        name: `Do Not Disappoint Me`,
        desc: `Pick 1 friendly HERO that knows this ability. Add 1 to wound rolls for attacks made by friendly ORDER SERPENTIS units that are wholly within 18" of that HERO. A unit cannot benefit from this command ability more than once per phase.`,
        when: [START_OF_COMBAT_PHASE],
        command_ability: true,
      },
    ],
  },
  {
    name: `Drakespawn Knights`,
    effects: [
      {
        name: `Dread Knight`,
        desc: `Add 1 to the Attacks characteristic of that model's melee weapon.`,
        when: [COMBAT_PHASE],
      },
      StandardBearerEffect,
      {
        name: `Hornblower`,
        desc: `Add 1 to charge rolls for units that include any Hornblowers.`,
        when: [CHARGE_PHASE],
      },
      {
        name: `Lance Charge`,
        desc: `This unit's Barbed Lances have a Rend characteristic of -2 instead of -1 and a Damage characteristic of 2 instead of 1 if this unit made a charge move in the same turn.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Drakespawn Chariots`,
    effects: [
      {
        name: `Scythed Runners`,
        desc: `Each time a model from this unit finishes a charge move, you can pick 1 enemy unit within 1" of that model and roll a D6. On a 2+, that enemy unit suffers D3 mortal wounds. If this unit has more than 1 model, roll to determine if mortal wounds are inflicted after each model completes its charge move, but do not allocate the mortal wounds until after all of the models in the unit have moved.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  {
    name: `War Hydra`,
    effects: [
      QuickWithTheLashEffect,
      {
        name: `Sever One Head, Another Takes Its Place`,
        desc: `Heal up to D3 wounds allocated to this model.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  {
    name: `Assassin`,
    effects: [
      {
        name: `Deathshead Poison`,
        desc: `If the unmodified wound roll for an attack made with Poison-coated Blades is 6, that attack inflicts D3 mortal wounds and the attack sequence ends (do not make a save roll).`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Hidden Murderer`,
        desc: `Instead of setting up this model on the battlefield, you can place it to one side and say that it is set up in hiding as a reserve unit. If you do so, at the start of a combat phase, you can set up this model within 1" of a friendly Cities of Sigmar unit that has 5 or more models and a Wounds characteristic of 1. If this model is not set up on the battlefield before the start of the fourth battle round, it is slain.`,
        when: [DURING_SETUP],
      },
    ],
  },
  {
    name: `Dark Riders`,
    effects: [
      {
        name: `Herald`,
        desc: `+1 to hit for that model's missile weapon.`,
        when: [SHOOTING_PHASE],
      },
      StandardBearerEffect,
      {
        name: `Hornblower`,
        desc: `Add 1 to charge rolls for units that include any Hornblowers.`,
        when: [CHARGE_PHASE],
      },
      {
        name: `Sow Terror and Confusion`,
        desc: `Subtract 1 from the Bravery characteristic of enemy units while they are within 12" of any friendly DARK RIDERS.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Murderous Charge`,
        desc: `This unit's Barbed Spears have a Damage characteristic of 2 instead of 1 if this unit made a charge move in the same turn.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Shadow Warriors`,
    effects: [
      {
        name: `Shadow Walker`,
        desc: `+1 to hit for that model's missile weapon.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `One with the Shadows`,
        desc: `Instead of setting up this unit on the battlefield, you can place this unit to one side and say that it is set up in the shadows as a reserve unit.`,
        when: [DURING_SETUP],
      },
      {
        name: `One with the Shadows`,
        desc: `If you have set this unit up as a reserve unit, at the end of your movement phase, you can set up this unit anywhere on the battlefield more than 9" from any enemy units.`,
        when: [END_OF_MOVEMENT_PHASE],
      },
      {
        name: `One with the Shadows`,
        desc: `Any reserve units in the shadows that are not set up on the battlefield before the start of the fourth battle round are destroyed.`,
        when: [TURN_FOUR_START_OF_ROUND],
      },
      {
        name: `Strike Unseen`,
        desc: `Add 1 to hit and wound rolls for attacks made with missile weapons by this unit if this unit is in cover.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Black Ark Fleetmaster`,
    effects: [
      {
        name: `Murderous Swashbuckler`,
        desc: `If the unmodified hit roll for an attack made with a Black Ark Cutlass is 6, that attack scores 2 hits on the target instead of 1. Make a wound and save roll for each hit.`,
        when: [COMBAT_PHASE],
      },
      SeaDragonCloakEffect,
      {
        name: `At Them, You Curs!`,
        desc: `Pick 1 friendly Scourge Privateers unit wholly within 12" of a friendly HERO with this command ability. Add 1 to the Attacks characteristic of that unit's melee weapons until the end of that phase. A unit cannot benefit from this command ability more than once per phase.`,
        when: [START_OF_COMBAT_PHASE],
        command_ability: true,
      },
    ],
  },
  {
    name: `Black Ark Corsairs`,
    effects: [
      {
        name: `Reaver`,
        desc: `+1 to hit for that model's attacks.`,
        when: [SHOOTING_PHASE],
      },
      StandardBearerEffect,
      HornblowerEffect,
      {
        name: `Flashing Steel`,
        desc: `Add 1 to hit rolls for attacks made by this unit if it has 15 or more models.`,
        when: [DURING_GAME],
      },
      SeaDragonCloakEffect,
    ],
  },
  {
    name: `Scourgerunner Chariots`,
    effects: [
      {
        name: `High Beastmaster`,
        desc: `If this unit has 3 or more models, 1 model in this unit can be a High Beastmaster. Add 1 to hit rolls for attacks made with that model's missile weapons.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Lay the Beast Low`,
        desc: `If the unmodified hit roll for an attack made with a Ravager Harpoon is 6, that attack inflicts D3 mortal wounds on the target and the attack sequence ends (do not make a wound or save roll).`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Kharibdyss`,
    effects: [
      {
        name: `Abyssal Howl`,
        desc: `Subtract 1 from the Bravery characteristic of enemy units within 12" of any models with this ability.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Feast of Bones`,
        desc: `At the end of the combat phase, if any enemy models were slain by wounds inflicted by this model's attacks in that combat phase, you can heal D3 wounds allocated to this model.`,
        when: [END_OF_COMBAT_PHASE],
        command_ability: true,
      },
      QuickWithTheLashEffect,
    ],
  },
  {
    name: `Nomad Prince`,
    effects: [
      {
        name: `Harrying Bird of Prey`,
        desc: `In your hero phase, you can pick 1 enemy HERO within 16" of this model. Until your next hero phase, subtract 1 from casting, dispelling and unbinding rolls for that model, and subtract 1 from hit rolls for attacks made by that model.`,
        when: [HERO_PHASE],
      },
      {
        name: `Lord of the Deepwood Host`,
        desc: `Pick 1 friendly HERO with this command ability. Until the end of that phase, add 1 to hit rolls for attacks made by friendly WANDERER units while they are wholly within 12" of that HERO. A unit cannot benefit from this command ability more than once per phase.`,
        when: [START_OF_SHOOTING_PHASE],
        command_ability: true,
      },
    ],
  },
  {
    name: `Eternal Guard`,
    effects: [
      {
        name: `Eternal Warden`,
        desc: `+1 to this model's melee attacks.`,
        when: [COMBAT_PHASE],
      },
      StandardBearerEffect,
      HornblowerEffect,
      {
        name: `Fortress of Boughs`,
        desc: `Add 1 to save rolls for attacks that target this unit if this unit has not made a move in the same turn.`,
        when: [DURING_GAME],
      },
      {
        name: `Form Fortress of Boughs`,
        desc: `Add 1 to hit and wound rolls for attacks made by this unit if this unit has not made a move in the same turn.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Wildwood Rangers`,
    effects: [
      {
        name: `Wildwood Warden`,
        desc: `+1 to this model's melee attacks.`,
        when: [COMBAT_PHASE],
      },
      StandardBearerEffect,
      HornblowerEffect,
      {
        name: `Guardians of the Kindred`,
        desc: `A Ranger's Draich has a Damage characteristic of 2 instead of 1 if the target is a MONSTER.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Wild Riders`,
    effects: [
      {
        name: `Wild Hunter`,
        desc: `+1 to this model's Hunting Spear attacks.`,
        when: [COMBAT_PHASE],
      },
      StandardBearerEffect,
      HornblowerEffect,
      {
        name: `Unbound Fury`,
        desc: `This unit's Hunting Spears have a Rend characteristic of -2 instead of -1 and a Damage characteristic of 2 instead of 1 if this unit made a charge move in the same turn.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Sisters of the Watch`,
    effects: [
      {
        name: `High Sister`,
        desc: `Add 1 to the Attacks characteristic of that model's missile weapon.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Eldritch Arrows`,
        desc: `If the unmodified wound roll for an attack made with a Watch Bow is 6, that attack inflicts 1 mortal wound on the target in addition to any normal damage.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Loose Until the Last`,
        desc: `Once per turn, if an enemy unit ends a charge move within 3" of this unit and there are no other enemy units within 3" of this unit, this unit can shoot.`,
        when: [CHARGE_PHASE],
      },
      {
        name: `Quicksilver Shot`,
        desc: `Add 1 to the Attacks characteristic of this unit's Watch Bows if there are no enemy models within 3" of this unit and this unit has not made a move in the same turn.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Sisters of the Thorn`,
    effects: [
      {
        name: `Handmaiden of the Thorn`,
        desc: `+1 to this model's Deepwood Coven Staff attacks.`,
        when: [COMBAT_PHASE],
      },
      StandardBearerEffect,
      HornblowerEffect,
      {
        name: `Magic`,
        desc: `This unit is a Wizard while it has 2 or more models.`,
        when: [HERO_PHASE],
      },
      {
        name: `Armour of Thorns`,
        desc: `7+ casting value. Pick 1 friendly WANDERERS unit wholly within 18" of the caster that is visible to them. Until that unit moves, that unit is treated as being in cover.In addition, until that unit moves, if the unmodified save roll for an attack made with a melee weapon that targets that unit is 6, the attacking unit suffers 1 mortal wound after all of its attacks have been resolved.`,
        when: [HERO_PHASE],
        spell: true,
      },
    ],
  },
  {
    name: `Cannon`,
    effects: [
      ...DuardinArtilleryEffects,
      {
        name: `Explosive Shells`,
        desc: `You can reroll the damage inflicted by a Cannon Shell if the target unit has 10 or more models.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Rune of Accuracy`,
        desc: `You can reroll failed hit rolls when firing a Cannon Shell if there is an ENGINEER from your army within 1" of the war machine.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Organ Gun`,
    effects: [
      ...DuardinArtilleryEffects,
      {
        name: `Organ Fire`,
        desc: `In the shooting phase the Organ Gun's Crew can load 1, 2, 3 or 4 barrels. If they load 2 or more barrels, roll a D6; if the result is equal to or greater than the number of loaded barrels, make one Barrage of Shots attack for each loaded barrel (roll separately to determine the number of Barrage of Shots attacks made for each barrel being fired). However, if the result is less than the number of loaded barrels, the Organ Gun jams and no shots are fired this phase.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Rune of Forging`,
        desc: `You can reroll the dice rolled to see if an Organ Gun jams if there is an ENGINEER from your army within 1" of the war machine.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
]

// Allied units
export const AlliedUnits: TUnits = [...getStormcastUnits(), ...getKharadronUnits(), ...getSylvanethUnits()]

// Battalions
export const Battalions: TBattalions = [
  {
    name: `Hammerhalian Lancers`,
    effects: [
      {
        name: `Glorious Cavalry Charge`,
        desc: `Add 1 to hit and wound rolls for attacks made with melee weapons by units from this battalion that made a charge move in the same turn and are wholly within 18" of the Freeguild General on Griffon from the same battalion.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Viridian Pathfinders`,
    effects: [
      {
        name: `Masters of Ambush`,
        desc: `Add 1 to charge rolls for friendly units from this battalion if they used the Hunters of the Hidden Paths battle trait to setup on the battlefield in the same turn.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  {
    name: `Greywater Artillery Company`,
    effects: [
      {
        name: `A Greywater Welcome`,
        desc: `In your shooting phase in the first battleround, friendly WARMACHINES from this battalion can shoot twice if they are within 6" of a friendly HERO from this battalion and are not within 3" of any enemy units.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Whitefire Retinue`,
    effects: [
      {
        name: `Triarch Covenant`,
        desc: `Add 1 to casting and unbinding rolls for friendly WIZARDS from this battalion while they are within 6" of another friendly model from the same battalion.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Aetherguard Windrunners`,
    effects: [
      {
        name: `Swift Like the Wind`,
        desc: `Units from this battalion can retreat and still shoot and/or charge later in the same turn.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Charrwind Beasthunters`,
    effects: [
      {
        name: `Beasthunters`,
        desc: `+1 to wound for attacks made by units in this battalion against an enemy MONSTER.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Phoenix Flight`,
    effects: [
      {
        name: `Golden Aura of the Phoenicium`,
        desc: `Heal 1 wound allocated to each friendly PHOENICIUM unit wholly within 12" of any units from this battalion.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  {
    name: `Greywater Shieldband (Greywater Fastness)`,
    effects: [
      {
        name: `Oathsworn Defenders`,
        desc: `Add 1 to hit rolls for attacks made by units from this battalion if they did not move in the same turn and are wholly within 12" of a HERO from the same battalion.`,
        when: [COMBAT_PHASE, SHOOTING_PHASE],
      },
    ],
  },
]
