import StormcastEternals from 'army/stormcast_eternals'
import { TArtifacts } from 'types/army'

const getStormcastArtifacts = () => StormcastEternals.Artifacts

const Artifacts: TArtifacts = [...getStormcastArtifacts()]

export default Artifacts
