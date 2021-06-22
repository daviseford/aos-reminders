import { TEntry } from 'types/data'
import {
  CHARGE_PHASE,
  COMBAT_PHASE,
  MOVEMENT_PHASE,
  SHOOTING_PHASE,
  START_OF_HERO_PHASE,
  START_OF_SETUP,
} from 'types/phases'
import { OneDropDeploymentEffect } from './core_rules'

const ExpertEffect = {
  name: `Expert`,
  desc: `Once per battle, 1 unit from this battalion can receive the All-out Attack or All-out Defence command without the command being issued and without a command point being spent.`,
  when: [SHOOTING_PHASE, COMBAT_PHASE],
}
const MagnificentEffect = {
  name: `Magnificent`,
  desc: `When you pick enhancements for your army (see 27.3), you can pick 1 extra enhancement.`,
  when: [START_OF_SETUP],
}
const SlayersEffect = {
  name: `Slayers`,
  desc: `Once per battle, 1 unit from this battalion can receive the All-out Attack or Unleash Hell command without the command being issued and without a command point being spent.`,
  when: [SHOOTING_PHASE, COMBAT_PHASE, CHARGE_PHASE],
}
const StrategistsEffect = {
  name: `Strategists`,
  desc: `Once per battle, when you receive command points at the start of your hero phase, you can receive 1 extra command point.`,
  when: [START_OF_HERO_PHASE],
}
const SwiftEffect = {
  name: `Swift`,
  desc: `Once per battle, 1 unit from this battalion can receive the At the Double or Forward to Victory command without the command being issued and without a command point being spent.`,
  when: [MOVEMENT_PHASE],
}

// Core battalions from Core Rules 2021
const CoreBattalions: TEntry[] = [
  {
    name: 'Warlord',
    effects: [StrategistsEffect, MagnificentEffect],
  },

  {
    name: 'Battle Regiment',
    effects: [OneDropDeploymentEffect],
  },
  {
    name: 'Grand Battery',
    effects: [SlayersEffect],
  },
  {
    name: 'Vanguard',
    effects: [SwiftEffect],
  },
  {
    name: 'Linebreaker',
    effects: [ExpertEffect],
  },
  {
    name: 'Command Entourage',
    effects: [],
  },
]

export default CoreBattalions
