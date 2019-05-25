import { Game, TGameStructure } from 'meta/turn_structure'
import { Units, Battalions } from './units'
import Artifacts from './artifacts'
import { processEffects } from 'utils/processEffects'
import Traits from './traits'

const Sylvaneth_Game: TGameStructure = { ...Game }

processEffects(Sylvaneth_Game, [Units, Battalions, Artifacts, Traits])

export default Sylvaneth_Game
