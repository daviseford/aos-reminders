import { TBattalions, TUnits } from 'types/army'
import {
  BATTLESHOCK_PHASE,
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_SETUP,
  MOVEMENT_PHASE,
  SHOOTING_PHASE,
  TURN_ONE_MOVEMENT_PHASE,
} from 'types/phases'

// Unit Names
export const Units: TUnits = [
  {
    name: `Greyfyrd Mercenary Company`,
    effects: [
      {
        name: `Fulfill One's Oaths`,
        desc: `Add 1 to hit rolls for attacks made with melee weapons by FYRESLAYERS MERCENARY units that target enemy units that made a charge move in the same turn. However, from the start of the third battle round, subtract 1 from the Bravery characteristic of friendly FYRESLAYERS MERCENARY units while they are not wholly within 18" of your general.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Tenebrous Court Mercenary Company`,
    effects: [
      {
        name: `Frightful Allies`,
        desc: `Add 1 to hit rolls for attacks made by FLESH-EATER COURTS MERCENARY units that made a charge move in the same turn. However, FLESH-EATER COURTS MERCENARY units cannot make retreat moves.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `The Sons Of The Lichemaster Mercenary Company`,
    effects: [
      {
        name: `Power Of The Lichemaster`,
        desc: `Add 1 to the Attacks characteristic of weapons used by Zombies or Skeleton Warriors units from this mercenary company while they are wholly within 18" of the Necromancer from the same company.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Order Of The Blood-Drenched Rose Mercenary Company`,
    effects: [
      {
        name: `Unreasoning Bloodlust`,
        desc: `Do not take battleshock tests for units from this mercenary company.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
  {
    name: `Grugg Brothers Mercenary Company`,
    effects: [
      {
        name: `Sibling Rivalry`,
        desc: `You can re-roll hit rolls of 1 for attacks made by a unit from this mercenary company that is within 6" of 1 other unit from the same mercenary company. You can instead re-roll all hit rolls for attacks made by a unit from this mercenary company that is within 6" of 2 other units from the same mercenary company.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Nimyard's Rough-Riders Mercenary Company`,
    effects: [
      {
        name: `Eyes And Ears`,
        desc: `Instead of setting up a unit from this mercenary company on the battlefield, you can place it to one side and say that it is scouting as a reserve unit. If you do so, at the end of your first movement phase, you must set up that unit wholly within 6" of the edge of the battlefield and more than 9" from any enemy units. Any number of units from this mercenary company can be set up this way.`,
        when: [DURING_SETUP, TURN_ONE_MOVEMENT_PHASE],
      },
    ],
  },
  {
    name: `The Blacksmoke Battery Mercenary Company`,
    effects: [
      {
        name: `The Spotter`,
        desc: `Add 1 to hit rolls for attacks made by Cannons and Organ Guns from this mercenary company if a Gyrocopter or Gyrobomber from the same mercenary company is within 12" of the target.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Rampagers Mercenary Company`,
    effects: [
      {
        name: `On The Rampage`,
        desc: `After you set up a unit from this mercenary company, you can move it D6.`,
        when: [DURING_SETUP],
      },
    ],
  },
  {
    name: `Skroug's Menagerie Mercenary Company`,
    effects: [
      {
        name: `Lord And Master`,
        desc: `The Chaos Gargant from this mercenary company can use the At the Double, Forward to Victory and Inspiring Presence command abilities from the core rules as if they were a general. However, any command abilities that they use only affect units from the same mercenary company as them.`,
        when: [MOVEMENT_PHASE, CHARGE_PHASE, BATTLESHOCK_PHASE],
      },
    ],
  },
  {
    name: `The Gutstuffers Mercenary Company`,
    effects: [
      {
        name: `Hungry Beyond Reason`,
        desc: `You can re-roll charge rolls for units from this mercenary company. However, if a unit from this mercenary company is within 12" of the enemy at the start of its charge phase, it must attempt to charge, and must make a charge move if it is possible for it to do so.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
]

// Battalions
export const Battalions: TBattalions = []
