import { tagAs } from 'factions/metatagger'
import { SlayersBattalionEffect, StrategistsBattalionEffect } from 'generic_rules/core_battalions'
import { OneDropDeploymentEffect } from 'generic_rules/core_rules'

const Battalions = {
  'Redemption Brotherhood': {
    effects: [OneDropDeploymentEffect],
  },
  'Brotherhood Command': {
    effects: [StrategistsBattalionEffect],
  },
  'Soulstrike Brotherhood': {
    effects: [SlayersBattalionEffect],
  },
}

export default tagAs(Battalions, 'battalion')
