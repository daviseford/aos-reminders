import { tagAs } from 'factions/metatagger'
import { MagnificentBattalionEffect } from 'generic_rules/core_battalions'
import { OneDropDeploymentEffect } from 'generic_rules/core_rules'

const NurgleBattalions = {
  'Thricefold Befoulment': {
    effects: [MagnificentBattalionEffect],
  },
  'Rotbringer Cyst': {
    effects: [OneDropDeploymentEffect],
  },
}

export default tagAs(NurgleBattalions, 'battalion')
