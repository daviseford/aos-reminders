/**
 * One source of truth for the mobile breakpoint.
 *
 * The JS hooks used to switch at 480px while index.scss and Bootstrap's `sm` switch at 576px, so
 * every viewport in between got mobile typography with desktop layout logic. These values match
 * the `max-width` media queries in index.scss; change them together.
 */
export const MOBILE_BREAKPOINT_PX = 575.98
export const TINY_MOBILE_BREAKPOINT_PX = 335

export const MOBILE_MEDIA_QUERY = `(max-width: ${MOBILE_BREAKPOINT_PX}px)`
export const TINY_MOBILE_MEDIA_QUERY = `(max-width: ${TINY_MOBILE_BREAKPOINT_PX}px)`

/**
 * `matchMedia` is the accurate answer because it excludes scrollbar width exactly as the stylesheet
 * does. jsdom does not implement it, so fall back to `innerWidth` rather than throwing during tests.
 */
export const matchesQuery = (query: string, fallbackMaxWidth: number): boolean => {
  if (typeof window === 'undefined') return false
  if (typeof window.matchMedia !== 'function') return window.innerWidth <= fallbackMaxWidth
  return window.matchMedia(query).matches
}

export const matchesMobile = () => matchesQuery(MOBILE_MEDIA_QUERY, MOBILE_BREAKPOINT_PX)

export const matchesTinyMobile = () => matchesQuery(TINY_MOBILE_MEDIA_QUERY, TINY_MOBILE_BREAKPOINT_PX)
