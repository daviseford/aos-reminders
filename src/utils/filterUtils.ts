import { TUnits, TBattalions } from 'types/army'
import { isProd } from './env'

type TFilterUnits = (units: TUnits, unitNames: string[]) => TUnits
type TFilterBattalions = (battalions: TBattalions, battalionNames: string[]) => TBattalions

/**
 * Returns a list of Units with unitNames removed
 * @param units
 * @param unitNames
 */
export const removeUnits: TFilterUnits = (units, unitNames) => {
  errorCheck(units, unitNames) // Error checking
  return units.filter(({ name }) => !unitNames.includes(name))
}

/**
 * Returns a list of Units with only unitNames
 * @param units
 * @param unitNames
 */
export const filterUnits: TFilterUnits = (units, unitNames) => {
  errorCheck(units, unitNames) // Error checking
  return units.filter(({ name }) => unitNames.includes(name))
}

/**
 * Returns a list of Battalions with only unitNames
 * @param battalions
 * @param battalionNames
 */
export const filterBattalions: TFilterBattalions = (battalions, battalionNames) => {
  errorCheck(battalions, battalionNames) // Error checking
  return battalions.filter(({ name }) => battalionNames.includes(name))
}

/**
 * Make sure all of the unitNames provided are correct
 * @param units
 * @param unitNames
 */
const errorCheck = (units: TUnits, unitNames: string[]) => {
  if (isProd) return // We don't want to be throwing errors in prod

  const names = units.map(x => x.name)
  unitNames.forEach(name => {
    if (!names.includes(name)) throw new Error(`${name} is misspelled.`)
  })
}
