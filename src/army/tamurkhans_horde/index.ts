import { Battalions as NurgleBattalions, Units as NurgleUnits } from 'army/nurgle/units'
import { Battalions, Units } from './units'
import Abilities from './abilities'
import Artifacts from './artifacts'
import EndlessSpells from './endless_spells'
import Spells from './spells'
import Traits from './traits'

export default {
  Abilities,
  Artifacts,
  Battalions: Battalions.concat(NurgleBattalions),
  EndlessSpells,
  Spells,
  Traits,
  Units: Units.concat(NurgleUnits),
}
