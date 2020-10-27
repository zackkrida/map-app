import {
  Menu,
  MenuList,
  MenuButton,
  MenuItem,
  MenuItems,
  MenuPopover,
  MenuLink,
} from '@reach/menu-button'

export function DropdownButton({ label, options }: DropdownButtonProps) {
  return (
    <Menu>
      <div className="relative inline-block text-left">
        <span className="rounded-md shadow-sm">
          <MenuButton
            type="button"
            className="inline-flex justify-center w-full rounded-md border border-gray-300 px-4 py-2 bg-white text-sm leading-5 font-medium text-gray-700 hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-50 active:text-gray-800 transition ease-in-out duration-150"
          >
            {label}
            {/* <!-- Heroicon name: chevron-down --> */}
            <svg
              className="-mr-1 ml-2 h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              />
            </svg>
          </MenuButton>
        </span>

        <MenuPopover>
          <div className="rounded-md shadow-lg">
            <div className="rounded-md bg-white shadow-xs">
              <MenuItems className="py-1">
                {options.map(i => (
                  <MenuItem
                    key={i.label}
                    onSelect={i.action}
                    className="block px-4 py-2 text-sm leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900"
                  >
                    {i.label}
                  </MenuItem>
                ))}
              </MenuItems>
            </div>
          </div>
        </MenuPopover>
      </div>
    </Menu>
  )
}

interface DropdownButtonProps {
  label: string
  options: DropdownOption[]
}

interface DropdownOption {
  label: string
  action: () => void
}
