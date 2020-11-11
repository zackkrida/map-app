import GoogleMap from 'google-map-react'
import { getLat, getLng, getMapBoundsFromProjects } from 'lib/utils'
import React, { useMemo, useState, useEffect } from 'react'
import useSupercluster from 'use-supercluster'
import { getMarkerColor, Marker, RawMarker } from './Marker'

const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
const mapSettings = {
  zoom: 11,
  minZoom: 9,
  maxZoom: 19,
  pos: {
    lat: 41.67391,
    lng: -70.9033,
  },
  padding: 40,
  showMarkersAtZoom: 13,
}

export function CustomMap({
  refs: { mapRef, mapsRef },
  projects = [],
  activeItem,
  setActiveItem,
}: {
  refs: {
    mapRef: React.MutableRefObject<google.maps.Map>
    mapsRef: React.MutableRefObject<HTMLElement>
  }
  projects: ProjectResultList
  activeItem: string
  setActiveItem: (value: string) => void
}) {
  const [bounds, setBounds] = useState(null)
  const [zoom, setZoom] = useState(mapSettings.zoom)

  const points = useMemo(
    () =>
      projects.map(i => ({
        type: 'Feature',
        properties: { cluster: false, id: i.Id, color: getMarkerColor(i) },
        geometry: {
          type: 'Point',
          coordinates: [getLng(i), getLat(i)],
        },
      })),
    [projects]
  )

  // Re-fit map whenever we get new projects
  useEffect(() => {
    if (projects.length === 0 || !mapRef.current) return
    mapRef.current.fitBounds(
      getMapBoundsFromProjects(mapsRef.current, projects),
      {
        left: mapSettings.padding,
        right: window.innerWidth > 700 ? 440 : mapSettings.padding,
        top: mapSettings.padding,
        bottom: mapSettings.padding,
      }
    )
  }, [projects])

  // get clusters
  const { clusters, supercluster } = useSupercluster({
    points,
    bounds,
    zoom,
    options: {
      radius: 300,
      maxZoom: mapSettings.showMarkersAtZoom,
      minZoom: mapSettings.minZoom,
    },
  })

  return (
    <GoogleMap
      defaultCenter={mapSettings.pos}
      defaultZoom={mapSettings.zoom}
      options={{
        fullscreenControl: false,
        minZoom: mapSettings.minZoom,
        maxZoom: mapSettings.maxZoom,
        zoomControlOptions: { position: 4 },
      }}
      bootstrapURLKeys={{ key, libraries: ['places'] }}
      yesIWantToUseGoogleMapApiInternals
      onGoogleApiLoaded={({ map, maps }) => {
        mapRef.current = map
        mapsRef.current = maps
      }}
      onChange={({ zoom, bounds }) => {
        setZoom(zoom)
        setBounds([bounds.nw.lng, bounds.se.lat, bounds.se.lng, bounds.nw.lat])
      }}
    >
      {clusters.map(cluster => {
        const [lng, lat] = cluster.geometry.coordinates
        const {
          cluster: isCluster,
          point_count: pointCount,
        } = cluster.properties

        if (isCluster) {
          return (
            <RawMarker key={`cluster-${cluster.id}`} lat={lat} lng={lng}>
              <div
                onClick={() => {
                  const expansionZoom = Math.min(
                    supercluster.getClusterExpansionZoom(cluster.id),
                    20
                  )
                  mapRef.current.setZoom(expansionZoom)
                  mapRef.current.panTo({ lat, lng })
                }}
                className="rounded-full w-12 h-12 text-center leading-none bg-brand-blue text-white flex items-center justify-center text-lg font-bold shadow-md hover:bg-blue-400 hover:scale-110 duration-75 ease-in-out transform"
              >
                {pointCount}
              </div>
            </RawMarker>
          )
        }

        return (
          <Marker
            lat={lat}
            lng={lng}
            key={`marker-${cluster.properties.id}`}
            active={cluster.properties.id === activeItem}
            color={cluster.properties.color}
            onClick={() => setActiveItem(cluster.properties.id)}
          />
        )
      })}
    </GoogleMap>
  )
}
