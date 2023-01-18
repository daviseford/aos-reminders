import { tagAs } from 'factions/metatagger'
import { MagnificentBattalionEffect, SlayersBattalionEffect } from 'generic_rules/core_battalions'
import { OneDropDeploymentEffect } from 'generic_rules/core_rules'

// Battalions from White Dwarf August 2021
const Battalions = {
  'Chaos Warband (Unified)': {
    effects: [{ ...OneDropDeploymentEffect }],
  },
  'Chaos Warband (Slayers)': {
    effects: [{ ...SlayersBattalionEffect }],
  },
  'Overlords of Chaos (Magnificent)': {
    effects: [{ ...MagnificentBattalionEffect }],
  },
  'Overlords of Chaos (Unified)': {
    effects: [{ ...OneDropDeploymentEffect }],
  },
}

export default tagAs(Battalions, 'battalion')
