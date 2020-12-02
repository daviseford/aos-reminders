import { Battalions as NurgleBattalions, Units as NurgleUnits } from 'army/nurgle/units'
import { uniqBy } from 'lodash'
import Artifacts from './artifacts'
import BattleTraits from './battle_traits'
import Traits from './traits'
import { Battalions, Units } from './units'
const TamurkhansHordeArmy = {
  BattleTraits,
  AlliedUnits: [...NurgleUnits],
  Artifacts,
  Battalions: uniqBy([...Battalions, ...NurgleBattalions], 'name'),
  Traits,
  Units,
}

export default TamurkhansHordeArmy
