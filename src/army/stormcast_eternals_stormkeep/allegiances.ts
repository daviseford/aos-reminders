import StormcastEternals from 'army/stormcast_eternals'
// This is where we store sub-allegiances such as
// Grand Courts, Hosts, Clans, Glades, Lodges, etc
import { TEntry } from 'types/data'

const getStormcastAllegiances = () => StormcastEternals.Allegiances

const Allegiances: TEntry[] = [...getStormcastAllegiances()]

export default Allegiances
