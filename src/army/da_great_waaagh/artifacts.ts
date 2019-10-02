import { TArtifacts } from 'types/army'
import Bonesplitterz from 'army/bonesplitterz'
import Ironjawz from 'army/ironjawz'

const getBonesplitterzArtifacts = () => Bonesplitterz.Artifacts
const getIronjawzArtifacts = () => Ironjawz.Artifacts

const Artifacts: TArtifacts = [...getBonesplitterzArtifacts(), ...getIronjawzArtifacts()]

export default Artifacts
