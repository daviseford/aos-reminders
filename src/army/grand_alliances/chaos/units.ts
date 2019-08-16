import { TUnits } from 'types/army'
import BeastsOfChaos from 'army/beasts_of_chaos'
import Everchosen from 'army/everchosen'
import Khorne from 'army/khorne'
import LegionsOfAzgorh from 'army/legions_of_azgorh'
import Nurgle from 'army/nurgle'
import Skaven from 'army/skaven'
import Slaanesh from 'army/slaanesh'
import SlavesToDarkness from 'army/slaves_to_darkness'
import Tzeentch from 'army/tzeentch'
import { getSlavesUnits } from 'army/slaves_to_darkness/units'
import { getEverchosenUnits } from 'army/everchosen/units'

// Grab the list of shared units.  Use this to filter the god aligned armies.
// Note Tamurkhan's Horde excluded since Nurgle includes that entire list already.
const filterList: TUnits = [...getSlavesUnits(), ...getEverchosenUnits()]

// Unit Names
export const Units: TUnits = [
  ...BeastsOfChaos.Units,
  ...Everchosen.Units,
  ...Khorne.Units.filter(units => !filterList.includes(units)),
  ...LegionsOfAzgorh.Units,
  ...Nurgle.Units.filter(units => !filterList.includes(units)),
  ...Skaven.Units,
  ...Slaanesh.Units.filter(units => !filterList.includes(units)),
  ...SlavesToDarkness.Units,
  ...Tzeentch.Units.filter(units => !filterList.includes(units)),
]
