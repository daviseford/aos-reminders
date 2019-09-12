import { TTraits } from 'types/army'
import {
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  MOVEMENT_PHASE,
  START_OF_COMBAT_PHASE,
  START_OF_HERO_PHASE,
  START_OF_SHOOTING_PHASE,
} from 'types/phases'

const CommandTraits: TTraits = [
  {
    name: `Grandfather's Blessing`,
    effects: [
      {
        name: `Grandfather's Blessing`,
        desc: `Once per battle, you can move the Cycle of Corruption one stage forward or backward if your general has not been slain.`,
        when: [START_OF_HERO_PHASE],
        command_trait: true,
      },
    ],
  },
  {
    name: `Living Plague`,
    effects: [
      {
        name: `Living Plague`,
        desc: `Roll a D6 for each enemy unit within 1" of your general. On a 4+ the unit being rolled for suffers 1 mortal wound and your receive 1 contagion point.`,
        when: [START_OF_HERO_PHASE],
        command_trait: true,
      },
    ],
  },
  {
    name: `Hulking Physique`,
    effects: [
      {
        name: `Hulking Physique`,
        desc: `Add 1 to the wound rolls for your general in the combat phase.`,
        when: [COMBAT_PHASE],
        command_trait: true,
      },
    ],
  },
  {
    name: `Bloated with Corruption (Rotbringer)`,
    effects: [
      {
        name: `Bloated with Corruption (Rotbringer)`,
        desc: `Roll a D6 each time you allocate a wound to your general in the combat phase (and it is not negated). On a 4+ the attacking unit suffers 1 mortal wound after all its attacks have been made.`,
        when: [COMBAT_PHASE],
        command_trait: true,
      },
    ],
  },
  {
    name: `Avalanche of Rotten Flesh (Rotbringer)`,
    effects: [
      {
        name: `Avalanche of Rotten Flesh (Rotbringer)`,
        desc: `Add 2 to the run and charge rolls for your general.`,
        when: [MOVEMENT_PHASE, CHARGE_PHASE],
        command_trait: true,
      },
    ],
  },
  {
    name: `Resilient (Rotbringer)`,
    effects: [
      {
        name: `Resilient (Rotbringer)`,
        desc: `Roll a D6 each time you allocate a wound or mortal wound to your general. On a 6+ the wound is negated.`,
        when: [DURING_GAME],
        command_trait: true,
      },
    ],
  },
  {
    name: `Tainted Corruptor (Daemon)`,
    effects: [
      {
        name: `Tainted Corruptor (Daemon)`,
        desc: `You can pick one terrain feature that is within 3" of your general. For the rest of the battle that terrain feature has the Sickness Blossoms scenery rule from the Feculent Gnarlmaw warscroll in addition to any other rules it already had.`,
        when: [START_OF_HERO_PHASE],
        command_trait: true,
      },
    ],
  },
  {
    name: `Nurgling Infestation (Daemon)`,
    effects: [
      {
        name: `Nurgling Infestation (Daemon)`,
        desc: `Once per battle, you can inflict D3 mortal wounds on an enemy unit that is within 3" of your general.`,
        when: [START_OF_COMBAT_PHASE],
        command_trait: true,
      },
    ],
  },
  {
    name: `Pestilent Breath (Daemon)`,
    effects: [
      {
        name: `Pestilent Breath (Daemon)`,
        desc: `Pick one enemy unit within 6" of your general. Roll a D6 for each model in that unit that is within 6" of your general. The unit suffers 1 mortal wound for each roll of 5+.`,
        when: [START_OF_SHOOTING_PHASE],
        command_trait: true,
      },
    ],
  },
  {
    name: `Hideous Visage (Mortal)`,
    effects: [
      {
        name: `Hideous Visage (Mortal)`,
        desc: `Subtract 2 from the Bravery characterisic of enemy units while they are within 3" of your general.`,
        when: [DURING_GAME],
        command_trait: true,
      },
    ],
  },
  {
    name: `Overpowering Stench (Mortal)`,
    effects: [
      {
        name: `Overpowering Stench (Mortal)`,
        desc: `Re-roll hit rolls of 6+ for attacks that target your general in the combat phase.`,
        when: [COMBAT_PHASE],
        command_trait: true,
      },
    ],
  },
  {
    name: `Virulent Contagion (Mortal)`,
    effects: [
      {
        name: `Virulent Contagion (Mortal)`,
        desc: `Improve the Rend characterisic by 1 for attacks made by your general in the combat phase.`,
        when: [COMBAT_PHASE],
        command_trait: true,
      },
    ],
  },
]

export default CommandTraits
