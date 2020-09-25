import { useEffect, useMemo, useState } from 'react'

type TWindowSizeState = {
  width: number | undefined
  height: number | undefined
}

// Hook
const useWindowSize = () => {
  // Initialize state with undefined width/height so server and client renders match
  // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
  const [windowSize, setWindowSize] = useState<TWindowSizeState>({
    width: undefined,
    height: undefined,
  })

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
      isTinyMobile: windowSize.width ? windowSize.width <= 335 : undefined,
      isMobile: windowSize.width ? windowSize.width <= 480 : undefined,
    }),
    [windowSize]
  )

  return value
}

export default useWindowSize
