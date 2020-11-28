import { omit, pick } from 'lodash'

/**
 * Take in some data and add metadata
 */
export const metadataTagger = obj => {
  return Object.keys(obj).reduce((a, name) => {
    const _copy = { ...obj[name], name }
    a[name] = _copy
    return a
  }, {})
}

export const keyOmitter = <T extends object, R extends keyof T>(obj: T, ...remove: R[]) => {
  if (!remove.length) return obj
  return omit(obj, ...remove)
}

export const keyPicker = <T extends object, R extends keyof T>(obj: T, ...remove: R[]) => {
  if (!remove.length) return obj
  return pick(obj, ...remove)
}
