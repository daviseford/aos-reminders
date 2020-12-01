import GenericEffects from 'army/generic/effects'
import { TEntry } from 'types/data'
import {
  BATTLESHOCK_PHASE,
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  DURING_SETUP,
  HERO_PHASE,
  MOVEMENT_PHASE,
  SAVES_PHASE,
  SHOOTING_PHASE,
  TURN_ONE_START_OF_ROUND,
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

export const LegacyDuardinUnits: TEntry[] = [
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
  {
    name: `Grudge Thrower`,
    effects: [
      ...GenericEffects.CrewedWarMachine('Duardin Artillery'),
      {
        name: `Lobbed Shot`,
        desc: `A Grudge Thrower can hurl Grudge Rocks at units that are not visible to it.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Settling a Grudge`,
        desc: `At the start of the first battle round, pick an enemy unit on the battlefield. Reroll failed hit and wound rolls for this Grudge Thrower when it targets that unit.`,
        when: [TURN_ONE_START_OF_ROUND],
      },
      {
        name: `Settling a Grudge`,
        desc: `Reroll failed hit and wound rolls for this Grudge Thrower when it targets the unit you chose at the start of the first battle round.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Rune of Shattering`,
        desc: `Grudge Rocks have a Damage characteristic of 6 instead of 3 if the target unit has 20 or more models.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Duardin Bolt Thrower`,
    effects: [
      ...GenericEffects.CrewedWarMachine('Duardin Artillery'),
      {
        name: `Penetrating Shot`,
        desc: `If a wound roll for a Runic Bolt is 6+, that shot has a Damage characteristic of D6 and a Rend characteristic of -3.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Rune of Skewering`,
        desc: `Add 1 to wound rolls for Runic Bolts if the target unit has 20 or more models.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Warden King on Throne of Power`,
    effects: [
      {
        name: `Ancestral Armour`,
        desc: `Reroll failed save rolls for this model.`,
        when: [SAVES_PHASE],
      },
      {
        name: `Great Book of Grudges`,
        desc: `At the start of the first battle round, pick an enemy unit on the battlefield. Reroll failed wound rolls for this model for attacks made against that enemy unit.`,
        when: [TURN_ONE_START_OF_ROUND],
      },
      {
        name: `Great Book of Grudges`,
        desc: `Reroll failed wound rolls for this model for attacks made against the enemy unit you chose at the start of the first battle round.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Throne of Power`,
        desc: `Once per game, in the charge phase, you may reroll one of the dice when determining this unit's charge distance.`,
        when: [CHARGE_PHASE],
      },
      {
        name: `Throne of Power`,
        desc: `Reroll hit rolls of 1 for this unit.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Thane with Battle Standard`,
    effects: [
      {
        name: `Honour of the Clan`,
        desc: `Reroll failed hit rolls when attacking with this model.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Ancestral Rune Standard`,
        desc: `In your hero phase, you can declare that this model will plant his Runic Standard. If you do, you may not move this model until your next hero phase, but until then he gains the following abilities:

        Defiance of the Ancestors: Reroll failed save rolls for this model.

        Rune of Spellbreaking: Subtract 2 from casting rolls for all enemy Wizards that are within 16" of an Ancestral Rune Standard.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Flame Cannon`,
    effects: [
      ...GenericEffects.CrewedWarMachine('Duardin Artillery'),
      {
        name: `Flame Burst`,
        desc: `When firing a Flame Burst, pick a unit within range to suffer D3 mortal wounds. After firing a Flame Burst, roll a dice; on a 1, 2 or 3, the flames die out and the unit you shot suffers no further damage, but on a 4+ it is set ablaze and suffers another D3 mortal wounds before the flames are extinguished.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Rune of Burning`,
        desc: `A Flame Burst inflicts D6 mortal wounds on the target instead of D3 if the target unit has 20 or more models (it will also inflict an additional D6 mortal wounds instead of D3 if the unit is set ablaze, as described in Flame Burst).`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
]
