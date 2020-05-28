// http://google-map-react.github.io/google-map-react/map/main/
import GoogleMap from 'google-map-react'
import { useState, useEffect, useRef } from 'react'

function Marker({ lat, lng, ...props }) {
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

export default function IndexPage() {
  const mapPos = {
    lat: 41.65391,
    lng: -71.2433,
  }
  const [activeItem, setActiveItem] = useState(null)

  useEffect(() => {
    if (!activeItem) return

    document
      .querySelector(`[data-index="${activeItem}"]`)
      .scrollIntoView({ behavior: 'smooth' })
  }, [activeItem])

  return (
    <div className="w-full md:h-screen flex flex-col md:flex-row items-stretch">
      <div className="md:flex-1 h-64 md:h-auto">
        <GoogleMap defaultCenter={mapPos} defaultZoom={11}>
          <Marker
            onClick={() => setActiveItem(14)}
            lat={mapPos.lat}
            lng={mapPos.lng}
          />
          <Marker
            onClick={() => setActiveItem(40)}
            lat={mapPos.lat + 0.1}
            lng={mapPos.lng + 0.1}
          />
        </GoogleMap>
      </div>
      <div className="md:w-96 md:flex md:flex-col md:max-h-screen">
        <h2>results</h2>
        <div className="block md:overflow-y-scroll flex-grow">
          <ul>
            <li data-index="1" className="text-lg py-4">
              1 Item
            </li>
            <li data-index="2" className="text-lg py-4">
              2 Item
            </li>
            <li data-index="3" className="text-lg py-4">
              3 Item
            </li>
            <li data-index="4" className="text-lg py-4">
              4 Item
            </li>
            <li data-index="5" className="text-lg py-4">
              5 Item
            </li>
            <li data-index="6" className="text-lg py-4">
              6 Item
            </li>
            <li data-index="7" className="text-lg py-4">
              7 Item
            </li>
            <li data-index="8" className="text-lg py-4">
              8 Item
            </li>
            <li data-index="9" className="text-lg py-4">
              9 Item
            </li>
            <li data-index="10" className="text-lg py-4">
              10 Item
            </li>
            <li data-index="11" className="text-lg py-4">
              1 Item
            </li>
            <li data-index="12" className="text-lg py-4">
              2 Item
            </li>
            <li data-index="13" className="text-lg py-4">
              3 Item
            </li>
            <li data-index="14" className="text-lg py-4">
              4 Item
            </li>
            <li data-index="15" className="text-lg py-4">
              5 Item
            </li>
            <li data-index="16" className="text-lg py-4">
              6 Item
            </li>
            <li data-index="17" className="text-lg py-4">
              7 Item
            </li>
            <li data-index="18" className="text-lg py-4">
              8 Item
            </li>
            <li data-index="19" className="text-lg py-4">
              9 Item
            </li>
            <li data-index="20" className="text-lg py-4">
              10 Item
            </li>
            <li data-index="21" className="text-lg py-4">
              1 Item
            </li>
            <li data-index="22" className="text-lg py-4">
              2 Item
            </li>
            <li data-index="23" className="text-lg py-4">
              3 Item
            </li>
            <li data-index="24" className="text-lg py-4">
              4 Item
            </li>
            <li data-index="25" className="text-lg py-4">
              5 Item
            </li>
            <li data-index="26" className="text-lg py-4">
              6 Item
            </li>
            <li data-index="27" className="text-lg py-4">
              7 Item
            </li>
            <li data-index="28" className="text-lg py-4">
              8 Item
            </li>
            <li data-index="29" className="text-lg py-4">
              9 Item
            </li>
            <li data-index="30" className="text-lg py-4">
              10 Item
            </li>
            <li data-index="31" className="text-lg py-4">
              1 Item
            </li>
            <li data-index="32" className="text-lg py-4">
              2 Item
            </li>
            <li data-index="33" className="text-lg py-4">
              3 Item
            </li>
            <li data-index="34" className="text-lg py-4">
              4 Item
            </li>
            <li data-index="35" className="text-lg py-4">
              5 Item
            </li>
            <li data-index="36" className="text-lg py-4">
              6 Item
            </li>
            <li data-index="37" className="text-lg py-4">
              7 Item
            </li>
            <li data-index="38" className="text-lg py-4">
              8 Item
            </li>
            <li data-index="39" className="text-lg py-4">
              9 Item
            </li>
            <li data-index="40" className="text-lg py-4">
              10 Item
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
