import { Battalions, Units } from './units'
import Abilities from './abilities'
import Artifacts from './artifacts'
import Traits from './traits'
//import Spells from './spells'
import { Battalions as TamurkhansBattalions, Units as TamurkhansUnits } from 'army/tamurkhans_horde/units'

export default {
  Abilities,
  Artifacts,
  Battalions: Battalions.concat(TamurkhansBattalions),
  Traits,
  Units: Units.concat(TamurkhansUnits),
}
