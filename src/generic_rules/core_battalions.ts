import rule_sources from 'meta/rule_sources'
import { TEntry } from 'types/data'
import {
  CHARGE_PHASE,
  COMBAT_PHASE,
  END_OF_CHARGE_PHASE,
  END_OF_SETUP,
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
  rule_sources: [rule_sources.CORE_RULES_2021],
}
const MagnificentEffect = {
  name: `Magnificent`,
  desc: `When you pick enhancements for your army (see 27.3), you can pick 1 extra enhancement.`,
  when: [START_OF_SETUP],
  rule_sources: [rule_sources.CORE_RULES_2021],
}
const SlayersEffect = {
  name: `Slayers`,
  desc: `Once per battle, 1 unit from this battalion can receive the All-out Attack or Unleash Hell command without the command being issued and without a command point being spent.`,
  when: [SHOOTING_PHASE, COMBAT_PHASE, CHARGE_PHASE],
  rule_sources: [rule_sources.CORE_RULES_2021],
}
const StrategistsEffect = {
  name: `Strategists`,
  desc: `Once per battle, when you receive command points at the start of your hero phase, you can receive 1 extra command point.`,
  when: [START_OF_HERO_PHASE],
  rule_sources: [rule_sources.CORE_RULES_2021],
}
const SwiftEffect = {
  name: `Swift`,
  desc: `Once per battle, 1 unit from this battalion can receive the At the Double or Forward to Victory command without the command being issued and without a command point being spent.`,
  when: [MOVEMENT_PHASE],
  rule_sources: [rule_sources.CORE_RULES_2021],
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
  {
    name: 'Alpha-Beast Pack',
    effects: [
      {
        name: `Scent Tracking`,
        desc: `After armies have been set up but before the first battle round begins, you can make a normal move of up to D6" with each unit in this battalion.`,
        when: [END_OF_SETUP],
        rule_sources: [rule_sources.GHB_2021],
      },
    ],
  },
  {
    name: 'Hunters of the Heartlands',
    effects: [
      {
        name: `Expert Underdogs`,
        desc: `Units from this battalion cannot be picked when your opponent carries out a monstrous rampage.`,
        when: [END_OF_CHARGE_PHASE],
        rule_sources: [rule_sources.GHB_2021],
      },
    ],
  },
]

export default CoreBattalions
