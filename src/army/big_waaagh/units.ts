import Bonesplitterz from 'army/bonesplitterz'
import Greenskinz from 'army/greenskinz'
import Ironjawz from 'army/ironjawz'
import { TBattalions, TUnits } from 'types/army'

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
