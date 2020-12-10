import Bonesplitterz from 'factions/orruk_warclans/bonesplitterz'
// import Greenskinz from 'army/greenskinz'
import Ironjawz from 'factions/orruk_warclans/ironjawz'
import { TEntry } from 'types/data'

// Importing Ironjawz
const getIronjawzUnits = () => Ironjawz.Units
const getIronjawzBattalions = () => Ironjawz.Battalions

// Importing Bonesplitterz
const getBonesplitterzUnits = () => Bonesplitterz.Units
const getBonesplitterzBattalions = () => Bonesplitterz.Battalions

// Importing Greenskinz
// const getGreenskinzUnits = () => Greenskinz.Units

export const AlliedUnits: TEntry[] = [
  ...getIronjawzUnits(),
  ...getBonesplitterzUnits(),
  // ...getGreenskinzUnits(),
]

export const Battalions: TEntry[] = [...getIronjawzBattalions(), ...getBonesplitterzBattalions()]
