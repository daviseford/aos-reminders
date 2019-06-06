import { Game, TGameStructure } from 'meta/turn_structure'
import { Units, Battalions } from './units'
import Artifacts from './artifacts'
import { processEffects } from 'utils/processEffects'
import Traits from './traits'

const Beastclaw_Game: TGameStructure = { ...Game }

processEffects(Beastclaw_Game, [Units, Battalions, Artifacts, Traits])

export default Beastclaw_Game
