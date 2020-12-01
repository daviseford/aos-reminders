import Bonesplitterz from 'army/bonesplitterz'
import Greenskinz from 'army/greenskinz'
import Ironjawz from 'army/ironjawz'
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

export const AlliedUnits: TEntry[] = [
  ...getIronjawzUnits(),
  ...getBonesplitterzUnits(),
  ...getGreenskinzUnits(),
]

export const Battalions: TEntry[] = [...getIronjawzBattalions(), ...getBonesplitterzBattalions()]
