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

export const consumePendingShareId = (
  storage: Pick<Storage, 'getItem' | 'removeItem'> = window.sessionStorage
): string | undefined => {
  try {
    const shareId = storage.getItem(PENDING_SHARE_STORAGE_KEY)?.trim()
    storage.removeItem(PENDING_SHARE_STORAGE_KEY)
    return shareId && SHARE_ID_PATTERN.test(shareId) ? shareId : undefined
  } catch {
    return undefined
  }
}
