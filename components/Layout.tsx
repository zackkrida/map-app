import GoogleMap, { Maps } from 'google-map-react'
import { scrollTo, getMapBoundsFromProjects } from 'lib/utils'
import Link from 'next/link'
import { useEffect, useState, useRef } from 'react'
import { Logo } from '../components/Logo'
import { ProjectListItem } from '../components/ProjectListItem'
import { Marker } from './Marker'
import { useLazyRequest } from 'lib/useLazyRequest'

enum SearchTypes {
  Name = 'name',
  Zip = 'zip',
  Address = 'address',
}

export function Layout({ mapPos, mapChildren, children }: LayoutProps) {
  const mapRef = useRef()
  const mapsRef = useRef()

  const [searchTerm, setSearchTerm] = useState('')
  const [searchType, setSearchType] = useState<SearchTypes>(SearchTypes.Zip)

  const { data: projects, fetchMore } = useLazyRequest(`/api/project`, {
    searchTerm,
    searchType,
  })
  console.log(projects)

  // Re-fit map whenever we get new projects
  useEffect(() => {
    if (projects.length === 0) return
    ;(mapRef.current as any).fitBounds(
      getMapBoundsFromProjects(mapsRef.current, projects),
      {
        right: window.innerWidth > 700 ? 400 : 0,
      }
    )
  }, [projects])

  const [activeItem, setActiveItem] = useState(null)
  useEffect(() => {
    if (!activeItem) return
    scrollTo(`[data-index="${activeItem}"]`)
  }, [activeItem])

  function handleSubmit(event) {
    event.preventDefault()
    fetchMore()
  }

  if (!projects) {
    return <div>Loading...</div>
  }

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
            defaultZoom={9.5}
            options={{
              fullscreenControl: false,
              zoomControlOptions: {
                position: 6,
              },
            }}
            bootstrapURLKeys={{
              key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
            }}
            yesIWantToUseGoogleMapApiInternals
            onGoogleApiLoaded={({ map, maps }) => {
              mapRef.current = map
              mapsRef.current = maps
            }}
          >
            {projects &&
              projects.map(
                i =>
                  i.i360__Appointment_Latitude__c !== null && (
                    <Marker
                      active={i.Id === activeItem}
                      onClick={() => setActiveItem(i.Id)}
                      key={i.Id}
                      lat={i.i360__Appointment_Latitude__c}
                      lng={i.i360__Appointment_Longitude__c}
                    />
                  )
              )}
            {mapChildren}
          </GoogleMap>
        </div>

        {/* Results Sidebar */}
        <div className="w-full md:max-w-md md:flex md:flex-col md:max-h-screen shadow-md z-20 md:m-4 md:rounded-md md:ml-auto overflow-hidden bg-white">
          <div className="pt-4 px-2 bg-brand-navy text-white shadow-md">
            <form className="flex rounded-md shadow-sm" onSubmit={handleSubmit}>
              <input
                value={searchTerm}
                onChange={event => setSearchTerm(event.target.value)}
                className="form-input flex-1 block w-full rounded-none rounded-l-md transition duration-150 ease-in-out sm:text-sm sm:leading-5 placeholder-cool-gray-500 text-brand-blue"
                placeholder={`Search projects by ${searchType}`}
              />
              <button
                type="submit"
                className="appearance-none inline-flex items-center px-3 rounded-r-md border border-l-0 border-blue-500 bg-brand-blue text-white text-sm active:bg-blue-500"
              >
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
            </form>

            <div className="pt-4 pb-2 flex justify-between items-center">
              <p className="text">
                Showing <strong>{projects.length}</strong> Projects
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

          {/* <div className="absolute top-0 left-0 max-h-screen overflow-scroll bg-white text-sm max-w-2xl">
            <pre>
              <code>{JSON.stringify(jobs, null, 2)}</code>
            </pre>
          </div> */}

          <div className="block md:overflow-y-scroll flex-grow">
            <ul>
              {projects.map(project => (
                <ProjectListItem
                  onClick={() => setActiveItem(project.Id)}
                  project={project}
                  key={project.Id}
                  currentId={activeItem}
                />
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
