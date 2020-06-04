import GoogleMap from 'google-map-react'
import Link from 'next/link'
import { Logo } from '../components/Logo'

export function Layout({ mapPos, mapChildren, children }: LayoutProps) {
  return (
    <div>
      {children && children}

      {/* Map */}
      <div className="w-full md:h-screen flex flex-col md:flex-row items-stretch relative">
        <Link href="/">
          <a className="absolute left-4 top-0 z-20 w-48 bg-white pb-2 px-4 pt-2 rounded-b-md shadow-md">
            <Logo />
          </a>
        </Link>

        <div className="md:absolute w-full w-full h-64 md:h-screen">
          <GoogleMap
            defaultCenter={mapPos}
            defaultZoom={11}
            bootstrapURLKeys={{
              key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
            }}
          >
            {mapChildren}
          </GoogleMap>
        </div>

        {/* Results Sidebar */}
        <div className="w-full md:w-96 md:flex md:flex-col md:max-h-screen shadow-md z-20 md:m-4 md:rounded-md md:ml-auto overflow-hidden bg-white">
          <div className="pt-4 px-2 bg-brand-navy text-white shadow-md">
            <div className="flex rounded-md shadow-sm">
              <input
                className="form-input flex-1 block w-full rounded-none rounded-l-md transition duration-150 ease-in-out sm:text-sm sm:leading-5 placeholder-cool-gray-500"
                placeholder="Search by address, zip code, customer or product"
              />
              <button className="appearance-none inline-flex items-center px-3 rounded-r-md border border-l-0 border-blue-500 bg-brand-blue text-white text-sm active:bg-blue-500">
                <svg
                  fill="currentColor"
                  className="w-6 h-6"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </button>
            </div>

            <div className="pt-4 pb-2 flex justify-between items-center">
              <p className="text">
                Showing <strong>40</strong> Jobs
              </p>
              <p>
                <button className="bg-white bg-opacity-25 px-2 py-1 rounded-md inline-flex border-white border-2 border-opacity-0 items-center text-sm focus:outline-none focus:border-opacity-100 focus:shadow-md focus:bg-opacity-100 focus:text-brand-blue focus:outline-none hover:border-opacity-100 hover:shadow-md hover:bg-opacity-100 hover:text-brand-blue transition-bg duration-100 ease-in-out">
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path>
                  </svg>
                  Filter Results
                </button>
              </p>
            </div>
          </div>

          <div className="block md:overflow-y-scroll flex-grow">
            <ul>
              {Array(40)
                .fill('')
                .map((_, i) => (
                  <Job key={i} />
                ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

interface LayoutProps {
  children?: React.ReactNode
  mapChildren?: React.ReactNode
  mapPos: LocationCoordinates
}

interface LocationCoordinates {
  lat: number
  lng: number
}

function Job() {
  return (
    <Link href="/job/[slug]" as="/job/one">
      <a className="block hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition duration-150 ease-in-out border-b border-gray-50">
        <div className="flex items-center px-4 py-4">
          <div className="min-w-0 flex-1 flex items-center">
            <div className="flex-shrink-0">
              <img
                className="h-12 w-12 rounded-full"
                src="/images/house.jpg"
                alt=""
              />
            </div>
            <div className="min-w-0 flex-1 px-4">
              <div>
                <div className="text-sm leading-5 font-medium text-indigo-600 truncate">
                  Zack Krida
                </div>
                <div className="mt-2 flex items-center text-sm leading-5 text-gray-500">
                  <svg
                    className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                  </svg>
                  <span className="truncate">
                    64 Shaw Drive, North Scituate, RI 02857
                  </span>
                </div>
              </div>
              <div className="flex text-sm capitalize text-white mt-2 justify-start">
                <div className="mr-1 bg-brand-navy px-2 rounded-md">
                  roofing
                </div>
                <div className="mr-1 bg-brand-green px-2 rounded-md">
                  siding
                </div>
                <div className="mr-1 bg-brand-blue px-2 rounded-md">
                  windows
                </div>
                <div className="bg-brand-orange px-2 rounded-md">doors</div>
              </div>
            </div>
          </div>
          <div>
            <svg
              className="h-5 w-5 text-gray-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fill-rule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
        </div>
      </a>
    </Link>
  )
}
