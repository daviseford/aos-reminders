import { Game, TGameStructure } from 'meta/turn_structure'
import { Units, Battalions } from './units'
import Artifacts from './artifacts'
import { processEffects } from 'utils/processEffects'

const Gloomspite_Game: TGameStructure = { ...Game }

processEffects(Gloomspite_Game, [Units, Battalions, Artifacts])

export default Gloomspite_Game
