import { tagAs } from 'factions/metatagger'
import { StrategistsBattalionEffect } from 'generic_rules/core_battalions'

const Battalions = {
  'Lords of the Clan': {
    effects: [StrategistsBattalionEffect],
  },
}

export default tagAs(Battalions, 'battalion')
