import { tagAs } from 'factions/metatagger'
import {
  COMBAT_PHASE,
  END_OF_COMBAT_PHASE,
  HERO_PHASE,
  START_OF_COMBAT_PHASE,
  START_OF_HERO_PHASE,
  START_OF_ROUND,
} from 'types/phases'

const CommandTraits = {
  'Bathed in Blood': {
    effects: [
      {
        name: `Bathed in Blood`,
        desc: `In the combat phase, each time an enemy model is slain by wounds caused by this general's attacks, you can heal 1 wound allocated to this general.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Zealous Orator': {
    effects: [
      {
        name: `Zealous Orator`,
        desc: `If this general issues the Rally command, you can return 1 slain model to the unit that receives the command for each 4+ instead of each 6.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'Sacrificial Overseer': {
    effects: [
      {
        name: `Sacrificial Overseer`,
        desc: `After this general has fought for the first time in the combat phase, if any enemy models were slain by wounds caused by this general's attacks in that phase, this general is said to be revelling in murder until the end of the phase. If this general is revelling in murder, they can fight for a second time in that phase. The strike-last effect applies to this general when they fight for that second time.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  // 'Terrifying Beauty': {
  //   effects: [
  //     {
  //       name: `Terrifying Beauty`,
  //       desc: `Subtract 1 from the hit rolls targeting this general.`,
  //       when: [SHOOTING_PHASE, COMBAT_PHASE],
  //     },
  //   ],
  // },
  'Master of Poisons': {
    effects: [
      {
        name: `Master of Poisons`,
        desc: `At the end of the combat phase, if any wounds caused by this general's attacks were allocated to any models on the battlefield in that phase, pick 1 of those models. That model suffers D6 mortal wounds.`,
        when: [END_OF_COMBAT_PHASE],
      },
    ],
  },
  'True Believer': {
    effects: [
      {
        name: `True Believer`,
        desc: `Add 1 to the number of the current battle round when determining the abilities gained by this general from the Blood Rites battle trait (pg 66). This ability and other similar abilities are cumulative.`,
        when: [START_OF_ROUND],
      },
    ],
  },
  'Arcane Mastery': {
    effects: [
      {
        name: `Arcane Mastery`,
        desc: `WIZARD only. This general knows all of the spells from the Lore of Shadows (pg 70) in addition to the other spells it knows.`,
        when: [HERO_PHASE],
      },
    ],
  },
  // 'Writhing Coils': {
  //   effects: [
  //     {
  //       name: `Writhing Coils`,
  //       desc: `Subtract 1 from hit rolls targeting this general.`,
  //       when: [SHOOTING_PHASE, COMBAT_PHASE],
  //     },
  //   ],
  // },
  // 'Fearsome Presence': {
  //   effects: [
  //     {
  //       name: `Fearsome Presence`,
  //       desc: `You can reroll failed battleshock tests for friendly Daughters of Khaine units wholly within 12" of this general.`,
  //       when: [BATTLESHOCK_PHASE],
  //     },
  //   ],
  // },
  // 'Veteran of the Cathtrar Dhule': {
  //   effects: [
  //     {
  //       name: `Veteran of the Cathtrar Dhule`,
  //       desc: `If this general is on the battlefield, roll a D6. On a 4+ you receive 1 extra command point.`,
  //       when: [START_OF_HERO_PHASE],
  //     },
  //   ],
  // },
  // 'Impenetrable Scales': {
  //   effects: [
  //     {
  //       name: `Impenetrable Scales`,
  //       desc: `Add 1 to save rolls for attacks targeting this general.`,
  //       when: [SAVES_PHASE],
  //     },
  //   ],
  // },
  'Fuelled by Revenge': {
    effects: [
      {
        name: `Fuelled by Revenge`,
        desc: `MELUSAI IRONSCALE only. Once per battle, at the start of the combat phase, you can say that this general will wreak Khaine's vengeance. If you do so, until the end of that phase, add 1 to the Attacks characteristic of melee weapons used by friendly MELUSAI units wholly within 12" of this general.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  // // Hagg Nar Flavor
  // 'Devoted Disciple': {
  //   effects: [
  //     {
  //       name: `Devoted Disciple`,
  //       desc: `Fanatical Faith negates wounds on a 5+ instead of 6 while wholly within 12" of this general.`,
  //       when: [WOUND_ALLOCATION_PHASE],
  //     },
  //   ],
  // },
  // // Draichi Ganeth Flavor
  // "Victor of Yaith'ril": {
  //   effects: [
  //     {
  //       name: `Victor of Yaith'ril`,
  //       desc: `Add 1 to the bravery characteristic of friendly Draichi Ganeth units wholly within 12" of this general.`,
  //       when: [DURING_GAME],
  //     },
  //   ],
  // },
  // // Kraith Flavor
  // 'Bathe in Their Blood': {
  //   effects: [
  //     {
  //       name: `Bathe in Their Blood`,
  //       desc: `If any enemy units were destroyed by friendly Kraith units this phase and this general is on the battlefield, you receive 1 command point.`,
  //       when: [END_OF_COMBAT_PHASE],
  //     },
  //   ],
  // },
  // // Khailebron Flavor
  // 'Mistress of Illusion': {
  //   effects: [
  //     {
  //       name: `Mistress of Illusion`,
  //       desc: `Subtract 1 from melee hit rolls made against this general.`,
  //       when: [COMBAT_PHASE],
  //     },
  //   ],
  // },
  // // Khelt Nar Flavor
  // 'The Circling Flock': {
  //   effects: [
  //     {
  //       name: `The Circling Flock`,
  //       desc: `Once per battle, you can add 1, 5-man unit of Khinerai Harpies anywhere on the battlefield more than 9" from enemy units.`,
  //       when: [END_OF_MOVEMENT_PHASE],
  //     },
  //   ],
  // },
  // // Zainthar Kai Flavor
  // 'Curse of the Bloody-Handed': {
  //   effects: [
  //     {
  //       name: `Curse of the Bloody-Handed`,
  //       desc: `Roll a D6 for each enemy unit within 3" of the general. On a 5+ that unit suffers D3 mortal wounds.`,
  //       when: [END_OF_COMBAT_PHASE],
  //     },
  //   ],
  // },
}

export default tagAs(CommandTraits, 'command_trait')
