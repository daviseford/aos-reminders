import { tagAs } from 'factions/metatagger'
import { GreatEndrinworks } from './common'

// Store Mount Traits here. You can add them to units, abilties, flavors, and subfactions later.
const MountTraits = { ...GreatEndrinworks }

// Always export using tagAs
export default tagAs(MountTraits, 'mount_trait')
