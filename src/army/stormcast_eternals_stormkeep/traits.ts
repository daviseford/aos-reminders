import StormcastEternals from 'army/stormcast_eternals'
import { TEntry } from 'types/data'

const getStormcastTraits = () => StormcastEternals.Traits

const CommandTraits: TEntry[] = [...getStormcastTraits()]

export default CommandTraits
