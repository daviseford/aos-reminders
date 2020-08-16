import LegionsOfNagash from 'army/legions_of_nagash'
import { TSpells } from 'types/army'

const getLegionsOfNagashSpells = () => LegionsOfNagash.Spells

// Importing Spells from LoN
const Spells: TSpells = [...getLegionsOfNagashSpells()]

export default Spells
