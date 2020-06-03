// http://google-map-react.github.io/google-map-react/map/main/
import { scrollTo } from 'lib/utils'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { Layout } from 'components/Layout'
import { Marker } from '../components/Marker'

export default function IndexPage({ mapPos }) {
  const [activeItem, setActiveItem] = useState(null)
  useEffect(() => {
    if (!activeItem) return
    scrollTo(`[data-index="${activeItem}"]`)
  }, [activeItem])

  // Everything we need here on the index is in the shared layout
  return <></>
}
