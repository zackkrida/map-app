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
  })
    .then(res => res.json())
    .then(res => {
      if (res.error && res.message === 'User is not authenticated') {
        throw new Error('User is not authenticated')
      }
      return res
    })

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

export const getAddressString = (project: Project | LegacyProject) =>
  project.legacy === true
    ? `${project.i360__Home_Address__c} ${project.i360__Home_City__c}, ${project.i360__Home_State__c} ${project.i360__Home_Zip_Postal_Code__c}`
    : `${project.i360__Appointment_Address__c} ${project.i360__Appointment_City__c}, ${project?.i360__Appointment_State__c} ${project?.i360__Appointment_Zip__c}`

export function downloadBlob(blob, filename) {
  // Create an object URL for the blob object
  const url = URL.createObjectURL(blob)

  // Create a new anchor element
  const a = document.createElement('a')

  // Set the href and download attributes for the anchor element
  // You can optionally set other attributes like `title`, etc
  // Especially, if the anchor element will be attached to the DOM
  a.href = url
  a.download = filename || 'download'

  // Click handler that releases the object URL after the element has been clicked
  // This is required for one-off downloads of the blob content
  const clickHandler = () => {
    setTimeout(() => {
      URL.revokeObjectURL(url)
      a.removeEventListener('click', clickHandler)
      a.remove()
    }, 150)
  }

  // Add the click event listener on the anchor element
  // Comment out this line if you don't want a one-off download of the blob content
  a.addEventListener('click', clickHandler, false)

  // Programmatically trigger a click on the anchor element
  // Useful if you want the download to happen automatically
  // Without attaching the anchor element to the DOM
  // Comment out this line if you don't want an automatic download of the blob content
  a.click()

  // Return the anchor element
  // Useful if you want a reference to the element
  // in order to attach it to the DOM or use it in some other way
  return a
}

/**
 * Remove object values that equal the string 'any'
 * @param obj Any object
 */
export function removeAnys(obj) {
  let clean = {}
  for (const [key, value] of Object.entries(obj)) {
    if (value !== 'any') {
      clean[key] = value
    }
  }
  return clean
}
