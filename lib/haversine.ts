import { getLat, getLng } from 'lib/utils'

/**
 * Functions to work with milage comparisons of Lat/Lng Values.
 * Modified from this Gist: https://gist.github.com/SimonJThompson/c9d01f0feeb95b18c7b0
 */

const toRad = (v: number) => (v * Math.PI) / 180
const kmToMiles = (km: number) => Number((km * 0.62137).toFixed(2))

const haversine = (l1: LatLng, l2: LatLng) => {
  var R = 6371 // km

  var x1 = l2.lat - l1.lat
  var dLat = toRad(x1)
  var x2 = l2.lng - l1.lng
  var dLon = toRad(x2)
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(l1.lat)) *
      Math.cos(toRad(l2.lat)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  var d = R * c

  return d
}

const projectToLatLng = (project: Project | LegacyProject) => ({
  lat: getLat(project),
  lng: getLng(project),
})

const within = (milesFrom: number, location: LatLng) => (
  comparison: Project | LegacyProject
) => kmToMiles(haversine(location, projectToLatLng(comparison))) <= milesFrom

/**
 * Check every address is within range of the initial address
 *
 * Usage:
 *
 * ```ts
 * const nearUser = withinXMilesOf(userAddress)
 * const fiveMilesFromUser = nearUser(5)
 * const addressesCloseToUser = fiveMilesFromUser(addresses)
 * ```
 */
export const withinXMilesOf = (address: LatLng) => (milesFrom: number) => (
  addresses: ProjectResultList
) => addresses.filter(within(milesFrom, address))

interface LatLng {
  lat: number
  lng: number
}
