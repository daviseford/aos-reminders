import Abilities from './abilities'
import Allegiances from './allegiances'
import Artifacts from './artifacts'
import EndlessSpells from './endless_spells'
import Scenery from './scenery'
import Spells from './spells'
import Traits from './traits'
import { AlliedUnits, Battalions, Units } from './units'

// Copy paste this directory to kickstart a new army
// Remember to add your army to:
//      - meta/factions.ts
//      - meta/army_list.ts

// Be sure to rename this variable to `[FactionName]Army`
const SampleArmy = {
  Abilities,
  Allegiances,
  AllegianceType: 'Allegiances',
  AlliedUnits,
  Artifacts,
  Battalions,
  EndlessSpells,
  Scenery,
  Spells,
  Traits,
  Units,
}

export default SampleArmy
