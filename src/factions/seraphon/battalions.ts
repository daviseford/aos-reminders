import { tagAs } from 'factions/metatagger'
import { SlayersBattalionEffect, SwiftBattalionEffect } from 'generic_rules/core_battalions'

const Battalions = {
  Thunderquake: {
    effects: [SlayersBattalionEffect, SwiftBattalionEffect],
  },
}

export default tagAs(Battalions, 'battalion')
