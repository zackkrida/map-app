import {
  Combobox,
  ComboboxInput,
  ComboboxList,
  ComboboxOption,
  ComboboxOptionText,
  ComboboxPopover,
} from '@reach/combobox'
import { badUnique, postFetcher } from 'lib/utils'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { Logo } from '../components/Logo'
import { CustomMap } from './CustomMap'
import { InfoModal } from './InfoModal'
import { ProjectList } from './ProjectList'
import { Select } from './Select'

export function Layout({ children }: LayoutProps) {
  const router = useRouter()
  const [projects, setProjects] = useState<ProjectResultList>([])
  const [productColors, setProductColors] = useState([])
  const types = [
    { value: 'zip', name: 'Zip Code' },
    { value: 'city', name: 'City/Town' },
    { value: 'name', name: 'Last Name' },
    { value: 'streetAddress', name: 'Street Address' },
    { value: 'productColor', name: 'Product Color' },
  ]
  const baseFilters = {
    year: 'any',
    status: 'any',
    jobType: 'any',
    productColor: 'any',
  }
  const [q, setQ] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [type, setType] = useState<string>(types[0].value)
  const [searchCount, setSearchCount] = useState(0)
  const [resultsLoading, setResultsLoading] = useState(false)
  const [activeItem, setActiveItem] = useState<string>(null)
  const [filters, setFilters] = useState(baseFilters)
  const [productColorResults, setProductColorResults] = useState([])

  const setNSearch = ({ nq, ntype, nfilters }) => {
    setQ(nq)
    setType(ntype)
    setFilters(nfilters)
    search({ nq, ntype, nfilters })
  }

  const dirty =
    q ||
    Object.values(filters).some(i => i !== 'any') ||
    type !== types[0].value

  const setFilter = (name: keyof typeof filters) => (value: string) =>
    setFilters({ ...filters, [name]: value })

  useEffect(() => {
    // load product colors on mount
    postFetcher('/api/product-colors').then(res => {
      let colors = badUnique(
        res
      ).sort((a: { name: string }, b: { name: string }) =>
        a.name.localeCompare(b.name)
      )
      setProductColors(colors)
    })

    let nq = ''
    let ntype = ''
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
  }, [])

  /**
   * Filtering for product color results
   */
  useEffect(() => {
    if (!q) {
      setProductColorResults(productColors)
      return
    }

    let newRes = [...productColors].filter(i =>
      i.name.toLowerCase().includes(q.toLowerCase())
    )

    setProductColorResults(newRes)
  }, [q, productColors])

  async function search(
    { nq = q, ntype = type, nfilters = filters } = {
      nq: q,
      ntype: type,
      nfilters: filters,
    }
  ) {
    setSearchCount(searchCount + 1)
    setResultsLoading(true)

    let projects = await postFetcher(`/api/project`, {
      q: nq,
      type: ntype,
      ...nfilters,
    })

    setProjects(projects)
    setResultsLoading(false)
  }

  function reset() {
    let nq = ''
    let ntype = types[0].value
    let nfilters = baseFilters
    setNSearch({ nq, ntype, nfilters })
  }

  function handleSubmit(event) {
    event.preventDefault()
    search().then(() => {
      router.push(
        {
          pathname: window.location.pathname,
          query: { q, type, ...removeAnys(filters) },
        },
        undefined,
        {
          shallow: true,
        }
      )
    })
  }

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
              projects={projects}
              activeItem={activeItem}
              setActiveItem={setActiveItem}
            />
          </div>
        </div>

        {/* Results Sidebar */}
        <div className="w-full md:max-w-md flex flex-col-reverse md:flex-col md:max-h-screen shadow-md z-20 md:m-4 md:rounded-md md:ml-auto overflow-hidden bg-white relative">
          <div className="pt-4 bg-brand-navy text-white shadow-md">
            <Combobox
              aria-label="Search projects by"
              openOnFocus
              onSelect={setQ}
            >
              <form className="relative" onSubmit={handleSubmit}>
                <div className="mx-2 flex md:rounded-md shadow-sm relative rounded-none rounded-l-md transition duration-150 ease-in-out sm:text-sm sm:leading-5 text-brand-navy">
                  <ComboboxInput
                    type="text"
                    value={q}
                    onChange={event => setQ(event.target.value)}
                    className="flex-1 block w-full form-input pr-28 placeholder-cool-gray-500"
                    placeholder="Search projects by"
                  />

                  <div className="absolute inset-y-0 right-0 flex items-center">
                    <select
                      aria-label="Search Type"
                      value={type}
                      onChange={event => {
                        setType(event.target.value)
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

                  {type === 'productColor' && (
                    <ComboboxPopover className="absolute top-2 z-20 w-full left-0 right-0">
                      {/* <div className="rounded-md bg-white shadow-lg mx-2"> */}
                      <ComboboxList className="max-h-60 rounded-md py-1 text-base leading-6 shadow-xs overflow-auto focus:outline-none sm:text-sm sm:leading-5">
                        {productColorResults.map(i => (
                          <div key={JSON.stringify(i)}>
                            <ComboboxOption value={i.name}>
                              <div className="flex">
                                <ComboboxOptionText />
                                {/* <!-- Highlighted: "text-indigo-200", Not Highlighted: "text-gray-500" --> */}
                                <span className="text-gray-500 truncate ml-auto">
                                  {i.type}
                                </span>
                              </div>

                              {/* <!--
            Checkmark, only display for selected option.

            Highlighted: "text-white", Not Highlighted: "text-indigo-600"
          --> */}
                              <span className="absolute inset-y-0 right-0 flex items-center pr-4 hidden">
                                {/* <!-- Heroicon name: check --> */}
                                <svg
                                  className="h-5 w-5"
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path
                                    fill-rule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clip-rule="evenodd"
                                  />
                                </svg>
                              </span>
                            </ComboboxOption>
                          </div>
                        ))}
                      </ComboboxList>
                      {/* </div> */}
                    </ComboboxPopover>
                  )}
                </div>
                {showFilters && (
                  <Filters filters={filters} setFilter={setFilter} />
                )}
              </form>
            </Combobox>
          </div>

          <ProjectList
            projects={projects}
            activeItem={activeItem}
            setActiveItem={setActiveItem}
          />

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

function Filters({
  filters,
  setFilter,
}: {
  filters: any
  setFilter: (name) => (value) => void
}) {
  const today = new Date()
  const years = Array(30)
    .fill('')
    .map((_, i) => ({
      name: `${today.getFullYear() - i}`,
      value: `${today.getFullYear() - i}`,
    }))

  return (
    <div className="px-2 py-4 top-full l-0 r-0 w-full bg-brand-gray">
      <div className="grid grid-cols-3 gap-2 grid-flow-row">
        <Select
          label="Created After"
          fallback="Any"
          options={years}
          value={filters.year}
          onChange={setFilter('year')}
        />
        <Select
          label="Status"
          fallback="Any"
          options={[
            { value: 'in-progress', name: 'In Progress' },
            { value: 'completed', name: 'Completed' },
            { value: 'legacy', name: 'Legacy' },
          ]}
          value={filters.status}
          onChange={setFilter('status')}
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
          onChange={setFilter('jobType')}
        />
      </div>
    </div>
  )
}

/**
 * Remove object values that equal the string 'any'
 * @param obj Any object
 */
function removeAnys(obj) {
  let clean = {}
  for (const [key, value] of Object.entries(obj)) {
    if (value !== 'any') {
      clean[key] = value
    }
  }
  return clean
}
