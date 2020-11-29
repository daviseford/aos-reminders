import { omit, pick } from 'lodash'
import { TParentEffectsObjWithEffects } from './factionTypes'

/**
 * Take in some data and add metadata
 */
// export const metadataTagger = obj => {
//   return Object.keys(obj).reduce((a, name) => {
//     const _copy = { ...obj[name], name }
//     a[name] = _copy
//     return a
//   }, {})
// }

/**
 * Returns the `obj` with the `keys` removed.
 *
 * @param obj
 * @param keys_to_omit - The keys to remove from the returned object
 *
 * @example
 *  * keyOmitter({ a: 1, b: 2, c: 3 }, ['a', 'c'])
 * // Returns { b: 2 }
 *
 */
export const keyOmitter = <T extends object, R extends Extract<keyof T, string>>(
  obj: T,
  keys_to_omit: R[]
) => {
  if (!keys_to_omit.length) return obj
  return omit(obj, ...keys_to_omit)
}

/**
 * Returns the `obj` with **ONLY** the `keys` that you choose.
 *
 * @param obj
 * @param keys_to_pick - The keys you'd like to be returned
 *
 * @example
 * keyPicker({ a: 1, b: 2, c: 3 }, ['a', 'c'])
 * // Returns { a: 1, c: 3 }
 */
export const keyPicker = <T extends object, R extends Extract<keyof T, string>>(
  obj: T,
  keys_to_pick: R[]
) => {
  if (!keys_to_pick.length) return obj
  return pick(obj, ...keys_to_pick)
}

export const pickEffects = <T extends TParentEffectsObjWithEffects, R extends Extract<keyof T, string>>(
  obj: T,
  key: R
): T[R]['effects'] => {
  const picked = keyPicker(obj, [key])
  return picked[key].effects
}

// export const withSpellTag = <T extends TObjWithEffects, S = T[keyof T]>(obj: TObjWithEffects) => {
//   const a = Object.keys(obj).reduce((a, k) => {
//     a[k] = { ...obj[k], spell: true }
//     return asp
//   }, {})

//   return a as T[S]
// }
