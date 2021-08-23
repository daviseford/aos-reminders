import { tagAs } from 'factions/metatagger'
import { MagnificentBattalionEffect, SwiftBattalionEffect } from 'generic_rules/core_battalions'
import { OneDropDeploymentEffect } from 'generic_rules/core_rules'
import rule_sources from './rule_sources'

// Battalions from White Dwarf August 2021
const Battalions = {
  'Bosses of the Stomp - Unified': {
    effects: [{ ...OneDropDeploymentEffect, rule_sources: [rule_sources.WHITE_DWARF_AUGUST_2021] }],
  },
  'Bosses of the Stomp - Magnificent': {
    effects: [{ ...MagnificentBattalionEffect, rule_sources: [rule_sources.WHITE_DWARF_AUGUST_2021] }],
  },
  'Footsloggas - Unified': {
    effects: [{ ...OneDropDeploymentEffect, rule_sources: [rule_sources.WHITE_DWARF_AUGUST_2021] }],
  },
  'Footsloggas - Swift': {
    effects: [{ ...SwiftBattalionEffect, rule_sources: [rule_sources.WHITE_DWARF_AUGUST_2021] }],
  },
}

export default tagAs(Battalions, 'battalion')
