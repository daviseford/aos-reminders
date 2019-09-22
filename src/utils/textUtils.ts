import { startCase, camelCase } from 'lodash'

export const titleCase = (val: string): string => startCase(camelCase(val))

export const unTitleCase = (val: string): string => {
  return val
    .toUpperCase()
    .split(' ')
    .join('_')
}

export const stripPunctuation = (text: string): string => text.replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, '')

export const generateUUID = () => {
  return [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('')
}
