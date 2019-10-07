import { TTraits } from 'types/army'
import Bonesplitterz from 'army/bonesplitterz'
import Ironjawz from 'army/ironjawz'
import { appendTag } from 'utils/armyUtils'

const getBonsplitterzTraits = () => Bonesplitterz.Traits.map(x => appendTag(x, 'Bonesplitterz'))

const getIronjawzTraits = () => Ironjawz.Traits.map(x => appendTag(x, 'Ironjawz'))

const CommandTraits: TTraits = [...getBonsplitterzTraits(), ...getIronjawzTraits()]

export default CommandTraits
