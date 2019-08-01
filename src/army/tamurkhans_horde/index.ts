import { Battalions, Units } from './units'
import Abilities from './abilities'
import Artifacts from './artifacts'
import Traits from './traits'
//import Spells from './spells'
import { Battalions as NurgleBattalions, Units as NurgleUnits } from 'army/nurgle/units'

export default {
  Abilities,
  Artifacts,
  Battalions: Battalions.concat(NurgleBattalions),
  Traits,
  Units: Units.concat(NurgleUnits),
}
