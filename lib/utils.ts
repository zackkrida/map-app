import { ProductColors } from 'types/colors'

export const getLat = (i: Project | LegacyProject) =>
  i.legacy === true ? i.i360__Latitude__c : i.i360__Appointment_Latitude__c

export const getLng = (i: Project | LegacyProject) =>
  i.legacy === true ? i.i360__Longitude__c : i.i360__Appointment_Longitude__c

export const scrollTo = (selector: string) => {
  const $el = document.querySelector(selector)
  if ($el)
    $el.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'center',
    })
}

export const fetcher = url => fetch(url).then(res => res.json())

export const postFetcher = (url, data = {}) =>
  fetch(url, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' },
  }).then(res => res.json())

export const getBrandColor = color => ProductColors[color] ?? 'bg-brand-orange'

export const prettyDate = dateStr =>
  new Intl.DateTimeFormat('en-US').format(new Date(dateStr))

// Return map bounds based on list of places
export const getMapBoundsFromProjects = (maps, projects: ProjectResultList) => {
  const bounds = new maps.LatLngBounds()

  projects.forEach(project => {
    const [lat, lng] = [getLat(project), getLng(project)]
    if (lat && lng) bounds.extend(new maps.LatLng(lat, lng))
  })

  return bounds
}

export function onlyUnique(value, index, self) {
  return self.indexOf(value) === index
}

const badObjEq = (one: {}) => (two: {}) =>
  JSON.stringify(one) === JSON.stringify(two)

export const badUnique = (arr: any[]) => {
  const results = []
  arr.map(item => {
    if (!results.some(badObjEq(item))) {
      results.push(item)
    }
  })
  return results
}
