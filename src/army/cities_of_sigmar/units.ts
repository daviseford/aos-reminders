import { TBattalions, TUnits } from 'types/army'
import {
  HERO_PHASE,
  DURING_GAME,
  START_OF_CHARGE_PHASE,
  CHARGE_PHASE,
  COMBAT_PHASE,
  SHOOTING_PHASE,
  BATTLESHOCK_PHASE,
} from 'types/phases'

// Unit Names
export const Units: TUnits = [
  {
    name: `Battlemage`,
    effects: [
      {
        name: `Magic of the Realms`,
        desc: `When you select this model to be part of your army, you must choose the realm that your Battlemage comes from. Add 1 to casting rolls for thismodel if the battle is taking place in the realm it comes from.`,
        when: [DURING_GAME],
      },
      {
        name: `Magic`,
        desc: `This model knows the spell from its warscroll that includes the name of the realm it comes from.`,
        when: [HERO_PHASE],
      },
      {
        name: `Chain Lightning (Azyr)`,
        desc: `Casting value 6+. Pick 1 visible enemy unit within 18" of the caster. That unit suffers D3 mortal wounds. Then, roll a dice for every other enemy unit within 6" of the original target. On a 4+, that unit suffers D3 mortal wounds.`,
        when: [HERO_PHASE],
        spell: true,
      },
      {
        name: `Fireball (Aqshy)`,
        desc: `Casting value 5+. Pick 1 visible enemy unit within 18" of the caster. If the enemy unit has 1 model, it suffers 1 mortal wound; if it has 2 to 9 models, it suffers D3 mortal wounds; and if it has 10 or more models, it suffers D6 mortal wounds.`,
        when: [HERO_PHASE],
        spell: true,
      },
      {
        name: `Mystifying Miasma (Ulgu)`,
        desc: `Casting value 4+. Pick 1 visible enemy unit within 18" of the caster. That unit cannot run until your next hero phase. In addition, subtract 2 from charge rolls for that unit until your next hero phase.`,
        when: [HERO_PHASE],
        spell: true,
      },
      {
        name: `Pall of Doom (Shyish)`,
        desc: `Casting value 6+. Pick 1 visible enemy unit within 18" of the caster. Subtract 2 from the Bravery characteristic of that unit until your next hero phase.`,
        when: [HERO_PHASE],
        spell: true,
      },
      {
        name: `Pha's Protection (Hysh)`,
        desc: `Casting value 5+. Pick 1 visible friendly unit within 18" of the caster. Subtract 1 from hit rolls for attacks that target that unit until your next hero phase.`,
        when: [HERO_PHASE],
        spell: true,
      },
      {
        name: `Shield of Thorns (Ghyran)`,
        desc: `Casting value 5+. Pick 1 visible friendly unit within 18" of the caster. Until your next hero phase, any enemy unit that finishes a charge move within 3" of that unit suffers D3 mortal wounds.`,
        when: [HERO_PHASE],
        spell: true,
      },
      {
        name: `Transmutation of Lead (Chamon)`,
        desc: `Casting value 7+. Pick 1 visible enemy unit within 18" of the caster. Until your next hero phase, halve the Move characteristic of the unit you picked, rounding up. In addition, if that unit has a Save characteristic of 2+, 3+ or 4+, you can re-roll hit rolls of 1 for attacks that target that unit until your next hero phase.`,
        when: [HERO_PHASE],
        spell: true,
      },
      {
        name: `Wildform (Ghur)`,
        desc: `Casting value 5+. Pick 1 visible friendly unit within 12" of the caster. Add 2 to run and charge rolls for that unit until your next hero phase.`,
        when: [HERO_PHASE],
        spell: true,
      },
    ],
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
        desc: `Casting value 7+. Pick 1 visible point on the battlefield within 18" of the caster. Draw an imaginary straight line 1mm wide between that point and the closest part of the caster's base. Roll a dice for each unit that has models passed across by this line. On a 2+, that unit suffers D3 mortal wounds.`,
        when: [HERO_PHASE],
        spell: true,
      },
      {
        name: `Wildform (Ghur)`,
        desc: `Casting value 5+. Pick 1 visible friendly unit within 12" of the caster. Add 2 to run and charge rolls for that unit until your next hero phase.`,
        when: [HERO_PHASE],
        spell: true,
      },
    ],
  },
  {
    name: `Celestial Hurricanum (with Battlemage)`,
    effects: [
      {
        name: `Celestial Battlemage`,
        desc: `Add 1 to casting rolls for this model if the battle is taking place in Azyr.`,
        when: [HERO_PHASE],
      },
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
      {
        name: `Chain Lightning (Azyr)`,
        desc: `Casting value 6+. Pick 1 visible enemy unit within 18" of the caster. That unit suffers D3 mortal wounds. Then, roll a dice for every other enemy unit within 6" of the original target. On a 4+, that unit suffers D3 mortal wounds.`,
        when: [HERO_PHASE],
        spell: true,
      },
      {
        name: `Comet of Casandora`,
        desc: `Casting value 6+. Pick 1 visible enemy unit within 18" of the caster and roll 2D6. If the roll is less than or equal to that unit's Move characteristic, that unit suffers D3 mortal wounds. If the roll is greater than that unit's Move characteristic, that unit suffers D6 mortal wounds.`,
        when: [HERO_PHASE],
        spell: true,
      },
    ],
  },
  {
    name: `Celestial Hurricanum`,
    effects: [
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
    ],
  },
  {
    name: `Luminark of Hysh (with Battlemage)`,
    effects: [
      {
        name: `Aura of Protection`,
        desc: `Roll a dice each time you allocate a wound or mortal wound to a friendly CITIES OF SIGMAR model within range of any friendly LUMINARKS OF HYSH. On a 6+, that wound or mortal wound is negated. The range of this ability is shown on the damage table.`,
        when: [DURING_GAME],
      },
      {
        name: `Locus of Hysh`,
        desc: `Add 1 to unbinding rolls for friendly COLLEGIATE ARCANE WIZARDS wholly within 12" of any friendly LUMINARKS OF HYSH.`,
        when: [HERO_PHASE],
      },
      {
        name: `Searing Beam of Light`,
        desc: `Pick 1 visible point on the battlefield within range of this ability (see damage table) and draw an imaginary straight line 1mm wide between that point and the closest part of this model's base. Roll a dice for each unit that has models passed across by this line. For each roll that is equal to or greater than the Searing Beam of Light value shown on this model's damage table, that unit suffers D3 mortal wounds.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `White Battlemage`,
        desc: `Add 1 to casting rolls for this model if the battle is taking place in Hysh.`,
        when: [HERO_PHASE],
      },
      {
        name: `Burning Gaze`,
        desc: `Casting value 6+. Pick 1 visible enemy unit within 18" of the caster. That unit suffers D3 mortal wounds. Double the number of wounds inflicted if that unit has 10 or more models, or triple the number of wounds inflicted if that unit has 20 or more models.`,
        when: [HERO_PHASE],
        spell: true,
      },
      {
        name: `Pha's Protection (Hysh)`,
        desc: `Casting value 5+. Pick 1 visible friendly unit within 18" of the caster. Subtract 1 from hit rolls for attacks that target that unit until your next hero phase.`,
        when: [HERO_PHASE],
        spell: true,
      },
    ],
  },
  {
    name: `Luminark of Hysh`,
    effects: [
      {
        name: `Aura of Protection`,
        desc: `Roll a dice each time you allocate a wound or mortal wound to a friendly CITIES OF SIGMAR model within range of any friendly LUMINARKS OF HYSH. On a 6+, that wound or mortal wound is negated. The range of this ability is shown on the damage table.`,
        when: [DURING_GAME],
      },
      {
        name: `Locus of Hysh`,
        desc: `Add 1 to unbinding rolls for friendly COLLEGIATE ARCANE WIZARDS wholly within 12" of any friendly LUMINARKS OF HYSH.`,
        when: [HERO_PHASE],
      },
      {
        name: `Searing Beam of Light`,
        desc: `Pick 1 visible point on the battlefield within range of this ability (see damage table) and draw an imaginary straight line 1mm wide between that point and the closest part of this model's base. Roll a dice for each unit that has models passed across by this line. For each roll that is equal to or greater than the Searing Beam of Light value shown on this model's damage table, that unit suffers D3 mortal wounds.`,
        when: [SHOOTING_PHASE],
      },
    ],
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
        desc: `Each time a model from this unit flees, you can pick 1 enemy unit within 6" of this unit and roll a dice. On a 4+, that enemy unit suffers 1 mortal wound.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
  {
    name: `Freeguild General`,
    effects: [
      {
        name: `Decapitating Swing`,
        desc: `If the unmodified hit roll for an attack made with a Zweihander is 6, that attack inflicts 1 mortal wound on the target in addition to any normal damage.`,
        when: [COMBAT_PHASE],
      },
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
        desc: `+1 save.`,
        when: [DURING_GAME],
      },
      {
        name: `Skilled Rider`,
        desc: `Add 1 to run and charge rolls for this model if it does not carry a Freeguild Shield.`,
        when: [DURING_GAME],
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
      {
        name: `Drummer`,
        desc: `Add 1 to run and charge rolls for units that include any Drummers.`,
        when: [DURING_GAME],
      },
      {
        name: `Standard Bearer`,
        desc: `Add 1 to the Bravery characteristic of units that include any Standard Bearers.`,
        when: [BATTLESHOCK_PHASE],
      },
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
        when: [DURING_GAME],
      },
      {
        name: `Standard Bearer`,
        desc: `Add 1 to the Bravery characteristic of units that include any Standard Bearers.`,
        when: [BATTLESHOCK_PHASE],
      },
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
        when: [DURING_GAME],
      },
      {
        name: `Piper`,
        desc: `Add 1 to run and charge rolls for units that include any Pipers.`,
        when: [DURING_GAME],
      },
      {
        name: `Standard Bearer`,
        desc: `Add 1 to the Bravery characteristic of units that include any Standard Bearers.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Stand and Shoot`,
        desc: `Once per turn, when an enemy unit ends a charge move within 3" of this unit and there are no other enemy units within 3" of this unit, this unit can shoot.`,
        when: [CHARGE_PHASE],
      },
      {
        name: `Steady Aim`,
        desc: `Add 1 to hit rolls for attacks made by this unit if it has 10 or more models, there are no enemy models within 3" of this unit, and this unit has not made a move in the same turn.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Crack Shot`,
        desc: `Enemy HEROES do not benefit from the Look Out, Sir! rule for attacks made with a Long Rifle.`,
        when: [COMBAT_PHASE],
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
      {
        name: `Hornblower`,
        desc: `Add 1 to run and charge rolls for units that include any Hornblowers.`,
        when: [DURING_GAME],
      },
      {
        name: `Standard Bearer`,
        desc: `Add 1 to the Bravery characteristic of units that include any Standard Bearers.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Decapitating Swing`,
        desc: `If the unmodified hit roll for an attack made with a Zweihander is 6, that attack inflicts 1 mortal wound on the target in addition to any normal damage.`,
        when: [COMBAT_PHASE],
      },
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
      {
        name: `Hornblower`,
        desc: `Add 1 to run and charge rolls for units that include any Hornblowers.`,
        when: [DURING_GAME],
      },
      {
        name: `Standard Bearer`,
        desc: `Add 1 to the Bravery characteristic of units that include any Standard Bearers.`,
        when: [BATTLESHOCK_PHASE],
      },
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
      {
        name: `Trumpeter`,
        desc: `Add 1 to run and charge rolls for units that include any Trumpeters.`,
        when: [DURING_GAME],
      },
      {
        name: `Expert Gunners`,
        desc: `Add 1 to the Attacks characteristic of this unit's Repeater Handguns if this unit is not within 3" of any enemy units.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Skilled Riders`,
        desc: `This unit can run and/or retreat and still shoot later in the same turn.`,
        when: [DURING_GAME],
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
      {
        name: `Trumpeter`,
        desc: `Add 1 to run and charge rolls for units that include any Trumpeters.`,
        when: [DURING_GAME],
      },
      {
        name: `Hail of Bullets`,
        desc: `After this unit makes a charge move, it can shoot with any Braces of Pistols it is armed with.`,
        when: [CHARGE_PHASE],
      },
      {
        name: `Reckless Riders`,
        desc: `You can re-roll run and charge rolls for this unit.`,
        when: [DURING_GAME],
      },
    ],
  },
]

// Allied units (usually this will involve writing a function to grab units from another army)
// Check out Nurgle or Khorne for good examples
export const AlliedUnits: TUnits = []

// Battalions
export const Battalions: TBattalions = [
  {
    name: ``,
    effects: [
      {
        name: ``,
        desc: ``,
        when: [HERO_PHASE],
      },
    ],
  },
]
