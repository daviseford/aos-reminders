import { uniqBy } from 'lodash'
import { Battalions, Units } from './units'
import Abilities from './abilities'
import Artifacts from './artifacts'
import Traits from './traits'
import { Battalions as NurgleBattalions, Units as NurgleUnits } from 'army/nurgle/units'

export default {
  Abilities,
  AlliedUnits: [...NurgleUnits],
  Artifacts,
  Battalions: uniqBy([...Battalions, ...NurgleBattalions], 'name'),
  Traits,
  Units,
}
