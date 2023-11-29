import { TItemDescriptions } from 'factions/factionTypes'
import { tagAs } from 'factions/metatagger'
import { MagnificentBattalionEffect, SwiftBattalionEffect } from 'generic_rules/core_battalions'
import { OneDropDeploymentEffect } from 'generic_rules/core_rules'

const Battalions = {
  'Vyperic Guard': {
    effects: [MagnificentBattalionEffect],
  },
  'Shadow Patrol': {
    effects: [OneDropDeploymentEffect, SwiftBattalionEffect],
  },
} satisfies TItemDescriptions

export default tagAs(Battalions, 'battalion')
