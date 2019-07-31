import { Battalions, Units } from './units'
import Abilities from './abilities'
import Artifacts from './artifacts'
import Spells from './spells'
import Traits from './traits'
import { Battalions as TamurkhansBattalions, Units as TamurkhansUnits } from 'army/tamurkhans_horde/units'

export default {
  Abilities,
  Artifacts,
  Battalions: Battalions.concat(TamurkhansBattalions),
  Spells,
  Traits,
  Units: Units.concat(TamurkhansUnits),
}
