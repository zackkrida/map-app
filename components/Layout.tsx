import GoogleMap, { Maps } from 'google-map-react'
import { scrollTo, getMapBoundsFromProjects } from 'lib/utils'
import Link from 'next/link'
import { useEffect, useState, useRef } from 'react'
import { Logo } from '../components/Logo'
import { ProjectListItem } from '../components/ProjectListItem'
import { Marker } from './Marker'
import { useLazyRequest } from 'lib/useLazyRequest'
import { useRouter } from 'next/router'

enum SearchTypes {
  Name = 'name',
  Zip = 'zip',
  Address = 'address',
}

export function Layout({ mapPos, mapChildren, children }: LayoutProps) {
  const mapRef = useRef()
  const mapsRef = useRef()

  const router = useRouter()

  const [searchTerm, setSearchTerm] = useState('')
  const [searchType, setSearchType] = useState<SearchTypes>(SearchTypes.Zip)
  const [resultsLoading, setResultsLoading] = useState(false)

  const { data: projects, fetchMore } = useLazyRequest(`/api/project`, {
    searchTerm,
    searchType,
  })

  // Re-fit map whenever we get new projects
  useEffect(() => {
    if (projects.length === 0 || !mapRef.current) return
    ;(mapRef.current as any).fitBounds(
      getMapBoundsFromProjects(mapsRef.current, projects),
      {
        right: window.innerWidth > 700 ? 400 : 0,
      }
    )
  }, [projects])

  // Submit search whenver the page's url updates and contains a search param
  useEffect(() => {
    console.log('it changed!')
    if ('searchTerm' in router.query) {
      setSearchTerm(router.query.searchTerm as string)
      setResultsLoading(true)
      fetchMore({
        searchTerm: router.query.searchTerm,
        searchType: router.query.searchType,
      }).then(_ => setResultsLoading(false))
    }
  }, [router.query])

  const [activeItem, setActiveItem] = useState(null)
  useEffect(() => {
    if (!activeItem) return
    scrollTo(`[data-index="${activeItem}"]`)
  }, [activeItem])

  function handleSubmit(event) {
    event.preventDefault()
    router.push({
      pathname: router.pathname,
      query: { ...router.query, searchTerm, searchType },
    })
  }

  if (!projects) {
    return <div>Loading...</div>
  }

  return (
    <div>
      {children && children}

      {/* Map */}
      <div className="w-full h-screen flex flex-col md:flex-row items-stretch relativee">
        <Link href="/">
          <a className="absolute left-0 right-0 w-40 mx-auto px-2 pt-1 pb-2 md:left-4 md:right-auto top-0 z-20 md:w-48 bg-white md:pb-2 md:px-4 md:pt-2 rounded-b-md shadow-md">
            <Logo />
          </a>
        </Link>

        <div className="md:absolute w-full flex-grow md:h-screen">
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
        <div className="w-full md:max-w-md flex flex-col-reverse md:flex-col md:max-h-screen shadow-md z-20 md:m-4 md:rounded-md md:ml-auto overflow-hidden bg-white">
          <div className="pt-4 px-2 bg-brand-navy text-white shadow-md">
            <form className="" onSubmit={handleSubmit}>
              <div className="flex md:rounded-md shadow-sm relative rounded-none rounded-l-md transition duration-150 ease-in-out sm:text-sm sm:leading-5  text-brand-navy">
                <input
                  value={searchTerm}
                  onChange={event => setSearchTerm(event.target.value)}
                  className="flex-1 block w-full form-input pr-28 placeholder-cool-gray-500"
                  placeholder={`Search projects by ${searchType}`}
                />
                <div className="absolute inset-y-0 right-0 flex items-center">
                  <select
                    aria-label="Search Type"
                    value={searchType}
                    onChange={event =>
                      setSearchType(event.target.value as SearchTypes)
                    }
                    className="form-select h-full py-0 pl-2 pr-7 border-transparent bg-transparent text-gray-500 sm:text-sm sm:leading-5 rounded-r-md rounded-l-none bg-blue-100 border-l border-blue-200"
                  >
                    {Object.entries(SearchTypes).map(([key, value]) => (
                      <option key={key} value={value}>
                        {key}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pt-2 pb-2 flex justify-between items-center">
                <p className="text-xs md:text-sm">
                  <strong>{projects.length}</strong> Results
                </p>

                <div className="flex items-center">
                  <div className="mr-2 w-20">
                    <select
                      defaultValue={null}
                      id="country"
                      className="text-gray-500 mr-2 block form-select w-full py-2 px-2 pr-6 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5 truncate"
                    >
                      <option value={null}>Year</option>
                      {new Array(30).fill('').map((_, i) => (
                        <option value={new Date().getFullYear() - i}>
                          {new Date().getFullYear() - i}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    disabled={searchTerm.length === 0 || resultsLoading}
                    type="submit"
                    className="appearance-none inline-flex items-center px-2 py-2 rounded-md border border-l-0 border-blue-500 bg-brand-blue text-white text-sm active:bg-blue-500"
                  >
                    {!resultsLoading ? (
                      <>
                        <span className="mr-1">Search</span>
                        <svg
                          fill="currentColor"
                          className="w-5 h-5"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                            clipRule="evenodd"
                          ></path>
                        </svg>
                      </>
                    ) : (
                      <svg
                        className="w-5 h-5"
                        viewBox="0 0 100 100"
                        preserveAspectRatio="xMidYMid"
                      >
                        <g>
                          <path
                            d="M50 15A35 35 0 1 0 74.74873734152916 25.25126265847084"
                            fill="none"
                            stroke="#ffffff"
                            stroke-width="12"
                          ></path>
                          <path
                            d="M49 3L49 27L61 15L49 3"
                            fill="#ffffff"
                          ></path>
                          <animateTransform
                            attributeName="transform"
                            type="rotate"
                            repeatCount="indefinite"
                            dur="1s"
                            values="0 50 50;360 50 50"
                            keyTimes="0;1"
                          ></animateTransform>
                        </g>
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* <div className="absolute top-0 left-0 max-h-screen overflow-scroll bg-white text-sm max-w-2xl">
            <pre>
              <code>{JSON.stringify(jobs, null, 2)}</code>
            </pre>
          </div> */}

          <div className="md:overflow-y-scroll md:flex-grow block">
            <ul className="flex md:block overflow-x-scroll md:overflow-auto">
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
