import {
  BATTLESHOCK_PHASE,
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  MOVEMENT_PHASE,
  SHOOTING_PHASE,
} from 'types/phases'
import { TTriumphs } from 'types/army'

// General triumphs available from GHB 2019
const GenericTriumphs: TTriumphs = [
  {
    name: `Inspired`,
    effects: [
      {
        name: `Inspired`,
        desc: `Once per battle, when selecting a friendly unit to shoot/fight, you may re-roll hit rolls for attacks made by the target until the end of the phase.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Bloodthirsty`,
    effects: [
      {
        name: `Bloodthirsty`,
        desc: `Once per battle, when selecting a friendly unit to shoot/fight, you may re-roll wound rolls for attacks made by the target until the end of the phase.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Indomitable`,
    effects: [
      {
        name: `Indomitable`,
        desc: `Once per battle, before making a save roll for a selected friendly unit, you may re-roll save rolls for attacks made against the target.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Unbowed`,
    effects: [
      {
        name: `Unbowed`,
        desc: `Once per battle, before you take a battleshock test for a selected friendly unit, you may declare the targeted unit will not make a battleshock test.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
  {
    name: `Eager`,
    effects: [
      {
        name: `Eager`,
        desc: `Once per battle, before you make a run or charge roll for selected friendly unit, you may re-roll that run or charge roll for the target.`,
        when: [MOVEMENT_PHASE, CHARGE_PHASE],
      },
    ],
  },
  {
    name: `Cunning`,
    effects: [
      {
        name: `Cunning`,
        desc: `Once per battle, you do not need to spend a command point to use a command ability.`,
        when: [DURING_GAME],
      },
    ],
  },
]

export default GenericTriumphs
