import { uniqBy } from 'lodash'
import BeastsOfChaos from 'army/beasts_of_chaos'
import Everchosen from 'army/everchosen'
import { KhorneUnits } from 'army/khorne/units'
import LegionsOfAzgorh from 'army/legions_of_azgorh'
import { NurgleUnits } from 'army/nurgle/units'
import TamurkhansHorde from 'army/tamurkhans_horde'
import Skaven from 'army/skaven'
import { SlaaneshUnits } from 'army/slaanesh/units'
import SlavesToDarkness from 'army/slaves_to_darkness'
import { TzeentchUnits } from 'army/tzeentch/units'
import { TUnits } from 'types/army'

// Unit Names
export const Units: TUnits = uniqBy(
  [
    ...BeastsOfChaos.Units,
    ...Everchosen.Units,
    ...KhorneUnits,
    ...LegionsOfAzgorh.Units,
    ...NurgleUnits,
    ...TamurkhansHorde.Units,
    ...Skaven.Units,
    ...SlaaneshUnits,
    ...SlavesToDarkness.Units,
    ...TzeentchUnits,
  ],
  'name'
)
