import { TItemDescriptions } from 'factions/factionTypes'
import { tagAs } from 'factions/metatagger'
import {
  MagnificentBattalionEffect,
  SlayersBattalionEffect,
  SwiftBattalionEffect,
} from 'generic_rules/core_battalions'

const OgorBattalions = {
  Jorlbad: {
    effects: [SwiftBattalionEffect],
  },
  Eurlbad: {
    effects: [SlayersBattalionEffect],
  },
  Junkmob: {
    effects: [SlayersBattalionEffect],
  },
  Torrbad: {
    effects: [MagnificentBattalionEffect],
  },
} satisfies TItemDescriptions

export default tagAs(OgorBattalions, 'battalion')
