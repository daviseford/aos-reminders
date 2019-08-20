import { TBattalions, TUnits } from 'types/army'
import Nighthaunt from 'army/nighthaunt'
import LegionsOfNagash from 'army/legions_of_nagash'

// Importing Nighthaunt units
const getNighthauntUnits = () => {
  return Nighthaunt.Units
}

// Importing LoN Units. Only Deadwalkers, Deathlords, Deathmages, and Deathrattle
const getLoNUnits = () => {
  const listOfUnits = [
    `Necromancer`,
    `Mortis Engine`,
    `Zombies`,
    `Dire Wolves`,
    `Corpse Cart with Unholy Lodestone`,
    `Corpse Cart with Balefire Brazier`,
    `Nagash, Supreme Lord of the Undead`,
    `Arkhan the Black, Mortarch of Sacrament`,
    `Mannfred, Mortarch of Night`,
    `Neferata, Mortarch of Blood`,
    `Morghast Harbingers`,
    `Morghast Archai`,
    `Grave Guard`,
    `Wight King with Baleful Tomb Blade`,
    `Wight King with Black Axe`,
    `Skeleton Warriors`,
    `Black Knights`,
  ]
  return LegionsOfNagash.Units.filter(({ name }) => listOfUnits.includes(name))
}

// Unit Names things
export const Units: TUnits = [...getNighthauntUnits(), ...getLoNUnits()]

// There are no valid Battalions for LoG
export const Battalions: TBattalions = []
