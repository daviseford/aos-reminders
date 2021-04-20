import { entryKeyToSelectionsKey, TEntry } from 'types/data'

export const getTagFromEntry = (entry: TEntry) => {
  let tag = ''
  Object.keys(entryKeyToSelectionsKey).forEach(k => {
    if (tag) return
    if (entry?.[k] === true) tag = k
  })
  return tag
}
