import { tagAs } from 'factions/metatagger'
import { MagnificentBattalionEffect, SwiftBattalionEffect } from 'generic_rules/core_battalions'
import { OneDropDeploymentEffect } from 'generic_rules/core_rules'
import { TItemDescriptions } from 'factions/factionTypes'

// Battalions from White Dwarf August 2021
const Battalions = {
  'Bosses of the Stomp': {
    effects: [MagnificentBattalionEffect, OneDropDeploymentEffect],
  },
  Footsloggas: {
    effects: [OneDropDeploymentEffect, SwiftBattalionEffect],
  },
} satisfies TItemDescriptions

export default tagAs(Battalions, 'battalion')
