import { useEffect, useMemo, useState } from 'react'

type TState = { width?: number; height?: number }

/**
 * This hook helps us track the window dimensions of our user's browser
 */
const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState<TState>({ width: undefined, height: undefined })

  useEffect(() => {
    // Handler to call on window resize
    const handleResize = () => {
      // Set window width/height to state
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    // Add event listener
    window.addEventListener('resize', handleResize)

    // Call handler right away so state gets updated with initial window size
    handleResize()

    // Remove event listener on cleanup
    return () => window.removeEventListener('resize', handleResize)
  }, []) // Empty array ensures that effect is only run on mount

  const value = useMemo(
    () => ({
      width: windowSize.width,
      height: windowSize.height,
      isTinyMobile: windowSize.width ? windowSize.width <= 335 : false,
      isMobile: windowSize.width ? windowSize.width <= 480 : false,
    }),
    [windowSize.width, windowSize.height]
  )

  return value
}

export default useWindowSize
