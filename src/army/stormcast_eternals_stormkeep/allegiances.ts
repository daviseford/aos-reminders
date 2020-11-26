import StormcastEternals from 'army/stormcast_eternals'
import { TAllegiances } from 'types/army'

const getStormcastAllegiances = () => StormcastEternals.Allegiances

// This is where we store sub-allegiances such as
// Grand Courts, Hosts, Clans, Glades, Lodges, etc
const Allegiances: TAllegiances = [...getStormcastAllegiances()]

export default Allegiances
