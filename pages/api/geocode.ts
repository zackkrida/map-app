import { connectTo360 } from 'lib/three60'
import { Client, Status } from '@googlemaps/google-maps-services-js'
import chunk from 'lodash/chunk'

/**
 * 1. Pull down all Jobs in 360 without lat, lng attributes
 * 2. Get the coordinates using the Google geolocation API
 * 3. Push them back into 360
 */
export default async function Geocode(_, res) {
  try {
    // https://improveit360-3562.cloudforce.com/01I1I000001rrvm?setupid=CustomObjects
    const mapClient = new Client({})
    const geolocate = address =>
      mapClient.geocode({
        params: { key: process.env.GOOGLE_GEOCODING_API_KEY, address },
      })
    const t60 = await connectTo360()

    // prettier-ignore
    const projects = await t60
      .sobject(ThreeSixty.Project)
      .select(['*'])
      .where({Latitude__c: null, Long__c: null})
      .maxFetch(200)

    // const geo = await geolocate(buildAddressString(projects[0]))
    // const result = geo.data.results[0].geometry.location
    const createUpdateRecord = project =>
      geolocate(buildAddressString(project)).then(geo => ({
        Id: project.Id,
        Latitude__c: geo.data.results[0].geometry.location.lat,
        Long__c: geo.data.results[0].geometry.location.lng,
      }))

    const chunkedProjects = chunk(projects, 50)
    let geoResults = []
    for (const projChunk of chunkedProjects) {
      const updatedProjects = await Promise.all(
        projChunk.map(createUpdateRecord)
      )
      geoResults.push(...updatedProjects)
      await new Promise(r => setTimeout(r, 1000))
    }

    // const updatedProjects = await Promise.all(projects.map(createUpdateRecord))

    const updateIn360Res = await t60
      .sobject(ThreeSixty.Project)
      .update(geoResults)

    res.json({ projects: projects.length })
  } catch (error) {
    console.error(error.message)
    console.error(error)
    res.json({ error: true, message: error.message })
  }
}

const buildAddressString = project =>
  `${project.i360__Appointment_Street__c}${project.i360__Appointment_City__c}, ${project.i360__Appointment_State__c} ${project.i360__Appointment_Zip__c}`
