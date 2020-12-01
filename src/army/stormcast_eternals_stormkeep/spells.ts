import StormcastEternals from 'army/stormcast_eternals'
import { TEntry } from 'types/data'

const getStormcastSpells = () => StormcastEternals.Spells

const Spells: TEntry[] = [...getStormcastSpells()]

export default Spells
