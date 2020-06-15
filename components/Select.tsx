import {
  ListboxButton,
  ListboxInput,
  ListboxList,
  ListboxOption,
  ListboxPopover,
} from '@reach/listbox'

export function Select({
  label = 'Choose',
  fallback = 'Any',
  options = [],
  value = '',
  onChange,
}) {
  return (
    <div className="text-gray-700 space-y-1 custom-select w-full">
      <label
        htmlFor={`${label}-drodown`}
        className="block text-sm leading-5 font-medium text-white"
      >
        {label}
      </label>
      <ListboxInput
        id={`${label}-dropdown`}
        value={value || fallback}
        onChange={onChange}
      >
        <div className="relative">
          <span className="inline-block w-full rounded-md shadow-sm">
            <ListboxButton
              as="button"
              type="button"
              className="cursor-default relative w-full rounded-md border border-gray-300 bg-white pl-3 pr-10 py-2 text-left focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition ease-in-out duration-150 sm:text-sm sm:leading-5"
            >
              <span className="block truncate">{value || fallback}</span>
              <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  viewBox="0 0 20 20"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    d="M7 7l3-3 3 3m0 6l-3 3-3-3"
                    strokeWidth={1.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </ListboxButton>
          </span>
        </div>
        <ListboxPopover className="absolute mt-1 w-full rounded-md bg-white shadow-lg outline-none">
          <ListboxList className="max-h-60 rounded-md py-1 text-base leading-6 shadow-xs overflow-auto focus:outline-none sm:text-sm sm:leading-5">
            {options.length > 0 ? (
              options.map(option => {
                const active = option.value === value

                return (
                  <ListboxOption
                    className="text-gray-900 cursor-default select-none relative py-2 pl-3 pr-9"
                    key={option.value}
                    value={option.value}
                    label={option.name}
                  >
                    <span className="font-normal block truncate">
                      {option.name}
                    </span>
                    {active && <Checkmark />}
                  </ListboxOption>
                )
              })
            ) : (
              <span>No options.</span>
            )}
          </ListboxList>
        </ListboxPopover>
      </ListboxInput>
    </div>
  )
}

function Checkmark() {
  return (
    <span className="text-indigo-600 absolute inset-y-0 right-0 flex items-center pr-4">
      <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path
          fillRule="evenodd"
          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
          clipRule="evenodd"
        />
      </svg>
    </span>
  )
}
