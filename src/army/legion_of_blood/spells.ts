import LegionsOfNagash from 'army/legions_of_nagash'
import { TSpells } from 'types/army'

const getLegionsOfNagashSpells = () => LegionsOfNagash.Spells

// Spells, Prayers, etc. go here
const Spells: TSpells = [...getLegionsOfNagashSpells()]

export default Spells
