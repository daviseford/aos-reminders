import { useEffect, useMemo, useState } from 'react'

// Hook
const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 })

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
      isTinyMobile: windowSize.width <= 335,
      isMobile: windowSize.width <= 480,
    }),
    [windowSize]
  )

  return value
}

export default useWindowSize
