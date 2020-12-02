import Bonesplitterz from 'army/bonesplitterz'
import Ironjawz from 'army/ironjawz'
// Spells, Prayers, etc. go here
import { TEntry } from 'types/data'
import { appendTag } from 'utils/armyUtils'

const getBonesplitterzSpells = () => Bonesplitterz.Spells.map(x => appendTag(x, 'Bonesplitterz'))
const getIronjawzSpells = () => Ironjawz.Spells.map(x => appendTag(x, 'Ironjawz'))

const Spells: TEntry[] = [...getBonesplitterzSpells(), ...getIronjawzSpells()]

export default Spells
