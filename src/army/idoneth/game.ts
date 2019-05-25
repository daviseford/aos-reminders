import { Game, TGameStructure } from 'meta/turn_structure'
import { Units, Battalions } from './units'
import Artifacts from './artifacts'
import Traits from './traits'
import { processEffects } from 'utils/processEffects'

const Idoneth_Game: TGameStructure = { ...Game }

processEffects(Idoneth_Game, [Units, Battalions, Artifacts, Traits])

export default Idoneth_Game
