import { startCase, camelCase } from 'lodash'

export const titleCase = (val: string): string => startCase(camelCase(val))
