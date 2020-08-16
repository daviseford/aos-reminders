import Bonesplitterz from 'army/bonesplitterz'
import Ironjawz from 'army/ironjawz'
import { TSpells } from 'types/army'
import { appendTag } from 'utils/armyUtils'

const getBonesplitterzSpells = () => Bonesplitterz.Spells.map(x => appendTag(x, 'Bonesplitterz'))
const getIronjawzSpells = () => Ironjawz.Spells.map(x => appendTag(x, 'Ironjawz'))

// Spells, Prayers, etc. go here
const Spells: TSpells = [...getBonesplitterzSpells(), ...getIronjawzSpells()]

export default Spells
