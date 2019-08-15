import { Battalions, Units } from './units'
import Abilities from './abilities'
import Allegiances from './allegiances'
import Artifacts from './artifacts'
import EndlessSpells from './endless_spells'
import Scenery from './scenery'
import Spells from './spells'
import Traits from './traits'
import { Battalions as TamurkhansBattalions, Units as TamurkhansUnits } from 'army/tamurkhans_horde/units'

export default {
  Abilities,
  Allegiances,
  Artifacts,
  Battalions: Battalions.concat(TamurkhansBattalions),
  EndlessSpells,
  Scenery,
  Spells,
  Traits,
  Units: Units.concat(TamurkhansUnits),
}
