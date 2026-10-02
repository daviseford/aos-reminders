import { useEffect, useState } from 'react'

const query = '(prefers-reduced-motion: reduce)'

const matches = () =>
  typeof window !== 'undefined' && typeof window.matchMedia === 'function' && window.matchMedia(query).matches

export const usePrefersReducedMotion = () => {
  const [reduced, setReduced] = useState(matches)

  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return
    const media = window.matchMedia(query)
    const onChange = () => setReduced(media.matches)
    onChange()
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [])

  return reduced
}
