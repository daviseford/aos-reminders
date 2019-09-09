import { startCase, camelCase } from 'lodash'

export const titleCase = (val: string): string => startCase(camelCase(val))

export const unTitleCase = (val: string): string => {
  return val
    .toUpperCase()
    .split(' ')
    .join('_')
}
