import { TItemDescriptions } from 'factions/factionTypes'
import { tagAs } from 'factions/metatagger'
import { MagnificentBattalionEffect } from 'generic_rules/core_battalions'
import { OneDropDeploymentEffect } from 'generic_rules/core_rules'

const Battalions = {
  Gorechosen: {
    effects: [OneDropDeploymentEffect, MagnificentBattalionEffect],
  },
} satisfies TItemDescriptions

export default tagAs(Battalions, 'battalion')
