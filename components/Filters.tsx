import {
  Combobox,
  ComboboxInput,
  ComboboxList,
  ComboboxOption,
  ComboboxOptionText,
  ComboboxPopover,
} from '@reach/combobox'
import { badUnique, postFetcher } from 'lib/utils'
import React, { useEffect, useState } from 'react'
import { Select } from './Select'

export function Filters({
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

  const [productColors, setProductColors] = useState([])
  const [productColorResults, setProductColorResults] = useState([])

  /**
   * Filtering for product color results
   */
  useEffect(() => {
    if (filters.productColor === 'any') {
      setProductColorResults(productColors)
      return
    }

    let newRes = [...productColors].filter(i =>
      i.name.toLowerCase().includes(filters.productColor.toLowerCase())
    )

    setProductColorResults(newRes)
  }, [filters.productColor, productColors])

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
  }, [])

  return (
    <div className="px-2 py-4 top-full l-0 r-0 w-full bg-brand-gray">
      <div className="grid grid-cols-3 gap-2 grid-flow-row relative">
        <Combobox
          className="col-span-3 text-gray-600"
          onSelect={setFilter('productColor')}
          openOnFocus
        >
          <label className="block text-sm leading-5 font-medium text-white">
            Product Color
          </label>
          <ComboboxInput
            value={filters.productColor === 'any' ? '' : filters.productColor}
            onChange={e => setFilter('productColor')(e.target.value)}
            className="flex-1 block w-full form-input placeholder-cool-gray-500 text-grey-500 text-sm mt-1"
            placeholder="Filter by product color"
          />
          <ComboboxPopover className="absolute top-2 z-20 w-full left-0 right-0">
            <ComboboxList className="max-h-60 rounded-md py-1 text-base leading-6 shadow-xs overflow-auto focus:outline-none sm:text-sm sm:leading-5">
              {productColorResults.map(i => (
                <div key={JSON.stringify(i)}>
                  <ComboboxOption value={i.name}>
                    <div className="flex">
                      <ComboboxOptionText />
                      <span className="text-gray-500 truncate ml-auto">
                        {i.type}
                      </span>
                    </div>

                    <span className="absolute inset-y-0 right-0 flex items-center pr-4 hidden">
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
          </ComboboxPopover>
        </Combobox>

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
