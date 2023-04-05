import { tagAs } from 'factions/metatagger'
import { GreatEndrinworks } from './common'

const MountTraits = { ...GreatEndrinworks }

export default tagAs(MountTraits, 'mount_trait')
