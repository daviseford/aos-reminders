import LegionsOfNagash from 'army/legions_of_nagash'
// Spells, Prayers, etc. go here
import { TEntry } from 'types/data'

const getLegionsOfNagashSpells = () => LegionsOfNagash.Spells

const Spells: TEntry[] = [...getLegionsOfNagashSpells()]

export default Spells
