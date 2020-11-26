import StormcastEternals from 'army/stormcast_eternals'
import { TTraits } from 'types/army'

const getStormcastTraits = () => StormcastEternals.Traits

const CommandTraits: TTraits = [...getStormcastTraits()]

export default CommandTraits
