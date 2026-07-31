import { useEffect, useMemo, useState } from 'react'
import { matchesMobile, matchesTinyMobile } from 'utils/breakpoints'

type WindowSize = { width?: number; height?: number }

const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: undefined,
    height: undefined,
  })

  useEffect(() => {
    let frame = 0

    const readSize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight })

    // Coalesce the burst of resize events a mobile URL bar produces into one state update per frame.
    const handleResize = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(readSize)
    }

    // The first measurement is synchronous, so mounting leaves no frame pending.
    readSize()
    window.addEventListener('resize', handleResize)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return useMemo(
    () => ({
      width: windowSize.width,
      height: windowSize.height,
      // Derived from the same breakpoints the stylesheet uses, so JS and CSS agree.
      isTinyMobile: windowSize.width ? matchesTinyMobile() : false,
      isMobile: windowSize.width ? matchesMobile() : false,
    }),
    [windowSize.width, windowSize.height]
  )
}

export default useWindowSize
