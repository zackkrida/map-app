import GoogleMap from 'google-map-react'
import { getMapBoundsFromProjects } from 'lib/utils'
import React, { useMemo, useRef, useState, useEffect } from 'react'
import useSupercluster from 'use-supercluster'
import { getMarkerColor, Marker, RawMarker } from './Marker'

const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
const mapSettings = {
  zoom: 11,
  pos: {
    lat: 41.67391,
    lng: -70.9033,
  },
}

export function CustomMap({
  projects = [],
  activeItem,
  setActiveItem,
}: {
  projects: ProjectResultList
  activeItem: string
  setActiveItem: (value: string) => void
}) {
  const mapRef = useRef<google.maps.Map>(null!)
  const mapsRef = useRef<HTMLElement>(null!)
  const [bounds, setBounds] = useState(null)
  const [zoom, setZoom] = useState(mapSettings.zoom)

  const points = useMemo(
    () =>
      projects.filter(validateLatLng).map(i => ({
        type: 'Feature',
        properties: { cluster: false, id: i.Id, color: getMarkerColor(i) },
        geometry: {
          type: 'Point',
          coordinates: [
            i.legacy === true
              ? i.i360__Longitude__c
              : i.i360__Appointment_Longitude__c,
            i.legacy === true
              ? i.i360__Latitude__c
              : i.i360__Appointment_Latitude__c,
          ],
        },
      })),
    [projects]
  )

  // Re-fit map whenever we get new projects
  useEffect(() => {
    if (projects.length === 0 || !mapRef.current) return
    mapRef.current.fitBounds(
      getMapBoundsFromProjects(
        mapsRef.current,
        projects.filter(validateLatLng)
      ),
      {
        left: 40,
        right: window.innerWidth > 700 ? 440 : 40,
        top: 40,
        bottom: 40,
      }
    )
  }, [projects])

  // get clusters
  const { clusters, supercluster } = useSupercluster({
    points,
    bounds,
    zoom,
    options: { radius: 300, maxZoom: 16, minZoom: 9 },
  })

  return (
    <GoogleMap
      defaultCenter={mapSettings.pos}
      defaultZoom={mapSettings.zoom}
      options={{
        fullscreenControl: false,
        minZoom: 9,
        maxZoom: 19,
        zoomControlOptions: { position: 4 },
      }}
      bootstrapURLKeys={{ key }}
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

/**
 * Sloppy, but make sure our Lat and Lng fall into
 * a generally-acceptable, expected range for New England.
 */
function validateLatLng(project: Project | LegacyProject) {
  if (
    project.legacy === true
      ? !project.i360__Latitude__c || !project.i360__Longitude__c
      : !project.i360__Appointment_Latitude__c ||
        !project.i360__Appointment_Longitude__c
  ) {
    return false
  }

  const [lat, lng] = [
    project.legacy === true
      ? project.i360__Latitude__c
      : project.i360__Appointment_Latitude__c,
    project.legacy === true
      ? project.i360__Longitude__c
      : project.i360__Appointment_Longitude__c,
  ]
  const latValid = lat > 40 && lat < 43
  const lngValid = lng < -69 && lng > -74
  const valid = latValid && lngValid

  if (!valid) {
    console.error(
      `Project ${project.Id} has an invalid lat/lng: ${lat} ${lng}.`
    )
  }

  return valid
}
