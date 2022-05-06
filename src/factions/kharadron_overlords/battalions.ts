import { tagAs } from 'factions/metatagger'
import {
  ExpertBattalionEffect,
  SlayersBattalionEffect,
  SwiftBattalionEffect,
} from 'generic_rules/core_battalions'

const KharadronOverlordsBattalions = {
  'Iron Sky Attack Squadron': {
    effects: [ExpertBattalionEffect, SwiftBattalionEffect],
  },
  'Grundstok Escort Wing': {
    effects: [SlayersBattalionEffect],
  },
}

export default tagAs(KharadronOverlordsBattalions, 'battalion')
