import Bonesplitterz from 'army/bonesplitterz'
import Ironjawz from 'army/ironjawz'
import { TCommandTraits } from 'types/army'
import { appendTag } from 'utils/armyUtils'

const getBonesplitterzTraits = () => Bonesplitterz.Traits.map(x => appendTag(x, 'Bonesplitterz'))

const getIronjawzTraits = () => Ironjawz.Traits.map(x => appendTag(x, 'Ironjawz'))

const CommandTraits: TCommandTraits = [...getBonesplitterzTraits(), ...getIronjawzTraits()]

export default CommandTraits
