import rule_sources from 'meta/rule_sources'
import { TEntry } from 'types/data'
import { CHARGE_PHASE, DURING_GAME, HERO_PHASE, MOVEMENT_PHASE, START_OF_HERO_PHASE } from 'types/phases'

// General command traits from Core Rules 2021
const GenericCommandTraits: TEntry[] = [
  {
    name: `Battle-lust`,
    effects: [
      {
        name: `Battle-lust`,
        desc: `You can reroll run rolls and charge rolls for this general.`,
        when: [MOVEMENT_PHASE, CHARGE_PHASE],
        rule_sources: [rule_sources.CORE_RULES_2021],
      },
    ],
  },
  {
    name: `Skilled Leader`,
    effects: [
      {
        name: `Skilled Leader`,
        desc: `If this general is on the battlefield at the start of your hero phase, roll a dice. On a 5+, you receive 1 extra command point.`,
        when: [START_OF_HERO_PHASE],
        rule_sources: [rule_sources.CORE_RULES_2021],
      },
    ],
  },
  {
    name: `High Priest`,
    effects: [
      {
        name: `High Priest`,
        desc: `You can reroll chanting rolls for this general.`,
        when: [HERO_PHASE],
        rule_sources: [rule_sources.CORE_RULES_2021],
      },
    ],
  },
  {
    name: `Heroic Stature`,
    effects: [
      {
        name: `Heroic Stature`,
        desc: `Add 1 to this general's Wounds characteristic.`,
        when: [DURING_GAME],
        rule_sources: [rule_sources.CORE_RULES_2021],
      },
    ],
  },
  {
    name: `Master of Magic`,
    effects: [
      {
        name: `Master of Magic`,
        desc: `Once per hero phase, you can reroll 1 casting roll, dispelling roll or unbinding roll for this general.`,
        when: [HERO_PHASE],
        rule_sources: [rule_sources.CORE_RULES_2021],
      },
    ],
  },
]
export default GenericCommandTraits
