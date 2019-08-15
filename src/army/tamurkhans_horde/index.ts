import { Battalions, Units } from './units'
import Abilities from './abilities'
import Allegiances from './allegiances'
import Artifacts from './artifacts'
import EndlessSpells from './endless_spells'
import Scenery from './scenery'
import Spells from './spells'
import Traits from './traits'
import { Battalions as NurgleBattalions, Units as NurgleUnits } from 'army/nurgle/units'

export default {
  Abilities,
  Allegiances,
  Artifacts,
  Battalions: Battalions.concat(NurgleBattalions),
  EndlessSpells,
  Scenery,
  Spells,
  Traits,
  Units: Units.concat(NurgleUnits),
}
