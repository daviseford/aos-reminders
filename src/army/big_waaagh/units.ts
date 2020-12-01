import Bonesplitterz from 'army/bonesplitterz'
import Greenskinz from 'army/greenskinz'
import Ironjawz from 'army/ironjawz'
import { TUnits } from 'types/army'
// Battalions
import { TEntry } from 'types/data'

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

export const Battalions: TEntry[] = [...getIronjawzBattalions(), ...getBonesplitterzBattalions()]
