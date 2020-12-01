import StormcastEternals from 'army/stormcast_eternals'
import { TCommandTraits } from 'types/army'

const getStormcastTraits = () => StormcastEternals.Traits

const CommandTraits: TCommandTraits = [...getStormcastTraits()]

export default CommandTraits
