import { TBattalions, TUnits } from 'types/army'
import FleshEaterCourts from 'army/flesh_eater_courts'
import LegionsOfNagash from 'army/legions_of_nagash'
import Nighthaunt from 'army/nighthaunt'

// Unit Names
export const Units: TUnits = [...FleshEaterCourts.Units, ...LegionsOfNagash.Units, ...Nighthaunt.Units]
export const Battalions: TBattalions = []
