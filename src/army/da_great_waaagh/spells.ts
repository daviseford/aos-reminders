import { TSpells } from 'types/army'
import Bonesplitterz from 'army/bonesplitterz'
import Ironjawz from 'army/ironjawz'

const getBonesplitterzSpells = () => Bonesplitterz.Spells
const getIronjawzSpells = () => Ironjawz.Spells

// Spells, Prayers, etc. go here
const Spells: TSpells = [...getBonesplitterzSpells(), ...getIronjawzSpells()]

export default Spells
