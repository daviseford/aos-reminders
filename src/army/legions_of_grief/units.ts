import { TUnits } from 'types/army'
import Nighthaunt from 'army/nighthaunt'
import LegionsOfNagash from 'army/legions_of_nagash'

// Importing Nighthaunt units
const getNighthauntUnits = () => Nighthaunt.Units

// Importing LoN Units. Only Deadwalkers, Deathlords, Deathmages, and Deathrattle
const getLoNUnits = () => {
  const listOfUnits = [
    `Arkhan the Black, Mortarch of Sacrament`,
    `Black Knights`,
    `Corpse Cart with Balefire Brazier`,
    `Corpse Cart with Unholy Lodestone`,
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
  return LegionsOfNagash.Units.filter(({ name }) => listOfUnits.includes(name))
}

// Unit export
export const Units: TUnits = [...getNighthauntUnits(), ...getLoNUnits()]
