import GoogleMap from 'google-map-react'
import Link from 'next/link'
import { Logo } from '../components/Logo'

export function Layout({
  mapPos,
  mapChildren,
  children,
}: {
  children?: React.ReactNode
  mapChildren?: React.ReactNode
  mapPos: { lat: number; lng: number }
}) {
  return (
    <div>
      {children && children}

      {/* Map */}
      <div className="w-full md:h-screen flex flex-col md:flex-row items-stretch relative">
        <div className="absolute left-4 top-0 z-20 w-48 bg-white pb-2 px-4 pt-2 rounded-b-md shadow-md">
          <Logo />
        </div>

        <div className="md:flex-1 h-64 md:h-auto">
          <GoogleMap defaultCenter={mapPos} defaultZoom={11}>
            {mapChildren}
          </GoogleMap>
        </div>

        {/* Results Sidebar */}
        <div className="md:w-96 md:flex md:flex-col md:max-h-screen">
          <h2>results</h2>
          <div className="block md:overflow-y-scroll flex-grow">
            <ul>
              <li data-index="1" className="text-lg py-4">
                <Link href="/job/[slug]" as={`/job/one`}>
                  <a>1 Item</a>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
