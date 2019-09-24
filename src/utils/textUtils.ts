import { startCase, camelCase } from 'lodash'
import { TTurnAction } from 'types/data'

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

export const getActionTitle = ({
  artifact,
  command_ability,
  command_trait,
  condition,
  endless_spell,
  name,
  scenery,
  spell,
  triumph,
}: TTurnAction): string => {
  const nameRegex = new RegExp(`${name as string}(, )?`, 'gi')
  const strippedCond = condition.replace(nameRegex, '')
  const suffix = name === condition ? `` : `: ${strippedCond}`
  if (artifact) return `Artifact${suffix}`
  if (command_ability) return `Command Ability${suffix}`
  if (command_trait) return `Command Trait${suffix}`
  if (endless_spell) return `Endless Spell${suffix}`
  if (scenery) return `Scenery${suffix}`
  if (spell) return `Spell${suffix}`
  if (triumph) return `Triumph${suffix}`
  return strippedCond
}
