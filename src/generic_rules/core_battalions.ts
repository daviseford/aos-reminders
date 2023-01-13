import meta_rule_sources from 'meta/rule_sources'
import { TEntry } from 'types/data'
import {
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  END_OF_CHARGE_PHASE,
  END_OF_SETUP,
  MOVEMENT_PHASE,
  SHOOTING_PHASE,
  START_OF_HERO_PHASE,
  START_OF_SETUP,
} from 'types/phases'
import { OneDropDeploymentEffect } from './core_rules'

export const ExpertBattalionEffect = {
  name: `Expert`,
  desc: `Once per battle, 1 unit from this battalion can receive the All-out Attack or All-out Defence command without the command being issued and without a command point being spent.`,
  when: [SHOOTING_PHASE, COMBAT_PHASE],
  rule_sources: [meta_rule_sources.CORE_RULES_2021],
  shared: true,
}
export const MagnificentBattalionEffect = {
  name: `Magnificent`,
  desc: `When you pick enhancements for your army (see 27.3), you can pick 1 extra enhancement.`,
  when: [START_OF_SETUP],
  rule_sources: [meta_rule_sources.CORE_RULES_2021],
  shared: true,
}
export const SlayersBattalionEffect = {
  name: `Slayers`,
  desc: `Once per battle, 1 unit from this battalion can receive the All-out Attack or Unleash Hell command without the command being issued and without a command point being spent.`,
  when: [SHOOTING_PHASE, COMBAT_PHASE, CHARGE_PHASE],
  rule_sources: [meta_rule_sources.CORE_RULES_2021],
  shared: true,
}
export const StrategistsBattalionEffect = {
  name: `Strategists`,
  desc: `Once per battle, when you receive command points at the start of your hero phase, you can receive 1 extra command point.`,
  when: [START_OF_HERO_PHASE],
  rule_sources: [meta_rule_sources.CORE_RULES_2021],
  shared: true,
}
export const SwiftBattalionEffect = {
  name: `Swift`,
  desc: `Once per battle, 1 unit from this battalion can receive the At the Double or Forward to Victory command without the command being issued and without a command point being spent.`,
  when: [MOVEMENT_PHASE],
  rule_sources: [meta_rule_sources.CORE_RULES_2021],
  shared: true,
}

// Core battalions from Core Rules 2021
const CoreBattalions: TEntry[] = [
  {
    name: 'Warlord',
    effects: [StrategistsBattalionEffect, MagnificentBattalionEffect],
  },
  {
    name: 'Battle Regiment',
    effects: [OneDropDeploymentEffect],
  },
  {
    name: 'Grand Battery',
    effects: [SlayersBattalionEffect],
  },
  {
    name: 'Vanguard',
    effects: [SwiftBattalionEffect],
  },
  {
    name: 'Linebreaker',
    effects: [ExpertBattalionEffect],
  },
  {
    name: 'Command Entourage',
    effects: [StrategistsBattalionEffect, MagnificentBattalionEffect],
  },
  {
    name: 'Command Entourage - Magnificent',
    effects: [MagnificentBattalionEffect],
  },
  {
    name: 'Command Entourage - Strategists',
    effects: [StrategistsBattalionEffect],
  },

  // GHB 2021 Battalions
  {
    name: 'Alpha-Beast Pack',
    effects: [
      {
        name: `Scent Tracking`,
        desc: `After armies have been set up but before the first battle round begins, you can make a normal move of up to D6" with each unit in this battalion.`,
        when: [END_OF_SETUP],
        rule_sources: [meta_rule_sources.GHB_2021],
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
        rule_sources: [meta_rule_sources.GHB_2021],
      },
    ],
  },

  // GHB 2022 Battalions
  {
    name: 'Expert Conquerors',
    effects: [
      {
        name: `Dominant Force`,
        desc: `GALLETIAN VETERANS units only. Each model in this battalion counts as 3 models for the purposes of contesting objectives.`,
        when: [DURING_GAME],
        rule_sources: [meta_rule_sources.GHB_2022],
      },
    ],
  },
  {
    name: 'Bounty Hunters',
    effects: [
      {
        name: `Headhunters`,
        desc: `If the target of an attack made with a melee weapon by a model in this battalion is a GALLETIAN VETERANS unit, add 1 to the Damage characteristic of that weapon for that attack.`,
        when: [COMBAT_PHASE],
        rule_sources: [meta_rule_sources.GHB_2022],
      },
    ],
  },

  // GHB 2022-23 (Season 2) Battalions
  {
    name: 'Galletian Command',
    effects: [
      {
        name: `United in Purpose`,
        desc: `The Infantry unit in this battalion is the Sworn Bodyguard of the GALLETIAN CHAMPION in this battalion. In the combat phase, when you pick the GALLETIAN CHAMPION in this battalion to fight for the first time in that phase, if the Sworn Bodyguard in this battalion is wholly within 6" of that GALLETIAN CHAMPION and has not yet fought in that phase, the GALLETIAN CHAMPION and the Sworn Bodyguard can fight one after the other in the order of your choice.`,
        when: [COMBAT_PHASE],
        rule_sources: [meta_rule_sources.GHB_2022_2023_SEASON_2],
      },
    ],
  },
  {
    name: 'Galletian Sharpshooters',
    effects: [
      {
        name: `Focus on Your Mark`,
        desc: `Attacks made with missile weapons by units in this battalion are not prevented from targeting enemy GALLETIAN CHAMPIONS that are within 1" of any enemy Battleline units (see 'The Key to Victory', pg 12).`,
        when: [SHOOTING_PHASE],
        rule_sources: [meta_rule_sources.GHB_2022_2023_SEASON_2],
      },
    ],
  },
  {
    name: 'Galletian Veterans',
    effects: [
      {
        name: `The Bonds of Battle`,
        desc: `When a model in this battalion makes an attack with a melee weapon, you can target an enemy unit within 1/2" of another model from the attacking unit instead of using the weapon's Range characteristic for that attack. If you do so, the attacking model must be within 1/2" of another model from its own unit that is within 1/2" of the target.`,
        when: [COMBAT_PHASE],
        rule_sources: [meta_rule_sources.GHB_2022_2023_SEASON_2],
      },
    ],
  },
]

export default CoreBattalions
