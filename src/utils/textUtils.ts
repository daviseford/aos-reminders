import { camelCase, startCase } from 'lodash'

export const titleCase = (value: string): string => startCase(camelCase(value))
