import { filterUnits } from 'utils/filterUtils'
import { TUnits } from 'types/army'
import LegionsOfNagash from 'army/legions_of_nagash'
import Nighthaunt from 'army/nighthaunt'

// Importing Nighthaunt units
const getNighthauntUnits = () => Nighthaunt.Units

// Importing LoN Units. Only Deadwalkers, Deathlords, Deathmages, and Deathrattle
const getLoNUnits = () => {
  const listOfUnits = [
    `Arkhan the Black, Mortarch of Sacrament`,
    `Black Knights`,
    `Corpse Cart w/ Balefire Brazier`,
    `Corpse Cart w/ Unholy Lodestone`,
    `Dire Wolves`,
    `Grave Guard`,
    `Mannfred, Mortarch of Night`,
    `Morghast Archai`,
    `Morghast Harbingers`,
    `Mortis Engine`,
    `Nagash, Supreme Lord of the Undead`,
    `Necromancer`,
    `Neferata, Mortarch of Blood`,
    `Skeleton Warriors`,
    `Wight King with Baleful Tomb Blade`,
    `Wight King with Black Axe`,
    `Zombies`,
  ]
  return filterUnits(LegionsOfNagash.Units, listOfUnits)
}

// Unit export
export const Units: TUnits = [...getNighthauntUnits(), ...getLoNUnits()]
