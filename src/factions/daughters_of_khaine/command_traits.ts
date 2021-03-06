import { tagAs } from 'factions/metatagger'
import {
  BATTLESHOCK_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  END_OF_COMBAT_PHASE,
  END_OF_MOVEMENT_PHASE,
  HERO_PHASE,
  SAVES_PHASE,
  SHOOTING_PHASE,
  START_OF_HERO_PHASE,
  WOUND_ALLOCATION_PHASE,
} from 'types/phases'
const CommandTraits = {
  // Paragons of Murder - Aelf Only
  'Bathed in Blood': {
    effects: [
      {
        name: `Bathed in Blood`,
        desc: `Add 1 to this general's wounds characteristic.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
      {
        name: `Bathed in Blood`,
        desc: `You can heal 1 wound allocated to this general.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'Zealous Orator': {
    effects: [
      {
        name: `Zealous Orator`,
        desc: `Friendly Daughters of Khaine units wholly within 12" of this general add 2 to their bravery characteristic.`,
        when: [DURING_GAME],
      },
    ],
  },
  'Sacrificial Overseer': {
    effects: [
      {
        name: `Sacrificial Overseer`,
        desc: `Add 1 to melee hit rolls for this general.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Terrifying Beauty': {
    effects: [
      {
        name: `Terrifying Beauty`,
        desc: `Subtract 1 from the hit rolls targeting this general.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },
  'Master of Poisons': {
    effects: [
      {
        name: `Master of Poisons`,
        desc: `Add 1 to the damage inflicted by each attack made by this general.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },
  'True Believer': {
    effects: [
      {
        name: `True Believer`,
        desc: `Add 1 to the current battle round when determining active Blood Rites. This effect is cumulative with other similar abilities.`,
        when: [DURING_GAME],
      },
    ],
  },
  // Masters of Blood - Bloodwrack Medusa Only
  'Arcane Mastery': {
    effects: [
      {
        name: `Arcane Mastery`,
        desc: `You can reroll 1 casting, dispelling, or unbinding roll for this general in this phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Writhing Coils': {
    effects: [
      {
        name: `Writhing Coils`,
        desc: `Subtract 1 from hit rolls targeting this general.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },
  'Fearsome Presence': {
    effects: [
      {
        name: `Fearsome Presence`,
        desc: `You can reroll failed battleshock tests for friendly Daughters of Khaine units wholly within 12" of this general.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
  // Morathi's Right Hand - Melusai Ironscale Only
  'Veteran of the Cathtrar Dhule': {
    effects: [
      {
        name: `Veteran of the Cathtrar Dhule`,
        desc: `If this general is on the battlefield, roll a D6. On a 4+ you receive 1 extra command point.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'Impenetrable Scales': {
    effects: [
      {
        name: `Impenetrable Scales`,
        desc: `Add 1 to save rolls for attacks targeting this general.`,
        when: [SAVES_PHASE],
      },
    ],
  },
  'Fuelled by Revenge': {
    effects: [
      {
        name: `Fuelled by Revenge`,
        desc: `Once per battle, you can use Wrath of the Scathborn without spending any command points.`,
        when: [HERO_PHASE],
      },
    ],
  },
  // Hagg Nar Flavor
  'Devoted Disciple': {
    effects: [
      {
        name: `Devoted Disciple`,
        desc: `Fanatical Faith negates wounds on a 5+ instead of 6 while wholly within 12" of this general.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
    ],
  },
  // Draichi Ganeth Flavor
  "Victor of Yaith'ril": {
    effects: [
      {
        name: `Victor of Yaith'ril`,
        desc: `Add 1 to the bravery characteristic of friendly Draichi Ganeth units wholly within 12" of this general.`,
        when: [DURING_GAME],
      },
    ],
  },
  // Kraith Flavor
  'Bathe in Their Blood': {
    effects: [
      {
        name: `Bathe in Their Blood`,
        desc: `If any enemy units were destroyed by friendly Kraith units this phase and this general is on the battlefield, you receive 1 command point.`,
        when: [END_OF_COMBAT_PHASE],
      },
    ],
  },
  // Khailebron Flavor
  'Mistress of Illusion': {
    effects: [
      {
        name: `Mistress of Illusion`,
        desc: `Subtract 1 from melee hit rolls made against this general.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  // Khelt Nar Flavor
  'The Circling Flock': {
    effects: [
      {
        name: `The Circling Flock`,
        desc: `Once per battle, you can add 1, 5-man unit of Khinerai Harpies anywhere on the battlefield more than 9" from enemy units.`,
        when: [END_OF_MOVEMENT_PHASE],
      },
    ],
  },
  // Zainthar Kai Flavor
  'Curse of the Bloody-Handed': {
    effects: [
      {
        name: `Curse of the Bloody-Handed`,
        desc: `Roll a D6 for each enemy unit within 3" of the general. On a 5+ that unit suffers D3 mortal wounds.`,
        when: [END_OF_COMBAT_PHASE],
      },
    ],
  },
}

export default tagAs(CommandTraits, 'command_trait')
