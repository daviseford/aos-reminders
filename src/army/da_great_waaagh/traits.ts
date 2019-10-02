import { TTraits } from 'types/army'
import Bonesplitterz from 'army/bonesplitterz'
import Ironjawz from 'army/ironjawz'

const getBonsplitterzTraits = () => Bonesplitterz.Traits

const getIronjawzTraits = () => Ironjawz.Traits

const CommandTraits: TTraits = [...getBonsplitterzTraits(), ...getIronjawzTraits()]

export default CommandTraits
