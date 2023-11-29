import { tagAs } from 'factions/metatagger'
import { GreatEndrinworks } from './common'
import { TItemDescriptions } from 'factions/factionTypes'

const MountTraits = { ...GreatEndrinworks } satisfies TItemDescriptions

export default tagAs(MountTraits, 'mount_trait')
