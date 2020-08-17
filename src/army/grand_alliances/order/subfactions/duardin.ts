import { TUnits } from 'types/army'
import {
  BATTLESHOCK_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  DURING_SETUP,
  HERO_PHASE,
  MOVEMENT_PHASE,
  SHOOTING_PHASE,
} from 'types/phases'

export const APPRENTICE_RUNESMITH = {
  name: `Apprentice Runesmith`,
  effects: [
    {
      name: `Overworked`,
      desc: `Whilst within 5" of a Runelord on Anvil of Doom, this model's Forging Tongs have an Attacks characteristic of 3.`,
      when: [COMBAT_PHASE],
    },
    {
      name: `Enthusiastic Young Assistant`,
      desc: `This model can attempt to unbind one spell in each enemy hero phase as if he were a wizard.`,
      when: [HERO_PHASE],
    },
  ],
}

const HornblowerEffect = {
  name: `Hornblower`,
  desc: `Models in this unit can be Hornblowers. When a unit containing any Hornblowers runs, they can 'Sound the Advance'. If they do so, do not roll a dice to see how far the unit runs; instead, they can move up to an extra 4".`,
  when: [MOVEMENT_PHASE],
}

export const LegacyDuardinUnits: TUnits = [
  {
    name: `Slayers`,
    effects: [
      {
        name: `Giant Slayer`,
        desc: `The leader of this unit is the Giant Slayer. Add 1 to the Attacks characteristic of the Giant Slayer's Slayer Axes.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Icon Bearer`,
        desc: `Models in this unit may be Icon Bearers. Roll a dice if a spell affects a unit with any Icon Bearers. On a roll of a 5+, that spell has no affect on the unit (but it will affect other units normally).`,
        when: [HERO_PHASE],
      },
      HornblowerEffect,
      {
        name: `Seeking a Glorious Death`,
        desc: `If there is an enemy Monster visible to this unit you do not need to take battleshock tests for this unit.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Deathblow`,
        desc: `If a Slayer is slain in the combat phase, roll a dice before it is removed. On a roll of 4+ you can inflict 1 mortal wound on the enemy unit that struck the fatal blow after all of its attacks have been made.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Slayer Oath`,
        desc: `You can add 1 to wound rolls for attacks made with Slayer Axes if the target unit has a Wounds characteristic of 2 or more.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Miners`,
    effects: [
      {
        name: `Prospector`,
        desc: `The leader of this unit is the Prospector. Some Prospectors fight with a Miner's Pickaxe, but some instead wield a Steam Drill in battle. Add 1 to the Attacks characteristic of the Prospector's Miner's Pickaxe.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Mining Cart`,
        desc: `A unit of Miners can have one Mining Cart. A Mining Cart has a Wounds characteristic of 4 instead of 1. It is pulled by a stubborn Mule that will Bite any foe that annoys it - it cannot attack with any other weapons. 
        
        Whilst a unit of Miners includes a Mining Cart they gain the Blasting Charges weapon. Some Mining Carts also carry Steam Harpoons.`,
        when: [DURING_GAME],
      },
      HornblowerEffect,
      {
        name: `Standard Bearer`,
        desc: `Models in this unit may be Standard Bearers. Standard Bearers can carry either a Runic Icon or a Clan Banner.`,
        when: [DURING_SETUP],
      },
      {
        name: `Underground Advance`,
        desc: `Instead of setting up a Miners unit on the battlefield, you may place it to one side and say that it is set up underground.`,
        when: [DURING_SETUP],
      },
      {
        name: `Underground Advance`,
        desc: `In any of your movement phases, the Miners can surface. When they do so, set up the unit on the battlefield more than 9" from any enemy models. This is the unit's move for that movement phase.`,
        when: [MOVEMENT_PHASE],
      },
      {
        name: `Runic Icon`,
        desc: `Roll a dice if a spell affects a unit with any Runic Icons. On a roll of a 5+1 that spell has no affect on the unit (but it will affect other units normally).`,
        when: [HERO_PHASE],
      },
      {
        name: `Clan Banner`,
        desc: `If you fail a battleshock test for a unit that has any Clan Banners, halve the number of models that flee (rounding up).`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Steam Harpoon`,
        desc: `If a unit of Miners includes a Mining Cart with a Steam Harpoon, and the unit did not move in its movement phase (or arrive on the battlefield using the Underground Advance ability), they can ready the Steam Harpoon and use it as a makeshift weapon. If they do so, one Miner within 1" of the Mining Cart can fire the Steam Harpoon in the shooting phase.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
]