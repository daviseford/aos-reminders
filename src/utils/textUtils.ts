import { camelCase, startCase } from 'lodash'
import { TTurnAction } from 'types/data'

export const titleCase = (val: string): string => startCase(camelCase(val))

export const unTitleCase = (val: string): string => {
  return val.toUpperCase().split(' ').join('_')
}

export const stripPunctuation = (text: string): string => text.replace(/[.,/#!$%^&*;:{}=\-‑–—_`'"~()]/g, '')

export const generateUUID = () => {
  return [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('')
}

export const hashCode = (str: string): string => {
  let hash = 0
  if (str.length === 0) return 'none'
  for (let i = 0; i < str.length; i++) {
    let char = str.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash // Convert to 32bit integer
  }
  return `${hash}`
}

export const getActionTitle = ({
  artifact,
  command_ability,
  command_trait,
  condition,
  endless_spell,
  mount_trait,
  name,
  prayer,
  scenery,
  spell,
  triumph,
}: TTurnAction): string => {
  const joinedCond = condition
    .map(x => x.value)
    .filter(x => x !== name)
    .join(', ')
  const suffix = name === joinedCond || joinedCond === `` ? `` : `: ${joinedCond}`
  if (artifact) return `Artifact${suffix}`
  if (command_ability) return `Command Ability${suffix}`
  if (command_trait) return `Command Trait${suffix}`
  if (endless_spell) return `Endless Spell${suffix}`
  if (mount_trait) return `Mount Trait${suffix}`
  if (prayer) return `Prayer${suffix}`
  if (scenery) return `Scenery${suffix}`
  if (spell) return `Spell${suffix}`
  if (triumph) return `Triumph${suffix}`
  return joinedCond
}
