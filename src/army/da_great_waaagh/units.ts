import { TBattalions, TUnits } from 'types/army'
import { HERO_PHASE } from 'types/phases'
import Bonesplitterz from 'army/bonesplitterz'
import Ironjawz from 'army/ironjawz'

// Importing Ironjawz
const getIronjawzUnits = () => Ironjawz.Units
const getIronjawzBattalions = () => Ironjawz.Battalions

// Importing Bonesplitterz
const getBonesplitterzUnits = () => Bonesplitterz.Units
const getBonesplitterzBattalions = () => Bonesplitterz.Battalions

// Exporting the units
export const Units: TUnits = [...getIronjawzUnits(), ...getBonesplitterzUnits()]

// Battalions
export const Battalions: TBattalions = [...getIronjawzBattalions(), ...getBonesplitterzBattalions()]
