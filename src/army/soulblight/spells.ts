import { TSpells } from 'types/army'
import LegionsOfNagash from 'army/legions_of_nagash'

const getLegionsOfNagashSpells = () => LegionsOfNagash.Spells

// Importing Spells from LoN
const Spells: TSpells = [...getLegionsOfNagashSpells()]

export default Spells
