import meta_rule_sources from 'meta/rule_sources'
import { TEntry } from 'types/data'
import {
  CHARGE_PHASE,
  COMBAT_PHASE,
  MOVEMENT_PHASE,
  SHOOTING_PHASE,
  START_OF_BATTLESHOCK_PHASE,
  START_OF_HERO_PHASE,
} from 'types/phases'

// General command abilities from Core Rules 2021
const GenericCommandAbilities: TEntry[] = [
  {
    name: `Rally`,
    effects: [
      {
        name: `Rally`,
        desc: `You can use this command ability at the start of the hero phase. The unit that receives the command must be more than 3" from all enemy units. Roll 1 dice for each slain model from that unit. For each 6, you can return 1 slain model to that unit. 'You can only return models to that unit that have a combined Wounds characteristic of 10 or less. For example, if the unit that received the command has a Wounds characteristic of 2, you can return a maximum of 5 models to that unit.`,
        when: [START_OF_HERO_PHASE],
        rule_sources: [
          meta_rule_sources.CORE_RULES_2021,
          meta_rule_sources.BATTLESCROLL_DEPLETED_RESERVES_APRIL_2023,
        ],
      },
    ],
  },

  {
    name: 'At The Double',
    effects: [
      {
        name: `At The Double`,
        desc: `You can use this command ability after you declare that a friendly unit will run. That unit must receive the command. The run roll is not made for that unit. Instead, 6" is added to that unit's Move characteristic in that phase. The unit is still considered to have run.`,
        when: [MOVEMENT_PHASE],
        rule_sources: [meta_rule_sources.CORE_RULES_2021],
      },
    ],
  },

  {
    name: 'Redeploy',
    effects: [
      {
        name: `Redeploy`,
        desc: `You can use this command ability in the enemy movement phase after an enemy unit finishes a normal move, run or retreat. The unit that receives the command must be within 9" of that enemy unit and more than 3" from all enemy units. You can make a D6" move with the unit that receives the command, but it must finish the move more than 3" from all enemy units and cannot shoot later in the turn.`,
        when: [MOVEMENT_PHASE],
        rule_sources: [meta_rule_sources.CORE_RULES_2021],
      },
    ],
  },

  {
    name: 'Forward To Victory',
    effects: [
      {
        name: `Forward To Victory`,
        desc: `You can use this command ability after you make a charge roll for a friendly unit. That unit must receive the command. You can reroll the charge roll for that unit.`,
        when: [CHARGE_PHASE],
        rule_sources: [meta_rule_sources.CORE_RULES_2021],
      },
    ],
  },

  {
    name: 'Unleash Hell',
    effects: [
      {
        name: `Unleash Hell`,
        desc: `You can use this command ability after an enemy unit finishes a charge move. The unit that receives the command must be within 6" of that enemy unit and more than 3" from all other enemy units. Models in the unit that receives the command that are within 6" of the target unit can shoot in that phase, but when they do so, you must subtract 1 from hit rolls for their attacks and they can only target the unit that made the charge move.`,
        when: [CHARGE_PHASE],
        rule_sources: [meta_rule_sources.CORE_RULES_2021, meta_rule_sources.ERRATA_CORE_RULES_DECEMBER_2021],
      },
    ],
  },

  {
    name: 'All-out Attack',
    effects: [
      {
        name: `All-out Attack`,
        desc: `You can use this command ability when you pick a friendly unit to shoot in your shooting phase or fight in the combat phase. That unit must receive the command. Add 1 to hit rolls for attacks made by that unit until the end of that phase.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
        rule_sources: [meta_rule_sources.CORE_RULES_2021],
      },
    ],
  },
  {
    name: 'All-out Defence',
    effects: [
      {
        name: `All-out Defence`,
        desc: `You can use this command ability when a friendly unit is picked as the target of an attack in the shooting or combat phase. That unit must receive the command. Add 1 to save rolls for attacks that target that unit until the end of that phase.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
        rule_sources: [meta_rule_sources.CORE_RULES_2021],
      },
    ],
  },
  {
    name: 'Inspiring Presence',
    effects: [
      {
        name: `Inspiring Presence`,
        desc: `You can use this command ability at the start of the battleshock phase. The unit that receives the command does not have to take battleshock tests in that phase.`,
        when: [START_OF_BATTLESHOCK_PHASE],
        rule_sources: [meta_rule_sources.CORE_RULES_2021],
      },
    ],
  },
]
export default GenericCommandAbilities
