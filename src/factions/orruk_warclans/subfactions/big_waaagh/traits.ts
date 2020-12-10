import Bonesplitterz from 'factions/orruk_warclans/subfactions/bonesplitterz'
import Ironjawz from 'factions/orruk_warclans/subfactions/ironjawz'
import { TEntry } from 'types/data'
import { appendTag } from 'utils/armyUtils'

const getBonesplitterzTraits = () => Bonesplitterz.Traits.map(x => appendTag(x, 'Bonesplitterz'))

const getIronjawzTraits = () => Ironjawz.Traits.map(x => appendTag(x, 'Ironjawz'))

const CommandTraits: TEntry[] = [...getBonesplitterzTraits(), ...getIronjawzTraits()]

export default CommandTraits
