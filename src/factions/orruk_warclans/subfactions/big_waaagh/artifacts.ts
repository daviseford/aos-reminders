import Bonesplitterz from 'factions/orruk_warclans/subfactions/bonesplitterz'
import Ironjawz from 'factions/orruk_warclans/subfactions/ironjawz'
import { TEntry } from 'types/data'
import { appendTag } from 'utils/armyUtils'

const getBonesplitterzArtifacts = () => Bonesplitterz.Artifacts.map(x => appendTag(x, 'Bonesplitterz'))
const getIronjawzArtifacts = () => Ironjawz.Artifacts.map(x => appendTag(x, 'Ironjawz'))

const Artifacts: TEntry[] = [...getBonesplitterzArtifacts(), ...getIronjawzArtifacts()]

export default Artifacts
