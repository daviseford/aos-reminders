import StormcastEternals from 'army/stormcast_eternals'
import { TEndlessSpells } from 'types/army'

const getStormcastEndless = () => StormcastEternals.EndlessSpells

const EndlessSpells: TEndlessSpells = [...getStormcastEndless()]

export default EndlessSpells
