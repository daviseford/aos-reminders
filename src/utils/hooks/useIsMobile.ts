import { useEffect, useState } from 'react'
import { MOBILE_MEDIA_QUERY, matchesMobile } from 'utils/breakpoints'

export const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(matchesMobile)

  useEffect(() => {
    const update = () => setIsMobile(matchesMobile())

    if (typeof window.matchMedia === 'function') {
      // Fires only when the breakpoint is crossed, so this no longer re-renders on every resize
      // event — notably the burst a mobile URL bar produces when it shows or hides.
      const query = window.matchMedia(MOBILE_MEDIA_QUERY)
      const handleChange = (event: MediaQueryListEvent) => setIsMobile(event.matches)
      update()

      // Safari below 14 only supports the deprecated addListener signature.
      if (query.addEventListener) {
        query.addEventListener('change', handleChange)
        return () => query.removeEventListener('change', handleChange)
      }
      query.addListener(handleChange)
      return () => query.removeListener(handleChange)
    }

    window.addEventListener('resize', update)
    update()
    return () => window.removeEventListener('resize', update)
  }, [])

  return isMobile
}
