import { tagAs } from 'factions/metatagger'
import {
  COMBAT_PHASE,
  END_OF_MOVEMENT_PHASE,
  HERO_PHASE,
  MOVEMENT_PHASE,
  START_OF_COMBAT_PHASE,
  START_OF_MOVEMENT_PHASE,
} from 'types/phases'

const CommandAbilities = {
  // Unit command abilities
  'Orgy of Slaughter': {
    effects: [
      {
        name: `Orgy of Slaughter`,
        desc: `Once per turn, you can pick a friendly Daughters of Khaine unit wholly within 12" of this model and within 3" of any enemy unit. That unit can fight.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Worship Through Bloodshed': {
    effects: [
      {
        name: `Worship Through Bloodshed`,
        desc: `If this model is on the battlefield, you can pick 1 other friendly Daughters of Khaine unit wholly within 24". The target can shoot or fight if it is within 3" of enemy units. Cannot be used more than once in the same phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Wrath of the Scathborn': {
    effects: [
      {
        name: `Wrath of the Scathborn`,
        desc: `Once per turn you can pick 1 friendly Melusai unit wholly within 12". Until your next hero phase, the target can run using 2D6 distance and still shoot and/or charge in the same turn.`,
        when: [HERO_PHASE],
      },
      {
        name: `Wrath of the Scathborn`,
        desc: `If active, unit can roll 2D6 when making the run roll. Unit may still shoot and/or charge in subsequent phases this turn.`,
        when: [MOVEMENT_PHASE],
      },
    ],
  },
  // Hagg Nar Flavor
  'Send Forth the Cauldrons': {
    effects: [
      {
        name: `Send Forth the Cauldrons`,
        desc: `Pick 1 friendly Hagg Nar Cauldron of Blood within 3" of any friendly Hagg Nar units with 3 or more models and wholly within 12" of a friendly Hagg Nar hero. Add 3" to the move characteristic of that Cauldron until your next hero phase. The same unit can only benefit once per turn.`,
        when: [START_OF_MOVEMENT_PHASE],
      },
    ],
  },
  // Draichi Ganeth Flavor
  'A Thousand Bladeforms': {
    effects: [
      {
        name: `A Thousand Bladeforms`,
        desc: `Pick 1 friendly Draichi Ganeth Witch Aelves or Sisters of Slaughter unit wholly within 12" of a friendly Draichi Ganeth hero. Add 1 to that unit's melee hit rolls until the end of the phase. A unit can only benefit from this once per turn.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  // Kraith Flavor
  'Inspired by Carnage': {
    effects: [
      {
        name: `Inspired by Carnage`,
        desc: `Pick 1 friendly Kraith Sisters of Slaughter unit wholly within 12" of a friendly Kraith hero. Add 1 to the wound rolls for attacks made in this phase. A unit can only benefit from this once per phase.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  // Khailebron Flavor
  'Masters of the Shadowpaths': {
    effects: [
      {
        name: `Masters of the Shadowpaths`,
        desc: `Pick 1 friendly Khailebron unit wholly within 12" of a friendly Khailebron general. Remove the target and set it up anywhere on the battlefield more than 9" from enemy units. It cannot move in the next movement phase.`,
        when: [END_OF_MOVEMENT_PHASE],
      },
      {
        name: `Masters of the Shadowpaths`,
        desc: `If active, the selected unit from the previous turn cannot move in this phase.`,
        when: [MOVEMENT_PHASE],
      },
    ],
  },
  // Khelt Nar Flavor
  'Bleed the Mind': {
    effects: [
      {
        name: `Bleed the Mind`,
        desc: `Pick 1 friendly Khelt Nar unit wholly within 12" of a friendly Khelt Nar hero. Until your next hero phase, unmodified melee hits rolls of 1 against the buffed unit inflict 1 mortal wound after resolving all attacks.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  // Zainthar Kai Flavor
  'Power in the Blood': {
    effects: [
      {
        name: `Power in the Blood`,
        desc: `Once per phase, you can use this ability when you select a friendly Zainthar Kai Melusai or Khinerai Harpies unit to fight wholly within 12" of a Zainthar Kai hero. Add 1 to the attacks characteristic of melee weapons used by the target.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
}

export default tagAs(CommandAbilities, 'command_ability')
