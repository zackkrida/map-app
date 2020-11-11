import { LoginModal } from './LoginModal'
import {
  downloadBlob,
  getAddressString,
  getLat,
  getLng,
  postFetcher,
  removeAnys,
} from 'lib/utils'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useEffect, useState, useRef } from 'react'
import { Logo } from './Logo'
import { CustomMap } from './CustomMap'
import { DropdownButton } from './DropdownButton'
import { InfoModal } from './InfoModal'
import { ProjectList } from './ProjectList'
import { Filters } from './Filters'
import { ProximityInput } from './ProximityInput'
import Tooltip from '@reach/tooltip'
import { withinXMilesOf } from 'lib/haversine'
import { LatLng } from '@googlemaps/google-maps-services-js'

const baseFilters = {
  year: 'any',
  status: 'any',
  jobType: 'any',
  productColor: 'any',
}

const miles = [
  { value: 5, name: '5 Miles' },
  { value: 10, name: '10 Miles' },
  { value: 50, name: '50 Miles' },
  { value: 100, name: '100 Miles' },
]

export function Layout({ children }: LayoutProps) {
  const mapRef = useRef<google.maps.Map>(null!)
  const mapsRef = useRef<HTMLElement>(null!)

  const router = useRouter()
  const [unauthenticated, setUnauthenticated] = useState(false)
  const [projects, setProjects] = useState<ProjectResultList>([])
  const [searchMode, setSearchMode] = useState(SearchModes.Unset)
  const types = [
    { value: 'zip', name: 'Zip Code' },
    { value: 'city', name: 'City/Town' },
    { value: 'name', name: 'Last Name' },
    { value: 'streetAddress', name: 'Street Address' },
  ]
  const [q, setQ] = useState('')
  const [proximityQuery, setProximityQuery] = useState('')
  const [proximityMiles, setProximityMiles] = useState(miles[0].value)
  const [showFilters, setShowFilters] = useState(false)
  const [advancedType, setAdvancedType] = useState<string>(null)
  const [searchCount, setSearchCount] = useState(0)
  const [resultsLoading, setResultsLoading] = useState(false)
  const [activeItem, setActiveItem] = useState<string>(null)
  const [filters, setFilters] = useState(baseFilters)
  const [userLatLng, setUserLatLng] = useState<
    google.maps.LatLng | google.maps.LatLngLiteral
  >({ lat: null, lng: null })

  useEffect(() => {
    if (advancedType !== null) {
      console.info(advancedType)
      setSearchMode(SearchModes.AdvancedSearch)
    }
  }, [advancedType])

  function getCurrentAddress() {
    if (userLatLng.lat === null) {
      navigator.geolocation.getCurrentPosition(
        position => {
          setUserLatLng({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
        },
        error => {
          console.error(error.message)
        },
        { enableHighAccuracy: true }
      )
    }
  }

  // Set the current address with the geocode API
  useEffect(() => {
    if (userLatLng.lat !== null && mapRef.current) {
      let geocoder = new window.google.maps.Geocoder()
      geocoder.geocode({ location: userLatLng }, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          console.log(results[0])
          setProximityQuery(results[0].formatted_address)
        } else {
          console.error(
            'Geocode was not successful for the following reason: ' + status
          )
        }
      })
    }
  }, [userLatLng, mapsRef])

  const setNSearch = ({ nq, ntype, nfilters }) => {
    setQ(nq)
    if (searchMode === SearchModes.AdvancedSearch) {
      setAdvancedType(ntype)
    }
    setFilters(nfilters)
    search({ nq, ntype, nfilters })
  }

  const dirty = searchMode !== SearchModes.Unset

  const setFilter = (name: keyof typeof filters) => (value: string) =>
    setFilters({ ...filters, [name]: value })

  async function search(
    { nq = q, ntype = advancedType, nfilters = filters } = {
      nq: q,
      ntype: advancedType,
      nfilters: filters,
    }
  ) {
    setSearchCount(searchCount + 1)
    setResultsLoading(true)

    try {
      let projects: ProjectResultList = await postFetcher(`/api/project`, {
        q: nq,
        type: ntype,
        ...nfilters,
      })

      if (searchMode === SearchModes.Proximity) {
        if (mapsRef.current) {
          let geocoder = new window.google.maps.Geocoder()
          geocoder.geocode({ address: proximityQuery }, function (
            results,
            status
          ) {
            if (status !== google.maps.GeocoderStatus.OK) {
              console.error(
                'Geocode was not successful for the following reason: ' + status
              )
              return
            }

            let referenceLatLng = {
              lat: results[0].geometry.location.lat(),
              lng: results[0].geometry.location.lng(),
            }

            let projs = withinXMilesOf(referenceLatLng)(proximityMiles)(
              projects
            )

            setProjects(projs)
          })
        }

        setProjects([])

        // filter by geolocation now, wowzers.
      } else {
        setProjects(projects)
      }
    } catch (error) {
      if (error.message === 'User is not authenticated') {
        setUnauthenticated(true)
      }
      setProjects([])
    }

    setResultsLoading(false)
  }

  function reset() {
    let nq = ''
    let ntype = null
    let nfilters = baseFilters
    setSearchMode(SearchModes.Unset)
    setNSearch({ nq, ntype, nfilters })
  }

  function handleSubmit(event) {
    event.preventDefault()
    search().then(() => {
      router.push(
        {
          pathname: window.location.pathname,
          query: { q, type: advancedType, ...removeAnys(filters) },
        },
        undefined,
        {
          shallow: true,
        }
      )
    })
  }

  useEffect(() => {
    let nq = ''
    let ntype = types[0].value
    let nfilters = baseFilters

    // set filters from query params on mount
    if (window.location.href.split('?').length > 1) {
      let params = new URLSearchParams(window.location.href.split('?')[1])

      if (params.get('q')) {
        nq = params.get('q')
      }
      if (params.get('type')) {
        ntype = params.get('type')
      }
      for (const key of Object.keys(baseFilters)) {
        if (params.get(key)) {
          nfilters[key as keyof typeof baseFilters] = params.get(key)
        }
      }
    }

    setNSearch({ nq, ntype, nfilters })
  }, [unauthenticated])

  if (!projects) {
    return <div>Loading...</div>
  }

  return (
    <div>
      {children && children}

      <div className="w-full h-screen flex flex-col md:flex-row items-stretch relative">
        <Link href="/">
          <a className="absolute left-0 right-0 w-40 mx-auto px-2 pt-1 pb-2 md:left-4 md:right-auto top-0 z-20 md:w-48 bg-white md:pb-2 md:px-4 md:pt-2 rounded-b-md shadow-md">
            <Logo />
          </a>
        </Link>
        <div className="relative md:absolute w-full flex-grow md:h-screen">
          <div className="absolute h-full min-h-full w-full">
            <CustomMap
              refs={{ mapRef, mapsRef }}
              projects={projects}
              activeItem={activeItem}
              setActiveItem={setActiveItem}
            />
          </div>
        </div>

        {/* Results Sidebar */}
        {!unauthenticated && (
          <div className="w-full md:max-w-md flex flex-col-reverse md:flex-col md:max-h-screen shadow-md z-20 md:m-4 md:rounded-md md:ml-auto overflow-hidden bg-white relative">
            <div className="pt-4 bg-brand-navy text-white shadow-md">
              <form className="relative" onSubmit={handleSubmit}>
                {searchMode === SearchModes.Unset && (
                  <div className="grid grid-cols-3 gap-2 px-2 items-center">
                    <div className="pr-2 col-span-2">
                      <h2 className="text-lg">
                        Welcome to the Marshall Job Map
                      </h2>
                      <p>
                        Choose a search mode on the right to narrow the results.
                      </p>
                    </div>
                    <div>
                      <button
                        onClick={() => setSearchMode(SearchModes.Proximity)}
                        type="button"
                        className="w-full block mx-auto bg-white text-brand-navy font-semibold px-2 py-2 rounded-md border-white border border-opacity-0 items-center text-sm focus:outline-none focus:border-opacity-100 focus:shadow-md focus:bg-opacity-100 focus:text-brand-blue hover:border-opacity-100 hover:shadow-md hover:bg-opacity-100 hover:text-brand-blue transition-bg duration-100 ease-in-out"
                      >
                        Search Nearby
                      </button>
                      <button
                        onClick={() =>
                          setSearchMode(SearchModes.AdvancedSearch)
                        }
                        type="button"
                        className="w-full mt-2 block mx-auto bg-white text-brand-navy font-semibold px-2 py-2 rounded-md border-white border border-opacity-0 items-center text-sm focus:outline-none focus:border-opacity-100 focus:shadow-md focus:bg-opacity-100 focus:text-brand-blue hover:border-opacity-100 hover:shadow-md hover:bg-opacity-100 hover:text-brand-blue transition-bg duration-100 ease-in-out"
                      >
                        Advanced Search
                      </button>
                    </div>
                  </div>
                )}
                {searchMode === SearchModes.Proximity && (
                  <div className="mx-2 flex md:rounded-md shadow-sm relative rounded-none rounded-l-md transition duration-150 ease-in-out sm:text-sm sm:leading-5 text-brand-navy">
                    <ProximityInput
                      mapsRef={mapsRef}
                      value={proximityQuery}
                      setValue={setProximityQuery}
                      placeholder={'Enter an address'}
                      className="flex-1 block w-full form-input pr-36 placeholder-cool-gray-300 text-brand-navy"
                    />

                    <div className="absolute inset-y-0 right-0 flex items-center">
                      <Tooltip label="Use current location">
                        <button
                          type="button"
                          className="appearance-none p-2"
                          onClick={getCurrentAddress}
                        >
                          <svg
                            className="w-4 h-4 text-gray-300 fill-current cursor-pointer"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 477.883 477.883"
                          >
                            <path d="M468.456 1.808a17.063 17.063 0 00-15.289 0L9.433 223.675c-8.429 4.219-11.842 14.471-7.624 22.9a17.065 17.065 0 0012.197 9.151l176.111 32.034 32.034 176.111a17.066 17.066 0 0014.353 13.841c.803.116 1.613.173 2.423.171a17.067 17.067 0 0015.275-9.438L476.07 24.711c4.222-8.427.813-18.681-7.614-22.903z" />
                          </svg>
                        </button>
                      </Tooltip>

                      <select
                        aria-label="Miles Radius"
                        value={proximityMiles}
                        onChange={event => {
                          setProximityMiles(Number(event.target.value))
                        }}
                        className="ml-2 form-select h-full py-0 pl-2 pr-7 border-transparent bg-transparent text-gray-500 sm:text-sm sm:leading-5 rounded-r-md rounded-l-none bg-blue-100 border-l border-blue-200"
                      >
                        {miles.map(mile => (
                          <option key={mile.name} value={mile.value}>
                            {mile.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}
                {searchMode === SearchModes.AdvancedSearch && (
                  <div className="mx-2 flex md:rounded-md shadow-sm relative rounded-none rounded-l-md transition duration-150 ease-in-out sm:text-sm sm:leading-5 text-brand-navy">
                    <input
                      type="text"
                      value={q}
                      onChange={event => setQ(event.target.value)}
                      className="flex-1 block w-full form-input pr-28 placeholder-cool-gray-500"
                      placeholder="Search projects by"
                    />

                    <div className="absolute inset-y-0 right-0 flex items-center">
                      <select
                        aria-label="Search Type"
                        value={advancedType}
                        onChange={event => {
                          setAdvancedType(event.target.value)
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
                )}
                <div
                  className={`px-2 pt-2 pb-2 flex justify-between items-center relative ${
                    showFilters && ` shadow-md z-2 `
                  }`}
                >
                  <p className="text-xs md:text-sm">
                    {resultsLoading ? (
                      'Loading Results'
                    ) : (
                      <>
                        <strong>
                          {new Intl.NumberFormat().format(projects.length)}
                        </strong>{' '}
                        Results
                      </>
                    )}
                  </p>

                  {searchMode !== SearchModes.Unset && (
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
                        {showFilters ? 'Hide Filters' : 'Filters'}
                      </button>

                      {dirty && (
                        <button
                          type="button"
                          className="bg-white bg-opacity-25 px-2 py-2 mr-2 rounded-md inline-flex border-white border border-opacity-0 items-center text-sm focus:outline-none focus:border-opacity-100 focus:shadow-md focus:bg-opacity-100 focus:text-brand-blue hover:border-opacity-100 hover:shadow-md hover:bg-opacity-100 hover:text-brand-blue transition-bg duration-100 ease-in-out"
                          onClick={reset}
                        >
                          Reset
                        </button>
                      )}

                      <button
                        disabled={resultsLoading}
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
                                strokeWidth="12"
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
                  )}
                </div>
                {showFilters && (
                  <Filters filters={filters} setFilter={setFilter} />
                )}
              </form>
            </div>

            <ProjectList
              projects={projects}
              activeItem={activeItem}
              setActiveItem={setActiveItem}
            />

            {searchCount > 0 && projects.length === 0 && !resultsLoading && (
              <div className="p-4 h-full flex flex-col justify-center items-center text-center flex-grow">
                <p className="mb-3">
                  No results for your current search and filters.
                </p>
                <p>Try making your search less specific.</p>
              </div>
            )}
            {searchCount === 0 && (
              <div className="p-4 flex flex-col justify-center items-center text-center flex-grow">
                <div>
                  <p>No results found.</p>
                </div>
              </div>
            )}
            <div className="w-full bg-brand-navy p-2 text-sm hidden md:flex justify-end">
              <DropdownButton
                label="Export results"
                options={[
                  {
                    label: 'Copy share link',
                    action: () =>
                      navigator.clipboard.writeText(window.location.href),
                  },
                  {
                    label: 'Download .txt file of addresses',
                    action: () => {
                      const content = projects.reduce((str, project) => {
                        if (project.legacy) return str
                        return `${str} \n${getAddressString(
                          project as Project
                        )}`
                      }, `Search Results from ${new Date().toLocaleDateString()}\n`)
                      const blob = new Blob([content], { type: 'text/plain' })
                      downloadBlob(blob, 'results.txt')
                    },
                  },
                ]}
              />
            </div>
          </div>
        )}
      </div>
      {unauthenticated && (
        <LoginModal setUnauthenticated={setUnauthenticated} />
      )}
      <InfoModal />
    </div>
  )
}

enum SearchModes {
  Unset = 'unset',
  Proximity = 'proximity',
  AdvancedSearch = 'advanced-search',
}
