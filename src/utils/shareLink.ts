const PENDING_SHARE_STORAGE_KEY = 'aos-reminders:aos4:pending-share'
const SHARE_ID_PATTERN = /^[A-Za-z0-9_-]{24,128}$/

export const capturePendingShareId = (
  location: Pick<Location, 'href' | 'pathname' | 'search' | 'hash'> = window.location,
  history: Pick<History, 'replaceState'> = window.history,
  storage: Pick<Storage, 'setItem'> = window.sessionStorage
): string | undefined => {
  try {
    const url = new URL(location.href)
    const shareId = url.searchParams.get('army')?.trim()
    if (!shareId) return undefined

    url.searchParams.delete('army')
    const nextUrl = `${url.pathname}${url.search}${url.hash}`
    history.replaceState({}, document.title, nextUrl)
    if (!SHARE_ID_PATTERN.test(shareId)) return undefined
    storage.setItem(PENDING_SHARE_STORAGE_KEY, shareId)
    return shareId
  } catch {
    return undefined
  }
}

/*
 * Reading and clearing are separate calls, deliberately. They used to be one `consume`, which meant
 * whoever read the id was betting that they would also be the one to open it — and Home's shell
 * reads it before the catalog-bound half exists, so a chunk that never arrives took the share down
 * with it and a reload had nothing left to recover. The key is now cleared only once something has
 * actually taken responsibility for the id.
 */
export const readPendingShareId = (
  storage: Pick<Storage, 'getItem'> = window.sessionStorage
): string | undefined => {
  try {
    const shareId = storage.getItem(PENDING_SHARE_STORAGE_KEY)?.trim()
    return shareId && SHARE_ID_PATTERN.test(shareId) ? shareId : undefined
  } catch {
    return undefined
  }
}

export const clearPendingShareId = (storage: Pick<Storage, 'removeItem'> = window.sessionStorage): void => {
  try {
    storage.removeItem(PENDING_SHARE_STORAGE_KEY)
  } catch {
    // Session storage can be unavailable in privacy modes, in which case there is nothing to clear.
  }
}
