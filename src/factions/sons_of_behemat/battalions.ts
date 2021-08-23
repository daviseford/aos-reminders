import { OneDropDeploymentEffect } from 'generic_rules/core_rules'
import meta_rule_sources from 'meta/rule_sources'
import { TEntry } from 'types/data'
import { MOVEMENT_PHASE, START_OF_SETUP } from 'types/phases'

const MagnificentEffect = {
  name: `Magnificent`,
  desc: `When you pick enhancements for your army (see 27.3), you can pick 1 extra enhancement.`,
  when: [START_OF_SETUP],
  rule_sources: [meta_rule_sources.CORE_RULES_2021],
  shared: true,
}
const SwiftEffect = {
  name: `Swift`,
  desc: `Once per battle, 1 unit from this battalion can receive the At the Double or Forward to Victory command without the command being issued and without a command point being spent.`,
  when: [MOVEMENT_PHASE],
  rule_sources: [meta_rule_sources.CORE_RULES_2021],
  shared: true,
}

// Battalions from White Dwarf August 2021
const Battalions: TEntry[] = [
  {
    name: 'Bosses of the Stomp - Unified',
    effects: [OneDropDeploymentEffect],
  },
  {
    name: 'Bosses of the Stomp - Magnificent',
    effects: [MagnificentEffect],
  },
  {
    name: 'Footsloggas - Unified',
    effects: [OneDropDeploymentEffect],
  },
  {
    name: 'Footsloggas - Swift',
    effects: [SwiftEffect],
  },
]

export default Battalions
