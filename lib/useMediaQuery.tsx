import { useEffect, useState } from 'react'

export function useMediaQuery(mediaQuery) {
  if (typeof window === 'undefined') return undefined // simple ssr-protection
  const [matches, setMatches] = useState(matchMedia(mediaQuery).matches)

  useEffect(() => {
    const mediaQueryList = matchMedia(mediaQuery)
    const handle = () => setMatches(mediaQueryList.matches)
    mediaQueryList.addListener(handle)
    mediaQueryList.addEventListener('change', handle)
    handle()
    return () => {
      mediaQueryList.removeListener(handle)
    }
  }, [mediaQuery])

  return matches
}
