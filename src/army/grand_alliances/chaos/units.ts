import { TUnits } from 'types/army'
import BeastsOfChaos from 'army/beasts_of_chaos'
import Everchosen from 'army/everchosen'
import Khorne from 'army/khorne'
import LegionsOfAzgorh from 'army/legions_of_azgorh'
import Nurgle from 'army/nurgle'
import Skaven from 'army/skaven'
import Slaanesh from 'army/slaanesh'
import SlavesToDarkness from 'army/slaves_to_darkness'
import TamurkhansHorde from 'army/tamurkhans_horde'
import Tzeentch from 'army/tzeentch'

// Unit Names
export const Units: TUnits = [
  ...BeastsOfChaos.Units,
  ...Everchosen.Units,
  ...Khorne.Units,
  ...LegionsOfAzgorh.Units,
  ...Nurgle.Units,
  ...Skaven.Units,
  ...Slaanesh.Units,
  ...SlavesToDarkness.Units,
  ...TamurkhansHorde.Units,
  ...Tzeentch.Units,
]
