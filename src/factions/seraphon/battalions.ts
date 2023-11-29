import { TItemDescriptions } from 'factions/factionTypes'
import { tagAs } from 'factions/metatagger'
import { SlayersBattalionEffect, SwiftBattalionEffect } from 'generic_rules/core_battalions'

const Battalions = {
  Thunderquake: {
    effects: [SlayersBattalionEffect, SwiftBattalionEffect],
  },
} satisfies TItemDescriptions

export default tagAs(Battalions, 'battalion')
