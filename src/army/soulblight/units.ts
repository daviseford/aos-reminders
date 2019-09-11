import { TBattalions, TUnits } from 'types/army'
import LegionsOfNagash from 'army/legions_of_nagash'
import { filterBattalions } from 'utils/filterUtils'

// Importing from LoN
const getLegionsOfNagashUnits = () => LegionsOfNagash.Units
const getLegionsOfNagashBattalions = () =>
  filterBattalions(LegionsOfNagash.Battalions, [`Deathmarch`, `Castellans of the Crimson Keep`])

// Unit Names
export const Units: TUnits = [...getLegionsOfNagashUnits()]

// Battalions
export const Battalions: TBattalions = [...getLegionsOfNagashBattalions()]
