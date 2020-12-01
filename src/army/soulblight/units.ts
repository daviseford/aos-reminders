import LegionsOfNagash from 'army/legions_of_nagash'
// Battalions
import { TEntry } from 'types/data'
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
    `Vampire Lord on Zombie Dragon`,
    `Vampire Lord`,
    `Vargheists`,
  ]
  return filterUnits(LegionsOfNagash.Units, listOfUnits)
}

const getLegionsOfNagashBattalions = () =>
  filterBattalions(LegionsOfNagash.Battalions, [`Court of Nulahmia`, `Castellans of the Crimson Keep`])

export const Units: TEntry[] = [...getLegionsOfNagashUnits()]

export const Battalions: TEntry[] = [...getLegionsOfNagashBattalions()]
