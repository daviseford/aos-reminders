import { tagAs } from 'factions/metatagger'
import { StrategistsBattalionEffect } from 'generic_rules/core_battalions'

const TzeentchBattalions = {
  'Omniscient Oracles': {
    effects: [StrategistsBattalionEffect],
  },
}

export default tagAs(TzeentchBattalions, 'battalion')
