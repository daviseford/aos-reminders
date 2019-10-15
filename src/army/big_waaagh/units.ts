import { TBattalions, TUnits } from 'types/army'
import Bonesplitterz from 'army/bonesplitterz'
import Ironjawz from 'army/ironjawz'
import Greenskinz from 'army/greenskinz'

// Importing Ironjawz
const getIronjawzUnits = () => Ironjawz.Units
const getIronjawzBattalions = () => Ironjawz.Battalions

// Importing Bonesplitterz
const getBonesplitterzUnits = () => Bonesplitterz.Units
const getBonesplitterzBattalions = () => Bonesplitterz.Battalions

// Importing Bonesplitterz
const getGreenskinzUnits = () => Greenskinz.Units

// Exporting the units
export const AlliedUnits: TUnits = [
  ...getIronjawzUnits(),
  ...getBonesplitterzUnits(),
  ...getGreenskinzUnits(),
]

// Battalions
export const Battalions: TBattalions = [...getIronjawzBattalions(), ...getBonesplitterzBattalions()]
