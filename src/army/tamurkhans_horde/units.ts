import { TBattalions, TUnits } from 'types/army'
import { TamurkhansUnits, TamurkhansBattalions } from 'army/tamurkhans_horde/units_tamurkhans'
import { NurgleUnits, NurgleBattalions } from 'army/nurgle/units_nurgle'

// Unit Names
export const Units: TUnits = [
  // Include Nurgle and Tamurkhans units here.
  ...TamurkhansUnits,
  ...NurgleUnits,
]

// Battalions
export const Battalions: TBattalions = [
  // Include Nurgle and Tamurkhans battalions here.
  ...TamurkhansBattalions,
  ...NurgleBattalions,
]
