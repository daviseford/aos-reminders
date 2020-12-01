import StormcastEternals from 'army/stormcast_eternals'
import { TEntry } from 'types/data'

const getStormcastArtifacts = () => StormcastEternals.Artifacts

const Artifacts: TEntry[] = [...getStormcastArtifacts()]

export default Artifacts
