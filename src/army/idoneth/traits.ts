import { TCommandTraits } from 'types/army'
import {
  DURING_GAME,
  COMBAT_PHASE,
  MOVEMENT_PHASE,
  CHARGE_PHASE,
} from 'types/phases'

const CommandTraits: TCommandTraits = [
  {
    name: 'Merciless Raider',
    effects: [
      {
        name: 'Merciless Raider',
        desc: 'You can re-roll run rolls and charge rolls for this general.',
        when: MOVEMENT_PHASE,
      },
      {
        name: 'Merciless Raider',
        desc: 'You can re-roll run rolls and charge rolls for this general.',
        when: CHARGE_PHASE,
      },
    ],
  },
  {
    name: 'Hunter of Souls',
    effects: [
      {
        name: 'Hunter of Souls',
        desc: 'Re-roll wound rolls of 1 for this general.',
        when: COMBAT_PHASE,
      },
    ],
  },
  {
    name: 'Unstoppable Fury',
    effects: [
      {
        name: 'Unstoppable Fury',
        desc: '“Add 2 to the Attacks characteristic of any weapons used by this general in any battle round in which the High Tide ability is in effect.',
        when: COMBAT_PHASE,
      },
    ],
  },
  {
    name: 'Born From Agony',
    effects: [
      {
        name: 'Born From Agony',
        desc: 'Increase this general’s Wounds characteristic by 2.',
        when: DURING_GAME,
      },
    ],
  },
  {
    name: 'Nightmare Legacy',
    effects: [
      {
        name: 'Nightmare Legacy',
        desc: 'Subtract 1 from the Bravery characteristic of enemy units while they are within 12" of this general.',
        when: DURING_GAME,
      },
    ],
  },
  {
    name: 'Lord of Storm and Sea',
    effects: [
      {
        name: 'Lord of Storm and Sea',
        desc: 'Add 2 to the Bravery characteristic of friendly IDONETH DEEPKIN units while they are wholly within 12" of this general.',
        when: DURING_GAME,
      },
    ],
  },
]

export default CommandTraits
