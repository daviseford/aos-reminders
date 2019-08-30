import { TUnits, TBattalions } from 'types/army'

type TFilterUnits = (units: TUnits, unitNames: string[]) => TUnits
type TFilterBattalions = (battalions: TBattalions, battalionNames: string[]) => TBattalions

/**
 * Returns a list of Units with unitNames removed
 * @param units
 * @param unitNames
 */
export const removeUnits: TFilterUnits = (units, unitNames) => {
  return units.filter(({ name }) => !unitNames.includes(name))
}

/**
 * Returns a list of Units with only unitNames
 * @param units
 * @param unitNames
 */
export const filterUnits: TFilterUnits = (units, unitNames) => {
  return units.filter(({ name }) => unitNames.includes(name))
}

/**
 * Returns a list of Battalions with only unitNames
 * @param battalions
 * @param battalionNames
 */
export const filterBattalions: TFilterBattalions = (battalions, battalionNames) => {
  return battalions.filter(({ name }) => battalionNames.includes(name))
}
