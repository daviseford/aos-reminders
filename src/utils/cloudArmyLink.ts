/*
 * Which cloud army the local document is a copy of.
 *
 * The document itself is written to `aos-reminders:aos4:army:v1` and survives a reload; the link to
 * its cloud record used to live in React state alone, so one refresh — a service-worker update, a
 * backgrounded tab, a phone reclaiming memory — silently turned "Update Army" back into
 * "Save Army", and the next save forked a duplicate instead of updating. At a tournament that
 * accumulates identically-named armies nobody can tell apart.
 *
 * The link is stored beside the document rather than inside it, because a document travels: it is
 * serialized into share links and read back by the import path, and neither should carry one
 * account's private record id. Anything that falsifies "this document IS that cloud army" clears
 * the link — see `unlinkCloudArmy` in Home.
 */
const CLOUD_ARMY_LINK_STORAGE_KEY = 'aos-reminders:aos4:cloud-army-link:v1'

export interface CloudArmyLink {
  id: string
  /** Last known name of the cloud record, so the toolbar can name the target before the list loads. */
  name: string
  /**
   * The serialized document as it stands on the account, so the toolbar can tell whether the army
   * on screen has moved away from it. `serializeAos4ArmyDocument` normalizes sort order and drops
   * empty preferences, so this compares by content and never reports a difference that isn't one.
   *
   * Optional: a link written before this field existed reports "changed", which is the safe
   * default — it offers a save that may be unnecessary rather than hiding one that is not.
   */
  savedSignature?: string
}

const isLink = (value: unknown): value is CloudArmyLink =>
  typeof value === 'object' &&
  value !== null &&
  typeof (value as CloudArmyLink).id === 'string' &&
  Boolean((value as CloudArmyLink).id) &&
  typeof (value as CloudArmyLink).name === 'string' &&
  ['string', 'undefined'].includes(typeof (value as CloudArmyLink).savedSignature)

export const readCloudArmyLink = (
  storage: Pick<Storage, 'getItem'> = window.localStorage
): CloudArmyLink | undefined => {
  try {
    const stored = storage.getItem(CLOUD_ARMY_LINK_STORAGE_KEY)
    if (!stored) return undefined
    const parsed: unknown = JSON.parse(stored)
    if (!isLink(parsed)) return undefined
    return {
      id: parsed.id,
      name: parsed.name,
      ...(parsed.savedSignature ? { savedSignature: parsed.savedSignature } : {}),
    }
  } catch {
    // Browser storage can be unavailable in privacy modes, and a hand-edited value is not ours.
    return undefined
  }
}

export const writeCloudArmyLink = (
  link: CloudArmyLink,
  storage: Pick<Storage, 'setItem'> = window.localStorage
): void => {
  try {
    storage.setItem(CLOUD_ARMY_LINK_STORAGE_KEY, JSON.stringify(link))
  } catch {
    // The in-memory link remains usable for this session.
  }
}

export const clearCloudArmyLink = (storage: Pick<Storage, 'removeItem'> = window.localStorage): void => {
  try {
    storage.removeItem(CLOUD_ARMY_LINK_STORAGE_KEY)
  } catch {
    // Nothing to recover from; the caller has already dropped its own copy.
  }
}
