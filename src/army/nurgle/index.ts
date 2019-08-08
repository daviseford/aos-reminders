import { Battalions as TamurkhansBattalions, Units as TamurkhansUnits } from 'army/tamurkhans_horde/units'
import { Battalions, Units } from './units'
import Abilities from './abilities'
import Artifacts from './artifacts'
import EndlessSpells from './endless_spells'
import Spells from './spells'
import Traits from './traits'

export default {
  Abilities,
  Artifacts,
  Battalions: Battalions.concat(TamurkhansBattalions),
  EndlessSpells,
  Spells,
  Traits,
  Units: Units.concat(TamurkhansUnits),
}
