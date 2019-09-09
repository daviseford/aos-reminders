import { uniqBy } from 'lodash'
import FleshEaterCourts from 'army/flesh_eater_courts'
import LegionsOfNagash from 'army/legions_of_nagash'
import Nighthaunt from 'army/nighthaunt'
import { TUnits } from 'types/army'

// Unit Names
export const Units: TUnits = uniqBy(
  [...FleshEaterCourts.Units, ...LegionsOfNagash.Units, ...Nighthaunt.Units],
  'name'
)

export default Units

// Available to ALL factions in this Grand Alliance
export const DeathUnits = []
