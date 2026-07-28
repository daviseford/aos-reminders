import { useEffect, useMemo, useState } from 'react'

type WindowSize = { width?: number; height?: number }

const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: undefined,
    height: undefined,
  })

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    window.addEventListener('resize', handleResize)
    handleResize()
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return useMemo(
    () => ({
      width: windowSize.width,
      height: windowSize.height,
      isTinyMobile: windowSize.width ? windowSize.width <= 335 : false,
      isMobile: windowSize.width ? windowSize.width <= 480 : false,
    }),
    [windowSize.width, windowSize.height]
  )
}

export default useWindowSize
