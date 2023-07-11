import { tagAs } from 'factions/metatagger'
import { MagnificentBattalionEffect, SwiftBattalionEffect } from 'generic_rules/core_battalions'
import { OneDropDeploymentEffect } from 'generic_rules/core_rules'
import rule_sources from './rule_sources'
import meta_rule_sources from 'meta/rule_sources'

// Battalions from White Dwarf August 2021
const Battalions = {
  'Bosses of the Stomp': {
    effects: [
      {
        ...MagnificentBattalionEffect,
        rule_sources: [rule_sources.WHITE_DWARF_AUGUST_2021, meta_rule_sources.BATTLESCROLL_ANDTOR_JULY_2023],
      },
      {
        ...OneDropDeploymentEffect,
        rule_sources: [rule_sources.WHITE_DWARF_AUGUST_2021, meta_rule_sources.BATTLESCROLL_ANDTOR_JULY_2023],
      },
    ],
  },
  Footsloggas: {
    effects: [
      {
        ...OneDropDeploymentEffect,
        rule_sources: [rule_sources.WHITE_DWARF_AUGUST_2021, meta_rule_sources.BATTLESCROLL_ANDTOR_JULY_2023],
      },
      {
        ...SwiftBattalionEffect,
        rule_sources: [rule_sources.WHITE_DWARF_AUGUST_2021, meta_rule_sources.BATTLESCROLL_ANDTOR_JULY_2023],
      },
    ],
  },
}

export default tagAs(Battalions, 'battalion')
