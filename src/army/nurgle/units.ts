import { TBattalions, TUnits } from 'types/army'
import { NurgleUnits, NurgleBattalions } from 'army/nurgle/units_nurgle'
import { TamurkhansUnits, TamurkhansBattalions } from 'army/tamurkhans_horde/units_tamurkhans'

// Unit Names
export const Units: TUnits = [
  // Include Nurgle and Tamurkhans units here.
  ...NurgleUnits,
  ...TamurkhansUnits,
]

// Battalions
export const Battalions: TBattalions = [
  // Include Nurgle and Tamurkhans battalions here.
  ...NurgleBattalions,
  ...TamurkhansBattalions,
]
