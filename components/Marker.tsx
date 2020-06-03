export function Marker({ lat, lng, ...props }) {
  return (
    <div
      {...props}
      className="Marker text-blue-400 hover:text-blue-500 block w-12 h-12 hover:scale-125 duration-75 ease-in-out transform cursor-pointer"
      lat={lat}
      lng={lng}
    >
      <svg
        fill="currentColor"
        stroke="#fff"
        strokeWidth={0.5}
        viewBox="0 0 20 20"
      >
        <path
          fillRule="evenodd"
          d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
          clipRule="evenodd"
        ></path>
      </svg>
    </div>
  )
}
