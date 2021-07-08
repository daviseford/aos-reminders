import { entryKeyToSelectionsKey, TEntry, TEntryProperties, TTurnAction } from 'types/data'

const isSelectionKey = (val: string): val is TEntryProperties => !!val && !!entryKeyToSelectionsKey[val]

/**
 * This utility helps extract a given tag from an entry
 *
 * Useful for figuring out if something is a command_ability, spell, etc.
 *
 * @example
 *
 * const tag = getTagFromEntry({ name: 'A Name', effects: [], spell: true })
 * // returns "spell"
 *
 *
 * @param entry
 * @returns string
 */
export const getTagFromEntry = (entry: TEntry | TTurnAction): TEntryProperties | undefined => {
  let tag = ''
  Object.keys(entryKeyToSelectionsKey).forEach(k => {
    if (tag) return
    if (entry?.[k] === true) tag = k
  })

  return isSelectionKey(tag) ? tag : undefined
}
