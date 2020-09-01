import GoogleMap, { Maps } from 'google-map-react'
import { scrollTo, getMapBoundsFromProjects } from 'lib/utils'
import Link from 'next/link'
import { useEffect, useState, useRef } from 'react'
import { Logo } from '../components/Logo'
import { ProjectListItem } from '../components/ProjectListItem'
import { Marker, StatusColorBg, getMarkerColor } from './Marker'
import { useLazyRequest } from 'lib/useLazyRequest'
import { useRouter } from 'next/router'
import { Select } from './Select'
import Dialog from '@reach/dialog'

export function Layout({ mapPos, mapChildren, children }: LayoutProps) {
  const mapRef = useRef()
  const mapsRef = useRef()

  const router = useRouter()

  const types = [
    { value: 'zip', name: 'Zip Code' },
    { value: 'city', name: 'City/Town' },
    { value: 'name', name: 'Last Name' },
    { value: 'streetAddress', name: 'Street Address' },
    { value: 'productColor', name: 'Product Color' },
    { value: 'productType', name: 'Product Type' },
  ]

  const [searchCount, setSearchCount] = useState(0)
  const [q, setQ] = useState('')
  const [type, setType] = useState<any>(types[0])
  const [resultsLoading, setResultsLoading] = useState(false)

  const today = new Date()
  const years = Array(30)
    .fill('')
    .map((_, i) => ({
      name: `${today.getFullYear() - i}`,
      value: `${today.getFullYear() - i}`,
    }))

  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    year: 'any',
    status: 'any',
    jobType: 'any',
    productColor: 'any',
  })

  const { data: projects, fetchMore: fetchMoreProjects } = useLazyRequest(
    `/api/project`,
    {
      q,
      type: type.value,
      ...filters,
    }
  )

  const {
    data: productColors = [],
    fetchMore: fetchMoreProductColors,
  } = useLazyRequest(`/api/product-colors`, {
    type: filters.jobType === 'any' ? null : filters.jobType,
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

  // load product colors whenever a product type is selected
  useEffect(() => {
    if ('jobType' in router.query) {
      fetchMoreProductColors()
    }
  })

  // Submit search whenver the page's url updates and contains a search param
  useEffect(() => {
    if ('q' in router.query) {
      const searchParams = {
        q: router.query.q,
        type: router.query.type,
        ...filters,
      }

      setSearchCount(searchCount + 1)
      setQ(router.query.q as string)
      setResultsLoading(true)
      fetchMoreProjects(searchParams).then(_ => setResultsLoading(false))
    }
  }, [router.query])

  const [activeItem, setActiveItem] = useState(null)
  useEffect(() => {
    if (!activeItem) return
    scrollTo(`[data-index="${activeItem}"]`)
  }, [activeItem])

  function handleSubmit(event) {
    event.preventDefault()

    let query = {
      ...router.query,
      q,
      type: type.value,
    }

    // Add non-'any' filters to the search
    for (const [filterName, filterValue] of Object.entries(filters)) {
      if (filterValue !== 'any') {
        query[filterName] = filterValue
      }
    }

    router.push({
      pathname: router.pathname,
      query,
    })
  }

  if (!projects) {
    return <div>Loading...</div>
  }

  return (
    <div>
      {children && children}

      {/* Map */}
      <div className="w-full h-screen flex flex-col md:flex-row items-stretch relative">
        <Link href="/">
          <a className="absolute left-0 right-0 w-40 mx-auto px-2 pt-1 pb-2 md:left-4 md:right-auto top-0 z-20 md:w-48 bg-white md:pb-2 md:px-4 md:pt-2 rounded-b-md shadow-md">
            <Logo />
          </a>
        </Link>

        <div className="relative md:absolute w-full flex-grow md:h-screen">
          <div className="absolute h-full min-h-full w-full">
            <GoogleMap
              defaultCenter={mapPos}
              defaultZoom={9.5}
              options={{
                fullscreenControl: false,
                zoomControlOptions: { position: 4 },
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
                    i.Latitude__c !== null && (
                      <Marker
                        active={i.Id === activeItem}
                        onClick={() => setActiveItem(i.Id)}
                        color={getMarkerColor(i)}
                        key={i.Id}
                        lat={Number(i.Latitude__c)}
                        lng={Number(i.Long__c)}
                      />
                    )
                )}
              {mapChildren}
            </GoogleMap>
          </div>
        </div>

        {/* Results Sidebar */}
        <div className="w-full md:max-w-md flex flex-col-reverse md:flex-col md:max-h-screen shadow-md z-20 md:m-4 md:rounded-md md:ml-auto overflow-hidden bg-white">
          <div className="pt-4 bg-brand-navy text-white shadow-md">
            <form className="relative" onSubmit={handleSubmit}>
              <div className="mx-2 flex md:rounded-md shadow-sm relative rounded-none rounded-l-md transition duration-150 ease-in-out sm:text-sm sm:leading-5  text-brand-navy">
                <input
                  value={q}
                  onChange={event => setQ(event.target.value)}
                  className="flex-1 block w-full form-input pr-28 placeholder-cool-gray-500"
                  placeholder="Search projects by"
                />
                <div className="absolute inset-y-0 right-0 flex items-center">
                  <select
                    aria-label="Search Type"
                    value={type.value}
                    onChange={event => {
                      setType(types.find(i => i.value === event.target.value))
                    }}
                    className="form-select h-full py-0 pl-2 pr-7 border-transparent bg-transparent text-gray-500 sm:text-sm sm:leading-5 rounded-r-md rounded-l-none bg-blue-100 border-l border-blue-200"
                  >
                    {types.map(type => (
                      <option key={type.name} value={type.value}>
                        {type.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div
                className={`px-2 pt-2 pb-2 flex justify-between items-center relative ${
                  showFilters && ` shadow-md z-2 `
                }`}
              >
                <p className="text-xs md:text-sm">
                  <strong>{projects.length}</strong> Results
                </p>

                <div className="flex items-center">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    type="button"
                    className="bg-white bg-opacity-25 px-2 py-2 mr-2 rounded-md inline-flex border-white border border-opacity-0 items-center text-sm focus:outline-none focus:border-opacity-100 focus:shadow-md focus:bg-opacity-100 focus:text-brand-blue hover:border-opacity-100 hover:shadow-md hover:bg-opacity-100 hover:text-brand-blue transition-bg duration-100 ease-in-out"
                  >
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
                    {showFilters ? 'Hide Filters' : 'Filter Results'}
                  </button>

                  <button
                    disabled={q.length === 0 || resultsLoading}
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
              {showFilters && (
                <div className="px-2 py-4 top-full l-0 r-0 w-full bg-brand-gray">
                  <div className="grid grid-cols-3 gap-2 grid-flow-row">
                    <Select
                      label="Created After"
                      fallback="Any"
                      options={years}
                      value={filters.year}
                      onChange={year => setFilters({ ...filters, year })}
                    />
                    <Select
                      label="Status"
                      fallback="Any"
                      options={[
                        { value: 'in-progress', name: 'In Progress' },
                        { value: 'completed', name: 'Completed' },
                      ]}
                      value={filters.status}
                      onChange={status => setFilters({ ...filters, status })}
                    />
                    <Select
                      label="Job Type"
                      fallback="Any"
                      options={[
                        { value: 'Roofing', name: 'Roofing' },
                        { value: 'Siding', name: 'Siding' },
                        { value: 'Doors', name: 'Doors' },
                        { value: 'Windows', name: 'Windows' },
                        { value: 'Warranty', name: 'Warranty' },
                      ]}
                      value={filters.jobType}
                      onChange={jobType => setFilters({ ...filters, jobType })}
                    />
                    {['Roofing', 'Siding', 'Windows'].includes(
                      filters.jobType
                    ) && (
                      <Select
                        truncateItems={false}
                        label="Product Color"
                        fallback="Any"
                        options={productColors.map(i => ({
                          value: i,
                          name: i,
                        }))}
                        value={filters.productColor}
                        onChange={productColor =>
                          setFilters({ ...filters, productColor })
                        }
                      />
                    )}
                  </div>
                </div>
              )}
            </form>
          </div>

          {projects.length > 0 && (
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
          )}
          {searchCount > 0 && projects.length === 0 && !resultsLoading && (
            <div className="text-center p-4 h-full flex flex-col justify-center items-center text-center flex-grow">
              <p className="mb-3">
                No results for your current search and filters.
              </p>
              <p>Try making your search less specific.</p>
            </div>
          )}
          {searchCount === 0 && (
            <div className="text-center p-4 flex flex-col justify-center items-center text-center flex-grow">
              <div>
                <p>No results found.</p>
              </div>
            </div>
          )}
        </div>
      </div>
      <InfoModal />
    </div>
  )
}

function InfoModal() {
  const [showInfoModal, setShowInfoModal] = useState(false)

  return (
    <>
      <button
        onClick={() => setShowInfoModal(true)}
        className="appearance-none rounded-full p-1 absolute left-2 bottom-2 bg-brand-blue hover:bg-blue-500 text-white w-8 h-8"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </button>
      <Dialog
        isOpen={showInfoModal}
        onDismiss={() => setShowInfoModal(false)}
        className="info-modal"
      >
        <div className="text-center p-4 h-full flex flex-col justify-between items-center text-center flex-grow bg-white rounded shadow-md">
          <div className="w-28 h-28 mx-auto mb-8 opacity-75">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 64 645"
              className="w-full fill-current text-brand-navy mx-auto"
            >
              <path
                fill="#6EA663"
                d="M39.623 31.628H0v7.907h39.623v-7.907zM39.623 19.767H0v7.907h39.623v-7.907zM39.623 43.488H0v7.907h39.623v-7.907zM39.623 55.349H0v7.907h39.623v-7.907z"
              ></path>
              <path
                fill="#5C8AE6"
                d="M51.51 19.767h-7.925v19.768h7.924V19.768zM63.396 19.767h-7.924v19.768h7.924V19.768zM63.396 43.488h-7.924v19.768h7.924V43.488zM51.51 43.488h-7.925v19.768h7.924V43.488z"
              ></path>
              <path
                fill="#738799"
                d="M0 15.814h39.623L63.396 0H23.774L0 15.814z"
              ></path>
            </svg>
          </div>
          <p className="text-gray-400 uppercase text-sm font-semibold">
            Welcome to the
          </p>
          <h1 className="text-lg md:text-2xl font-semibold">
            Marshall Project Map
          </h1>
          <p className="mt-4">
            Use the filters to search for ongoing and completed projects.
          </p>

          <h3 className="text-md font-bold mt-4">Marker Color Legend</h3>
          <ul className="mt-4 text-sm">
            {Object.entries(StatusColorBg).map(([key, value]) => (
              <li
                key={key}
                className="flex justify-between items-center gap-2 pb-2"
              >
                <span
                  className={`rounded-full block w-4 h-4 mr-4 border-opacity-75 border-2 ${value}`}
                ></span>
                {key}
              </li>
            ))}
          </ul>
        </div>
      </Dialog>
    </>
  )
}
