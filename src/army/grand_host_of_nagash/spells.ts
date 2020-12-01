import LegionsOfNagash from 'army/legions_of_nagash'
// Importing Spells from LoN
import { TEntry } from 'types/data'

const getLegionsOfNagashSpells = () => LegionsOfNagash.Spells

const Spells: TEntry[] = [...getLegionsOfNagashSpells()]

export default Spells
