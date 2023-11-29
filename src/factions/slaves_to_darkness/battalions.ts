import { TItemDescriptions } from 'factions/factionTypes'
import { tagAs } from 'factions/metatagger'
import { MagnificentBattalionEffect, SlayersBattalionEffect } from 'generic_rules/core_battalions'
import { OneDropDeploymentEffect } from 'generic_rules/core_rules'

const Battalions = {
  'Chaos Warband (Unified)': {
    effects: [OneDropDeploymentEffect],
  },
  'Chaos Warband (Slayers)': {
    effects: [SlayersBattalionEffect],
  },
  'Overlords of Chaos (Magnificent)': {
    effects: [MagnificentBattalionEffect],
  },
  'Overlords of Chaos (Unified)': {
    effects: [OneDropDeploymentEffect],
  },
} satisfies TItemDescriptions

export default tagAs(Battalions, 'battalion')
