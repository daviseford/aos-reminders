import { tagAs } from 'factions/metatagger'
import { OneDropDeploymentEffect } from 'generic_rules/core_rules'

const Battalions = {
  'Ossiarch Cohort': {
    effects: [OneDropDeploymentEffect],
  },
}

export default tagAs(Battalions, 'battalion')
