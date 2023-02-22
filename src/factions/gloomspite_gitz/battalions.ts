import { tagAs } from 'factions/metatagger'
import { MagnificentBattalionEffect } from 'generic_rules/core_battalions'

const Battalions = {
  'Troggherd Heavies': {
    effects: [MagnificentBattalionEffect],
  },
}

export default tagAs(Battalions, 'battalion')
