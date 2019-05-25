import { TCommandTraits } from 'types/army'
import {
  DURING_GAME,
  COMBAT_PHASE,
  MOVEMENT_PHASE,
  CHARGE_PHASE,
  TURN_ONE_DURING_ROUND,
  TURN_TWO_DURING_ROUND,
  TURN_THREE_DURING_ROUND,
  TURN_FOUR_DURING_ROUND,
  TURN_FIVE_DURING_ROUND,
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
        desc:
          '“Add 2 to the Attacks characteristic of any weapons used by this general in any battle round in which the High Tide ability is in effect.',
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
        desc:
          'Add 2 to the Bravery characteristic of friendly IDONETH DEEPKIN units while they are wholly within 12" of this general.',
        when: DURING_GAME,
      },
    ],
  },
  {
    name: 'Tides of Death (Normal)',
    effects: [
      {
        name: 'Low Tide',
        desc: 'In this battle round, all units with the Tides of Death battle trait are treated as being in cover.',
        when: TURN_ONE_DURING_ROUND,
      },
      {
        name: 'Flood Tide',
        desc:
          'In this battle round, all units with the Tides of Death battle trait that run can still either shoot or charge in the same turn (but not both).',
        when: TURN_TWO_DURING_ROUND,
      },
      {
        name: 'High Tide',
        desc:
          'In this battle round, units with the Tides of Death battle trait fight before any other units in the combat phase. Fight with all eligible Idoneth Deepkin units one after the other, and then resolve any fights with any other units.',
        when: TURN_THREE_DURING_ROUND,
      },
      {
        name: 'Ebb Tide',
        desc:
          'In this battle round, all units with the Tides of Death battle trait that retreat can still either shoot or charge in the same turn (but not both).',
        when: TURN_FOUR_DURING_ROUND,
      },
      {
        name: 'Low Tide',
        desc:
          'In this battle round, all units with the Tides of Death battle trait that retreat can still either shoot or charge in the same turn (but not both).',
        when: TURN_FIVE_DURING_ROUND,
      },
    ],
  },
  {
    name: 'Tides of Death (Reversed)',
    effects: [
      {
        name: 'Ebb Tide',
        desc:
          'In this battle round, all units with the Tides of Death battle trait that retreat can still either shoot or charge in the same turn (but not both).',
        when: TURN_ONE_DURING_ROUND,
      },
      {
        name: 'High Tide',
        desc:
          'In this battle round, units with the Tides of Death battle trait fight before any other units in the combat phase. Fight with all eligible Idoneth Deepkin units one after the other, and then resolve any fights with any other units.',
        when: TURN_TWO_DURING_ROUND,
      },
      {
        name: 'Flood Tide',
        desc:
          'In this battle round, all units with the Tides of Death battle trait that run can still either shoot or charge in the same turn (but not both).',
        when: TURN_THREE_DURING_ROUND,
      },
      {
        name: 'Low Tide',
        desc: 'In this battle round, all units with the Tides of Death battle trait are treated as being in cover.',
        when: TURN_FOUR_DURING_ROUND,
      },
      {
        name: 'Ebb Tide',
        desc:
          'In this battle round, all units with the Tides of Death battle trait that retreat can still either shoot or charge in the same turn (but not both).',
        when: TURN_FIVE_DURING_ROUND,
      },
    ],
  },
]

export default CommandTraits
