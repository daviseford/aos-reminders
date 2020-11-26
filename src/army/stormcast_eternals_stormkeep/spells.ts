import StormcastEternals from 'army/stormcast_eternals'
import { TSpells } from 'types/army'

const getStormcastSpells = () => StormcastEternals.Spells

const Spells: TSpells = [...getStormcastSpells()]

export default Spells
