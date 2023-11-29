import { TItemDescriptions } from 'factions/factionTypes'
import { tagAs } from 'factions/metatagger'
import {
  ExpertBattalionEffect,
  SlayersBattalionEffect,
  SwiftBattalionEffect,
} from 'generic_rules/core_battalions'

const KharadronOverlordsBattalions = {
  'Attack Squadron': {
    effects: [ExpertBattalionEffect, SwiftBattalionEffect],
  },
  'Escort Wing': {
    effects: [SlayersBattalionEffect],
  },
} satisfies TItemDescriptions

export default tagAs(KharadronOverlordsBattalions, 'battalion')
