import { TTraits } from 'types/army'
import Bonesplitterz from 'army/bonesplitterz'
import Ironjawz from 'army/ironjawz'
import { appendTag } from 'utils/armyUtils'

const getBonesplitterzTraits = () => Bonesplitterz.Traits.map(x => appendTag(x, 'Bonesplitterz'))

const getIronjawzTraits = () => Ironjawz.Traits.map(x => appendTag(x, 'Ironjawz'))

const CommandTraits: TTraits = [...getBonesplitterzTraits(), ...getIronjawzTraits()]

export default CommandTraits
