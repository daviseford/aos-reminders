import { TUnits } from 'types/army'

type TFilterUnits = (units: TUnits, unitNames: string[]) => TUnits

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
