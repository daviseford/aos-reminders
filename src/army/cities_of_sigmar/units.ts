import { TBattalions, TUnits } from 'types/army'
import { HERO_PHASE, DURING_GAME, COMBAT_PHASE, SHOOTING_PHASE } from 'types/phases'

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
        desc: `f the unmodified hit roll for an attack made with Twin Beaks is 6, that attack scores 2 hits on the target instead of 1. Make a wound and save roll for each hit.`,
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
