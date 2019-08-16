import { TUnits } from 'types/army'
import FleshEaterCourts from 'army/flesh_eater_courts'
import LegionsOfNagash from 'army/legions_of_nagash'
import Nighthaunt from 'army/nighthaunt'
import { getNighthauntUnits } from 'army/nighthaunt/units'

// Grab the list of shared Nighthaunt
const filterList: TUnits = [...getNighthauntUnits()]

// Unit Names
export const Units: TUnits = [
  ...FleshEaterCourts.Units,
  ...LegionsOfNagash.Units.filter(units => !filterList.includes(units)),
  ...Nighthaunt.Units,
]
