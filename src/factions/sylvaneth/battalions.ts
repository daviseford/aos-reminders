import { TItemDescriptions } from 'factions/factionTypes'
import { tagAs } from 'factions/metatagger'
import { StrategistsBattalionEffect } from 'generic_rules/core_battalions'

const Battalions = {
  'Lords of the Clan': {
    effects: [StrategistsBattalionEffect],
  },
} satisfies TItemDescriptions

export default tagAs(Battalions, 'battalion')
