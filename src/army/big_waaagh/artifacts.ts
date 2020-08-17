import Bonesplitterz from 'army/bonesplitterz'
import Ironjawz from 'army/ironjawz'
import { TArtifacts } from 'types/army'
import { appendTag } from 'utils/armyUtils'

const getBonesplitterzArtifacts = () => Bonesplitterz.Artifacts.map(x => appendTag(x, 'Bonesplitterz'))
const getIronjawzArtifacts = () => Ironjawz.Artifacts.map(x => appendTag(x, 'Ironjawz'))

const Artifacts: TArtifacts = [...getBonesplitterzArtifacts(), ...getIronjawzArtifacts()]

export default Artifacts
