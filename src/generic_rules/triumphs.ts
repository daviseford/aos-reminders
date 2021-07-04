import meta_rule_sources from 'meta/rule_sources'
import { TEntry } from 'types/data'
import { BATTLESHOCK_PHASE, CHARGE_PHASE, COMBAT_PHASE, SHOOTING_PHASE } from 'types/phases'

// General triumphs available from Core Rules 2021
const GenericTriumphs: TEntry[] = [
  {
    name: `Inspired`,
    effects: [
      {
        name: `Inspired`,
        desc: `Once per battle, after you pick a friendly unit to shoot or fight, you can say that it is inspired. If you do so, add 1 to wound rolls for attacks made by that unit until the end of that phase.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
        rule_sources: [meta_rule_sources.CORE_RULES_2021],
      },
    ],
  },
  {
    name: `Bloodthirsty`,
    effects: [
      {
        name: `Bloodthirsty`,
        desc: `Once per battle, after you make a charge roll for a friendly unit, you can say that it is bloodthirsty. If you do so, you can reroll that charge roll.`,
        when: [CHARGE_PHASE],
        rule_sources: [meta_rule_sources.CORE_RULES_2021],
      },
    ],
  },
  {
    name: `Indomitable`,
    effects: [
      {
        name: `Indomitable`,
        desc: `Once per battle, after you take a battleshock test for a friendly unit, you can say it is indomitable. If you do so, no models from that unit will flee in that battleshock phase.`,
        when: [BATTLESHOCK_PHASE],
        rule_sources: [meta_rule_sources.CORE_RULES_2021],
      },
    ],
  },
]

export default GenericTriumphs
