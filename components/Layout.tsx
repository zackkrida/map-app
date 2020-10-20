import { useLazyRequest } from 'lib/useLazyRequest'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { Logo } from '../components/Logo'
import { CustomMap } from './CustomMap'
import { InfoModal } from './InfoModal'
import { Select } from './Select'
import { ProjectList } from './ProjectList'

export function Layout({ children }: LayoutProps) {
  const router = useRouter()
  const types = [
    { value: 'zip', name: 'Zip Code' },
    { value: 'city', name: 'City/Town' },
    { value: 'name', name: 'Last Name' },
    { value: 'streetAddress', name: 'Street Address' },
    { value: 'productColor', name: 'Product Color' },
    { value: 'productType', name: 'Product Type' },
  ]
  const [q, setQ] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [type, setType] = useState<any>(types[0])
  const [searchCount, setSearchCount] = useState(0)
  const [resultsLoading, setResultsLoading] = useState(false)
  const [activeItem, setActiveItem] = useState<string>(null)
  const [filters, setFilters] = useState({
    year: 'any',
    status: 'any',
    jobType: 'any',
    productColor: 'any',
  })
  const setFilter = (name: keyof typeof filters) => (value: string) =>
    setFilters({ ...filters, [name]: value })
  const { data: projects = [], fetchMore: fetchMoreProjects } = useLazyRequest(
    `/api/project`,
    {
      q,
      type: type.value,
      ...filters,
    }
  )

  // const {
  //   data: legacyProjects = [],
  //   fetchMore: fetchMoreLegacyProjects,
  // } = useLazyRequest('/api/legacy', { q, type: type.value, ...filters })

  function search() {
    const searchParams = {
      q: router?.query?.q || '',
      type: router?.query?.type,
      ...filters,
    }

    setSearchCount(searchCount + 1)
    setQ((router.query?.q as string) || '')
    setResultsLoading(true)
    // fetchMoreProjects(searchParams).then(_ => setResultsLoading(false))
    Promise.all([
      fetchMoreProjects(searchParams),
      // fetchMoreLegacyProjects(searchParams),
    ]).then(_ => {
      setResultsLoading(false)
    })
  }

  // Submit search whenver the page is mounted
  useEffect(() => {
    search()
  }, [])

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

    router.push({ pathname: router.pathname, query }).then(() => search())
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
        <div className="w-full md:max-w-md flex flex-col-reverse md:flex-col md:max-h-screen shadow-md z-20 md:m-4 md:rounded-md md:ml-auto overflow-hidden bg-white">
          <div className="pt-4 bg-brand-navy text-white shadow-md">
            <form className="relative" onSubmit={handleSubmit}>
              <div className="mx-2 flex md:rounded-md shadow-sm relative rounded-none rounded-l-md transition duration-150 ease-in-out sm:text-sm sm:leading-5  text-brand-navy">
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
                  {resultsLoading ? (
                    'Loading Results'
                  ) : (
                    <>
                      <strong>{projects.length}</strong> Results
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

                  {q && (
                    <button
                      type="button"
                      className="bg-white bg-opacity-25 px-2 py-2 mr-2 rounded-md inline-flex border-white border border-opacity-0 items-center text-sm focus:outline-none focus:border-opacity-100 focus:shadow-md focus:bg-opacity-100 focus:text-brand-blue hover:border-opacity-100 hover:shadow-md hover:bg-opacity-100 hover:text-brand-blue transition-bg duration-100 ease-in-out"
                      onClick={() => router.push('/').then(() => search())}
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
  const router = useRouter()
  const today = new Date()
  const years = Array(30)
    .fill('')
    .map((_, i) => ({
      name: `${today.getFullYear() - i}`,
      value: `${today.getFullYear() - i}`,
    }))

  const {
    data: productColors = [],
    fetchMore: fetchMoreProductColors,
  } = useLazyRequest(`/api/product-colors`, {
    type: filters.jobType === 'any' ? null : filters.jobType,
  })

  // load product colors whenever a product type is selected
  useEffect(() => {
    if ('jobType' in router.query) {
      fetchMoreProductColors()
    }
  })

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
        {['Roofing', 'Siding', 'Windows'].includes(filters.jobType) && (
          <Select
            truncateItems={false}
            label="Product Color"
            fallback="Any"
            options={productColors.map(i => ({
              value: i,
              name: i,
            }))}
            value={filters.productColor}
            onChange={setFilter('productColor')}
          />
        )}
      </div>
    </div>
  )
}
