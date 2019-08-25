import { TArtifacts } from 'types/army'
import {
  BATTLESHOCK_PHASE,
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  END_OF_COMBAT_PHASE,
  HERO_PHASE,
  MOVEMENT_PHASE,
  SHOOTING_PHASE,
  START_OF_COMBAT_PHASE,
  START_OF_HERO_PHASE,
} from 'types/phases'

const Artifacts: TArtifacts = [
  {
    name: `Heart Seeker`,
    effects: [
      {
        name: `Heart Seeker`,
        desc: `You can re-roll wound rolls for attacks made with that weapon.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Collar of Khorne`,
    effects: [
      {
        name: `Collar of Khorne`,
        desc: `The bearer can attempt to unbind one spell in each enemy hero phase in the same manner as a WIZARD.`,
        when: [HERO_PHASE],
      },
      {
        name: `Collar of Khorne`,
        desc: `The bearer can attempt to dispel one endless spell at the start of your hero phase in the same manner as a WIZARD.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  {
    name: `Blood Drinker`,
    effects: [
      {
        name: `Blood Drinker`,
        desc: `At the end of the combat phase, if any attacks made by that weapon caused a wound or mortal wound to be allocated to an enemy unit that was not negated, you can heal up to D3 wounds allocated to the bearer.`,
        when: [END_OF_COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Gorecleaver`,
    effects: [
      {
        name: `Gorecleaver`,
        desc: `Improve the Rend characteristic of that weapon by 1. In addition, if the unmodified wound roll for an attack made with that weapon is 6, double the Damage characteristic for that attack.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `The Crimson Plate`,
    effects: [
      {
        name: `The Crimson Plate`,
        desc: `You can re-roll save rolls of 1 for attacks that target the bearer.`,
        when: [COMBAT_PHASE, SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Blood Rune`,
    effects: [
      {
        name: `Blood Rune`,
        desc: `Each time an attack made by the bearer with a melee weapon slays an enemy HERO or MONSTER, you receive 1 additional Blood Tithe point.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Banner of Rage`,
    effects: [
      {
        name: `Banner of Rage`,
        desc: `You can re-roll hit rolls of 1 for attacks made with melee weapons by friendly KHORNE units that are wholly within 12" of the bearer.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Banner of Wrath`,
    effects: [
      {
        name: `Banner of Wrath`,
        desc: `In the combat phase, roll a D6 for each enemy unit within 8" of the bearer. On a 4+ that unit suffers D3 mortal wounds.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Banner of Blood`,
    effects: [
      {
        name: `Banner of Blood`,
        desc: `You can re-roll charge rolls for friendly KHORNE units that are wholly within 12" of the bearer when the charge roll is made.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  {
    name: `Skull-helm of Khorne`,
    effects: [
      {
        name: `Skull-helm of Khorne`,
        desc: `Subtract 2 from the Bravery characteristic of enemy units while they are within 8" of the bearer.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
  {
    name: `Blood-forged Armour`,
    effects: [
      {
        name: `Blood-forged Armour`,
        desc: `Roll a D6 each time you allocate a mortal wound to the bearer. On a 5+ that mortal wound is negated.`,
        when: [COMBAT_PHASE, SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Brazen Rune`,
    effects: [
      {
        name: `Brazen Rune`,
        desc: `Roll a D6 each time you allocate a wound or mortal wound to the bearer that was inflicted by a spell. On a 2+ that wound or mortal wound is negated.`,
        when: [HERO_PHASE],
      },
      {
        name: `Brazen Rune`,
        desc: `Once per battle, the bearer can attempt to unbind 1 spell in the enemy hero phase in the same manner as a WIZARD or attempt to dispel one endless spell at the start of your hero phase in the same manner as a WIZARD.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  {
    name: `Blade of Endless Bloodshed`,
    effects: [
      {
        name: `Blade of Endless Bloodshed`,
        desc: `Pick 1 of the bearer's melee weapons. Improve the Rend characteristic of that weapon by 1.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Mark of the Destroyer`,
    effects: [
      {
        name: `Mark of the Destroyer`,
        desc: `Pick 1 of the bearer's melee weapons. Add 2 to the Attacks characteristic of that weapon.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Talisman of Burning Blood`,
    effects: [
      {
        name: `Talisman of Burning Blood`,
        desc: `Add 1 to run rolls for friendly KHORNE units wholly within 12" of the bearer when the run roll is made.`,
        when: [MOVEMENT_PHASE],
      },
      {
        name: `Talisman of Burning Blood`,
        desc: `Add 1 to charge rolls for friendly KHORNE units wholly within 12" of the bearer when the charge roll is made.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  {
    name: `A'rgath, the King of Blades`,
    effects: [
      {
        name: `A'rgath, the King of Blades`,
        desc: `Pick 1 of the bearer's melee weapons. Change the To Hit characteristic of that weapon for attacks that target a HERO to 2+.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Deathdealer`,
    effects: [
      {
        name: `Deathdealer`,
        desc: `Pick 1 of the bearer's melee weapons. Improve the Rend characteristic of that weapon by 1.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Khartoth the Bloodhunger`,
    effects: [
      {
        name: `Khartoth the Bloodhunger`,
        desc: `At the start of the combat phase roll a D6. On a 4+ the bearer fights at the start of the combat phase, before the players pick any other units to fight in that combat phase. The bearer cannot fight again in that combat phase unless an ability or spell allows it to fight more than once.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Hellfire Blade`,
    effects: [
      {
        name: `Hellfire Blade`,
        desc: `Pick 1 of the bearer's melee weapons. If the unmodified wound roll for an attack made with that weapon is 6, that attack inflicts 1 mortal wound on the target in addition to any normal damage.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Harvester of Skulls`,
    effects: [
      {
        name: `Harvester of Skulls`,
        desc: `Add 1 to the Attacks characteristic of this weapon.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Behemoth's Bane`,
    effects: [
      {
        name: `Behemoth's Bane`,
        desc: `Pick 1 of the bearer's melee weapons. Once per turn, you can re-roll 1 failed hit roll or 1 failed wound roll for an attack made with that weapon.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `The Crimson Crown`,
    effects: [
      {
        name: `The Crimson Crown`,
        desc: `Once per battle round, the bearer can use a command ability on their warscroll without a command point being spent.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Armour of Scorn`,
    effects: [
      {
        name: `Armour of Scorn`,
        desc: `Roll a D6 each time you allocate a wound or mortal wound to the bearer. Add 2 to the roll if that wound or mortal wound was caused by a spell. On a 6+ that wound or mortal wound is negated.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Mark of the Bloodreaper`,
    effects: [
      {
        name: `Mark of the Bloodreaper`,
        desc: `You can re-roll save rolls of 1 for attacks that target the bearer.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Collar of Khorne`,
    effects: [
      {
        name: `Collar of Khorne`,
        desc: `The bearer can attempt to unbind one spell in the enemy hero phase in the same manner as a WIZARD.`,
        when: [HERO_PHASE],
      },
      {
        name: `Collar of Khorne`,
        desc: `The bearer can attempt to dispel one endless spell at the start of your hero phase in the same manner as a WIZARD.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  {
    name: `Crimson Soulstone`,
    effects: [
      {
        name: `Crimson Soulstone`,
        desc: `Each time an attack made by the bearer with a melee weapon slays an enemy HERO or MONSTER, you can heal up to D3 wounds allocated to the bearer.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Mark of the Slayer`,
    effects: [
      {
        name: `Mark of the Slayer`,
        desc: `You can re-roll hit rolls of 1 for attacks made with melee weapons by friendly KHORNE units wholly within 12" of the bearer.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
]

export default Artifacts
