import { TItemDescriptions } from 'factions/factionTypes'
import { tagAs } from 'factions/metatagger'
import { OneDropDeploymentEffect } from 'generic_rules/core_rules'

const Battalions = {
  'Ossiarch Cohort': {
    effects: [OneDropDeploymentEffect],
  },
} satisfies TItemDescriptions

export default tagAs(Battalions, 'battalion')
