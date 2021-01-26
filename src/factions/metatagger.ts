import { omit, pick } from 'lodash'
import { TEffects, TEntryProperties } from 'types/data'
import { IObjWithEffects, TParentEffectsObjWithEffects } from './factionTypes'

/**
 * Adds the given tag to all sub-objects
 *
 * @param obj
 * @param tag
 */
export const tagAs = <
  D extends Record<string, IObjWithEffects>,
  E extends TEntryProperties,
  F extends D[keyof D]
>(
  obj: D,
  tag: E
) => {
  return Object.keys(obj).reduce((a, key) => {
    const origObj = obj[key]

    const taggedObj = {
      ...origObj,
      // TODO: We used to tag all sub-effects. I'm not sure we need to anymore, tbh
      // effects: origObj.effects.map(x => ({ ...x, [tag]: true })),
      [tag]: true,
    }

    // @ts-ignore
    a[key] = taggedObj
    return a
  }, {} as Record<keyof D, F & Record<E, true>>)
}

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

/**
 * Grabs battle traits and basic effects
 * @param obj
 * @param keys
 */
export const pickEffects = <T extends TParentEffectsObjWithEffects, R extends Extract<keyof T, string>>(
  obj: T,
  keys: R[]
): TEffects[] => {
  const picked = keyPicker(obj, keys)
  return keys.reduce((a, k) => {
    a = a.concat(picked[k].effects)
    return a
  }, [] as TEffects[])
}
