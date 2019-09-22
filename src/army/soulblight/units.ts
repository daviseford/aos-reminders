import { TBattalions, TUnits } from 'types/army'
import LegionsOfNagash from 'army/legions_of_nagash'
import { filterBattalions, filterUnits } from 'utils/filterUtils'

// Importing from LoN
const getLegionsOfNagashUnits = () => {
  const listOfUnits = [
    `Bat Swarms`,
    `Blood Knights`,
    `Bloodseeker Palanquin`,
    `Coven Throne`,
    `Fell Bats`,
    `Mannfred, Mortarch of Night`,
    `Neferata, Mortarch of Blood`,
    `Prince Vhordrai`,
    `Vampire Lord`,
    `Vampire Lord on Zombie Dragon`,
    `Vargheists`,
  ]
  return filterUnits(LegionsOfNagash.Units, listOfUnits)
}

const getLegionsOfNagashBattalions = () =>
  filterBattalions(LegionsOfNagash.Battalions, [`Court of Nulahmia`, `Castellans of the Crimson Keep`])

// Unit Names
export const Units: TUnits = [...getLegionsOfNagashUnits()]

// Battalions
export const Battalions: TBattalions = [...getLegionsOfNagashBattalions()]
