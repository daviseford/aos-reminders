import { tagAs } from 'factions/metatagger'
import { BreathOfMorgrimEffect, GreatEndrinworks } from './common'

const MountTraits = { ...GreatEndrinworks, ...BreathOfMorgrimEffect }

export default tagAs(MountTraits, 'mount_trait')
