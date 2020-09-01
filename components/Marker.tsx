export function Marker({ active = false, lat, lng, color, ...props }) {
  return (
    <div
      {...props}
      className={`Marker ${color} block w-8 h-8 hover:scale-110 duration-75 ease-in-out transform -translate-y-1/2 -translate-x-1/2 cursor-pointer origin-bottom ${
        active ? `'scale-125 z-10` : ''
      }`}
      lat={lat}
      lng={lng}
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
  )
}

export const getMarkerColor = (project: ProjectProps) => {
  if (project.i360__Completed_On__c !== null) return StatusColor.Completed
  if (project.i360__Completed_On__c === null) return StatusColor.Progress
}

export enum StatusColorBg {
  Legacy = 'bg-brand-gray',
  Progress = 'bg-brand-orange',
  Completed = 'bg-brand-blue',
}

export enum StatusColor {
  Legacy = 'text-brand-gray',
  Progress = 'text-brand-orange',
  Completed = 'text-brand-blue',
}
