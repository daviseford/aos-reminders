import { useEffect, useState } from 'react'

const mobileBreakpoint = 480

const getIsMobile = () => (typeof window === 'undefined' ? false : window.innerWidth <= mobileBreakpoint)

export const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(getIsMobile)

  useEffect(() => {
    const handleResize = () => setIsMobile(getIsMobile())
    window.addEventListener('resize', handleResize)
    handleResize()
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return isMobile
}
