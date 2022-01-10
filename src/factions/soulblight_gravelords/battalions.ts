import { tagAs } from 'factions/metatagger'
import {
  MagnificentBattalionEffect,
  SlayersBattalionEffect,
  SwiftBattalionEffect,
} from 'generic_rules/core_battalions'

const SoulblightGravelordsBattalions = {
  "Radukar's Court": {
    effects: [MagnificentBattalionEffect],
  },
  'Fellwing Flock': {
    effects: [SwiftBattalionEffect],
  },
  'Deathstench Drove': {
    effects: [SlayersBattalionEffect],
  },
}

export default tagAs(SoulblightGravelordsBattalions, 'battalion')
