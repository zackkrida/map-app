import { StatusColor } from 'types/colors'

export const RawMarker = ({ children, ...props }: BaseMarkerProps) => children

export function Marker({
  active = false,
  lat,
  lng,
  color,
  ...props
}: Omit<CustomMarkerProps, 'children'>) {
  return (
    <RawMarker lat={lat} lng={lng}>
      <div
        {...props}
        className={`Marker ${color} block w-8 h-8 hover:scale-110 duration-75 ease-in-out transform -translate-y-1/2 -translate-x-1/2 cursor-pointer origin-bottom ${
          active ? `'scale-125 z-10` : ''
        }`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          stroke="#fff"
          strokeWidth={0.5}
        >
          <path
            fillRule="evenodd"
            d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
            clipRule="evenodd"
          />
        </svg>
      </div>
    </RawMarker>
  )
}

export const getMarkerColor = (project: Project | LegacyProject) => {
  if (project.legacy === true) {
    return StatusColor.Legacy
  } else {
    if (project.i360__Completed_On__c !== null) return StatusColor.Completed
    if (project.i360__Completed_On__c === null) return StatusColor.Progress
  }
}
