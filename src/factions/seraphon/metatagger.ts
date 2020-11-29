import { omit, pick } from 'lodash'

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

export const keyOmitter = <T extends object, R extends Extract<keyof T, string>>(obj: T, remove: R[]) => {
  if (!remove.length) return obj
  return omit(obj, ...remove)
}

export const keyPicker = <T extends object, R extends Extract<keyof T, string>>(obj: T, select: R[]) => {
  if (!select.length) return obj
  return pick(obj, ...select)
}

// type TObjWithEffects = Record<string, object & { effects: unknown[] }>

// export const pickEffects = <T extends TObjWithEffects, R extends keyof T>(
//   obj: T,
//   key: R
// ): T[R]['effects'] => {
//   const picked = keyPicker(obj, key)
//   return picked[key].effects
// }

// export const withSpellTag = <T extends TObjWithEffects, S = T[keyof T]>(obj: TObjWithEffects) => {
//   const a = Object.keys(obj).reduce((a, k) => {
//     a[k] = { ...obj[k], spell: true }
//     return asp
//   }, {})

//   return a as T[S]
// }
