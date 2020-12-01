import StormcastEternals from 'army/stormcast_eternals'
import { TEntry } from 'types/data'

const getStormcastEndless = () => StormcastEternals.EndlessSpells

const EndlessSpells: TEntry[] = [...getStormcastEndless()]

export default EndlessSpells
