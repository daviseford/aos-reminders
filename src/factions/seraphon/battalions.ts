import { tagAs } from 'factions/metatagger'
import { SlayersBattalionEffect, SwiftBattalionEffect } from 'generic_rules/core_battalions'

const Battalions = {
  'Thunderquake (Slayers)': {
    effects: [SlayersBattalionEffect],
  },
  'Thunderquake (Swift)': {
    effects: [SwiftBattalionEffect],
  },
}

export default tagAs(Battalions, 'battalion')
