import { tagAs } from 'factions/metatagger'
import {
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  END_OF_SETUP,
  MOVEMENT_PHASE,
  START_OF_COMBAT_PHASE,
  START_OF_HERO_PHASE,
  START_OF_SHOOTING_PHASE,
  WOUND_ALLOCATION_PHASE,
} from 'types/phases'
const CommandTraits = {
  // Traits shared across Daemons, Rotbringers, and Mortals.
  "Grandfather's Blessing": {
    effects: [
      {
        name: `Grandfather's Blessing`,
        desc: `Once per battle, you can move the Cycle of Corruption one stage forward or backward if your general has not been slain.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'Living Plague': {
    effects: [
      {
        name: `Living Plague`,
        desc: `Roll a D6 for each enemy unit within 1" of your general. On a 4+ the unit being rolled for suffers 1 mortal wound and your receive 1 contagion point.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'Hulking Physique': {
    effects: [
      {
        name: `Hulking Physique`,
        desc: `Add 1 to the wound rolls for your general in the combat phase.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  // Rotbringers Traits
  'Bloated with Corruption': {
    effects: [
      {
        name: `Bloated with Corruption`,
        desc: `Roll a D6 each time you allocate a wound to your general in the combat phase (and it is not negated). On a 4+ the attacking unit suffers 1 mortal wound after all its attacks have been made.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Avalanche of Rotten Flesh': {
    effects: [
      {
        name: `Avalanche of Rotten Flesh`,
        desc: `Add 2 to the run and charge rolls for your general.`,
        when: [MOVEMENT_PHASE, CHARGE_PHASE],
      },
    ],
  },
  Resilient: {
    effects: [
      {
        name: `Resilient`,
        desc: `Roll a D6 each time you allocate a wound or mortal wound to your general. On a 6+ the wound is negated.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
    ],
  },
  // Daemon Traits
  'Tainted Corruptor': {
    effects: [
      {
        name: `Tainted Corruptor`,
        desc: `You can pick one terrain feature that is within 3" of your general. For the rest of the battle that terrain feature has the Sickness Blossoms scenery rule from the Feculent Gnarlmaw warscroll in addition to any other rules it already had.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'Nurgling Infestation': {
    effects: [
      {
        name: `Nurgling Infestation`,
        desc: `Once per battle, you can inflict D3 mortal wounds on an enemy unit that is within 3" of your general.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  'Pestilent Breath': {
    effects: [
      {
        name: `Pestilent Breath`,
        desc: `Pick one enemy unit within 6" of your general. Roll a D6 for each model in that unit that is within 6" of your general. The unit suffers 1 mortal wound for each roll of 5+.`,
        when: [START_OF_SHOOTING_PHASE],
      },
    ],
  },
  // Mortal Traits
  'Hideous Visage': {
    effects: [
      {
        name: `Hideous Visage`,
        desc: `Subtract 2 from the Bravery characterisic of enemy units while they are within 3" of your general.`,
        when: [DURING_GAME],
      },
    ],
  },
  'Overpowering Stench': {
    effects: [
      {
        name: `Overpowering Stench`,
        desc: `Reroll hit rolls of 6+ for attacks that target your general in the combat phase.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Virulent Contagion': {
    effects: [
      {
        name: `Virulent Contagion`,
        desc: `Improve the Rend characterisic by 1 for attacks made by your general in the combat phase.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  // Munificent Wanderers Command Traits
  'One Last Gift': {
    effects: [
      {
        name: `One Last Gift`,
        desc: `Unmodified melee hit rolls of 6 targeting a Munificent Wanderers daemon unit wholly within 12" of this general cause the attacking unit to suffer 1 mortal wound after all its attacks have resolved.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  // Droning Guard Command Traits
  'Rotwing Commander': {
    effects: [
      {
        name: `Rotwing Commander`,
        desc: `After armies have been setup before the first battle round, friendly Droning Guard Plague Drones units can move up to 4".`,
        when: [END_OF_SETUP],
      },
    ],
  },
  // Blessed Sons Command Traits
  'Foul Conqueror': {
    effects: [
      {
        name: `Foul Conqueror`,
        desc: `Once per turn you can use the At the Double command ability on a friendly Blessed Sons Rotbringer unit within 12" of this general without spending any command points.`,
        when: [MOVEMENT_PHASE],
      },
    ],
  },
  // Drowned Men Command Traits
  'Bloated Raider': {
    effects: [
      {
        name: `Bloated Raider`,
        desc: `You can reroll charge rolls for friendly Drowned Men Pusgoyle Blightlords units wholly within 14" of this general.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  // Tamurkhan's Horde Command Traits
  'Unrelenting Conqueror': {
    effects: [
      {
        name: `Unrelenting Conqueror`,
        desc: `Add 1 to run rolls for friendly Tamurkhan's Horde units while they are wholly within 14" of this general.`,
        when: [MOVEMENT_PHASE],
      },
    ],
  },
}

export default tagAs(CommandTraits, 'command_trait')
