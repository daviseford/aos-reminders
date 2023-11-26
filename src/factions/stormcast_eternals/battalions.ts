import { tagAs } from 'factions/metatagger'
import { SlayersBattalionEffect, StrategistsBattalionEffect } from 'generic_rules/core_battalions'
import { OneDropDeploymentEffect } from 'generic_rules/core_rules'
import { WARDS_PHASE } from 'types/phases'

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
  'The Blacktalons': {
    effects: [
      {
        name: `Justice Will Be Served`,
        desc: `Friendly THE BLACKTALONS units have a ward of 6+.`,
        when: [WARDS_PHASE],
      },
    ],
  },
}

export default tagAs(Battalions, 'battalion')
